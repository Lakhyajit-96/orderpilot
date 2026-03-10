import { createHmac, timingSafeEqual } from "node:crypto";

export type OAuthMailboxProvider = "GMAIL" | "MICROSOFT365";

type OAuthStatePayload = {
  workspaceId: string;
  provider: OAuthMailboxProvider;
  address?: string | null;
  syncMode: "POLLING" | "WEBHOOK";
  issuedAt: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function getMailboxOAuthScopes(provider: OAuthMailboxProvider, override?: string | null) {
  if (override?.trim()) {
    return override.trim();
  }

  if (provider === "GMAIL") {
    return [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");
  }

  return [
    "offline_access",
    "openid",
    "profile",
    "email",
    "https://graph.microsoft.com/Mail.Read",
    "https://graph.microsoft.com/User.Read",
  ].join(" ");
}

export function buildMailboxOAuthRedirectUri(appUrl: string, provider: OAuthMailboxProvider) {
  return new URL(`/api/inbox/oauth/${provider}/callback`, appUrl).toString();
}

export function encodeMailboxOAuthState(payload: OAuthStatePayload, secret: string) {
  const serialized = JSON.stringify(payload);
  const encoded = toBase64Url(serialized);
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function decodeMailboxOAuthState(state: string, secret: string): OAuthStatePayload {
  const [encoded, signature] = state.split(".");

  if (!encoded || !signature) {
    throw new Error("Invalid mailbox OAuth state.");
  }

  const expected = sign(encoded, secret);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    throw new Error("Mailbox OAuth state signature is invalid.");
  }

  return JSON.parse(fromBase64Url(encoded)) as OAuthStatePayload;
}

export function buildMailboxAuthorizeUrl(input: {
  provider: OAuthMailboxProvider;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
  tenantId?: string | null;
  loginHint?: string | null;
}) {
  if (input.provider === "GMAIL") {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", input.clientId);
    url.searchParams.set("redirect_uri", input.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("scope", input.scope);
    url.searchParams.set("state", input.state);

    if (input.loginHint) {
      url.searchParams.set("login_hint", input.loginHint);
    }

    return url.toString();
  }

  const tenantId = input.tenantId?.trim() || "common";
  const url = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("scope", input.scope);
  url.searchParams.set("state", input.state);

  if (input.loginHint) {
    url.searchParams.set("login_hint", input.loginHint);
  }

  return url.toString();
}

export function buildMicrosoftSubscriptionRequest(notificationUrl: string, clientState: string) {
  const expirationDateTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  return {
    changeType: "created,updated",
    notificationUrl,
    resource: "/me/mailFolders('Inbox')/messages",
    expirationDateTime,
    clientState,
  };
}

export function buildMicrosoftSubscriptionRenewalRequest() {
  return {
    expirationDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function buildGmailWatchRequest(topicName: string) {
  return {
    labelIds: ["INBOX"],
    topicName,
  };
}

export function normalizeTokenExpiry(expiresInSeconds: number | null | undefined) {
  if (!expiresInSeconds || Number.isNaN(expiresInSeconds)) {
    return null;
  }

  return new Date(Date.now() + expiresInSeconds * 1000);
}