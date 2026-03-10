import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OrderPilot — AI Order Intake for Distributors",
    template: "%s | OrderPilot",
  },
  description:
    "OrderPilot turns emailed purchase orders into ERP-ready draft orders with AI extraction, exception review, and a premium operator workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <AppProviders clerkPublishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
