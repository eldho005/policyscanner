import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | PolicyScanner',
  description: 'How PolicyScanner collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds layout__grid-item--centered">
              <header className="legal-header">
                <h1 className="legal-title">Privacy Policy</h1>
                <p className="legal-subtitle">How we collect, use, and protect your personal information</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">Effective Date</div><p className="legal-meta__value">June 28, 2025</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Last Updated</div><p className="legal-meta__value">December 22, 2025</p></div>
              </div>
              <nav className="legal-nav legal-nav--simple">
                <h2 className="legal-nav__title">Quick Navigation</h2>
                <ul className="legal-nav__list">
                  <li><a href="#introduction" className="legal-nav__link">Introduction</a></li>
                  <li><a href="#information-we-collect" className="legal-nav__link">Information We Collect</a></li>
                  <li><a href="#how-we-use" className="legal-nav__link">How We Use Information</a></li>
                  <li><a href="#sharing" className="legal-nav__link">Information Sharing</a></li>
                  <li><a href="#life-insurers" className="legal-nav__link">Sharing with Life Insurers</a></li>
                  <li><a href="#your-rights" className="legal-nav__link">Your Rights</a></li>
                  <li><a href="#security" className="legal-nav__link">Data Security</a></li>
                  <li><a href="#contact" className="legal-nav__link">Contact Information</a></li>
                </ul>
              </nav>
              <div className="legal-content">
                <section id="introduction">
                  <h2>Introduction</h2>
                  <p>Welcome to <strong>PolicyScanner Brokerage Incorporated</strong> (collectively, &ldquo;PolicyScanner&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; and/or &ldquo;our&rdquo;). We own and operate the website: www.policyscanner.ca (the &ldquo;Site&rdquo;), which offers online life insurance brokerage, insurance quote comparison, and insurance advisory services.</p>
                  <p>We take your privacy seriously. This Privacy Policy describes our personal information processing practices in relation to you and your personal information as well as the types of personal information we may collect from or about you when you visit our Site or interact with our advertisements on social media platforms.</p>
                  <p><strong>For information on how and when we share your personal information with life insurance companies, please see the section entitled &ldquo;Sharing with Life Insurance Companies&rdquo; below.</strong></p>
                </section>
                <section id="information-we-collect">
                  <h2>What Personal Information We Collect</h2>
                  <p>We collect and maintain different types of personal information provided through our website or via <strong>Facebook and Instagram Lead Ads</strong>. This includes:</p>
                  <h3>Contact and Identification Information</h3>
                  <ul>
                    <li>Name, address, postal code, telephone number, and email address</li>
                    <li>Date of birth, citizenship/residency status, marital status and gender</li>
                  </ul>
                  <h3>Health and Medical Information</h3>
                  <ul>
                    <li>Height, weight, whether or not you are a smoker</li>
                    <li>Medical history and family medical history</li>
                    <li>Tobacco and alcohol usage history</li>
                  </ul>
                  <h3>Employment and Financial Information</h3>
                  <ul>
                    <li>Occupation, years of employment, annual income</li>
                    <li>Financial assets and debt information</li>
                  </ul>
                </section>
                <section id="how-we-use">
                  <h2>How We Use Your Personal Information</h2>
                  <p>We only collect information from you that is necessary to provide you with the life insurance products and services available through our Site. We collect information to:</p>
                  <ul>
                    <li><strong>Fulfill your requests</strong> for life insurance quotes, assessments, and applications</li>
                    <li><strong>Assess your life insurance needs</strong> and identify appropriate products</li>
                    <li><strong>Ensure compliance</strong> with applicable laws and regulatory requirements in Canada</li>
                  </ul>
                </section>
                <section id="sharing">
                  <h2>How We Share Your Information</h2>
                  <p>Your personal information will be shared with life insurance companies and managing general agents to assist you in purchasing suitable life insurance policies.</p>
                  <p><strong>Meta Platforms (Facebook &amp; Instagram):</strong> For users who provide information via Lead Ads, we use the <strong>Meta Marketing API</strong> to securely retrieve and process your inquiry. This data is transferred from Meta&apos;s servers to our internal brokerage system for the sole purpose of providing the insurance quote you requested.</p>
                  <p>We may also disclose your personal information to:</p>
                  <ul>
                    <li><strong>Life insurance companies</strong> for obtaining quotes and processing applications</li>
                    <li><strong>Service providers</strong> to perform business functions including website hosting and secure data retrieval</li>
                    <li><strong>Legal authorities</strong> as required by law</li>
                  </ul>
                  <p><strong>Important:</strong> We will not share your personal information with any third-party marketers without your specific consent.</p>
                </section>
                <section id="life-insurers">
                  <h2>Sharing with Life Insurance Companies</h2>
                  <p><strong>This is a critical aspect of our business model.</strong> When you request life insurance quotes or submit applications through our platform:</p>
                  <ol>
                    <li><strong>Quote Generation:</strong> We share necessary personal information with multiple life insurance companies to generate accurate quotes</li>
                    <li><strong>Application Submission:</strong> If you choose to submit an application, we share your information with the selected insurer</li>
                  </ol>
                  <p><strong>Important:</strong> The personal information that you submit to a life insurance company will be governed by that insurer&apos;s privacy policy. <em>We do not send any information to a life insurance company until the application is complete and you authorize us to submit it.</em></p>
                </section>
                <section id="your-rights">
                  <h2>Your Rights and Choices</h2>
                  <p>It is important to us that we collect, use or disclose your personal information only when we have your consent to do so. You have the right to:</p>
                  <ul>
                    <li><strong>Access your personal information</strong> that we have about you</li>
                    <li><strong>Request corrections</strong> to inaccurate or incomplete information</li>
                    <li><strong>Withdraw your consent</strong> at any time</li>
                    <li><strong>Data Deletion:</strong> To specifically request the deletion of data retrieved via our Facebook integration, please follow our <a href="/data-deletion">Data Deletion Instructions</a>.</li>
                  </ul>
                </section>
                <section id="security">
                  <h2>Data Security and Protection</h2>
                  <p>We use reasonable physical, technical, and administrative security measures to protect personal information from unauthorized access or disclosure. This includes encryption when transmitting data from Meta&apos;s API to our servers.</p>
                </section>
                <section id="data-retention">
                  <h2>Data Retention</h2>
                  <p>We keep your personal information as long as is reasonably necessary to complete our dealings with you, comply with life insurance industry requirements, or as may be required by law.</p>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Contact Information</h2>
                <p>If you have questions regarding this Privacy Policy, you may contact our Privacy Officer:</p>
                <div className="layout__grid">
                  <div className="layout__grid-item layout__grid-item--md-half">
                    <p className="u-font-medium"><strong>Privacy Officer:</strong> Eldho George</p>
                    <p><strong>Email:</strong> <a href="mailto:eldho@policyscanner.ca">eldho@policyscanner.ca</a></p>
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
                  Digital Life Insurance Brokerage
                </div>
                <p className="legal-footer-section__updated">Last Updated: December 22, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
