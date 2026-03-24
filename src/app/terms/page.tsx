import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — PolicyScanner.ca",
  description: "Your agreement for using the PolicyScanner life insurance brokerage platform.",
  alternates: { canonical: "/terms" },
};

const sections = [
  { id: "agreement", label: "Agreement & Acceptance" },
  { id: "about", label: "About Our Service" },
  { id: "role", label: "Our Role as Broker" },
  { id: "responsibilities", label: "Your Responsibilities" },
  { id: "limitations", label: "Service Limitations" },
  { id: "prohibited", label: "Prohibited Activities" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "governing", label: "Governing Law" },
  { id: "contact", label: "Contact Information" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[860px] mx-auto px-6 py-14">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary mb-3">Legal</p>
          <h1 className="font-display text-[2.4rem] font-semibold tracking-[-0.03em] text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-[0.9rem] text-foreground-secondary leading-relaxed max-w-[560px]">
            Your agreement for using our life insurance brokerage platform.
          </p>
          <div className="flex gap-6 mt-6 text-[0.78rem] text-foreground-muted">
            <span><span className="font-semibold text-foreground-secondary">Effective Date:</span> June 28, 2025</span>
            <span><span className="font-semibold text-foreground-secondary">Last Updated:</span> June 28, 2025</span>
          </div>
        </div>
      </div>

      {/* Important callout */}
      <div className="max-w-[860px] mx-auto px-6 pt-10">
        <div className="bg-white border border-border rounded-lg p-5 text-[0.88rem] leading-relaxed text-foreground-secondary">
          <p className="font-semibold text-foreground mb-1">Important: Read Before Using Our Service</p>
          <p>By accessing or using PolicyScanner, you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our platform. PolicyScanner is a brokerage service only — we do not make insurance decisions.</p>
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

          <section id="agreement">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Agreement and Acceptance</h2>
            <p>Welcome to PolicyScanner Brokerage Incorporated (&ldquo;PolicyScanner,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). We own and operate the website <strong className="text-foreground">www.policyscanner.ca</strong> (the &ldquo;Site&rdquo;), which provides digital life insurance brokerage, insurance quote comparison, and related advisory services (the &ldquo;Services&rdquo;).</p>
            <p className="mt-3">These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our Site and Services. By accessing or using our Services, you agree to be bound by these Terms and by our Privacy Policy.</p>
            <div className="mt-4 bg-white border border-border rounded-lg p-4 text-[0.84rem]">
              <p><strong className="text-foreground">Changes to Terms:</strong> We reserve the right to modify these Terms at any time. We will notify you of changes by updating the &ldquo;Last Updated&rdquo; date above. Your continued use of our Services after changes are posted constitutes acceptance of the modified Terms.</p>
            </div>
          </section>

          <section id="about">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">About Our Service</h2>
            <p><strong className="text-foreground">Who We Are:</strong> PolicyScanner Brokerage Incorporated is a licensed life insurance brokerage in Ontario, Canada, regulated by FSRA under license #41964M. All of our advisors are LLQP-certified.</p>
            <p className="mt-3"><strong className="text-foreground">What We Do:</strong> We provide digital life insurance brokerage services, including quote comparison from multiple life insurance companies, application facilitation, advisory services through our LLQP-certified advisors, and educational content about life insurance products.</p>
            <p className="mt-3"><strong className="text-foreground">Geographic Limitations:</strong> Our services are available only to residents of Ontario, Canada.</p>
            <p className="mt-3"><strong className="text-foreground">Email Communications:</strong> By submitting a quote request, you consent to receiving a quote confirmation email, advisor follow-up communications, and relevant policy information. You may opt out at any time.</p>
          </section>

          <section id="role">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Our Role as Insurance Brokerage</h2>
            <div className="bg-white border border-border rounded-lg p-5 space-y-2 text-[0.85rem]">
              <p className="font-semibold text-foreground mb-3">What We Are NOT</p>
              <ul className="list-disc list-inside space-y-2">
                <li>We are <strong className="text-foreground">NOT</strong> an insurance company — we do not issue, underwrite, or provide insurance policies</li>
                <li>We do <strong className="text-foreground">NOT</strong> make underwriting decisions — all coverage decisions are made solely by insurance companies</li>
                <li>We do <strong className="text-foreground">NOT</strong> control pricing — premium rates are set by insurance companies</li>
                <li>We do <strong className="text-foreground">NOT</strong> guarantee coverage — approval is subject to each insurer&apos;s underwriting guidelines</li>
                <li>We are <strong className="text-foreground">NOT</strong> financial advisors — we facilitate applications, not comprehensive financial planning</li>
              </ul>
            </div>
            <p className="mt-4"><strong className="text-foreground">Independence and Compensation:</strong> We are compensated through commissions paid by insurance companies when you purchase a policy through our platform. You do not pay any additional fees.</p>
          </section>

          <section id="responsibilities">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Your Responsibilities</h2>
            <p><strong className="text-foreground">Age and Capacity:</strong> You must be at least 18 years old and have the legal capacity to enter into these Terms.</p>
            <p className="mt-3"><strong className="text-foreground">Accurate Information:</strong> You are responsible for providing complete and accurate information about your health history, lifestyle factors, financial information, and any other material circumstances that may affect insurance risk.</p>
            <div className="mt-3 bg-white border border-border rounded-lg p-4 text-[0.84rem]">
              <p>Failure to provide accurate information may result in claim denial or policy cancellation by the insurance company.</p>
            </div>
            <p className="mt-4"><strong className="text-foreground">Financial Decisions:</strong> You acknowledge that you are responsible for your own financial and insurance decisions. While our LLQP-certified advisors can provide guidance, you should consider consulting with independent financial advisors for comprehensive planning.</p>
          </section>

          <section id="limitations">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Service Limitations</h2>
            <p>While we strive for accuracy, we make no warranties regarding the accuracy or completeness of information on our Site, currency of insurance product information, or availability of specific products for your situation.</p>
            <p className="mt-3">Our Services do not constitute legal, tax, or comprehensive financial advice.</p>
          </section>

          <section id="prohibited">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li>Provide false information in applications or communications</li>
              <li>Use our Services for illegal purposes or in violation of applicable laws</li>
              <li>Attempt to circumvent our security measures</li>
              <li>Interfere with the operation of our Site</li>
              <li>Scrape or harvest content from our Site using automated means</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Use our Services to engage in fraudulent activities</li>
            </ul>
          </section>

          <section id="liability">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Limitation of Liability</h2>
            <p>Our Services are provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without warranties of any kind.</p>
            <p className="mt-3"><strong className="text-foreground">Limitation of Damages:</strong> To the maximum extent permitted by law, PolicyScanner&apos;s total liability shall not exceed the lesser of the commissions received for the specific transaction in question, or one hundred dollars (CAD $100).</p>
            <p className="mt-3"><strong className="text-foreground">Excluded Damages:</strong> In no event shall PolicyScanner be liable for indirect, incidental, or consequential damages, loss of profits, business interruption, or punitive damages.</p>
            <p className="mt-3">PolicyScanner is not responsible for any actions, decisions, or omissions by insurance companies, including application denials, claim disputes, policy cancellations, or coverage limitations.</p>
          </section>

          <section id="termination">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Termination</h2>
            <p>We may terminate or suspend your access to our Services immediately, without prior notice, for breach of these Terms, violation of applicable laws, fraudulent behavior, or any reason at our sole discretion.</p>
          </section>

          <section id="governing">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Governing Law and Dispute Resolution</h2>
            <p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada. You and PolicyScanner irrevocably consent to the exclusive jurisdiction of the courts of Ontario, Canada.</p>
            <p className="mt-3"><strong className="text-foreground">Complaint Resolution:</strong></p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Contact us directly using the information below</li>
              <li>If not resolved, you may contact FSRA</li>
              <li>For policy-related issues, contact the OmbudService for Life and Health Insurance (OLHI)</li>
            </ul>
          </section>

          <section id="contact">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Contact Information</h2>
            <div className="bg-white border border-border rounded-lg p-6 space-y-2 text-[0.88rem]">
              <p><span className="font-semibold text-foreground">Company:</span> PolicyScanner Brokerage Incorporated</p>
              <p><span className="font-semibold text-foreground">Email:</span> <a href="mailto:info@policyscanner.ca" className="text-primary hover:underline">info@policyscanner.ca</a></p>
              <p><span className="font-semibold text-foreground">Legal Inquiries:</span> <a href="mailto:legal@policyscanner.ca" className="text-primary hover:underline">legal@policyscanner.ca</a></p>
              <p><span className="font-semibold text-foreground">Address:</span> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
              <p><span className="font-semibold text-foreground">Phone:</span> (437) 422-8353</p>
              <p><span className="font-semibold text-foreground">FSRA License:</span> #41964M</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border-light text-foreground-muted text-[0.78rem]">
                <a href="https://www.fsrao.ca" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">FSRA: www.fsrao.ca</a>
                <a href="https://www.olhi.ca" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">OLHI: www.olhi.ca</a>
              </div>
            </div>
            <p className="mt-6 text-[0.78rem] text-foreground-muted">PolicyScanner Brokerage Incorporated (FSRA #41964M) · Digital Life Insurance Brokerage · All advisors are LLQP-certified · Last Updated: June 28, 2025</p>
          </section>

        </article>
      </div>

      <Footer />
    </div>
  );
}
