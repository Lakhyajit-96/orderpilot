import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { completeMailboxOAuth, parseMailboxOAuthState } from "@/lib/inbox";

function toProvider(value: string) {
  if (value === "GMAIL" || value === "MICROSOFT365") {
    return value;
  }

  throw new Error("Unsupported mailbox OAuth provider.");
}

function buildSettingsRedirect(requestUrl: string, status: string, message?: string) {
  const url = new URL("/settings", requestUrl);
  url.searchParams.set("mailboxOAuth", status);
  if (message) {
    url.searchParams.set("mailboxMessage", message);
  }
  return url;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.redirect(buildSettingsRedirect(request.url, "error", contextResult.error));
  }

  const { provider: rawProvider } = await params;
  const provider = toProvider(rawProvider);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      buildSettingsRedirect(request.url, "error", errorDescription ?? error),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      buildSettingsRedirect(request.url, "error", "Missing mailbox OAuth callback parameters."),
    );
  }

  try {
    const decodedState = parseMailboxOAuthState(state);

    if (
      decodedState.provider !== provider ||
      decodedState.workspaceId !== contextResult.context.workspace.id
    ) {
      throw new Error("Mailbox OAuth state did not match the active workspace.");
    }

    await completeMailboxOAuth({
      organizationId: contextResult.context.workspace.id,
      provider,
      code,
      addressHint: decodedState.address,
      syncMode: decodedState.syncMode,
    });

    return NextResponse.redirect(buildSettingsRedirect(request.url, "connected", provider));
  } catch (callbackError) {
    const message = callbackError instanceof Error ? callbackError.message : "Mailbox OAuth failed.";
    return NextResponse.redirect(buildSettingsRedirect(request.url, "error", message));
  }
}