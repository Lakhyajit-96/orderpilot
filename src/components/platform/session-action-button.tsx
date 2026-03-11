"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SessionActionButton({
  isAuthenticated,
  className,
  size = "sm",
  variant = "secondary",
}: {
  isAuthenticated: boolean;
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  if (!isAuthenticated) {
    return (
      <Button asChild size={size} variant={variant} className={className}>
        <Link href="/sign-in">
          <LogIn className="size-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <SignOutButton redirectUrl="/">
      <Button size={size} variant={variant} className={cn("cursor-pointer", className)}>
        <LogOut className="size-4" />
        Sign out
      </Button>
    </SignOutButton>
  );
}