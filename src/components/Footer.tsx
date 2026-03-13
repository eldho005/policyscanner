export default function Footer() {
  return (
    <footer className="footer">
      <div className="layout__container">
        
        {/* Footer Main Content */}
        <div className="footer__main">
          <div className="layout__grid">
            
            {/* Company Information */}
            <div className="layout__grid-item layout__grid-item--md-third layout__grid-item--lg-quarter">
              <div className="footer__column">
                <h4 className="footer__title">Company</h4>
                <ul className="footer__list">
                  <li className="footer__list-item">
                    <a href="/about-us" className="footer__link">About Us</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/disclaimer" className="footer__link">Important Disclaimers</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/licensing-and-trust" className="footer__link">Licensing &amp; Trust</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/compensated" className="footer__link">How We&apos;re Compensated</a>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Insurance Types */}
            <div className="layout__grid-item layout__grid-item--md-third layout__grid-item--lg-quarter">
              <div className="footer__column">
                <h4 className="footer__title">Insurance Types</h4>
                <ul className="footer__list">
                  <li className="footer__list-item">
                    <a href="/life-insurance/what-is-term-life-insurance" className="footer__link">Term Life</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/life-insurance/whole-life-insurance" className="footer__link">Whole Life</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/life-insurance/mortgage-insurance" className="footer__link">Mortgage</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/life-insurance/critical-illness-insurance" className="footer__link">Critical Illness</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/life-insurance" className="footer__link">Life Insurance</a>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Learn Section */}
            <div className="layout__grid-item layout__grid-item--md-third layout__grid-item--lg-quarter">
              <div className="footer__column">
                <h4 className="footer__title">Learn</h4>
                <ul className="footer__list">
                  <li className="footer__list-item">
                    <a href="/life-insurance" className="footer__link">What Is Life Insurance?</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/#guides-resources" className="footer__link">Types of Insurance</a>
                  </li>
                  <li className="footer__list-item">
                    <a href="/learn/insurance-calculator" className="footer__link">Insurance Calculator</a>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Contact & Social */}
            <div className="layout__grid-item layout__grid-item--md-full layout__grid-item--lg-quarter">
              <div className="footer__column">
                <h4 className="footer__title">Contact &amp; Follow</h4>
                <ul className="footer__list">
                  <li className="footer__list-item">
                    <a href="mailto:info@policyscanner.ca" className="footer__link footer__contact-link">
                      <span className="footer__contact-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </span>
                      info@policyscanner.ca
                    </a>
                  </li>
                  <li className="footer__list-item">
                    <a href="tel:+14374228353" className="footer__link footer__contact-link">
                      <span className="footer__contact-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </span>
                      +1 437 422 8353
                    </a>
                  </li>
                </ul>
                
                {/* Social Links */}
                <div className="footer__social">
                  <h5 className="footer__social-title">Follow Us</h5>
                  <div className="footer__social-links">
                    <a href="https://facebook.com/policyscanner" className="footer__social-link" aria-label="Follow PolicyScanner on Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="https://linkedin.com/company/policyscanner" className="footer__social-link" aria-label="Follow PolicyScanner on LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href="https://instagram.com/policyscanner" className="footer__social-link" aria-label="Follow PolicyScanner on Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Footer Links */}
        <div className="footer__secondary">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--md-two-thirds">
              <ul className="footer__legal-list">
                <li className="footer__legal-item">
                  <a href="/privacy-policy" className="footer__legal-link">Privacy Policy</a>
                </li>
                <li className="footer__legal-item">
                  <a href="/terms-of-service" className="footer__legal-link">Terms of Service</a>
                </li>
                <li className="footer__legal-item">
                  <a href="/cookie-policy" className="footer__legal-link">Cookie Policy</a>
                </li>
                <li className="footer__legal-item">
                  <a href="/advisor-disclosure" className="footer__legal-link">Advisor Disclosure</a>
                </li>
              </ul>
            </div>
            <div className="layout__grid-item layout__grid-item--md-third">
              <div className="footer__canadian">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__canadian-icon">
                  <path d="M12 2L9.5 4.5L5 3L6.5 7.5L3 11L7.5 12.5L9 17L12 15L15 17L16.5 12.5L21 11L17.5 7.5L19 3L14.5 4.5L12 2Z"/>
                </svg>
                100% Canadian Owned and Operated
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="footer__copyright">
          <p className="footer__copyright-text">&copy; 2026 PolicyScanner Inc. All rights reserved.</p>
        </div>
        
        {/* Disclaimer */}
        <div className="footer__disclaimer">
          <p className="footer__disclaimer-text">
            Disclaimer: PolicyScanner is a comparison platform and not an insurance provider.
            We do not offer financial advice. All quotes are subject to change and are based on the information provided at the time of submission.
            Please consult a licensed advisor for personalized recommendations.
          </p>
        </div>
      </div>
    </footer>
  )
}
