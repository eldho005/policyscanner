import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import WhyChoose from "@/components/sections/WhyChoose";
import Steps from "@/components/sections/Steps";
import Insights from "@/components/sections/Insights";

const Partners = dynamic(() => import("@/components/sections/Partners"));
const Reviews = dynamic(() => import("@/components/sections/Reviews"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "InsuranceAgency"],
      "@id": "https://www.policyscanner.ca/#organization",
      name: "PolicyScanner",
      legalName: "PolicyScanner Brokerage Incorporated",
      url: "https://www.policyscanner.ca",
      logo: "https://www.policyscanner.ca/favicon.svg",
      description:
        "Compare life insurance quotes from 30+ Canadian insurers. Licensed brokerage (FSRA #41964M) helping Canadians find affordable coverage.",
      areaServed: {
        "@type": "Country",
        name: "Canada",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kitchener",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-437-422-8353",
        contactType: "customer service",
        email: "support@policyscanner.ca",
        availableLanguage: "English",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
      sameAs: ["https://g.page/r/CSTWjjGbW_3gEAE"],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.policyscanner.ca/#website",
      url: "https://www.policyscanner.ca",
      name: "PolicyScanner",
      publisher: { "@id": "https://www.policyscanner.ca/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.policyscanner.ca/quote",
        description: "Get a personalized life insurance quote",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Partners />
        <Features />
        <Stats />
        <WhyChoose />
        <Reviews />
        <Insights />
        <Steps />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
