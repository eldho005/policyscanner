import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { insuranceTypes, insuranceTypeSlugs } from "@/data/insurance-types";
import { CheckCircle, ArrowRight, Users } from "lucide-react";

export function generateStaticParams() {
  return insuranceTypeSlugs.map((slug) => ({ type: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const data = insuranceTypes[type];
  if (!data) return {};
  return {
    title: `${data.title} — PolicyScanner.ca`,
    description: data.metaDescription,
    openGraph: {
      title: `${data.title} — PolicyScanner.ca`,
      description: data.metaDescription,
      url: `https://policyscanner.ca/insurance/${type}`,
    },
    alternates: {
      canonical: `https://policyscanner.ca/insurance/${type}`,
    },
  };
}

export default async function InsuranceTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const data = insuranceTypes[type];
  if (!data) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-background-warm border-b border-border-light">
          <div className="max-w-[1120px] mx-auto px-7 pt-16 pb-14 max-sm:pt-10 max-sm:pb-10">
            <nav className="flex items-center gap-1.5 text-[0.78rem] text-foreground-muted mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#features" className="hover:text-foreground transition-colors">Insurance</Link>
              <span>/</span>
              <span className="text-foreground-secondary">{data.title}</span>
            </nav>

            <div className="max-w-[680px]">
              <span className="inline-block bg-primary-subtle text-primary text-[0.7rem] font-semibold px-2.5 py-1 rounded-full mb-5 tracking-[0.02em] uppercase">
                Insurance type
              </span>
              <h1 className="font-display text-[2.2rem] max-sm:text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.025em] opsz-48 text-foreground mb-4">
                {data.title}
              </h1>
              <p className="text-[1.1rem] max-sm:text-[0.95rem] text-primary font-medium mb-3">
                {data.tagline}
              </p>
              <p className="text-[0.95rem] text-foreground-secondary leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </section>

        {/* Features + Ideal For */}
        <section className="py-16 max-sm:py-12">
          <div className="max-w-[1120px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Features */}
              <div>
                <h2 className="font-display text-[1.35rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-6">
                  Key features
                </h2>
                <ul className="space-y-4">
                  {data.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-accent-green flex-shrink-0 mt-0.5" />
                      <span className="text-[0.9rem] text-foreground-secondary leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ideal for */}
              <div>
                <h2 className="font-display text-[1.35rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-6">
                  Ideal for
                </h2>
                <ul className="space-y-4">
                  {data.idealFor.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Users size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-[0.9rem] text-foreground-secondary leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 max-sm:py-10 bg-background-warm border-y border-border-light">
          <div className="max-w-[620px] mx-auto px-7 text-center">
            <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-3">
              Compare {data.title.toLowerCase()} quotes
            </h2>
            <p className="text-[0.9rem] text-foreground-secondary mb-6">
              See rates from 20+ Canadian insurers side by side. No phone calls, no pressure — just transparent quotes in under 2 minutes.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors"
            >
              Compare Quotes Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
