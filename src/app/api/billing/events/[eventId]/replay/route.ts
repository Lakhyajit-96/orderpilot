import { NextResponse } from "next/server";
import { BillingEventStatus } from "@/generated/prisma/enums";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { getDb } from "@/lib/db";
import { flags } from "@/lib/env";
import { getStripeServer } from "@/lib/stripe";
import { processStripeEvent } from "@/lib/stripe-event-processor";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  if (!flags.hasStripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const db = getDb();
  const stripe = getStripeServer();

  if (!db || !stripe) {
    return NextResponse.json({ error: "Billing replay is unavailable." }, { status: 503 });
  }

  const { eventId } = await params;
  const billingEvent = await db.billingEvent.findUnique({ where: { externalEventId: eventId } });

  if (!billingEvent || billingEvent.organizationId !== contextResult.context.workspace.id) {
    return NextResponse.json({ error: "Billing event not found." }, { status: 404 });
  }

  if (
    billingEvent.status !== BillingEventStatus.FAILED &&
    billingEvent.status !== BillingEventStatus.IGNORED
  ) {
    return NextResponse.json(
      { error: "Only failed or ignored events can be replayed safely." },
      { status: 409 },
    );
  }

  try {
    const event = await stripe.events.retrieve(eventId);
    await processStripeEvent(event, stripe);

    const refreshed = await db.billingEvent.findUnique({ where: { externalEventId: eventId } });
    return NextResponse.json({ event: refreshed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not replay billing event.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}