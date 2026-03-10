import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMailboxAuthorizeUrl,
  buildMailboxOAuthRedirectUri,
  buildMicrosoftSubscriptionRenewalRequest,
  buildMicrosoftSubscriptionRequest,
  decodeMailboxOAuthState,
  encodeMailboxOAuthState,
  getMailboxOAuthScopes,
} from "./mailbox-oauth-core.ts";

test("buildMailboxOAuthRedirectUri builds callback path", () => {
  assert.equal(
    buildMailboxOAuthRedirectUri("https://app.example.com", "GMAIL"),
    "https://app.example.com/api/inbox/oauth/GMAIL/callback",
  );
});

test("mailbox oauth state round-trips with signing", () => {
  const state = encodeMailboxOAuthState(
    {
      workspaceId: "org_123",
      provider: "MICROSOFT365",
      address: "ops@example.com",
      syncMode: "WEBHOOK",
      issuedAt: 123,
    },
    "secret",
  );

  assert.deepEqual(decodeMailboxOAuthState(state, "secret"), {
    workspaceId: "org_123",
    provider: "MICROSOFT365",
    address: "ops@example.com",
    syncMode: "WEBHOOK",
    issuedAt: 123,
  });
});

test("buildMailboxAuthorizeUrl builds provider-specific urls", () => {
  const gmailUrl = buildMailboxAuthorizeUrl({
    provider: "GMAIL",
    clientId: "client",
    redirectUri: "https://app.example.com/callback",
    state: "abc",
    scope: getMailboxOAuthScopes("GMAIL"),
  });

  assert.match(gmailUrl, /accounts\.google\.com/);
  assert.match(gmailUrl, /access_type=offline/);
});

test("buildMicrosoftSubscriptionRequest shapes graph subscription body", () => {
  const request = buildMicrosoftSubscriptionRequest("https://app.example.com/webhook", "secret");

  assert.equal(request.notificationUrl, "https://app.example.com/webhook");
  assert.equal(request.clientState, "secret");
  assert.equal(request.resource, "/me/mailFolders('Inbox')/messages");
});

test("buildMicrosoftSubscriptionRenewalRequest extends graph expiration", () => {
  const request = buildMicrosoftSubscriptionRenewalRequest();

  assert.match(request.expirationDateTime, /T/);
});