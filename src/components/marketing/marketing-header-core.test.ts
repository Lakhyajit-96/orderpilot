import assert from "node:assert/strict";
import test from "node:test";
import { resolveMarketingHref } from "./marketing-header-core.ts";

test("resolveMarketingHref keeps hash links local on the homepage", () => {
  assert.equal(resolveMarketingHref("#workflow", "/"), "#workflow");
});

test("resolveMarketingHref points hash links back to the landing page from app routes", () => {
  assert.equal(resolveMarketingHref("#workflow", "/dashboard"), "/#workflow");
  assert.equal(resolveMarketingHref("/dashboard", "/dashboard"), "/dashboard");
});