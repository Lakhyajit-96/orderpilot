import { BillingEventStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";

export type BillingEventSnapshot = {
  organizationId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  planKey?: string | null;
};

export async function recordBillingEvent(input: {
  externalEventId: string;
  eventType: string;
  livemode: boolean;
  status: keyof typeof BillingEventStatus;
  message?: string | null;
  snapshot?: BillingEventSnapshot;
}) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.billingEvent.upsert({
    where: { externalEventId: input.externalEventId },
    create: {
      externalEventId: input.externalEventId,
      eventType: input.eventType,
      livemode: input.livemode,
      status: input.status,
      message: input.message ?? null,
      processedAt: input.status === BillingEventStatus.RECEIVED ? undefined : new Date(),
      organizationId: input.snapshot?.organizationId ?? undefined,
      stripeCustomerId: input.snapshot?.stripeCustomerId ?? undefined,
      stripeSubscriptionId: input.snapshot?.stripeSubscriptionId ?? undefined,
      planKey: input.snapshot?.planKey ?? undefined,
    },
    update: {
      status: input.status,
      message: input.message ?? null,
      processedAt: input.status === BillingEventStatus.RECEIVED ? undefined : new Date(),
      organizationId: input.snapshot?.organizationId ?? undefined,
      stripeCustomerId: input.snapshot?.stripeCustomerId ?? undefined,
      stripeSubscriptionId: input.snapshot?.stripeSubscriptionId ?? undefined,
      planKey: input.snapshot?.planKey ?? undefined,
    },
  });
}

export async function getRecentBillingEvents(organizationId: string | null | undefined) {
  return getBillingEvents({ organizationId, take: 8 });
}

export async function getBillingEvents(input: {
  organizationId: string | null | undefined;
  status?: keyof typeof BillingEventStatus;
  take?: number;
}) {
  const db = getDb();

  if (!db || !input.organizationId) {
    return [];
  }

  return db.billingEvent.findMany({
    where: {
      organizationId: input.organizationId,
      ...(input.status ? { status: input.status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: input.take ?? 12,
  });
}

export async function getBillingDiagnosticsSnapshot(
  organizationId: string | null | undefined,
) {
  const db = getDb();

  if (!db || !organizationId) {
    return { subscription: null, recentEvents: [], failedEvents: [] };
  }

  const [subscription, recentEvents, failedEvents] = await Promise.all([
    db.subscription.findUnique({ where: { organizationId } }),
    getBillingEvents({ organizationId, take: 8 }),
    getBillingEvents({ organizationId, status: BillingEventStatus.FAILED, take: 5 }),
  ]);

  return { subscription, recentEvents, failedEvents };
}