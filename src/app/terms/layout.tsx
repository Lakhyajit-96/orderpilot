import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms governing your use of OrderPilot. Service scope, acceptable use, payment, data handling, availability, and liability.",
  openGraph: {
    title: "Terms and Conditions | OrderPilot",
    description:
      "Terms governing the use of OrderPilot for distributor order intake automation.",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
