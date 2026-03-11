import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { flags } from "@/lib/env";
import {
  syncCheckoutSessionSubscription,
  syncWorkspaceSubscriptionFromStripe,
} from "@/lib/stripe-event-processor";
import { getStripeServer } from "@/lib/stripe";
import { ensureWorkspaceForUser } from "@/lib/workspace";

const requestSchema = z.object({
  sessionId: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  if (!flags.hasStripe || !flags.hasClerk || !flags.hasDatabase) {
    return NextResponse.json(
      { error: "Billing sync requires Stripe, sign-in, and database persistence." },
      { status: 503 },
    );
  }

  const authState = await auth();

  if (!authState.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripeServer();
  const user = await currentUser();

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is unavailable." }, { status: 503 });
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

  const payload = request.headers.get("content-type")?.includes("application/json")
    ? requestSchema.parse(await request.json())
    : {};

  const snapshot = payload.sessionId
    ? await syncCheckoutSessionSubscription({
        stripe,
        sessionId: payload.sessionId,
        expectedOrganizationId: workspace.id,
      })
    : await syncWorkspaceSubscriptionFromStripe({
        stripe,
        organizationId: workspace.id,
      });

  if (!snapshot) {
    return NextResponse.json(
      { error: "No Stripe subscription is attached to this workspace yet." },
      { status: 409 },
    );
  }

  return NextResponse.json({ snapshot });
}