import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Clock, MessageSquare, Phone } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — PolicyScanner.ca",
  description:
    "Get in touch with PolicyScanner.ca. We're a licensed Canadian brokerage here to help you find the right life insurance coverage.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us — PolicyScanner.ca",
    description:
      "Get in touch with PolicyScanner.ca. Licensed Canadian brokerage helping you find the right life insurance.",
    url: "https://www.policyscanner.ca/contact",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "PolicyScanner",
  url: "https://www.policyscanner.ca",
  telephone: "+1-437-422-8353",
  email: "support@policyscanner.ca",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kitchener",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
};

const channels = [
  {
    icon: <Phone size={22} />,
    title: "Call us",
    detail: "(437) 422-8353",
    sub: "Mon–Fri, 9 AM – 6 PM ET.",
  },
  {
    icon: <Mail size={22} />,
    title: "Email us",
    detail: "support@policyscanner.ca",
    sub: "We respond within 1 business day.",
  },
  {
    icon: <Clock size={22} />,
    title: "Business hours",
    detail: "Mon–Fri, 9 AM – 6 PM ET",
    sub: "Excluding Canadian statutory holidays.",
  },
  {
    icon: <MessageSquare size={22} />,
    title: "General inquiries",
    detail: "Use the form below",
    sub: "For quotes, partnerships, or press.",
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-background-warm border-b border-border-light">
          <div className="max-w-[760px] mx-auto px-7 pt-16 pb-14 max-sm:pt-10 max-sm:pb-10">
            <span className="inline-block bg-primary-subtle text-primary text-[0.7rem] font-semibold px-2.5 py-1 rounded-full mb-5 tracking-[0.02em] uppercase">
              Contact
            </span>
            <h1 className="font-display text-[2.2rem] max-sm:text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.025em] opsz-48 text-foreground mb-4">
              We&apos;re here to help
            </h1>
            <p className="text-[1.05rem] max-sm:text-[0.95rem] text-foreground-secondary leading-relaxed max-w-[560px]">
              Whether you have a question about your quote, need help choosing coverage, or just want to learn more — reach out anytime.
            </p>
          </div>
        </section>

        {/* Contact channels */}
        <section className="py-14 max-sm:py-10">
          <div className="max-w-[760px] mx-auto px-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {channels.map((ch) => (
                <div key={ch.title} className="bg-white border border-border rounded-lg p-6 text-center">
                  <div className="w-11 h-11 rounded-lg bg-primary-light flex items-center justify-center text-primary mx-auto mb-4">
                    {ch.icon}
                  </div>
                  <h3 className="text-[0.9rem] font-semibold text-foreground mb-1">{ch.title}</h3>
                  <p className="text-[0.9rem] font-medium text-foreground mb-1">{ch.detail}</p>
                  <p className="text-[0.78rem] text-foreground-muted">{ch.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section className="py-14 max-sm:py-10 bg-background-warm border-y border-border-light">
          <div className="max-w-[520px] mx-auto px-7">
            <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-2">
              Send us a message
            </h2>
            <p className="text-[0.9rem] text-foreground-secondary mb-8">
              Fill out the form and we&apos;ll get back to you within 1 business day.
            </p>

            <ContactForm />
          </div>
        </section>

        {/* Quick CTA */}
        <section className="py-14 max-sm:py-10">
          <div className="max-w-[760px] mx-auto px-7 text-center">
            <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-3">
              Looking for a quote instead?
            </h2>
            <p className="text-[0.9rem] text-foreground-secondary mb-6">
              Compare rates from 20+ Canadian insurers in under 2 minutes.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors"
            >
              Compare Quotes Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
