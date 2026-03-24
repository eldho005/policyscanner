import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Life Insurance Quotes — PolicyScanner.ca",
  description:
    "Compare personalized life insurance quotes side by side. See rates from Canada's top insurers ranked by price, coverage, and value.",
  alternates: { canonical: "/results" },
  robots: { index: false, follow: true },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
