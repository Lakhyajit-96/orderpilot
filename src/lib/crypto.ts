/**
 * AES-256-GCM symmetric encryption for sensitive fields stored in the database.
 *
 * Usage:
 *   const encrypted = encryptField(rawToken);      // store this in DB
 *   const raw       = decryptField(encrypted);     // use this in memory
 *
 * Key: TOKEN_ENCRYPTION_KEY env var — 32-byte hex string (64 hex chars).
 * Generate with: `openssl rand -hex 32`
 *
 * If TOKEN_ENCRYPTION_KEY is not set the helpers are no-ops (identity functions)
 * so the app still works in local dev without the key configured.
 */

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;   // 96-bit IV recommended for GCM
const TAG_BYTES = 16;  // GCM authentication tag

const SEPARATOR = ":";

function getEncryptionKey(): Buffer | null {
  const hex = env.TOKEN_ENCRYPTION_KEY?.trim();

  if (!hex) {
    return null;
  }

  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(
      "[OrderPilot] TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). " +
      "Generate one with: openssl rand -hex 32",
    );
  }

  return Buffer.from(hex, "hex");
}

/**
 * Encrypt a plaintext string.
 * Returns a string in the format: <iv_hex>:<tag_hex>:<ciphertext_hex>
 * Returns null if value is null/undefined.
 */
export function encryptField(value: string | null | undefined): string | null {
  if (!value) return null;

  const key = getEncryptionKey();

  if (!key) {
    // Encryption not configured — store plaintext (dev/test convenience).
    return value;
  }

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString("hex"), tag.toString("hex"), ciphertext.toString("hex")].join(SEPARATOR);
}

/**
 * Decrypt a value encrypted by encryptField.
 * Returns null if value is null/undefined.
 * Falls back to returning value as-is if it doesn't look like an encrypted blob
 * (handles plaintext values already in the DB before encryption was enabled).
 */
export function decryptField(value: string | null | undefined): string | null {
  if (!value) return null;

  const key = getEncryptionKey();

  if (!key) {
    // Encryption not configured — value is stored as plaintext.
    return value;
  }

  const parts = value.split(SEPARATOR);

  if (parts.length !== 3) {
    // Stored before encryption was enabled — return as-is (graceful migration).
    return value;
  }

  const [ivHex, tagHex, ciphertextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  if (iv.length !== IV_BYTES || tag.length !== TAG_BYTES) {
    // Malformed — return as-is to avoid crashing.
    return value;
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
