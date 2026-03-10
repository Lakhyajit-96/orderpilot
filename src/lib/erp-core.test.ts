import test from "node:test";
import assert from "node:assert/strict";
import {
  buildErpAdapterPayload,
  buildErpExportPayload,
  maskAuthHeader,
  parseJsonRecord,
} from "./erp-core.ts";

test("maskAuthHeader hides token body", () => {
  assert.equal(maskAuthHeader("Bearer secret-token-1234"), "Bearer••••1234");
});

test("buildErpExportPayload shapes order data for downstream systems", () => {
  const payload = buildErpExportPayload({
    workspaceName: "Atlas Workspace",
    orderId: "PO-1001",
    status: "Ready to export",
    customerName: "Atlas Supply",
    customerEmail: "ops@atlas.example",
    sourceEmail: "orders@atlas.example",
    shippingAddress: "100 Harbor Way",
    summary: "Urgent replenishment",
    totalCents: 420000,
    notes: [{ body: "Approved by reviewer", authorName: "Taylor" }],
    lineItems: [
      {
        sku: "SKU-100",
        description: "Stainless elbow fitting",
        quantity: 24,
        mappedTo: "ERP-100",
        confidence: 98,
      },
    ],
  });

  assert.equal(payload.workspace, "Atlas Workspace");
  assert.equal(payload.order.id, "PO-1001");
  assert.equal(payload.customer.email, "ops@atlas.example");
  assert.equal(payload.lineItems[0]?.mappedSku, "ERP-100");
  assert.equal(payload.notes[0]?.author, "Taylor");
});

test("buildErpAdapterPayload shapes NetSuite payloads with mappings", () => {
  const payload = buildErpExportPayload({
    workspaceName: "Atlas Workspace",
    orderId: "PO-1001",
    status: "Ready to export",
    customerName: "Atlas Supply",
    customerEmail: "ops@atlas.example",
    notes: [],
    lineItems: [{ sku: "SKU-1", description: "Valve", quantity: 2, mappedTo: "ERP-1" }],
  });
  const adapter = buildErpAdapterPayload({
    provider: "NETSUITE",
    fieldMappings: { lineItem: { mappedSku: "item" } },
    payload,
  });

  assert.equal(adapter.adapter, "NETSUITE");
  assert.equal(adapter.body.itemList[0]?.item, "ERP-1");
});

test("parseJsonRecord returns fallback for empty input", () => {
  assert.deepEqual(parseJsonRecord("", { ok: true }), { ok: true });
});