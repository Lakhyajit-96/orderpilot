import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Data Handling",
  description:
    "Practical security for mailbox OAuth, token rotation, webhook verification, data retention, and incident response. Built for distributor operations trust.",
  openGraph: {
    title: "Security & Data Handling | OrderPilot",
    description:
      "Practical security for mailbox OAuth, token rotation, webhook verification, data retention, and incident response.",
  },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
