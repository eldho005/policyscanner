import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'FSRA & LLQP Licensing Disclosure | PolicyScanner',
  description: 'PolicyScanner regulatory compliance and professional credentials disclosure.',
}

export default function AdvisorDisclosurePage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds layout__grid-item--centered">
              <header className="legal-header">
                <h1 className="legal-title">FSRA &amp; LLQP Licensing Disclosure</h1>
                <p className="legal-subtitle">Our regulatory compliance and professional credentials</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">FSRA License</div><p className="legal-meta__value">#41964M</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Licensed Province</div><p className="legal-meta__value">Ontario, Canada</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Advisor Certification</div><p className="legal-meta__value">All LLQP-Certified</p></div>
              </div>
              <nav className="legal-nav">
                <h2 className="legal-nav__title">Quick Navigation</h2>
                <ul className="legal-nav__list">
                  <li><a href="#fsra-licensing" className="legal-nav__link">FSRA Licensing</a></li>
                  <li><a href="#llqp-certification" className="legal-nav__link">LLQP Certification</a></li>
                  <li><a href="#regulatory-compliance" className="legal-nav__link">Regulatory Compliance</a></li>
                  <li><a href="#professional-standards" className="legal-nav__link">Professional Standards</a></li>
                  <li><a href="#ongoing-requirements" className="legal-nav__link">Ongoing Requirements</a></li>
                  <li><a href="#consumer-protection" className="legal-nav__link">Consumer Protection</a></li>
                  <li><a href="#verification" className="legal-nav__link">License Verification</a></li>
                  <li><a href="#contact" className="legal-nav__link">Contact Information</a></li>
                </ul>
              </nav>
              <div className="legal-warning">
                <div className="legal-warning__title">&#10003; Regulatory Compliance Guarantee</div>
                <p className="legal-warning__content">PolicyScanner Brokerage Incorporated operates in full compliance with all FSRA regulations and Ontario insurance laws. All our advisors maintain current LLQP certification and meet ongoing professional standards.</p>
              </div>
              <div className="legal-content">
                <section id="fsra-licensing">
                  <h2>FSRA Licensing Information</h2>
                  <h3>Our FSRA License</h3>
                  <p><strong>PolicyScanner Brokerage Incorporated</strong> is licensed by the Financial Services Regulatory Authority of Ontario (FSRA) to operate as a life insurance brokerage in Ontario, Canada.</p>
                  <div className="legal-card">
                    <div className="legal-card__header">
                      <div className="legal-card__icon">FSRA</div>
                      <div><h4 className="legal-card__title">Life Insurance Brokerage License</h4><p className="legal-card__subtitle">License Number: #41964M</p></div>
                    </div>
                    <p className="legal-card__content">This license authorizes us to provide life insurance brokerage services, including quote comparison, application facilitation, and advisory services to residents of Ontario, Canada.</p>
                  </div>
                  <h3>What FSRA Licensing Means</h3>
                  <ul>
                    <li><strong>Regulatory Oversight:</strong> We are subject to comprehensive regulatory oversight by FSRA</li>
                    <li><strong>Consumer Protection:</strong> FSRA ensures we meet strict standards for consumer protection</li>
                    <li><strong>Professional Standards:</strong> We must demonstrate ongoing suitability and competence</li>
                    <li><strong>Compliance Monitoring:</strong> FSRA conducts regular audits and compliance reviews</li>
                    <li><strong>Financial Responsibility:</strong> We maintain required errors and omissions insurance</li>
                  </ul>
                  <h3>About FSRA</h3>
                  <p>The Financial Services Regulatory Authority of Ontario (FSRA) is an independent regulatory agency that oversees the life and health insurance sector in Ontario. FSRA&apos;s role is to:</p>
                  <ul>
                    <li>Ensure agents and businesses meet qualifications for licensing</li>
                    <li>Monitor ongoing compliance with Ontario&apos;s insurance laws</li>
                    <li>Protect consumers&apos; interests in the insurance marketplace</li>
                    <li>Promote high standards of business conduct and transparency</li>
                  </ul>
                </section>
                <section id="llqp-certification">
                  <h2>LLQP Certification</h2>
                  <h3>All Advisors are LLQP-Certified</h3>
                  <p><strong>Every advisor at PolicyScanner holds current LLQP (Life License Qualification Program) certification.</strong> This is the mandatory professional qualification for life insurance sales in Canada.</p>
                  <div className="legal-card">
                    <div className="legal-card__header">
                      <div className="legal-card__icon">LLQP</div>
                      <div><h4 className="legal-card__title">Life License Qualification Program</h4><p className="legal-card__subtitle">National Professional Standard</p></div>
                    </div>
                    <p className="legal-card__content">LLQP certification demonstrates comprehensive knowledge of life insurance, accident &amp; sickness insurance, ethics, and professional practice standards required to provide competent advice to clients.</p>
                  </div>
                  <h3>LLQP Requirements</h3>
                  <p>To earn LLQP certification, our advisors must:</p>
                  <ol>
                    <li><strong>Complete approved training course:</strong> 100+ hours of comprehensive curriculum covering:<ul><li>Life Insurance principles and products</li><li>Accident &amp; Sickness Insurance</li><li>Ethics and Professional Practice</li><li>Segregated Funds and Annuities</li></ul></li>
                    <li><strong>Pass provincial examinations:</strong> 4 separate module exams with 60% minimum pass rate</li>
                    <li><strong>Meet character requirements:</strong> Criminal background checks and suitability assessment</li>
                    <li><strong>Maintain continuing education:</strong> 30 CE credits every 2 years</li>
                  </ol>
                </section>
                <section id="regulatory-compliance">
                  <h2>Regulatory Compliance</h2>
                  <h3>Compliance Framework</h3>
                  <p>PolicyScanner operates under a comprehensive regulatory compliance framework that includes:</p>
                  <ul>
                    <li><strong>Ontario Insurance Act:</strong> Full compliance with provincial insurance legislation</li>
                    <li><strong>FSRA Regulations:</strong> Adherence to all FSRA rules and guidelines</li>
                    <li><strong>CISRO Standards:</strong> Compliance with Canadian Insurance Services Regulatory Organizations standards</li>
                    <li><strong>Industry Best Practices:</strong> Following established industry best practices for consumer protection</li>
                  </ul>
                  <h3>Consumer Rights</h3>
                  <p>As a FSRA-licensed brokerage, we are required to respect your rights, including:</p>
                  <ul>
                    <li><strong>Right to information:</strong> Clear, accurate information about products and services</li>
                    <li><strong>Right to choice:</strong> Access to multiple insurance options and competitive quotes</li>
                    <li><strong>Right to privacy:</strong> Protection of your personal and financial information</li>
                    <li><strong>Right to complaint:</strong> Access to formal complaint and dispute resolution processes</li>
                  </ul>
                </section>
                <section id="professional-standards">
                  <h2>Professional Standards</h2>
                  <h3>Errors and Omissions Insurance</h3>
                  <p>As required by FSRA, we maintain comprehensive Errors and Omissions (E&amp;O) insurance coverage:</p>
                  <ul>
                    <li><strong>Minimum coverage:</strong> $1 million per occurrence</li>
                    <li><strong>Extended coverage:</strong> Protection against fraudulent acts</li>
                    <li><strong>Consumer protection:</strong> Financial protection for clients in case of professional negligence</li>
                    <li><strong>Continuous coverage:</strong> Maintained throughout our license period</li>
                  </ul>
                </section>
                <section id="ongoing-requirements">
                  <h2>Ongoing Requirements</h2>
                  <h3>License Renewal</h3>
                  <p>Our FSRA license requires regular renewal every two years, including suitability review, compliance verification, and maintenance of E&amp;O insurance.</p>
                  <h3>Continuing Education</h3>
                  <p>All PolicyScanner advisors must complete 30 CE credits every 2 years for license renewal, covering technical aspects of life insurance and industry developments.</p>
                </section>
                <section id="consumer-protection">
                  <h2>Consumer Protection</h2>
                  <h3>Complaint Process</h3>
                  <p>If you have concerns about our services, you have access to:</p>
                  <ol>
                    <li><strong>Direct resolution:</strong> Contact us directly to resolve any issues</li>
                    <li><strong>FSRA complaint:</strong> File a complaint with our regulator if needed</li>
                    <li><strong>OLHI assistance:</strong> OmbudService for Life and Health Insurance for policy disputes</li>
                    <li><strong>Legal remedies:</strong> Courts and other legal remedies as available</li>
                  </ol>
                </section>
                <section id="verification">
                  <h2>License Verification</h2>
                  <h3>Verify Our License</h3>
                  <p>You can independently verify our licensing status through:</p>
                  <ul>
                    <li><strong>FSRA website:</strong> Search for license #41964M at <a href="https://www.fsrao.ca" target="_blank" rel="noopener">www.fsrao.ca</a></li>
                    <li><strong>Direct inquiry:</strong> Contact FSRA directly at (416) 250-7250</li>
                  </ul>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Regulatory Contact Information</h2>
                <p>For questions about our licensing or regulatory compliance:</p>
                <div className="layout__grid">
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p className="u-font-medium"><strong>PolicyScanner Brokerage Incorporated</strong></p>
                    <p><strong>FSRA License:</strong> #41964M</p>
                    <p><strong>Email:</strong> <a href="mailto:compliance@policyscanner.ca">compliance@policyscanner.ca</a></p>
                  </div>
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p><strong>Address:</strong> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
                    <p><strong>Phone:</strong> <a href="tel:4374228353">(437) 422-8353</a></p>
                  </div>
                </div>
              </div>
              <div className="legal-footer-section">
                <div className="legal-footer-section__company">
                  <strong>PolicyScanner Brokerage Incorporated (FSRA #41964M)</strong><br />
                  Licensed Life Insurance Brokerage - Ontario, Canada<br />
                  All advisors are LLQP-certified professionals
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
