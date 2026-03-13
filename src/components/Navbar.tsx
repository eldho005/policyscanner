export default function Navbar() {
  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="u-skip-link">Skip to content</a>

      {/* Enhanced Navbar with Better Layout */}
      <header className="navbar" id="navbarContainer">
        <div className="navbar__inner">
          <div className="navbar__content">
            
            {/* LEFT SIDE: Logo Only */}
            <a className="navbar__brand" href="/">
              <img
                src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746833395/policyscanner-logo_wjm5hq.webp"
                alt="PolicyScanner Logo"
                className="navbar__logo"
                fetchPriority="high"
              />
            </a>
            
            {/* RIGHT SIDE: Navigation + CTAs Container */}
            <div className="navbar__right">
              
              {/* Desktop Navigation */}
              <nav className="navbar__nav navbar__nav--desktop" aria-label="Main Navigation">
                <ul className="navbar__list">
                  {/* Insurance Types Mega Menu */}
                  <li className="navbar__item" id="insuranceTypeNavItem">
                    <a className="navbar__link" href="#" aria-haspopup="true" aria-expanded="false" aria-current="page">
                      Insurance Types
                      <svg className="navbar__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </a>
                  </li>
                  
                  {/* Learn Mega Menu */}
                  <li className="navbar__item" id="learnNavItem">
                    <a className="navbar__link" href="#" aria-haspopup="true" aria-expanded="false">
                      Learn
                      <svg className="navbar__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </a>
                  </li>
                  
                  {/* About Mega Menu */}
                  <li className="navbar__item" id="aboutNavItem">
                    <a className="navbar__link" href="#" aria-haspopup="true" aria-expanded="false">
                      About
                      <svg className="navbar__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
              
              {/* Desktop CTA Buttons */}
              <div className="navbar__actions navbar__actions--desktop">
                <a href="/compare-insurance-quotes" className="button button--primary button--navbar">Compare Quotes Now</a>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button
                className="navbar__toggle"
                type="button"
                id="mobileMenuToggle"
                aria-expanded="false"
                aria-controls="mobileNav"
                aria-label="Toggle navigation"
              >
                <svg id="menuOpenIcon" className="navbar__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <svg id="menuCloseIcon" className="navbar__toggle-icon navbar__toggle-icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
            </div>
          </div>
        </div>
        
        {/* Insurance Types Mega Menu Content */}
        <div className="megamenu" id="insuranceTypeMegaMenu" role="menu">
          <div className="layout__container">
            <div className="layout__grid">
              
              <div className="layout__grid-item layout__grid-item--md-third">
                <a href="/life-insurance/what-is-term-life-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Term Life Insurance</div>
                  <p className="megamenu__description">Affordable coverage for a set period</p>
                </a>
                <a href="/life-insurance/whole-life-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Whole Life Insurance</div>
                  <p className="megamenu__description">Lifetime coverage with cash value</p>
                </a>
              </div>

              <div className="layout__grid-item layout__grid-item--md-third">
                <a href="/life-insurance/mortgage-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Mortgage Insurance</div>
                  <p className="megamenu__description">Protect your home loan</p>
                </a>
                <a href="/life-insurance/critical-illness-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Critical Illness Insurance</div>
                  <p className="megamenu__description">Coverage for serious health conditions</p>
                </a>
              </div>
              
              <div className="layout__grid-item layout__grid-item--md-third">
                <a href="/life-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Life Insurance</div>
                  <p className="megamenu__description">Flexible premium and death benefits</p>
                </a>
                <a href="/compare-insurance-quotes" className="megamenu__item megamenu__item--cta" role="menuitem">
                  <div className="megamenu__title">Compare Quotes Now</div>
                  <p className="megamenu__description">Takes less than 30 seconds</p>
                </a>
              </div>

            </div>
          </div>
        </div>
        
        {/* Learn Mega Menu Content */}
        <div className="megamenu" id="learnMegaMenu" role="menu">
          <div className="layout__container">
            <div className="layout__grid">
              <div className="layout__grid-item layout__grid-item--md-third">
                <a href="/life-insurance#what-is-life-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">What Is Life Insurance</div>
                  <p className="megamenu__description">Essential coverage concepts</p>
                </a>
                <a href="/life-insurance#types-of-life-insurance" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Types of Life Insurance</div>
                  <p className="megamenu__description">Compare policy options</p>
                </a>
                <a href="/life-insurance/what-is-term-life-insurance#term-vs-whole-comparison" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Term vs Whole Life</div>
                  <p className="megamenu__description">Which is right for you?</p>
                </a>
              </div>
              
              <div className="layout__grid-item layout__grid-item--md-third">
                <a href="/life-insurance/whole-life-insurance#what-is-whole-life" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">What is Whole Life Insurance</div>
                  <p className="megamenu__description">Understanding whole life insurance</p>
                </a>
                <a href="/life-insurance#coverage-needs" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Insurance Calculator</div>
                  <p className="megamenu__description">How much coverage do you need?</p>
                </a>
                <a href="/life-insurance#application-process" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Application Process</div>
                  <p className="megamenu__description">What to expect when applying</p>
                </a>
              </div>
              
              <div className="layout__grid-item layout__grid-item--md-third">
                <a href="/#guides-resources" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Guides &amp; Resources</div>
                  <p className="megamenu__description">In-depth articles and tools</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* About Mega Menu Content */}
        <div className="megamenu" id="aboutMegaMenu" role="menu">
          <div className="layout__container">
            <div className="layout__grid">
              <div className="layout__grid-item layout__grid-item--md-half">
                <a href="/about-us" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">About Us</div>
                  <p className="megamenu__description">Our mission and team</p>
                </a>
                <a href="/licensing-and-trust" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Licensing &amp; Trust</div>
                  <p className="megamenu__description">Our certifications and security</p>
                </a>
              </div>
              
              <div className="layout__grid-item layout__grid-item--md-half">
                <a href="/about-us#contact" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Contact Us</div>
                  <p className="megamenu__description">Get in touch with our team</p>
                </a>
                <a href="/#our-insurance-partners" className="megamenu__item" role="menuitem">
                  <div className="megamenu__title">Our Insurance Partners</div>
                  <p className="megamenu__description">The companies we work with</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div className="mobilemenu__backdrop" id="mobileMenuBackdrop"></div>

      {/* Mobile Menu */}
      <div className="mobilemenu" id="mobileNav">
        <div className="layout__container mobilemenu__container">
          {/* Insurance Types Mobile */}
          <div className="mobilemenu__section">
            <button
              className="mobilemenu__toggle"
              id="insuranceTypesMobileToggle"
              aria-expanded="false"
              aria-controls="insuranceTypesMenu"
            >
              <span>Insurance Types</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="mobilemenu__arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="mobilemenu__submenu" id="insuranceTypesMenu">
              <a href="/life-insurance/what-is-term-life-insurance" className="mobilemenu__link">Term Life</a>
              <a href="/life-insurance/whole-life-insurance" className="mobilemenu__link">Whole Life</a>
              <a href="/life-insurance/mortgage-insurance" className="mobilemenu__link">Mortgage</a>
              <a href="/life-insurance/critical-illness-insurance" className="mobilemenu__link">Critical Illness</a>
              <a href="/life-insurance" className="mobilemenu__link">Life Insurance</a>
            </div>
          </div>

          {/* Learn Mobile */}
          <div className="mobilemenu__section">
            <button
              className="mobilemenu__toggle"
              id="learnMobileToggle"
              aria-expanded="false"
              aria-controls="learnMenu"
            >
              <span>Learn</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="mobilemenu__arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="mobilemenu__submenu" id="learnMenu">
              <a href="/life-insurance#what-is-life-insurance" className="mobilemenu__link">What Is Life Insurance</a>
              <a href="/life-insurance#types-of-life-insurance" className="mobilemenu__link">Types of Life Insurance</a>
              <a href="/life-insurance/what-is-term-life-insurance#term-vs-whole-comparison" className="mobilemenu__link">Term vs Whole Life</a>
              <a href="/life-insurance/whole-life-insurance#what-is-whole-life" className="mobilemenu__link">What is Whole Life Insurance</a>
              <a href="/life-insurance#coverage-needs" className="mobilemenu__link">Insurance Calculator</a>
              <a href="/life-insurance#application-process" className="mobilemenu__link">Application Process</a>
              <a href="/#guides-resources" className="mobilemenu__link">Guides &amp; Resources</a>
            </div>
          </div>
          
          {/* About Mobile */}
          <div className="mobilemenu__section">
            <button
              className="mobilemenu__toggle"
              id="aboutMobileToggle"
              aria-expanded="false"
              aria-controls="aboutMenu"
            >
              <span>About</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="mobilemenu__arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="mobilemenu__submenu" id="aboutMenu">
              <a href="/about-us" className="mobilemenu__link">About Us</a>
              <a href="/about-us#contact" className="mobilemenu__link">Contact Us</a>
              <a href="/licensing-and-trust" className="mobilemenu__link">Licensing &amp; Trust</a>
              <a href="/#our-insurance-partners" className="mobilemenu__link">Our Insurance Partners</a>
            </div>
          </div>
          
          {/* Mobile CTA Buttons */}
          <div className="mobilemenu__actions">
            <a href="https://policyscanner.zohobookings.com/#/policyscanner" className="button button--outline button--navbar">Schedule a Call</a>
            <a href="/compare-insurance-quotes" className="button button--primary button--navbar">Compare Quotes Now</a>
          </div>
        </div>
      </div>
    </>
  )
}
