import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Free Life Insurance Quote — PolicyScanner.ca",
  description:
    "Answer a few quick questions and compare personalized life insurance quotes from 30+ Canadian insurers. Free, fast, and no obligation.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Get Your Free Life Insurance Quote — PolicyScanner.ca",
    description:
      "Answer a few quick questions and compare personalized life insurance quotes from 30+ Canadian insurers.",
    url: "https://policyscanner.ca/quote",
  },
};

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
