import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PolicyScanner.ca",
  description: "How PolicyScanner collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "what-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "sharing", label: "Information Sharing" },
  { id: "sharing-insurers", label: "Sharing with Life Insurers" },
  { id: "your-rights", label: "Your Rights" },
  { id: "security", label: "Data Security" },
  { id: "contact", label: "Contact Information" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[860px] mx-auto px-6 py-14">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary mb-3">Legal</p>
          <h1 className="font-display text-[2.4rem] font-semibold tracking-[-0.03em] text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-[0.9rem] text-foreground-secondary leading-relaxed max-w-[560px]">
            How we collect, use, and protect your personal information.
          </p>
          <div className="flex gap-6 mt-6 text-[0.78rem] text-foreground-muted">
            <span><span className="font-semibold text-foreground-secondary">Effective Date:</span> June 28, 2025</span>
            <span><span className="font-semibold text-foreground-secondary">Last Updated:</span> December 22, 2025</span>
          </div>
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
        <article className="prose-custom space-y-12 text-[0.9rem] leading-relaxed text-foreground-secondary">

          <section id="introduction">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Introduction</h2>
            <p>Welcome to PolicyScanner Brokerage Incorporated (collectively, &ldquo;PolicyScanner&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; and/or &ldquo;our&rdquo;). We own and operate the website <strong className="text-foreground">www.policyscanner.ca</strong> (the &ldquo;Site&rdquo;), which offers online life insurance brokerage, insurance quote comparison, and insurance advisory services.</p>
            <p className="mt-3">We take your privacy seriously. This Privacy Policy describes our personal information processing practices in relation to you and your personal information as well as the types of personal information we may collect from or about you when you visit our Site or interact with our advertisements on social media platforms.</p>
          </section>

          <section id="what-we-collect">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">What Personal Information We Collect</h2>
            <p>We collect and maintain different types of personal information provided through our website or via Facebook and Instagram Lead Ads. This includes:</p>
            <div className="mt-5 space-y-5">
              <div className="bg-white border border-border rounded-lg p-5">
                <h3 className="text-[0.88rem] font-semibold text-foreground mb-2">Contact and Identification Information</h3>
                <ul className="list-disc list-inside space-y-1 text-[0.85rem]">
                  <li>Name, address, postal code, telephone number, and email address</li>
                  <li>Date of birth, citizenship/residency status, marital status and gender</li>
                </ul>
              </div>
              <div className="bg-white border border-border rounded-lg p-5">
                <h3 className="text-[0.88rem] font-semibold text-foreground mb-2">Health and Medical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-[0.85rem]">
                  <li>Height, weight, whether or not you are a smoker</li>
                  <li>Medical history and family medical history</li>
                  <li>Tobacco and alcohol usage history</li>
                </ul>
              </div>
              <div className="bg-white border border-border rounded-lg p-5">
                <h3 className="text-[0.88rem] font-semibold text-foreground mb-2">Employment and Financial Information</h3>
                <ul className="list-disc list-inside space-y-1 text-[0.85rem]">
                  <li>Occupation, years of employment, annual income</li>
                  <li>Financial assets and debt information</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="how-we-use">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">How We Use Your Personal Information</h2>
            <p>We only collect information from you that is necessary to provide you with the life insurance products and services available through our Site. We collect information to:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li>Fulfill your requests for life insurance quotes, assessments, and applications</li>
              <li>Send you a quote confirmation email and relevant follow-up communications regarding your inquiry</li>
              <li>Contact you by phone or email when a licensed advisor is ready to review your results</li>
              <li>Assess your life insurance needs and identify appropriate products</li>
              <li>Ensure compliance with applicable laws and regulatory requirements in Canada</li>
            </ul>
            <div className="mt-5 bg-primary-subtle border border-primary/20 rounded-lg p-4 text-[0.84rem]">
              <p className="font-semibold text-foreground mb-1">Email communications</p>
              <p>By submitting a quote request, you consent to receiving a quote confirmation email and follow-up communications from PolicyScanner. You may opt out at any time by clicking &ldquo;Unsubscribe&rdquo; in any email or by contacting us directly.</p>
            </div>
          </section>

          <section id="sharing">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">How We Share Your Information</h2>
            <p>Your personal information will be shared with life insurance companies and managing general agents to assist you in purchasing suitable life insurance policies.</p>
            <p className="mt-3"><strong className="text-foreground">Meta Platforms (Facebook &amp; Instagram):</strong> For users who provide information via Lead Ads, we use the Meta Marketing API to securely retrieve and process your inquiry. This data is transferred from Meta&apos;s servers to our internal brokerage system for the sole purpose of providing the insurance quote you requested.</p>
            <p className="mt-3">We may also disclose your personal information to:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Life insurance companies for obtaining quotes and processing applications</li>
              <li>Service providers to perform business functions including website hosting and secure data retrieval</li>
              <li>Legal authorities as required by law</li>
            </ul>
            <div className="mt-4 bg-white border border-border rounded-lg p-4 text-[0.84rem]">
              <p><strong className="text-foreground">Important:</strong> We will not share your personal information with any third-party marketers without your specific consent.</p>
            </div>
          </section>

          <section id="sharing-insurers">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Sharing with Life Insurance Companies</h2>
            <p>This is a critical aspect of our business model. When you request life insurance quotes or submit applications through our platform:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li><strong className="text-foreground">Quote Generation:</strong> We share necessary personal information with multiple life insurance companies to generate accurate quotes</li>
              <li><strong className="text-foreground">Application Submission:</strong> If you choose to submit an application, we share your information with the selected insurer</li>
            </ul>
            <div className="mt-4 bg-white border border-border rounded-lg p-4 text-[0.84rem]">
              <p><strong className="text-foreground">Important:</strong> The personal information that you submit to a life insurance company will be governed by that insurer&apos;s privacy policy. We do not send any information to a life insurance company until the application is complete and you authorize us to submit it.</p>
            </div>
          </section>

          <section id="your-rights">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Your Rights and Choices</h2>
            <p>It is important to us that we collect, use or disclose your personal information only when we have your consent to do so. You have the right to:</p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li>Access your personal information that we have about you</li>
              <li>Request corrections to inaccurate or incomplete information</li>
              <li>Withdraw your consent at any time</li>
              <li>Opt out of email communications at any time</li>
              <li><strong className="text-foreground">Data Deletion:</strong> To specifically request the deletion of your data, please contact us at the email below</li>
            </ul>
          </section>

          <section id="security">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Data Security and Protection</h2>
            <p>We use reasonable physical, technical, and administrative security measures to protect personal information from unauthorized access or disclosure. This includes encryption when transmitting data from Meta&apos;s API to our servers.</p>
            <p className="mt-3"><strong className="text-foreground">Data Retention:</strong> We keep your personal information as long as is reasonably necessary to complete our dealings with you, comply with life insurance industry requirements, or as may be required by law.</p>
          </section>

          <section id="contact">
            <h2 className="font-display text-[1.3rem] font-semibold text-foreground tracking-[-0.02em] mb-4">Contact Information</h2>
            <p>If you have questions regarding this Privacy Policy, you may contact our Privacy Officer:</p>
            <div className="mt-4 bg-white border border-border rounded-lg p-6 space-y-2 text-[0.88rem]">
              <p><span className="font-semibold text-foreground">Privacy Officer:</span> Eldho George</p>
              <p><span className="font-semibold text-foreground">Email:</span> <a href="mailto:eldho@policyscanner.ca" className="text-primary hover:underline">eldho@policyscanner.ca</a></p>
              <p><span className="font-semibold text-foreground">Address:</span> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
              <p><span className="font-semibold text-foreground">Phone:</span> (437) 422-8353</p>
            </div>
            <p className="mt-6 text-[0.78rem] text-foreground-muted">PolicyScanner Brokerage Incorporated (FSRA #41964M) · Digital Life Insurance Brokerage · Last Updated: December 22, 2025</p>
          </section>

        </article>
      </div>

      <Footer />
    </div>
  );
}
