import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Stories",
  description:
    "Outcome-focused proof from operations leaders. See how distributor teams achieve faster review, fewer re-entry loops, and clearer approvals.",
  openGraph: {
    title: "Customer Stories | OrderPilot",
    description:
      "Outcome-focused proof from operations leaders using OrderPilot for distributor order intake.",
  },
};

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
