import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { flags } from "@/lib/env";
import { getPriceIdForPlan, getStripeServer } from "@/lib/stripe";
import { ensureWorkspaceForUser } from "@/lib/workspace";

const requestSchema = z.object({
  planKey: z.enum(["starter", "growth", "enterprise"]),
});

export async function POST(request: Request) {
  const authState = flags.hasClerk ? await auth() : null;

  if (!flags.hasStripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add your Stripe keys and price IDs." },
      { status: 503 },
    );
  }

  const stripe = getStripeServer();

  if (!stripe) {
    return NextResponse.json({ error: "Stripe server is unavailable." }, { status: 503 });
  }

  const { planKey } = requestSchema.parse(await request.json());

  if (planKey === "enterprise") {
    return NextResponse.json(
      { error: "Enterprise plans are handled by sales. Please contact sales to get started." },
      { status: 400 },
    );
  }

  const priceId = getPriceIdForPlan(planKey);

  if (!priceId) {
    return NextResponse.json(
      { error: `Missing Stripe price configuration for ${planKey}.` },
      { status: 503 },
    );
  }

  const user = flags.hasClerk ? await currentUser() : null;

  if (flags.hasClerk && !user) {
    return NextResponse.json({ error: "Sign in before starting checkout." }, { status: 401 });
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const displayName =
    user?.fullName || user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "Operator";
  const workspace = authState?.userId
    ? await ensureWorkspaceForUser({
        clerkUserId: authState.userId,
        clerkOrgId: authState.orgId,
        displayName,
        email: email ?? `${authState.userId}@orderpilot.local`,
      })
    : null;

  if (flags.hasDatabase && authState?.userId && !workspace) {
    return NextResponse.json(
      { error: "Workspace setup is incomplete. Please reload and try again." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const metadata = {
    product: "orderpilot",
    planKey,
    clerkUserId: authState?.userId ?? user?.id ?? "anonymous",
    organizationId: workspace?.id ?? "",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${url.origin}/settings?checkout=success`,
    cancel_url: `${url.origin}/settings?checkout=canceled`,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    client_reference_id: authState?.userId ?? user?.id ?? undefined,
    customer_email: email ?? undefined,
    metadata,
    subscription_data: {
      metadata,
    },
  });

  return NextResponse.json({ url: session.url });
}

