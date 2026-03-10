"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AppProviders({
  children,
  clerkPublishableKey,
}: {
  children: React.ReactNode;
  clerkPublishableKey?: string;
}) {
  if (!clerkPublishableKey) {
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>;
}

