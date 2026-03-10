import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { getMailboxOAuthStartUrl } from "@/lib/inbox";

function toProvider(value: string) {
  if (value === "GMAIL" || value === "MICROSOFT365") {
    return value;
  }

  throw new Error("Unsupported mailbox OAuth provider.");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const { provider: rawProvider } = await params;
  const provider = toProvider(rawProvider);
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const syncMode = url.searchParams.get("syncMode") === "WEBHOOK" ? "WEBHOOK" : "POLLING";
  const redirectUrl = getMailboxOAuthStartUrl({
    organizationId: contextResult.context.workspace.id,
    provider,
    address,
    syncMode,
  });

  return NextResponse.redirect(redirectUrl);
}