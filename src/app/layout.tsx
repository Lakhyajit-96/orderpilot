import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { clerkRuntime } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OrderPilot — AI Order Intake for Distributors",
    template: "%s | OrderPilot",
  },
  description:
    "OrderPilot turns emailed purchase orders into ERP-ready draft orders with AI extraction, exception review, and a premium operator workflow.",
  icons: {
    icon: [{ url: "/brand/orderpilot-mark.svg", type: "image/svg+xml" }],
    shortcut: ["/brand/orderpilot-mark.svg"],
    apple: ["/brand/orderpilot-mark.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} bg-background text-foreground antialiased`}
      >
        <AppProviders clerkPublishableKey={clerkRuntime.publishableKey}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
