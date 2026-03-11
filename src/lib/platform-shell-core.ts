export type PlatformAccessState =
  | "SIGN_IN_SETUP_REQUIRED"
  | "SIGN_IN_REQUIRED"
  | "WORKSPACE_UNAVAILABLE"
  | "READY";

export function getPlatformAccessState(input: {
  isConfigured: boolean;
  isAuthenticated: boolean;
  workspace: { id?: string | null } | null;
}): PlatformAccessState {
  if (!input.isConfigured) {
    return "SIGN_IN_SETUP_REQUIRED";
  }

  if (!input.isAuthenticated) {
    return "SIGN_IN_REQUIRED";
  }

  if (!input.workspace?.id) {
    return "WORKSPACE_UNAVAILABLE";
  }

  return "READY";
}

export function isPlatformRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}