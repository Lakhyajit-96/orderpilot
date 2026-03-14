import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controls & Rollout",
  description:
    "Keep approvals visible, rollout staged, and downstream handoff controlled. Audit trails, reason codes, and phased adoption for distributor operations.",
  openGraph: {
    title: "Controls & Rollout | OrderPilot",
    description:
      "Approvals, audit trails, and staged rollout controls for distributor order operations.",
  },
};

export default function ControlsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
