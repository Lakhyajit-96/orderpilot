import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers for operations, IT, and order desk leaders evaluating OrderPilot. Learn about rollout, approvals, setup, and integration questions.",
  openGraph: {
    title: "FAQ | OrderPilot",
    description:
      "Common questions about OrderPilot for distributor order intake automation.",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
