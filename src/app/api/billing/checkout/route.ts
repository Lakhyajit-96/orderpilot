import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildCheckoutCancelUrl, buildCheckoutSuccessUrl } from "@/lib/billing-checkout-core";
import { flags } from "@/lib/env";
import { captureError, trackEvent } from "@/lib/error-tracking";
import { getPriceIdForPlan, getStripeServer } from "@/lib/stripe";
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from "@/lib/rate-limit";
import { ensureWorkspaceForUser } from "@/lib/workspace";

const requestSchema = z.object({
  planKey: z.enum(["starter", "growth", "enterprise"]),
});

export async function POST(request: Request) {
  const authState = flags.hasClerk ? await auth() : null;

  // Rate limiting
  const rateLimitId = getRateLimitIdentifier(request, authState?.userId);
  const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.CHECKOUT);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please try again later." },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.reset),
        },
      },
    );
  }

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

  try {
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

    const metadata = {
      product: "orderpilot",
      planKey,
      clerkUserId: authState?.userId ?? user?.id ?? "anonymous",
      organizationId: workspace?.id ?? "",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: buildCheckoutSuccessUrl(request.url),
      cancel_url: buildCheckoutCancelUrl(request.url),
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: authState?.userId ?? user?.id ?? undefined,
      customer_email: email ?? undefined,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    trackEvent("checkout_started", {
      planKey,
      userId: authState?.userId,
      organizationId: workspace?.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    captureError(error, {
      userId: authState?.userId,
      route: "/api/billing/checkout",
      method: "POST",
    });

    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

