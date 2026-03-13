import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Licensing & Trust | PolicyScanner',
  description: 'PolicyScanner licensing, trust measures, and security standards for Canadian life insurance.',
}

export default function LicensingTrustPage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds layout__grid-item--centered">
              <header className="legal-header">
                <h1 className="legal-title">Licensing &amp; Trust</h1>
                <p className="legal-subtitle">Your security and protection are our top priorities</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">FSRA Licensed</div><p className="legal-meta__value">#41964M</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Security Grade</div><p className="legal-meta__value">A+ Rated</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Industry Standing</div><p className="legal-meta__value">Excellent</p></div>
              </div>
              <nav className="legal-nav">
                <h2 className="legal-nav__title">Trust &amp; Security Overview</h2>
                <ul className="legal-nav__list">
                  <li><a href="#regulatory-licensing" className="legal-nav__link">Regulatory Licensing</a></li>
                  <li><a href="#professional-credentials" className="legal-nav__link">Professional Credentials</a></li>
                  <li><a href="#data-security" className="legal-nav__link">Data Security</a></li>
                  <li><a href="#consumer-protection" className="legal-nav__link">Consumer Protection</a></li>
                  <li><a href="#industry-affiliations" className="legal-nav__link">Industry Affiliations</a></li>
                  <li><a href="#transparency" className="legal-nav__link">Transparency &amp; Ethics</a></li>
                  <li><a href="#financial-strength" className="legal-nav__link">Financial Strength</a></li>
                  <li><a href="#verification" className="legal-nav__link">Verify Our Credentials</a></li>
                </ul>
              </nav>
              <div className="legal-warning">
                <div className="legal-warning__title">&#128737;&#65039; Trust Guarantee</div>
                <p className="legal-warning__content">PolicyScanner operates under the highest standards of regulatory compliance, data security, and professional ethics. Every interaction with us is protected by multiple layers of consumer protection and industry oversight.</p>
              </div>
              <div className="legal-content">
                <section id="regulatory-licensing">
                  <h2>Regulatory Licensing &amp; Oversight</h2>
                  <h3>FSRA Licensed Life Insurance Brokerage</h3>
                  <p><strong>PolicyScanner Brokerage Incorporated</strong> is fully licensed by FSRA to operate as a life insurance brokerage in Ontario, Canada.</p>
                  <div className="legal-card">
                    <div className="legal-card__header">
                      <div className="legal-card__icon">&#10003;</div>
                      <div><h4 className="legal-card__title">FSRA License #41964M</h4><p className="legal-card__subtitle">Licensed Life Insurance Brokerage</p></div>
                    </div>
                    <p className="legal-card__content">Our license authorizes us to provide life insurance brokerage services throughout Ontario, including quote comparison, application facilitation, and ongoing policy support.</p>
                  </div>
                  <h3>What FSRA Licensing Means for You</h3>
                  <ul>
                    <li><strong>Rigorous Oversight:</strong> FSRA continuously monitors our business practices and compliance</li>
                    <li><strong>Consumer Protection:</strong> Multiple layers of protection for your personal and financial information</li>
                    <li><strong>Professional Standards:</strong> All staff must meet ongoing education and ethical requirements</li>
                    <li><strong>Financial Responsibility:</strong> Required professional liability insurance coverage</li>
                    <li><strong>Complaint Resolution:</strong> Access to formal regulatory complaint processes</li>
                  </ul>
                </section>
                <section id="professional-credentials">
                  <h2>Professional Credentials &amp; Certification</h2>
                  <h3>LLQP-Certified Advisors</h3>
                  <p><strong>Every advisor at PolicyScanner holds current LLQP (Life License Qualification Program) certification.</strong></p>
                  <div className="legal-types-container">
                    <div className="legal-type-item">
                      <h4 className="legal-type-item__name">Life License Qualification Program (LLQP)</h4>
                      <p className="legal-type-item__description">Comprehensive 100+ hour certification program covering life insurance, accident &amp; sickness insurance, ethics, and professional practice standards.</p>
                    </div>
                    <div className="legal-type-item">
                      <h4 className="legal-type-item__name">Continuing Education Requirements</h4>
                      <p className="legal-type-item__description">30 continuing education credits required every 2 years to maintain current knowledge and professional competency.</p>
                    </div>
                    <div className="legal-type-item">
                      <h4 className="legal-type-item__name">Professional Ethics Training</h4>
                      <p className="legal-type-item__description">Mandatory ethics and professional conduct training ensuring client-first approach and transparent practices.</p>
                    </div>
                  </div>
                </section>
                <section id="data-security">
                  <h2>Data Security &amp; Privacy Protection</h2>
                  <div className="legal-card">
                    <div className="legal-card__header">
                      <div className="legal-card__icon">&#128274;</div>
                      <div><h4 className="legal-card__title">Multi-Layer Security Framework</h4><p className="legal-card__subtitle">Military-grade encryption and protection</p></div>
                    </div>
                    <p className="legal-card__content">Our security framework includes 256-bit SSL encryption, secure data centers, multi-factor authentication, regular security audits, and compliance with industry security standards.</p>
                  </div>
                  <h3>Security Measures</h3>
                  <ul>
                    <li><strong>256-bit SSL Encryption:</strong> All data transmission is encrypted using industry-standard protocols</li>
                    <li><strong>Secure Data Centers:</strong> Information stored in SOC 2-compliant facilities with 24/7 monitoring</li>
                    <li><strong>Access Controls:</strong> Strict employee access controls and background checks</li>
                    <li><strong>Regular Audits:</strong> Quarterly security assessments and vulnerability testing</li>
                    <li><strong>Data Minimization:</strong> We collect only the information necessary for service delivery</li>
                  </ul>
                </section>
                <section id="consumer-protection">
                  <h2>Consumer Protection &amp; Safeguards</h2>
                  <h3>Financial Protection</h3>
                  <ul>
                    <li><strong>Errors &amp; Omissions Insurance:</strong> $1M+ professional liability coverage</li>
                    <li><strong>Assuris Protection:</strong> Industry fund protecting policy obligations up to $200,000</li>
                    <li><strong>Segregated Client Funds:</strong> Premiums held in trust and remitted directly to insurers</li>
                    <li><strong>No-Fee Guarantee:</strong> We never charge fees to consumers for our services</li>
                  </ul>
                  <h3>Complaint Resolution</h3>
                  <ol>
                    <li><strong>Direct Resolution:</strong> Contact our customer service team directly</li>
                    <li><strong>Management Escalation:</strong> Escalate to senior management if needed</li>
                    <li><strong>FSRA Complaint:</strong> File formal complaint with our regulator</li>
                    <li><strong>OLHI Mediation:</strong> OmbudService for Life and Health Insurance</li>
                    <li><strong>Legal Remedies:</strong> Courts and other legal options remain available</li>
                  </ol>
                </section>
                <section id="industry-affiliations">
                  <h2>Industry Affiliations &amp; Recognition</h2>
                  <div className="legal-types-container">
                    <div className="legal-type-item">
                      <h4 className="legal-type-item__name">Insurance Brokers Association of Ontario (IBAO)</h4>
                      <p className="legal-type-item__description">Professional association promoting excellence in insurance brokerage services and consumer protection.</p>
                    </div>
                    <div className="legal-type-item">
                      <h4 className="legal-type-item__name">Canadian Association of Insurance and Financial Advisors (CAIFA)</h4>
                      <p className="legal-type-item__description">National organization advancing professional standards and ethical practices in financial services.</p>
                    </div>
                    <div className="legal-type-item">
                      <h4 className="legal-type-item__name">Life Insurance Marketing and Research Association (LIMRA)</h4>
                      <p className="legal-type-item__description">Global research and consulting organization helping improve the life insurance industry.</p>
                    </div>
                  </div>
                </section>
                <section id="transparency">
                  <h2>Transparency &amp; Ethics</h2>
                  <div style={{background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', border: '1px solid #ffeaa7', borderRadius: '12px', padding: '16px', margin: '16px 0'}}>
                    <div style={{fontSize: '15px', fontWeight: 600, color: '#856404', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      &#128161; Complete Transparency Promise
                    </div>
                    <p style={{fontSize: '13px', color: '#856404', margin: 0, lineHeight: 1.6}}>We believe in complete transparency about our operations, compensation, and relationships. You&apos;ll always know exactly how we operate and how we&apos;re compensated.</p>
                  </div>
                  <h3>Our Compensation Model</h3>
                  <ul>
                    <li><strong>Free to Consumers:</strong> We never charge fees to individuals seeking insurance</li>
                    <li><strong>Insurer Commissions:</strong> We receive standard industry commissions from insurance companies</li>
                    <li><strong>No Hidden Fees:</strong> All costs are built into standard insurance premiums</li>
                    <li><strong>Aligned Interests:</strong> We only succeed when you get the right coverage at the best price</li>
                  </ul>
                </section>
                <section id="financial-strength">
                  <h2>Financial Strength &amp; Stability</h2>
                  <div className="legal-card">
                    <div className="legal-card__header">
                      <div className="legal-card__icon">&#128202;</div>
                      <div><h4 className="legal-card__title">Strong Financial Foundation</h4><p className="legal-card__subtitle">Stable and growing business</p></div>
                    </div>
                    <p className="legal-card__content">We maintain strong financial health through diversified revenue streams, conservative financial management, and ongoing investment in technology and service capabilities.</p>
                  </div>
                </section>
                <section id="verification">
                  <h2>Verify Our Credentials</h2>
                  <h3>Independent Verification</h3>
                  <p>We encourage you to independently verify our credentials and standing:</p>
                  <div className="legal-table">
                    <table style={{width: '100%', borderCollapse: 'collapse', margin: '16px 0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)'}}>
                      <thead>
                        <tr>
                          <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600}}>Verification Source</th>
                          <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600}}>What to Verify</th>
                          <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600}}>Contact Information</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>FSRA</td>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>License #41964M Status</td>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>www.fsrao.ca | (416) 250-7250</td>
                        </tr>
                        <tr style={{background: '#f9fafb'}}>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Better Business Bureau</td>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Business Rating &amp; Reviews</td>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>www.bbb.org</td>
                        </tr>
                        <tr>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Google Reviews</td>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Customer Experience</td>
                          <td style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Google Business Profile</td>
                        </tr>
                        <tr style={{background: '#f9fafb'}}>
                          <td style={{padding: '12px', textAlign: 'left'}}>IBAO</td>
                          <td style={{padding: '12px', textAlign: 'left'}}>Membership Status</td>
                          <td style={{padding: '12px', textAlign: 'left'}}>www.ibao.org</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Questions About Our Licensing &amp; Trust Measures?</h2>
                <p>We&apos;re happy to discuss our credentials, security measures, and consumer protections:</p>
                <div className="layout__grid">
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p className="u-font-medium"><strong>PolicyScanner Brokerage Incorporated</strong></p>
                    <p><strong>FSRA License:</strong> #41964M</p>
                    <p><strong>General Inquiries:</strong> <a href="mailto:info@policyscanner.ca">info@policyscanner.ca</a></p>
                    <p><strong>Compliance Questions:</strong> <a href="mailto:compliance@policyscanner.ca">compliance@policyscanner.ca</a></p>
                  </div>
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p><strong>Phone:</strong> <a href="tel:4374228353">(437) 422-8353</a></p>
                    <p><strong>Address:</strong> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
                    <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
                <div className="layout__grid" style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(59,197,185,0.1)'}}>
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <h3 style={{marginTop: 0}}>Ready to Get Started?</h3>
                    <p>Experience our trusted, secure service for yourself:</p>
                    <a href="/compare-insurance-quotes" className="button button--primary">Compare Quotes Now</a>
                  </div>
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <h3 style={{marginTop: 0}}>Have Questions?</h3>
                    <p>Speak with one of our licensed advisors:</p>
                    <a href="https://policyscanner.zohobookings.com/#/policyscanner" className="button button--outline">Schedule a Call</a>
                  </div>
                </div>
              </div>
              <div className="legal-footer-section">
                <div className="legal-footer-section__company">
                  <strong>PolicyScanner Brokerage Incorporated (FSRA #41964M)</strong><br />
                  Licensed Life Insurance Brokerage - Ontario, Canada<br />
                  Committed to transparency, security, and exceptional service
                </div>
                <p className="legal-footer-section__updated">Last Updated: June 30, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
