import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { recordLaunchChecklistTelemetry } from "@/lib/launch-telemetry";

const launchChecklistSchema = z.object({
  checklist: z.array(z.object({
    key: z.string().trim().min(1),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    supportText: z.string().trim().min(1),
    href: z.string().trim().min(1),
    ctaLabel: z.string().trim().min(1),
    completed: z.boolean(),
  })).min(1),
});

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = launchChecklistSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const telemetry = await recordLaunchChecklistTelemetry({
      organizationId: contextResult.context.workspace.id,
      clerkUserId: contextResult.context.clerkUserId,
      checklist: parsed.data.checklist,
    });

    return NextResponse.json({ telemetry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not record launch checklist telemetry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}