import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Broker Compensation & Relationship Disclosure | PolicyScanner',
  description: 'Transparency in how PolicyScanner is compensated and our business relationships.',
}

export default function CompensatedPage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds" style={{margin: '0 auto'}}>
              <header className="legal-header">
                <h1 className="legal-title">Broker Compensation &amp; Relationship Disclosure</h1>
                <p className="legal-subtitle">Transparency in how we are compensated and our business relationships</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">Business Model</div><p className="legal-meta__value">Commission-Based</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Cost to You</div><p className="legal-meta__value">$0 - No Fees</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Compensation Source</div><p className="legal-meta__value">Insurance Companies</p></div>
              </div>
              <nav className="legal-nav">
                <h2 className="legal-nav__title">Quick Navigation</h2>
                <ul className="legal-nav__list">
                  <li><a href="#overview" className="legal-nav__link">Compensation Overview</a></li>
                  <li><a href="#how-we-earn" className="legal-nav__link">How We Earn</a></li>
                  <li><a href="#no-cost-to-you" className="legal-nav__link">No Cost to You</a></li>
                  <li><a href="#relationships" className="legal-nav__link">Insurance Relationships</a></li>
                  <li><a href="#independence" className="legal-nav__link">Our Independence</a></li>
                  <li><a href="#contact" className="legal-nav__link">Contact Information</a></li>
                </ul>
              </nav>
              <div className="legal-warning">
                <div className="legal-warning__title">Important: How We Get Paid</div>
                <p className="legal-warning__content">PolicyScanner is compensated through commissions paid by insurance companies when you purchase a policy through our platform. You pay no additional fees - you will be charged the same whether you buy from us or directly from the insurance company.</p>
              </div>
              <div className="legal-content">
                <section id="overview">
                  <h2>Compensation Overview</h2>
                  <p><strong>PolicyScanner Brokerage Incorporated</strong> operates as an independent life insurance brokerage, earning compensation through commissions paid by insurance companies when clients purchase policies through our platform.</p>
                  <h3>Key Transparency Points</h3>
                  <ul>
                    <li><strong>No fees to clients:</strong> You never pay PolicyScanner directly for our services</li>
                    <li><strong>Commission-based model:</strong> We are paid by insurance companies when you purchase coverage</li>
                    <li><strong>Same pricing guarantee:</strong> You pay the same premium whether you buy directly from the insurer or through us</li>
                    <li><strong>Independent advice:</strong> We work with multiple insurers to find you the best options</li>
                  </ul>
                  <h3>Our Value Proposition</h3>
                  <p>While insurance companies compensate us for our services, you receive significant value including:</p>
                  <ul>
                    <li><strong>Expert guidance:</strong> LLQP-certified advisors to help you navigate options</li>
                    <li><strong>Comparison shopping:</strong> We compare multiple insurers to find your best options</li>
                    <li><strong>Application assistance:</strong> Streamlined application process and underwriting support</li>
                    <li><strong>Ongoing service:</strong> Continued support throughout the life of your policy</li>
                  </ul>
                </section>
                <section id="how-we-earn">
                  <h2>How We Earn Compensation</h2>
                  <h3>Primary Compensation: First-Year Commissions</h3>
                  <p>The majority of our compensation comes from first-year commissions paid by insurance companies when a new policy is issued:</p>
                  <div className="legal-card">
                    <div className="legal-card__header"><div><h4 className="legal-card__title">First-Year Commission</h4><p className="legal-card__subtitle">Paid when your policy is issued</p></div></div>
                    <p className="legal-card__content">Insurance companies pay us a percentage of your first-year premium when your policy is approved and issued. This is our primary form of compensation and incentivizes us to help you secure appropriate coverage.</p>
                  </div>
                  <h3>Secondary Compensation: Renewal Commissions</h3>
                  <p>We may also receive ongoing renewal commissions for policies that remain in force:</p>
                  <div className="legal-card">
                    <div className="legal-card__header"><div><h4 className="legal-card__title">Renewal Commission</h4><p className="legal-card__subtitle">Smaller ongoing payments</p></div></div>
                    <p className="legal-card__content">Some insurance companies pay reduced ongoing commissions (typically 2-5% of annual premiums) while policies remain active. This aligns our interests with your satisfaction and policy retention.</p>
                  </div>
                  <h3>No Additional Compensation</h3>
                  <p><strong>We do not receive any other forms of compensation including:</strong></p>
                  <ul>
                    <li>Fees paid directly by clients</li>
                    <li>Bonuses based on sales volume</li>
                    <li>Profit-sharing from insurance companies</li>
                    <li>Non-monetary gifts or incentives</li>
                    <li>Revenue sharing from third-party services</li>
                  </ul>
                </section>
                <section id="no-cost-to-you">
                  <h2>No Cost to You</h2>
                  <h3>Zero Fees Policy</h3>
                  <p><strong>PolicyScanner never charges fees to clients.</strong> Our services are completely free to you, including:</p>
                  <ul>
                    <li><strong>Quote comparison:</strong> Comparing rates from multiple insurers</li>
                    <li><strong>Advisory consultation:</strong> Professional advice from LLQP-certified advisors</li>
                    <li><strong>Application processing:</strong> Complete application management and submission</li>
                    <li><strong>Underwriting support:</strong> Assistance throughout the underwriting process</li>
                    <li><strong>Policy delivery:</strong> Coordinating policy issuance and delivery</li>
                    <li><strong>Ongoing service:</strong> Post-sale support and policy administration assistance</li>
                  </ul>
                  <h3>Same Pricing Guarantee</h3>
                  <p><em>You pay exactly the same premium whether you purchase life insurance directly from an insurance company or through PolicyScanner.</em> Insurance companies set their premium rates independently, and you will not pay any additional costs by working with us.</p>
                  <h3>Added Value at No Extra Cost</h3>
                  <p>By working with PolicyScanner, you receive additional value at no extra cost:</p>
                  <ul>
                    <li><strong>Market comparison:</strong> Access to multiple insurers through one platform</li>
                    <li><strong>Professional expertise:</strong> Guidance from licensed life insurance professionals</li>
                    <li><strong>Time savings:</strong> Streamlined comparison and application process</li>
                    <li><strong>Advocacy:</strong> Someone working on your behalf with insurance companies</li>
                  </ul>
                </section>
                <section id="relationships">
                  <h2>Insurance Company Relationships</h2>
                  <h3>Independent Brokerage Model</h3>
                  <p><strong>PolicyScanner is an independent brokerage</strong> that works with multiple life insurance companies. We are not owned by, controlled by, or exclusively contracted with any single insurance company.</p>
                  <h3>Current Insurance Partners</h3>
                  <p>We maintain contractual relationships with leading Canadian life insurance companies including:</p>
                  <ul>
                    <li><strong>Major Canadian Insurers:</strong> Manulife, Sun Life, Great-West Life, Canada Life</li>
                    <li><strong>Regional Insurers:</strong> RBC Insurance, TD Insurance, BMO Insurance</li>
                    <li><strong>Specialty Providers:</strong> Various specialty and niche life insurance providers</li>
                    <li><strong>Reinsurers:</strong> Access to select reinsurance markets for larger cases</li>
                  </ul>
                  <h3>Contracting Requirements</h3>
                  <p>To work with insurance companies, we must:</p>
                  <ul>
                    <li><strong>Meet licensing requirements:</strong> Maintain FSRA licensing and LLQP certification</li>
                    <li><strong>Comply with company standards:</strong> Adhere to each insurer&apos;s business practices and procedures</li>
                    <li><strong>Maintain E&amp;O insurance:</strong> Carry appropriate professional liability coverage</li>
                    <li><strong>Meet production requirements:</strong> Some insurers require minimum production levels</li>
                  </ul>
                </section>
                <section id="independence">
                  <h2>Our Independence</h2>
                  <h3>Independent Decision Making</h3>
                  <p><strong>PolicyScanner maintains complete independence</strong> in making recommendations to clients. Our decisions are based on:</p>
                  <ul>
                    <li><strong>Your specific needs:</strong> Coverage requirements, budget, and financial goals</li>
                    <li><strong>Product suitability:</strong> Which products best match your situation</li>
                    <li><strong>Competitive advantages:</strong> Pricing, underwriting, and service quality</li>
                    <li><strong>Company stability:</strong> Financial strength and claims-paying ability</li>
                  </ul>
                  <h3>Your Rights</h3>
                  <p>You always have the right to:</p>
                  <ul>
                    <li><strong>Ask questions:</strong> About our recommendations and reasoning</li>
                    <li><strong>Request alternatives:</strong> Ask for different options or insurance companies</li>
                    <li><strong>Seek second opinions:</strong> Consult with other advisors or directly with insurers</li>
                    <li><strong>Make your own decisions:</strong> Accept or decline any recommendations</li>
                    <li><strong>File complaints:</strong> With us, FSRA, or other regulatory bodies if needed</li>
                  </ul>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Questions About Our Compensation?</h2>
                <p>If you have questions about our compensation structure or business relationships, please contact us:</p>
                <div className="layout__grid">
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p className="u-font-medium"><strong>Company:</strong> PolicyScanner Brokerage Incorporated</p>
                    <p><strong>Email:</strong> <a href="mailto:info@policyscanner.ca">info@policyscanner.ca</a></p>
                    <p><strong>Compliance Inquiries:</strong> <a href="mailto:compliance@policyscanner.ca">compliance@policyscanner.ca</a></p>
                  </div>
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p><strong>Address:</strong> 6 Urbane Blvd, Kitchener, Ontario, N2E 0J2</p>
                    <p><strong>Phone:</strong> <a href="tel:4374228353">(437) 422-8353</a></p>
                    <p><strong>FSRA License:</strong> #41964M</p>
                  </div>
                </div>
              </div>
              <div className="legal-footer-section">
                <div className="legal-footer-section__company">
                  <strong>PolicyScanner Brokerage Incorporated (FSRA #41964M)</strong><br />
                  Independent Life Insurance Brokerage - Ontario, Canada<br />
                  Commission-based model - No fees to clients
                </div>
                <p className="legal-footer-section__updated">Last Updated: June 29, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
