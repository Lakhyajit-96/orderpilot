import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getStripeServer } from "@/lib/stripe";
import { processStripeEvent } from "@/lib/stripe-event-processor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeServer();

  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const payload = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    await processStripeEvent(event, stripe);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook request.";
    const status = message.toLowerCase().includes("signature") ? 400 : 500;

    if (status === 500) {
      console.error("Stripe webhook processing failed.", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}