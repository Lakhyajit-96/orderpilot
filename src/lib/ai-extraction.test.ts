import test from "node:test";
import assert from "node:assert/strict";
import { extractOrderFromEmail, validateExtractedOrder } from "./ai-extraction.ts";

test("extractOrderFromEmail parses structured line items", async () => {
  const result = await extractOrderFromEmail({
    subject: "PO #12345",
    body: "SKU-001 | Widget A | 10\nSKU-002 | Widget B | 5\nSKU-003 | Widget C | 3",
    fromEmail: "buyer@example.com",
    fromName: "John Buyer",
  });

  assert.equal(result.lineItems.length, 3);
  assert.equal(result.lineItems[0].sku, "SKU-001");
  assert.equal(result.lineItems[0].description, "Widget A");
  assert.equal(result.lineItems[0].quantity, 10);
  assert.equal(result.customerName, "John Buyer");
  assert.equal(result.customerEmail, "buyer@example.com");
  assert.equal(result.poNumber, "12345");
  assert.ok(result.confidence > 50);
});

test("extractOrderFromEmail handles unstructured emails", async () => {
  const result = await extractOrderFromEmail({
    subject: "Need to order some parts",
    body: "Hi, can you send me some widgets? Thanks!",
    fromEmail: "customer@example.com",
    fromName: "Jane Customer",
  });

  assert.equal(result.lineItems.length, 1);
  assert.equal(result.lineItems[0].sku, "EMAIL-REVIEW");
  assert.ok(result.exceptions.length > 0);
  assert.ok(result.confidence < 50);
  assert.equal(result.customerName, "Jane Customer");
});

test("extractOrderFromEmail extracts PO numbers from subject", async () => {
  const testCases = [
    { subject: "PO #ABC-123", expected: "ABC-123" },
    { subject: "Purchase Order: XYZ789", expected: "XYZ789" },
    { subject: "Order #12345", expected: "12345" },
  ];

  for (const testCase of testCases) {
    const result = await extractOrderFromEmail({
      subject: testCase.subject,
      body: "SKU-001 | Test Item | 1",
      fromEmail: "test@example.com",
      fromName: "Test User",
    });

    assert.equal(result.poNumber, testCase.expected);
  }
});

test("extractOrderFromEmail extracts shipping address", async () => {
  const result = await extractOrderFromEmail({
    subject: "Order",
    body: "SKU-001 | Item | 1\n\nShip to: 123 Main St, City, ST 12345",
    fromEmail: "test@example.com",
    fromName: "Test User",
  });

  assert.ok(result.shippingAddress);
  assert.ok(result.shippingAddress.includes("123 Main St"));
});

test("validateExtractedOrder reduces confidence for suspicious SKUs", () => {
  const order = {
    customerName: "Test Customer",
    customerEmail: "test@example.com",
    lineItems: [
      { sku: "MANUAL-REVIEW", description: "Needs review", quantity: 1 },
    ],
    confidence: 80,
    exceptions: [],
  };

  const validated = validateExtractedOrder(order);

  assert.ok(validated.confidence < order.confidence);
  assert.ok(validated.exceptions.some((e) => e.includes("manual SKU mapping")));
});

test("validateExtractedOrder flags invalid quantities", () => {
  const order = {
    customerName: "Test Customer",
    lineItems: [
      { sku: "SKU-001", description: "Item", quantity: 0 },
    ],
    confidence: 80,
    exceptions: [],
  };

  const validated = validateExtractedOrder(order);

  assert.ok(validated.exceptions.some((e) => e.includes("invalid quantities")));
  assert.ok(validated.confidence < order.confidence);
});

test("validateExtractedOrder flags missing customer name", () => {
  const order = {
    customerName: "Unknown Customer",
    lineItems: [
      { sku: "SKU-001", description: "Item", quantity: 1 },
    ],
    confidence: 80,
    exceptions: [],
  };

  const validated = validateExtractedOrder(order);

  assert.ok(validated.exceptions.some((e) => e.includes("Customer name")));
});
