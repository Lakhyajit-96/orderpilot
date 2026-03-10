import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { flags } from "@/lib/env";
import { createBillingPortalSessionUrl } from "@/lib/billing-portal-core";
import { getDb } from "@/lib/db";
import { getStripeServer } from "@/lib/stripe";
import { ensureWorkspaceForUser } from "@/lib/workspace";

export async function POST(request: Request) {
  if (!flags.hasStripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add your Stripe keys first." },
      { status: 503 },
    );
  }

  if (!flags.hasDatabase || !flags.hasClerk) {
    return NextResponse.json(
      { error: "Billing portal requires Clerk authentication and database persistence." },
      { status: 503 },
    );
  }

  const authState = await auth();

  if (!authState.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripeServer();
  const db = getDb();
  const user = await currentUser();

  if (!stripe || !db) {
    return NextResponse.json({ error: "Billing portal is unavailable." }, { status: 503 });
  }

  const workspace = await ensureWorkspaceForUser({
    clerkUserId: authState.userId,
    clerkOrgId: authState.orgId,
    displayName:
      user?.fullName || user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "Operator",
    email: user?.primaryEmailAddress?.emailAddress ?? `${authState.userId}@orderpilot.local`,
  });

  if (!workspace) {
    return NextResponse.json(
      { error: "Workspace setup is incomplete. Please reload and try again." },
      { status: 503 },
    );
  }

  const subscription = await db.subscription.findUnique({
    where: { organizationId: workspace.id },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  const result = await createBillingPortalSessionUrl({
    persistedCustomerId: subscription?.stripeCustomerId ?? null,
    workspaceCustomerId: workspace.subscription?.stripeCustomerId ?? null,
    stripeSubscriptionId: subscription?.stripeSubscriptionId ?? null,
    requestUrl: request.url,
    loadCustomerIdFromSubscription: async (subscriptionId) => {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

      return typeof stripeSubscription.customer === "string"
        ? stripeSubscription.customer
        : stripeSubscription.customer?.id ?? null;
    },
    createPortalSession: async ({ customer, returnUrl }) => {
      const session = await stripe.billingPortal.sessions.create({
        customer,
        return_url: returnUrl,
      });

      return session.url;
    },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ url: result.url });
}