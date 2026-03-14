import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the rollout path that matches your order volume. Transparent seat-based pricing from Starter to Enterprise for distributor operations.",
  openGraph: {
    title: "Pricing | OrderPilot",
    description:
      "Transparent seat-based pricing for distributor order intake automation. Start with inbox visibility and grow into full ERP handoff.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
