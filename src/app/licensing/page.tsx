import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BadgeCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "FSRA Licensing & LLQP Disclosure — PolicyScanner.ca",
  description: "PolicyScanner Brokerage Incorporated regulatory compliance, FSRA license #41964M, and LLQP certification details.",
  alternates: { canonical: "/licensing" },
};

const sections = [
  { id: "fsra", label: "FSRA Licensing" },
  { id: "llqp", label: "LLQP Certification" },
  { id: "compliance", label: "Regulatory Compliance" },
  { id: "standards", label: "Professional Standards" },
  { id: "ongoing", label: "Ongoing Requirements" },
  { id: "consumer", label: "Consumer Protection" },
  { id: "verify", label: "License Verification" },
  { id: "contact", label: "Contact Information" },
];

export default function LicensingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[860px] mx-auto px-6 py-14">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary mb-3">Regulatory</p>
          <h1 className="font-display text-[2.4rem] font-semibold tracking-[-0.03em] text-foreground mb-4">
            FSRA &amp; LLQP Licensing Disclosure
          </h1>
          <p className="text-[0.9rem] text-foreground-secondary leading-relaxed max-w-[560px]">
            Our regulatory compliance and professional credentials.
          </p>
          <div className="flex gap-5 mt-8 flex-wrap">
            <div className="bg-background border border-border rounded-lg px-5 py-3 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-foreground-muted mb-0.5">FSRA License</p>
              <p className="font-display text-[1.1rem] font-semibold text-foreground">#41964M</p>
            </div>
            <div className="bg-background border border-border rounded-lg px-5 py-3 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-foreground-muted mb-0.5">Licensed Province</p>
              <p className="font-display text-[1.1rem] font-semibold text-foreground">Ontario, Canada</p>
            </div>
            <div className="bg-background border border-border rounded-lg px-5 py-3 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-foreground-muted mb-0.5">Advisor Certification</p>
              <p className="font-display text-[1.1rem] font-semibold text-foreground">All LLQP-Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance banner */}
      <div className="max-w-[860px] mx-auto px-6 pt-10">
        <div className="flex items-start gap-3 bg-accent-green-bg border border-accent-green/20 rounded-lg p-5 text-[0.88rem] text-foreground-secondary">
          <ShieldCheck size={18} className="text-accent-green flex-shrink-0 mt-0.5" />
          <p><strong className="text-foreground">Regulatory Compliance Guarantee — </strong>PolicyScanner Brokerage Incorporated operates in full compliance with all FSRA regulations and Ontario insurance laws. All our advisors maintain current LLQP certification and meet ongoing professional standards.</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[860px] mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-14">

        {/* Nav */}
        <nav className="hidden lg:block">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-foreground-muted mb-4">Quick Navigation</p>
          <ul className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[0.82rem] text-foreground-secondary hover:text-primary transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <article className="space-y-12 text-[0.9rem] leading-relaxed text-foreground-secondary">

          <section id="fsra">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">FSRA Licensing Information</h2>
            <div className="bg-white border border-border rounded-lg p-5 mb-5 flex items-start gap-4">
              <BadgeCheck size={22} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-[0.88rem] mb-0.5">FSRA · Life Insurance Brokerage License</p>
                <p className="text-[0.84rem]">License Number: <strong className="text-foreground">#41964M</strong></p>
              </div>
            </div>
            <p>PolicyScanner Brokerage Incorporated is licensed by the Financial Services Regulatory Authority of Ontario (FSRA) to operate as a life insurance brokerage in Ontario, Canada.</p>
            <p className="mt-4 font-semibold text-foreground">What FSRA Licensing Means</p>
            <ul className="mt-2 list-disc list-inside space-y-2">
              <li><strong className="text-foreground">Regulatory Oversight:</strong> We are subject to comprehensive regulatory oversight by FSRA</li>
              <li><strong className="text-foreground">Consumer Protection:</strong> FSRA ensures we meet strict standards for consumer protection</li>
              <li><strong className="text-foreground">Professional Standards:</strong> We must demonstrate ongoing suitability and competence</li>
              <li><strong className="text-foreground">Compliance Monitoring:</strong> FSRA conducts regular audits and compliance reviews</li>
              <li><strong className="text-foreground">Financial Responsibility:</strong> We maintain required errors and omissions insurance</li>
            </ul>
            <div className="mt-5 bg-white border border-border rounded-lg p-5 text-[0.85rem]">
              <p className="font-semibold text-foreground mb-2">About FSRA</p>
              <p>The Financial Services Regulatory Authority of Ontario (FSRA) is an independent regulatory agency that oversees the life and health insurance sector in Ontario. FSRA ensures agents and businesses meet qualifications for licensing, monitors ongoing compliance with Ontario&apos;s insurance laws, and protects consumers&apos; interests in the insurance marketplace.</p>
            </div>
          </section>

          <section id="llqp">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">LLQP Certification</h2>
            <p>Every advisor at PolicyScanner holds current LLQP (Life License Qualification Program) certification — the mandatory professional qualification for life insurance sales in Canada.</p>
            <p className="mt-4 font-semibold text-foreground">LLQP Requirements</p>
            <p className="mt-2">To earn LLQP certification, our advisors must:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li><strong className="text-foreground">Complete approved training course:</strong> 100+ hours of comprehensive curriculum covering life insurance, accident &amp; sickness insurance, ethics, and segregated funds</li>
              <li><strong className="text-foreground">Pass provincial examinations:</strong> 4 separate module exams with 60% minimum pass rate</li>
              <li><strong className="text-foreground">Meet character requirements:</strong> Criminal background checks and suitability assessment</li>
              <li><strong className="text-foreground">Maintain continuing education:</strong> 30 CE credits every 2 years</li>
            </ul>
          </section>

          <section id="compliance">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Regulatory Compliance</h2>
            <p>PolicyScanner operates under a comprehensive regulatory compliance framework that includes:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li><strong className="text-foreground">Ontario Insurance Act:</strong> Full compliance with provincial insurance legislation</li>
              <li><strong className="text-foreground">FSRA Regulations:</strong> Adherence to all FSRA rules and guidelines</li>
              <li><strong className="text-foreground">CISRO Standards:</strong> Compliance with Canadian Insurance Services Regulatory Organizations standards</li>
              <li><strong className="text-foreground">Industry Best Practices:</strong> Following established industry best practices for consumer protection</li>
            </ul>
            <p className="mt-5 font-semibold text-foreground">Consumer Rights</p>
            <p className="mt-2">As a FSRA-licensed brokerage, we are required to respect your rights, including:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Right to clear, accurate information about products and services</li>
              <li>Right to access multiple insurance options and competitive quotes</li>
              <li>Right to protection of your personal and financial information</li>
              <li>Right to formal complaint and dispute resolution processes</li>
            </ul>
          </section>

          <section id="standards">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Professional Standards</h2>
            <p className="font-semibold text-foreground">Errors and Omissions Insurance</p>
            <p className="mt-2">As required by FSRA, we maintain comprehensive Errors and Omissions (E&amp;O) insurance coverage:</p>
            <ul className="mt-3 list-disc list-inside space-y-1">
              <li>Minimum coverage: $1 million per occurrence</li>
              <li>Extended coverage: Protection against fraudulent acts</li>
              <li>Consumer protection: Financial protection for clients in case of professional negligence</li>
              <li>Continuous coverage: Maintained throughout our license period</li>
            </ul>
          </section>

          <section id="ongoing">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Ongoing Requirements</h2>
            <p><strong className="text-foreground">License Renewal:</strong> Our FSRA license requires regular renewal every two years, including suitability review, compliance verification, and maintenance of E&amp;O insurance.</p>
            <p className="mt-3"><strong className="text-foreground">Continuing Education:</strong> All PolicyScanner advisors must complete 30 CE credits every 2 years for license renewal, covering technical aspects of life insurance and industry developments.</p>
          </section>

          <section id="consumer">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Consumer Protection</h2>
            <p className="font-semibold text-foreground">Complaint Process</p>
            <p className="mt-2">If you have concerns about our services, you have access to:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li><strong className="text-foreground">Direct resolution:</strong> Contact us directly to resolve any issues</li>
              <li><strong className="text-foreground">FSRA complaint:</strong> File a complaint with our regulator if needed</li>
              <li><strong className="text-foreground">OLHI assistance:</strong> OmbudService for Life and Health Insurance for policy disputes</li>
              <li><strong className="text-foreground">Legal remedies:</strong> Courts and other legal remedies as available</li>
            </ul>
          </section>

          <section id="verify">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">License Verification</h2>
            <p>You can independently verify our licensing status through:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li><strong className="text-foreground">FSRA website:</strong> Search for license #41964M at <a href="https://www.fsrao.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.fsrao.ca</a></li>
              <li><strong className="text-foreground">Direct inquiry:</strong> Contact FSRA directly at (416) 250-7250</li>
            </ul>
          </section>

          <section id="contact">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Contact Information</h2>
            <div className="bg-white border border-border rounded-lg p-6 space-y-2 text-[0.88rem]">
              <p><span className="font-semibold text-foreground">Company:</span> PolicyScanner Brokerage Incorporated</p>
              <p><span className="font-semibold text-foreground">FSRA License:</span> #41964M</p>
              <p><span className="font-semibold text-foreground">Email:</span> <a href="mailto:compliance@policyscanner.ca" className="text-primary hover:underline">compliance@policyscanner.ca</a></p>
              <p><span className="font-semibold text-foreground">Address:</span> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
              <p><span className="font-semibold text-foreground">Phone:</span> (437) 422-8353</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border-light text-foreground-muted text-[0.78rem]">
                <a href="https://www.fsrao.ca" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">FSRA: www.fsrao.ca</a>
                <a href="https://www.olhi.ca" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">OLHI: www.olhi.ca</a>
              </div>
            </div>
            <p className="mt-6 text-[0.78rem] text-foreground-muted">PolicyScanner Brokerage Incorporated (FSRA #41964M) · Licensed Life Insurance Brokerage — Ontario, Canada · All advisors are LLQP-certified professionals · Last Updated: June 28, 2025</p>
          </section>

        </article>
      </div>

      <Footer />
    </div>
  );
}
