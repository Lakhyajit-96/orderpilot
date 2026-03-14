import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "One workspace for intake, review, and ERP-ready release. See how OrderPilot gives distributor operations teams a unified command center.",
  openGraph: {
    title: "Platform | OrderPilot",
    description:
      "One workspace for intake, review, and ERP-ready release for distributor operations.",
  },
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children;
}
