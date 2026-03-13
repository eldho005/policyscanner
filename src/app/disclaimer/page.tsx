import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Important Disclaimers | PolicyScanner',
  description: 'Important disclaimers about PolicyScanner services and limitations.',
}

export default function DisclaimerPage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds layout__grid-item--centered">
              <header className="legal-header">
                <h1 className="legal-title">Important Disclaimers</h1>
                <p className="legal-subtitle">Please read these important disclosures about our services and limitations</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">Effective Date</div><p className="legal-meta__value">June 28, 2025</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Last Updated</div><p className="legal-meta__value">June 28, 2025</p></div>
              </div>
              <nav className="legal-nav">
                <h2 className="legal-nav__title">Quick Navigation</h2>
                <ul className="legal-nav__list">
                  <li><a href="#brokerage-role" className="legal-nav__link">Our Role as Broker</a></li>
                  <li><a href="#quotes-pricing" className="legal-nav__link">Quotes &amp; Pricing</a></li>
                  <li><a href="#underwriting" className="legal-nav__link">Underwriting Decisions</a></li>
                  <li><a href="#information-accuracy" className="legal-nav__link">Information Accuracy</a></li>
                  <li><a href="#service-limitations" className="legal-nav__link">Service Limitations</a></li>
                  <li><a href="#third-parties" className="legal-nav__link">Third-Party Services</a></li>
                  <li><a href="#liability" className="legal-nav__link">Liability Limitations</a></li>
                  <li><a href="#contact" className="legal-nav__link">Contact Information</a></li>
                </ul>
              </nav>
              <div className="legal-warning legal-warning--alert">
                <div className="legal-warning__title">&#9888;&#65039; Important Notice</div>
                <p className="legal-warning__content">PolicyScanner Brokerage Incorporated is an insurance brokerage, NOT an insurance company. We do not underwrite, issue, or control insurance policies. All insurance contracts are between you and the insurance companies we represent.</p>
              </div>
              <div className="legal-content">
                <section id="brokerage-role">
                  <h2>Our Role as an Insurance Brokerage</h2>
                  <h3>What We Are</h3>
                  <p><strong>PolicyScanner Brokerage Incorporated</strong> is a licensed life insurance brokerage in Ontario, regulated by FSRA (License #41964M).</p>
                  <h3>What We Do</h3>
                  <ul>
                    <li><strong>Act as an intermediary</strong> between you and life insurance companies</li>
                    <li><strong>Provide quotes</strong> from multiple insurance companies for comparison</li>
                    <li><strong>Facilitate applications</strong> by submitting them to appropriate insurers</li>
                    <li><strong>Offer guidance</strong> through our LLQP-certified advisors</li>
                  </ul>
                  <h3>What We Are NOT</h3>
                  <ul>
                    <li><strong>We are NOT an insurance company</strong> - we do not issue policies</li>
                    <li><strong>We do NOT underwrite policies</strong> - insurance companies make all underwriting decisions</li>
                    <li><strong>We do NOT guarantee coverage</strong> - approval is subject to insurer&apos;s underwriting</li>
                    <li><strong>We are NOT responsible for claims</strong> - claims are handled by the insurance company</li>
                  </ul>
                </section>
                <section id="quotes-pricing">
                  <h2>Quotes and Pricing Disclaimers</h2>
                  <h3>Quote Validity and Accuracy</h3>
                  <p>All quotes displayed on our platform are:</p>
                  <ul>
                    <li><strong>Preliminary estimates only</strong> based on the information you provide</li>
                    <li><strong>Subject to underwriting</strong> by the insurance companies</li>
                    <li><strong>Subject to change</strong> based on additional information collected during underwriting</li>
                    <li><strong>Not binding contracts</strong> or guarantees of coverage</li>
                  </ul>
                  <h3>Final Pricing</h3>
                  <p><em>Your premium is not final until you sign and pay for the actual insurance policy.</em> Factors that may affect your final premium include medical exam results, additional health information, changes in underwriting guidelines, and verification of information provided.</p>
                  <h3>Quote Discrepancies</h3>
                  <p>In the event of any discrepancies between quotes displayed on our website and those established by insurance companies, <strong>the insurance companies&apos; quotes shall govern</strong>.</p>
                </section>
                <section id="underwriting">
                  <h2>Underwriting Decisions</h2>
                  <h3>No Control Over Insurance Company Decisions</h3>
                  <p><strong>PolicyScanner has no control over, and is not responsible for, underwriting decisions made by insurance companies.</strong> These decisions include application approval or denial, premium pricing, coverage amounts, medical exam requirements, and policy modifications or exclusions.</p>
                  <h3>Application Results</h3>
                  <p>Insurance companies may approve your application, approve with modifications, request additional information, or decline your application based on their underwriting guidelines.</p>
                </section>
                <section id="information-accuracy">
                  <h2>Information Accuracy</h2>
                  <h3>Your Responsibility for Accurate Information</h3>
                  <p><strong>You are obligated to provide full and accurate information</strong> about material circumstances that may affect your insurance risk, including medical history, tobacco and substance use, financial information, criminal history, and other insurance coverage.</p>
                  <p><em>Failure to disclose material information may result in claim denial or policy cancellation by the insurance company.</em></p>
                </section>
                <section id="service-limitations">
                  <h2>Service Limitations</h2>
                  <h3>Geographic Limitations</h3>
                  <p>PolicyScanner can only arrange life insurance products for residents of <strong>Ontario, Canada</strong>. We are not licensed to serve residents of other provinces or countries.</p>
                  <h3>Professional Advice</h3>
                  <p><strong>Our services do not constitute legal, tax, or financial advice.</strong> You should consult with qualified professionals for advice specific to your situation.</p>
                </section>
                <section id="third-parties">
                  <h2>Third-Party Services and Insurance Companies</h2>
                  <p>All insurance policies are contracts between you and the insurance company, not PolicyScanner. The insurance company is responsible for policy administration, claims handling, and the terms that govern your coverage.</p>
                </section>
                <section id="liability">
                  <h2>Limitation of Liability</h2>
                  <h3>Disclaimer of Warranties</h3>
                  <p>Our services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied.</p>
                  <h3>Excluded Damages</h3>
                  <p>In no event shall PolicyScanner be liable for indirect, incidental, or consequential damages, loss of profits, business interruption, or punitive damages.</p>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Contact Information</h2>
                <p>If you have questions about these disclaimers or our services, please contact us:</p>
                <div className="layout__grid">
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p className="u-font-medium"><strong>Company:</strong> PolicyScanner Brokerage Incorporated</p>
                    <p><strong>Email:</strong> <a href="mailto:info@policyscanner.ca">info@policyscanner.ca</a></p>
                  </div>
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p><strong>Address:</strong> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
                    <p><strong>Phone:</strong> <a href="tel:4374228353">(437) 422-8353</a></p>
                    <p><strong>FSRA License:</strong> #41964M</p>
                  </div>
                </div>
                <p className="text-small text-secondary u-text-center">
                  <strong>FSRA:</strong> <a href="https://www.fsrao.ca" target="_blank" rel="noopener">www.fsrao.ca</a> | <strong>OLHI:</strong> <a href="https://www.olhi.ca" target="_blank" rel="noopener">www.olhi.ca</a>
                </p>
              </div>
              <div className="legal-footer-section">
                <div className="legal-footer-section__company">
                  <strong>PolicyScanner Brokerage Incorporated (FSRA #41964M)</strong><br />
                  Digital Life Insurance Brokerage<br />
                  All advisors are LLQP-certified
                </div>
                <p className="legal-footer-section__updated">Last Updated: June 28, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
