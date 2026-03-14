import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow",
  description:
    "From shared mailbox capture to ERP-ready release. See the four-stage workflow that turns emailed purchase orders into structured, reviewable order drafts.",
  openGraph: {
    title: "Workflow | OrderPilot",
    description:
      "From shared mailbox capture to ERP-ready release. See the four-stage workflow for distributor order intake.",
  },
};

export default function WorkflowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
