import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Life Insurance Calculator (DIME Method) — PolicyScanner.ca",
  description:
    "Calculate how much life insurance you need using the DIME method. Free calculator covering Debt, Income, Mortgage & Education costs for Canadian families.",
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: "Life Insurance Calculator (DIME Method) — PolicyScanner.ca",
    description:
      "Calculate how much life insurance you need using the DIME method. Free calculator for Canadian families.",
    type: "website",
    url: "https://policyscanner.ca/calculator",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
