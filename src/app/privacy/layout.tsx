import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How OrderPilot handles customer and operator data. Scope, collection, use, sharing, security, retention, and user rights.",
  openGraph: {
    title: "Privacy Policy | OrderPilot",
    description:
      "How OrderPilot handles customer and operator data for distributor operations.",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
