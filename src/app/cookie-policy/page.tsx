import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Cookie Policy | PolicyScanner',
  description: 'How PolicyScanner uses cookies and tracking technologies.',
}

export default function CookiePolicyPage() {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="layout__section">
        <div className="layout__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds layout__grid-item--centered">
              <header className="legal-header">
                <h1 className="legal-title">Cookie Policy</h1>
                <p className="legal-subtitle">How we use cookies and tracking technologies to enhance your experience</p>
              </header>
              <div className="legal-meta">
                <div className="legal-meta__item"><div className="legal-meta__label">Effective Date</div><p className="legal-meta__value">June 28, 2025</p></div>
                <div className="legal-meta__item"><div className="legal-meta__label">Last Updated</div><p className="legal-meta__value">June 28, 2025</p></div>
              </div>
              <nav className="legal-nav">
                <h2 className="legal-nav__title">Quick Navigation</h2>
                <ul className="legal-nav__list">
                  <li><a href="#types-of-cookies" className="legal-nav__link">Types of Cookies</a></li>
                  <li><a href="#how-we-use" className="legal-nav__link">How We Use Cookies</a></li>
                  <li><a href="#third-party" className="legal-nav__link">Third-Party Cookies</a></li>
                  <li><a href="#your-choices" className="legal-nav__link">Your Choices</a></li>
                  <li><a href="#contact" className="legal-nav__link">Contact Information</a></li>
                </ul>
              </nav>
              <div className="legal-content">
                <section id="types-of-cookies">
                  <h2>Types of Cookies We Use</h2>
                  <p>We use different types of cookies for various purposes on our website:</p>
                  <div className="legal-types-container">
                    <div className="legal-type-item">
                      <h3 className="legal-type-item__name">Strictly Necessary Cookies</h3>
                      <p className="legal-type-item__description">These cookies are essential for our website to function properly. They enable basic features like page navigation, access to secure areas, and form submissions. Without these cookies, our services cannot be provided.</p>
                    </div>
                    <div className="legal-type-item">
                      <h3 className="legal-type-item__name">Performance Cookies</h3>
                      <p className="legal-type-item__description">These cookies help us understand how visitors interact with our website by collecting anonymous information about pages visited, time spent on the site, and any error messages encountered.</p>
                    </div>
                    <div className="legal-type-item">
                      <h3 className="legal-type-item__name">Functionality Cookies</h3>
                      <p className="legal-type-item__description">These cookies remember your preferences and choices to provide you with a more personalized experience, such as remembering your language preferences or login information.</p>
                    </div>
                    <div className="legal-type-item">
                      <h3 className="legal-type-item__name">Marketing Cookies</h3>
                      <p className="legal-type-item__description">These cookies track your browsing habits to show you relevant advertisements and measure the effectiveness of our marketing campaigns. They help us understand which content is most valuable to our visitors.</p>
                    </div>
                  </div>
                </section>
                <section id="how-we-use">
                  <h2>How We Use Cookies</h2>
                  <p>We use cookies for several important purposes to enhance your experience with our life insurance services:</p>
                  <h3>Website Functionality</h3>
                  <ul>
                    <li><strong>Session Management:</strong> Maintaining your session as you navigate through quote forms and applications</li>
                    <li><strong>Form Data:</strong> Temporarily storing information you enter in our life insurance quote forms</li>
                    <li><strong>User Preferences:</strong> Remembering your settings and preferences for future visits</li>
                  </ul>
                  <h3>Analytics and Performance</h3>
                  <ul>
                    <li><strong>Website Analytics:</strong> Understanding how visitors use our website to improve functionality</li>
                    <li><strong>Performance Monitoring:</strong> Identifying and fixing technical issues to ensure optimal performance</li>
                    <li><strong>User Journey Analysis:</strong> Analyzing how users navigate through our life insurance quote process</li>
                  </ul>
                  <h3>Personalization</h3>
                  <ul>
                    <li><strong>Content Personalization:</strong> Showing relevant life insurance products and information</li>
                    <li><strong>Quote Customization:</strong> Providing personalized insurance recommendations based on your profile</li>
                    <li><strong>User Experience:</strong> Adapting the website experience to your preferences and behavior</li>
                  </ul>
                </section>
                <section id="third-party">
                  <h2>Third-Party Cookies</h2>
                  <p>We work with trusted third-party service providers who may also place cookies on your device:</p>
                  <h3>Analytics Services</h3>
                  <ul>
                    <li><strong>Google Analytics:</strong> Website performance and user behavior analysis</li>
                    <li><strong>Hotjar:</strong> User experience insights and heatmap analysis</li>
                    <li><strong>Heap Analytics:</strong> Event tracking and user journey analysis</li>
                  </ul>
                  <h3>Communication Tools</h3>
                  <ul>
                    <li><strong>Customer Support Platforms:</strong> Live chat functionality and customer service tools</li>
                    <li><strong>Email Marketing:</strong> Newsletter delivery and marketing communication tracking</li>
                    <li><strong>Scheduling Tools:</strong> Appointment booking with our LLQP-certified advisors</li>
                  </ul>
                  <h3>Marketing and Advertising</h3>
                  <ul>
                    <li><strong>Social Media Platforms:</strong> Facebook, LinkedIn, and other social media analytics</li>
                    <li><strong>Advertising Networks:</strong> Relevant advertisement delivery and campaign measurement</li>
                    <li><strong>Remarketing:</strong> Showing relevant content to previous website visitors</li>
                  </ul>
                </section>
                <section id="your-choices">
                  <h2>Your Cookie Choices</h2>
                  <p>You have several options for managing cookies on your device:</p>
                  <h3>Browser Settings</h3>
                  <p>Most web browsers allow you to control cookies through their settings preferences. You can typically:</p>
                  <ul>
                    <li><strong>Block all cookies:</strong> Prevent all cookies from being stored on your device</li>
                    <li><strong>Block third-party cookies:</strong> Allow only cookies from PolicyScanner while blocking third-party cookies</li>
                    <li><strong>Delete cookies:</strong> Remove existing cookies from your device</li>
                    <li><strong>Receive notifications:</strong> Get alerts when cookies are being set</li>
                  </ul>
                  <h3>Important Note</h3>
                  <p><em>Please note that blocking or deleting cookies may affect your ability to use certain features of our website, including our life insurance quote tools and personalized recommendations.</em></p>
                </section>
                <section id="updates">
                  <h2>Updates to This Policy</h2>
                  <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the &ldquo;Last Updated&rdquo; date at the top of this policy.</p>
                </section>
              </div>
              <div className="legal-contact" id="contact">
                <h2>Contact Information</h2>
                <p>If you have questions about our use of cookies or this Cookie Policy, please contact us:</p>
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
                <p className="text-small text-secondary u-text-center"><strong>For general inquiries:</strong> <a href="mailto:info@policyscanner.ca">info@policyscanner.ca</a></p>
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
