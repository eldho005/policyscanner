import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Terms of Service | PolicyScanner',
  description: 'Terms of Service for using the PolicyScanner life insurance comparison platform.',
}

export default function TermsOfServicePage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds layout__grid-item--centered">
              <header className="legal-header">
                <h1 className="legal-title">Terms of Service</h1>
                <p className="legal-subtitle">Your agreement for using our life insurance brokerage platform</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">Effective Date</div><p className="legal-meta__value">June 28, 2025</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Last Updated</div><p className="legal-meta__value">June 28, 2025</p></div>
              </div>
              <nav className="legal-nav">
                <h2 className="legal-nav__title">Quick Navigation</h2>
                <ul className="legal-nav__list">
                  <li><a href="#agreement" className="legal-nav__link">Agreement &amp; Acceptance</a></li>
                  <li><a href="#about-us" className="legal-nav__link">About Our Service</a></li>
                  <li><a href="#our-role" className="legal-nav__link">Our Role as Broker</a></li>
                  <li><a href="#your-responsibilities" className="legal-nav__link">Your Responsibilities</a></li>
                  <li><a href="#service-limitations" className="legal-nav__link">Service Limitations</a></li>
                  <li><a href="#prohibited-activities" className="legal-nav__link">Prohibited Activities</a></li>
                  <li><a href="#liability" className="legal-nav__link">Limitation of Liability</a></li>
                  <li><a href="#termination" className="legal-nav__link">Termination</a></li>
                  <li><a href="#governing-law" className="legal-nav__link">Governing Law</a></li>
                  <li><a href="#contact" className="legal-nav__link">Contact Information</a></li>
                </ul>
              </nav>
              <div className="legal-warning legal-warning--alert">
                <div className="legal-warning__title">Important: Read Before Using Our Service</div>
                <p className="legal-warning__content">By accessing or using PolicyScanner, you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our platform. PolicyScanner is a brokerage service only - we do not make insurance decisions.</p>
              </div>
              <div className="legal-content">
                <section id="agreement">
                  <h2>Agreement and Acceptance</h2>
                  <p>Welcome to <strong>PolicyScanner Brokerage Incorporated</strong> (&ldquo;PolicyScanner,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). We own and operate the website www.policyscanner.ca (the &ldquo;Site&rdquo;), which provides digital life insurance brokerage, insurance quote comparison, and related advisory services (the &ldquo;Services&rdquo;).</p>
                  <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our Site and Services. <strong>By accessing or using our Services, you agree to be bound by these Terms and by our Privacy Policy.</strong></p>
                  <h3>Changes to Terms</h3>
                  <p>We reserve the right to modify these Terms at any time. We will notify you of changes by updating the &ldquo;Last Updated&rdquo; date above. Your continued use of our Services after changes are posted constitutes acceptance of the modified Terms.</p>
                </section>
                <section id="about-us">
                  <h2>About Our Service</h2>
                  <h3>Who We Are</h3>
                  <p>PolicyScanner Brokerage Incorporated is a licensed life insurance brokerage in Ontario, Canada, regulated by FSRA under license #41964M. All of our advisors are LLQP-certified.</p>
                  <h3>What We Do</h3>
                  <p>We provide digital life insurance brokerage services, including:</p>
                  <ul>
                    <li><strong>Quote comparison</strong> from multiple life insurance companies</li>
                    <li><strong>Application facilitation</strong> by submitting your applications to insurers</li>
                    <li><strong>Advisory services</strong> through our LLQP-certified advisors</li>
                    <li><strong>Educational content</strong> about life insurance products and processes</li>
                  </ul>
                  <h3>Geographic Limitations</h3>
                  <p>Our services are available only to residents of <strong>Ontario, Canada</strong>.</p>
                </section>
                <section id="our-role">
                  <h2>Our Role as Insurance Brokerage</h2>
                  <h3>What We Are NOT</h3>
                  <ul>
                    <li><strong>We are NOT an insurance company</strong> - we do not issue, underwrite, or provide insurance policies</li>
                    <li><strong>We do NOT make underwriting decisions</strong> - all coverage decisions are made solely by insurance companies</li>
                    <li><strong>We do NOT control pricing</strong> - premium rates are set by insurance companies</li>
                    <li><strong>We do NOT guarantee coverage</strong> - approval is subject to each insurer&apos;s underwriting guidelines</li>
                    <li><strong>We are NOT financial advisors</strong> - we facilitate applications, not comprehensive financial planning</li>
                  </ul>
                  <h3>Independence and Compensation</h3>
                  <p>We are compensated through commissions paid by insurance companies when you purchase a policy through our platform. <strong>You do not pay any additional fees.</strong></p>
                </section>
                <section id="your-responsibilities">
                  <h2>Your Responsibilities</h2>
                  <h3>Age and Capacity</h3>
                  <p>You must be at least 18 years old and have the legal capacity to enter into these Terms.</p>
                  <h3>Accurate Information</h3>
                  <p><strong>You are responsible for providing complete and accurate information</strong> about your health history, lifestyle factors, financial information, and any other material circumstances that may affect insurance risk.</p>
                  <p><em>Failure to provide accurate information may result in claim denial or policy cancellation by the insurance company.</em></p>
                  <h3>Financial Decisions</h3>
                  <p><strong>You acknowledge that you are responsible for your own financial and insurance decisions.</strong> While our LLQP-certified advisors can provide guidance, you should consider consulting with independent financial advisors for comprehensive planning.</p>
                </section>
                <section id="service-limitations">
                  <h2>Service Limitations</h2>
                  <p>While we strive for accuracy, we make no warranties regarding the accuracy or completeness of information on our Site, currency of insurance product information, or availability of specific products for your situation.</p>
                  <p><strong>Our Services do not constitute legal, tax, or comprehensive financial advice.</strong></p>
                </section>
                <section id="prohibited-activities">
                  <h2>Prohibited Activities</h2>
                  <p>You agree not to:</p>
                  <ul>
                    <li><strong>Provide false information</strong> in applications or communications</li>
                    <li><strong>Use our Services for illegal purposes</strong> or in violation of applicable laws</li>
                    <li><strong>Attempt to circumvent</strong> our security measures</li>
                    <li><strong>Interfere with</strong> the operation of our Site</li>
                    <li><strong>Scrape or harvest</strong> content from our Site using automated means</li>
                    <li><strong>Impersonate others</strong> or misrepresent your identity</li>
                    <li><strong>Use our Services</strong> to engage in fraudulent activities</li>
                  </ul>
                </section>
                <section id="liability">
                  <h2>Limitation of Liability</h2>
                  <p><strong>Our Services are provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without warranties of any kind.</strong></p>
                  <h3>Limitation of Damages</h3>
                  <p>To the maximum extent permitted by law, PolicyScanner&apos;s total liability shall not exceed the lesser of the commissions received for the specific transaction in question, or one hundred dollars (CAD $100).</p>
                  <h3>Excluded Damages</h3>
                  <p>In no event shall PolicyScanner be liable for indirect, incidental, or consequential damages, loss of profits, business interruption, or punitive damages.</p>
                  <p><strong>PolicyScanner is not responsible for any actions, decisions, or omissions by insurance companies</strong>, including application denials, claim disputes, policy cancellations, or coverage limitations.</p>
                </section>
                <section id="termination">
                  <h2>Termination</h2>
                  <p>We may terminate or suspend your access to our Services immediately, without prior notice, for breach of these Terms, violation of applicable laws, fraudulent behavior, or any reason at our sole discretion.</p>
                </section>
                <section id="governing-law">
                  <h2>Governing Law and Dispute Resolution</h2>
                  <p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada. You and PolicyScanner irrevocably consent to the exclusive jurisdiction of the courts of Ontario, Canada.</p>
                  <h3>Complaint Resolution</h3>
                  <ol>
                    <li>Contact us directly using the information below</li>
                    <li>If not resolved, you may contact FSRA</li>
                    <li>For policy-related issues, contact the OmbudService for Life and Health Insurance (OLHI)</li>
                  </ol>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Contact Information</h2>
                <p>If you have questions about these Terms of Service or our Services, please contact us:</p>
                <div className="layout__grid">
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p className="u-font-medium"><strong>Company:</strong> PolicyScanner Brokerage Incorporated</p>
                    <p><strong>Email:</strong> <a href="mailto:info@policyscanner.ca">info@policyscanner.ca</a></p>
                    <p><strong>Legal Inquiries:</strong> <a href="mailto:legal@policyscanner.ca">legal@policyscanner.ca</a></p>
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
