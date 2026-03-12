import test from "node:test";
import assert from "node:assert/strict";
import { encryptField, decryptField } from "./crypto.ts";

test("encryptField and decryptField round-trip successfully", () => {
  const original = "sensitive-token-12345";
  const encrypted = encryptField(original);
  
  assert.ok(encrypted);
  assert.notEqual(encrypted, original);
  
  const decrypted = decryptField(encrypted);
  assert.equal(decrypted, original);
});

test("encryptField returns null for null input", () => {
  assert.equal(encryptField(null), null);
  assert.equal(encryptField(undefined), null);
});

test("decryptField returns null for null input", () => {
  assert.equal(decryptField(null), null);
  assert.equal(decryptField(undefined), null);
});

test("encryptField produces different ciphertext for same input", () => {
  const original = "test-value";
  const encrypted1 = encryptField(original);
  const encrypted2 = encryptField(original);
  
  assert.notEqual(encrypted1, encrypted2);
  assert.equal(decryptField(encrypted1), original);
  assert.equal(decryptField(encrypted2), original);
});

test("decryptField handles plaintext gracefully when encryption not configured", () => {
  const plaintext = "not-encrypted-value";
  const result = decryptField(plaintext);
  
  assert.ok(result);
});
