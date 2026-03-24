import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://policyscanner.ca"),
  title: "PolicyScanner.ca — The Best Way to Buy Life Insurance in Canada",
  description:
    "Compare life insurance quotes from 30+ Canadian insurers. Get personalized rates in under 2 minutes.",
  openGraph: {
    title: "PolicyScanner.ca — Compare Life Insurance Quotes",
    description:
      "Compare life insurance quotes from 30+ Canadian insurers. Get personalized rates in under 2 minutes.",
    url: "https://policyscanner.ca",
    siteName: "PolicyScanner",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PolicyScanner.ca — Compare Life Insurance Quotes",
    description:
      "Compare life insurance quotes from 30+ Canadian insurers. Get personalized rates in under 2 minutes.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${playfair.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
