import test from "node:test";
import assert from "node:assert/strict";
import {
  buildOrderInputFromMailboxMessage,
  decodeGmailPushNotification,
  isNewerMailboxCursor,
  maskSecret,
  parseSenderHeader,
} from "./inbox-core.ts";

test("parseSenderHeader extracts sender name and email", () => {
  assert.deepEqual(parseSenderHeader('"Atlas Supply" <ops@atlas.example>'), {
    name: "Atlas Supply",
    email: "ops@atlas.example",
  });
});

test("maskSecret hides middle characters", () => {
  assert.equal(maskSecret("abcd1234wxyz"), "abcd••••wxyz");
});

test("buildOrderInputFromMailboxMessage preserves structured line items when present", () => {
  const input = buildOrderInputFromMailboxMessage({
    provider: "GMAIL",
    externalMessageId: "msg_123",
    fromEmail: "ops@atlas.example",
    fromName: "Atlas Supply",
    subject: "Restock request",
    bodyText: "SKU-100 | Stainless elbow fitting | 24",
  });

  assert.equal(input.externalRef, "GMAIL-msg_123");
  assert.equal(input.status, "INGESTED");
  assert.equal(input.lineItems.length, 1);
  assert.equal(input.exceptions.length, 0);
});

test("buildOrderInputFromMailboxMessage falls back to review when parsing is not structured", () => {
  const input = buildOrderInputFromMailboxMessage({
    provider: "MICROSOFT365",
    externalMessageId: "msg_456",
    fromEmail: "buyer@example.com",
    fromName: "Buyer",
    subject: "Need urgent restock",
    bodyText: "Please rush 40 units of the usual valve kit.",
  });

  assert.equal(input.status, "REVIEW");
  assert.equal(input.lineItems[0]?.sku, "MICROSOFT365-EMAIL");
  assert.match(input.exceptions[0] ?? "", /structured line-item extraction/i);
});

test("decodeGmailPushNotification decodes Pub/Sub data payloads", () => {
  const encoded = Buffer.from(
    JSON.stringify({ emailAddress: "Ops@Atlas.example", historyId: 12345 }),
    "utf8",
  ).toString("base64");

  assert.deepEqual(decodeGmailPushNotification(encoded), {
    emailAddress: "ops@atlas.example",
    historyId: "12345",
  });
});

test("isNewerMailboxCursor compares numeric Gmail history ids safely", () => {
  assert.equal(isNewerMailboxCursor("246", "245"), true);
  assert.equal(isNewerMailboxCursor("245", "245"), false);
  assert.equal(isNewerMailboxCursor("244", "245"), false);
  assert.equal(isNewerMailboxCursor("abc", "245"), true);
});