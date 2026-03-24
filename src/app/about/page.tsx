import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Users, Scale, BadgeCheck, MapPin, Phone, Mail, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — PolicyScanner.ca",
  description:
    "PolicyScanner.ca is a licensed life insurance brokerage based in Kitchener, Canada. We compare rates from 20+ insurers to help Canadians find affordable coverage.",
  alternates: { canonical: "/about" },
};

const carriers = [
  "Canada Life",
  "Manulife",
  "Sun Life",
  "Industrial Alliance (iA)",
  "Desjardins Insurance",
  "RBC Insurance",
  "BMO Insurance",
  "Equitable Life",
  "Empire Life",
  "Assumption Life",
  "Foresters Financial",
  "Beneva",
  "Canada Protection Plan",
  "Humania",
  "UV Insurance",
];

const values = [
  {
    icon: <Scale size={22} />,
    title: "Unbiased comparison",
    desc: "We aren't tied to any single insurer. Our recommendations are based entirely on what fits your needs and budget.",
  },
  {
    icon: <Shield size={22} />,
    title: "Licensed & regulated",
    desc: "We operate as a licensed life insurance brokerage, registered and regulated under Canadian provincial insurance authorities.",
  },
  {
    icon: <Users size={22} />,
    title: "Built for clarity",
    desc: "Life insurance can be confusing. We simplify the process so you can make confident decisions without the jargon.",
  },
  {
    icon: <BadgeCheck size={22} />,
    title: "Your data, protected",
    desc: "We follow PIPEDA guidelines and never sell your personal information. Your data is used only to generate your quotes.",
  },
];

const stats = [
  { value: "20+", label: "Insurance carriers" },
  { value: "2 min", label: "Average quote time" },
  { value: "$0", label: "Cost to compare" },
  { value: "24h", label: "Response time" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ── Hero with image ── */}
        <section className="bg-background-warm border-b border-border-light">
          <div className="max-w-[1120px] mx-auto px-7 pt-16 pb-14 max-sm:pt-10 max-sm:pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary-subtle text-primary text-[0.7rem] font-semibold px-2.5 py-1 rounded-full mb-5 tracking-[0.02em] uppercase">
                  About us
                </span>
                <h1 className="font-display text-[2.2rem] max-sm:text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.025em] opsz-48 text-foreground mb-4">
                  A licensed brokerage, built to simplify life insurance
                </h1>
                <p className="text-[1.05rem] max-sm:text-[0.95rem] text-foreground-secondary leading-relaxed mb-6">
                  PolicyScanner.ca is a licensed insurance brokerage based in Kitchener, Ontario. We compare rates from 20+ Canadian insurers so you can find the right coverage — without the runaround.
                </p>

                {/* Key credentials */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-green-bg flex items-center justify-center flex-shrink-0">
                      <Award size={16} className="text-accent-green" />
                    </div>
                    <span className="text-[0.88rem] font-medium text-foreground">Licensed life insurance brokerage in Ontario</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-blue-bg flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-accent-blue" />
                    </div>
                    <span className="text-[0.88rem] font-medium text-foreground">Based in Kitchener, Ontario, Canada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <span className="text-[0.88rem] font-medium text-foreground">(437) 422-8353</span>
                  </div>
                </div>
              </div>

              {/* Image placeholder */}
              <div className="gradient-warm-1 rounded-lg h-[340px] max-sm:h-[220px] relative overflow-hidden">
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[0.82rem] font-semibold text-foreground">Kitchener, ON</p>
                        <p className="text-[0.72rem] text-foreground-muted">Licensed Canadian brokerage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats row ── */}
        <section className="border-b border-border-light">
          <div className="max-w-[1120px] mx-auto px-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border-light">
              {stats.map((s) => (
                <div key={s.label} className="py-8 text-center">
                  <div className="font-display text-[1.8rem] font-semibold text-primary tracking-[-0.02em] opsz-32">{s.value}</div>
                  <div className="text-[0.78rem] text-foreground-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we do — with side image ── */}
        <section className="py-18 max-sm:py-12">
          <div className="max-w-[1120px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-12 items-center">
              <div>
                <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-5">
                  What we do
                </h2>
                <div className="text-[0.95rem] text-foreground-secondary leading-[1.75] space-y-4">
                  <p>
                    We connect you with personalized life insurance quotes from Canada&apos;s top-rated carriers — all in one place. You answer a few straightforward questions, and we show you side-by-side rates from multiple insurers so you can compare coverage, cost, and terms without pressure.
                  </p>
                  <p>
                    As a brokerage, we represent <strong className="text-foreground font-semibold">you</strong> — not the insurance companies. Our role is to find you the best combination of coverage and price, regardless of which insurer offers it.
                  </p>
                  <p>
                    We built PolicyScanner because buying life insurance in Canada shouldn&apos;t require weeks of phone calls, confusing paperwork, and high-pressure sales tactics. Our platform gives you the transparency and control to make the right decision for your family.
                  </p>
                </div>
              </div>

              {/* Image placeholder */}
              <div className="gradient-warm-2 rounded-lg h-[300px] max-sm:h-[200px]" />
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-18 max-sm:py-12 bg-background-warm border-y border-border-light">
          <div className="max-w-[1120px] mx-auto px-7">
            <div className="text-center mb-10">
              <h2 className="font-display text-[1.7rem] font-semibold tracking-[-0.02em] opsz-32 text-foreground mb-2">
                What we stand for
              </h2>
              <p className="text-[0.9rem] text-foreground-secondary">
                The principles behind every recommendation we make.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => (
                <div key={v.title} className="bg-white border border-border rounded-lg p-6">
                  <div className="w-11 h-11 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                    {v.icon}
                  </div>
                  <h3 className="text-[0.95rem] font-semibold text-foreground mb-1.5">{v.title}</h3>
                  <p className="text-[0.85rem] text-foreground-secondary leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Carriers ── */}
        <section className="py-18 max-sm:py-12">
          <div className="max-w-[1120px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
              <div>
                <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-3">
                  Insurance companies we compare
                </h2>
                <p className="text-[0.9rem] text-foreground-secondary leading-relaxed mb-5">
                  We work with {carriers.length}+ licensed insurers across Canada. Here are some of the carriers whose rates we compare on your behalf.
                </p>
                <p className="text-[0.85rem] text-foreground-muted leading-relaxed">
                  Because we&apos;re an independent brokerage, we have no obligation to favour any particular carrier — your best rate is our only priority.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {carriers.map((c) => (
                  <span
                    key={c}
                    className="bg-white border border-border rounded-full px-4 py-2.5 text-[0.84rem] font-medium text-foreground-secondary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact strip ── */}
        <section className="bg-dark text-white">
          <div className="max-w-[1120px] mx-auto px-7 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <MapPin size={18} />
                </div>
                <p className="text-[0.92rem] font-semibold">Kitchener, Ontario</p>
                <p className="text-[0.8rem] text-white/60">Canada</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <Phone size={18} />
                </div>
                <p className="text-[0.92rem] font-semibold">(437) 422-8353</p>
                <p className="text-[0.8rem] text-white/60">Mon–Fri, 9 AM – 6 PM ET</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <Mail size={18} />
                </div>
                <p className="text-[0.92rem] font-semibold">support@policyscanner.ca</p>
                <p className="text-[0.8rem] text-white/60">We respond within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Disclaimers ── */}
        <section className="py-12 max-sm:py-10 bg-background-warm border-t border-border-light">
          <div className="max-w-[900px] mx-auto px-7">
            <h2 className="text-[0.85rem] font-semibold text-foreground mb-3">Regulatory disclosures</h2>
            <div className="text-[0.8rem] text-foreground-muted leading-[1.7] space-y-3">
              <p>
                PolicyScanner.ca operates as a licensed life insurance brokerage in Canada, based in Kitchener, Ontario. We are authorized to compare and distribute life insurance products on behalf of multiple insurers. Our brokerage is registered with the applicable provincial regulatory authorities including the Financial Services Regulatory Authority of Ontario (FSRA).
              </p>
              <p>
                We do not provide financial, tax, or legal advice. The information on this website is for general informational purposes only and should not be considered a substitute for professional advice. Insurance products are underwritten by the respective insurance companies — PolicyScanner.ca is not an insurer.
              </p>
              <p>
                Rates displayed are estimates based on the information you provide and are subject to change based on the underwriting process of each individual carrier. Final premiums are determined by the issuing insurer after a complete application review.
              </p>
              <p>
                PolicyScanner.ca may receive commission from insurance companies when a policy is issued through our platform. This compensation does not influence our recommendations or the rates you are quoted — all carriers pay industry-standard commissions, and your premium is the same whether you purchase directly or through a broker.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-14 max-sm:py-10">
          <div className="max-w-[760px] mx-auto px-7 text-center">
            <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-3">
              Ready to compare your options?
            </h2>
            <p className="text-[0.9rem] text-foreground-secondary mb-6">
              Get personalized quotes from 20+ Canadian insurers in under 2 minutes.
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
