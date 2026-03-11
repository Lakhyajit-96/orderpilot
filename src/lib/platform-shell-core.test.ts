import test from "node:test";
import assert from "node:assert/strict";
import { getPlatformAccessState, isPlatformRouteActive } from "./platform-shell-core.ts";

test("getPlatformAccessState requires sign-in setup before platform access", () => {
  assert.equal(
    getPlatformAccessState({ isConfigured: false, isAuthenticated: false, workspace: null }),
    "SIGN_IN_SETUP_REQUIRED",
  );
});

test("getPlatformAccessState requires authentication when sign-in is configured", () => {
  assert.equal(
    getPlatformAccessState({ isConfigured: true, isAuthenticated: false, workspace: null }),
    "SIGN_IN_REQUIRED",
  );
});

test("getPlatformAccessState blocks access when the workspace cannot be loaded", () => {
  assert.equal(
    getPlatformAccessState({ isConfigured: true, isAuthenticated: true, workspace: null }),
    "WORKSPACE_UNAVAILABLE",
  );
});

test("getPlatformAccessState allows access only when the workspace is ready", () => {
  assert.equal(
    getPlatformAccessState({ isConfigured: true, isAuthenticated: true, workspace: { id: "ws_123" } }),
    "READY",
  );
});

test("isPlatformRouteActive handles nested order routes", () => {
  assert.equal(isPlatformRouteActive("/orders/PO-100", "/orders"), true);
  assert.equal(isPlatformRouteActive("/settings", "/orders"), false);
});