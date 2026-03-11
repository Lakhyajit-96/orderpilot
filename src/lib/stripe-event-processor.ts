import type Stripe from "stripe";
import { BillingEventStatus, SubscriptionStatus } from "@/generated/prisma/enums";
import {
  recordBillingEvent,
  type BillingEventSnapshot,
} from "@/lib/billing-diagnostics";
import { getDb } from "@/lib/db";
import { getPlanKeyForPriceId } from "@/lib/stripe";
import { mapStripeSubscriptionStatus, resolvePlanKey } from "@/lib/stripe-webhook-core";
import type { PlanKey } from "@/lib/plans";

type PersistedSubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

function toPlanKey(value: string | null | undefined): PlanKey | null {
  if (value === "starter" || value === "growth" || value === "enterprise") {
    return value;
  }

  return null;
}

function getMetadataValue(
  metadata: Stripe.Metadata | null | undefined,
  key: string,
) {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getResourceId(resource: { id: string } | string | null | undefined) {
  if (!resource) {
    return null;
  }

  return typeof resource === "string" ? resource : resource.id;
}

async function resolveOrganizationId(
  organizationId: string | null,
  clerkUserId: string | null,
) {
  if (organizationId) {
    return organizationId;
  }

  if (!clerkUserId) {
    return null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const membership = await db.membership.findFirst({
    where: { clerkUserId },
    select: { organizationId: true },
  });

  return membership?.organizationId ?? null;
}

async function persistSubscriptionSnapshot(input: {
  organizationId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  planKey: PlanKey | null;
  status: PersistedSubscriptionStatus;
}): Promise<BillingEventSnapshot> {
  const db = getDb();
  const snapshot = {
    organizationId: input.organizationId,
    stripeCustomerId: input.stripeCustomerId,
    stripeSubscriptionId: input.stripeSubscriptionId,
    planKey: input.planKey,
  } satisfies BillingEventSnapshot;

  if (!db) {
    return snapshot;
  }

  const matches: Array<Record<string, string>> = [];

  if (input.organizationId) {
    matches.push({ organizationId: input.organizationId });
  }

  if (input.stripeCustomerId) {
    matches.push({ stripeCustomerId: input.stripeCustomerId });
  }

  if (input.stripeSubscriptionId) {
    matches.push({ stripeSubscriptionId: input.stripeSubscriptionId });
  }

  const existing = matches.length
    ? await db.subscription.findFirst({
        where: { OR: matches },
        select: {
          id: true,
          organizationId: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          planKey: true,
        },
      })
    : null;

  if (existing) {
    await db.subscription.update({
      where: { id: existing.id },
      data: {
        status: input.status,
        ...(input.planKey ? { planKey: input.planKey } : {}),
        ...(input.stripeCustomerId ? { stripeCustomerId: input.stripeCustomerId } : {}),
        ...(input.stripeSubscriptionId ? { stripeSubscriptionId: input.stripeSubscriptionId } : {}),
      },
    });

    return {
      organizationId: input.organizationId ?? existing.organizationId,
      stripeCustomerId: input.stripeCustomerId ?? existing.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId ?? existing.stripeSubscriptionId,
      planKey: input.planKey ?? existing.planKey,
    };
  }

  if (!input.organizationId || !input.planKey) {
    return snapshot;
  }

  await db.subscription.create({
    data: {
      organizationId: input.organizationId,
      stripeCustomerId: input.stripeCustomerId ?? undefined,
      stripeSubscriptionId: input.stripeSubscriptionId ?? undefined,
      planKey: input.planKey,
      status: input.status,
    },
  });

  return snapshot;
}

async function syncFromSubscription(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  fallback?: {
    planKey?: PlanKey | null;
    clerkUserId?: string | null;
    organizationId?: string | null;
  },
) {
  const planKey = toPlanKey(
    resolvePlanKey(
      getMetadataValue(subscription.metadata, "planKey"),
      fallback?.planKey,
      getPlanKeyForPriceId(subscription.items.data[0]?.price?.id),
    ),
  );
  const clerkUserId =
    getMetadataValue(subscription.metadata, "clerkUserId") ?? fallback?.clerkUserId ?? null;
  const organizationId = await resolveOrganizationId(
    getMetadataValue(subscription.metadata, "organizationId") ?? fallback?.organizationId ?? null,
    clerkUserId,
  );

  return persistSubscriptionSnapshot({
    organizationId,
    stripeCustomerId: getResourceId(subscription.customer),
    stripeSubscriptionId: subscription.id,
    planKey,
    status: mapStripeSubscriptionStatus(subscription.status) as PersistedSubscriptionStatus,
  });
}

async function handleCheckoutSessionCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  if (session.mode !== "subscription") {
    return null;
  }

  const planKey = toPlanKey(getMetadataValue(session.metadata, "planKey"));
  const clerkUserId = getMetadataValue(session.metadata, "clerkUserId");
  const organizationId = getMetadataValue(session.metadata, "organizationId");
  const subscriptionId = getResourceId(session.subscription);

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return syncFromSubscription(stripe, subscription, { planKey, clerkUserId, organizationId });
  }

  return persistSubscriptionSnapshot({
    organizationId: await resolveOrganizationId(organizationId, clerkUserId),
    stripeCustomerId: getResourceId(session.customer),
    stripeSubscriptionId: null,
    planKey,
    status: SubscriptionStatus.ACTIVE,
  });
}

async function updateStatusFromInvoice(
  invoice: Stripe.Invoice,
  status: PersistedSubscriptionStatus,
) {
  return persistSubscriptionSnapshot({
    organizationId: null,
    stripeCustomerId: getResourceId(invoice.customer),
    stripeSubscriptionId: getResourceId(invoice.parent?.subscription_details?.subscription),
    planKey: null,
    status,
  });
}

export async function syncCheckoutSessionSubscription(input: {
  stripe: Stripe;
  sessionId: string;
  expectedOrganizationId?: string | null;
}) {
  const session = await input.stripe.checkout.sessions.retrieve(input.sessionId);
  const sessionOrganizationId = getMetadataValue(session.metadata, "organizationId");

  if (
    input.expectedOrganizationId &&
    sessionOrganizationId &&
    sessionOrganizationId !== input.expectedOrganizationId
  ) {
    throw new Error("That checkout session does not belong to the active workspace.");
  }

  return handleCheckoutSessionCompleted(input.stripe, session);
}

export async function syncWorkspaceSubscriptionFromStripe(input: {
  stripe: Stripe;
  organizationId: string;
}) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const persistedSubscription = await db.subscription.findUnique({
    where: { organizationId: input.organizationId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      planKey: true,
    },
  });

  if (persistedSubscription?.stripeSubscriptionId) {
    const stripeSubscription = await input.stripe.subscriptions.retrieve(
      persistedSubscription.stripeSubscriptionId,
    );

    return syncFromSubscription(input.stripe, stripeSubscription, {
      organizationId: input.organizationId,
      planKey: toPlanKey(persistedSubscription.planKey),
    });
  }

  if (!persistedSubscription?.stripeCustomerId) {
    return null;
  }

  const subscriptionList = await input.stripe.subscriptions.list({
    customer: persistedSubscription.stripeCustomerId,
    status: "all",
    limit: 5,
  });
  const latestSubscription = [...subscriptionList.data].sort((left, right) => right.created - left.created)[0];

  if (!latestSubscription) {
    return null;
  }

  return syncFromSubscription(input.stripe, latestSubscription, {
    organizationId: input.organizationId,
    planKey: toPlanKey(persistedSubscription.planKey),
  });
}

export async function processStripeEvent(event: Stripe.Event, stripe: Stripe) {
  await recordBillingEvent({
    externalEventId: event.id,
    eventType: event.type,
    livemode: event.livemode,
    status: BillingEventStatus.RECEIVED,
    message: null,
  });

  try {
    let snapshot: BillingEventSnapshot | null = null;
    let status: (typeof BillingEventStatus)[keyof typeof BillingEventStatus] =
      BillingEventStatus.PROCESSED;

    switch (event.type) {
      case "checkout.session.completed":
        snapshot = await handleCheckoutSessionCompleted(
          stripe,
          event.data.object as Stripe.Checkout.Session,
        );
        if (!snapshot) {
          status = BillingEventStatus.IGNORED;
        }
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        snapshot = await syncFromSubscription(stripe, event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        snapshot = await updateStatusFromInvoice(
          event.data.object as Stripe.Invoice,
          SubscriptionStatus.ACTIVE,
        );
        break;
      case "invoice.payment_failed":
        snapshot = await updateStatusFromInvoice(
          event.data.object as Stripe.Invoice,
          SubscriptionStatus.PAST_DUE,
        );
        break;
      default:
        status = BillingEventStatus.IGNORED;
        break;
    }

    await recordBillingEvent({
      externalEventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      status,
      snapshot: snapshot ?? undefined,
      message: null,
    });

    return { ok: true as const, snapshot, status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook processing failed.";

    await recordBillingEvent({
      externalEventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      status: BillingEventStatus.FAILED,
      message,
    });

    throw error;
  }
}