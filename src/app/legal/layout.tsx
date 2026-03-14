import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Compliance, security, and integration responsibilities for OrderPilot customers. Mailbox integrations, ERP handoff, and export log policies.",
  openGraph: {
    title: "Legal | OrderPilot",
    description:
      "Legal posture and obligations around mailbox integrations, ERP handoffs, and data security.",
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
