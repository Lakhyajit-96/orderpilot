import test from "node:test";
import assert from "node:assert/strict";
import {
  buildGeneratedOrderRef,
  buildMailboxSummary,
  getOrderStatusLabel,
  isDuplicateExternalRefConstraintError,
  parseMailboxExceptions,
  parseMailboxLineItems,
} from "./order-write-core.ts";

test("parseMailboxLineItems parses pipe-delimited inbox lines", () => {
  const items = parseMailboxLineItems(
    "SKU-100 | Stainless elbow fitting | 24\nSKU-220 | Brass valve kit | 3",
  );

  assert.deepEqual(items, [
    { sku: "SKU-100", description: "Stainless elbow fitting", quantity: 24 },
    { sku: "SKU-220", description: "Brass valve kit", quantity: 3 },
  ]);
});

test("parseMailboxLineItems rejects invalid rows", () => {
  assert.throws(
    () => parseMailboxLineItems("SKU-100 | Missing quantity"),
    /Each line item must use the format/,
  );
});

test("parseMailboxExceptions trims blank lines", () => {
  assert.deepEqual(parseMailboxExceptions("Need PO\n\nMissing ship date\n"), [
    "Need PO",
    "Missing ship date",
  ]);
});

test("buildMailboxSummary falls back to subject when summary is empty", () => {
  assert.equal(
    buildMailboxSummary("Urgent restock request", ""),
    "Inbound email received: Urgent restock request",
  );
});

test("getOrderStatusLabel exposes reviewer-facing status names", () => {
  assert.equal(getOrderStatusLabel("INGESTED"), "Intake captured");
  assert.equal(getOrderStatusLabel("REVIEW"), "Needs review");
  assert.equal(getOrderStatusLabel("APPROVED"), "Ready to export");
  assert.equal(getOrderStatusLabel("EXPORTED"), "Exported");
});

test("buildGeneratedOrderRef returns prefixed ids", () => {
  assert.match(buildGeneratedOrderRef("MAIL"), /^MAIL-[A-F0-9]{8}$/);
});

test("isDuplicateExternalRefConstraintError detects externalRef unique violations", () => {
  assert.equal(
    isDuplicateExternalRefConstraintError({
      code: "P2002",
      meta: { target: ["organizationId", "externalRef"] },
    }),
    true,
  );
  assert.equal(
    isDuplicateExternalRefConstraintError({
      code: "P2002",
      meta: { target: ["organizationId", "name"] },
    }),
    false,
  );
});