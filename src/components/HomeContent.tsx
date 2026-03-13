import HowItWorksPhone from './HowItWorksPhone'

function StarIcon({ first = false }: { first?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={!first}
      {...(first ? { 'aria-label': '5 star rating' } : {})}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function StarsSection() {
  return (
    <div className="insurance-reviews-component__credentials">
      <div className="insurance-reviews-component__verification">
        <img
          src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1752290506/verified_custoemr_hbv2ly.png"
          alt="Verified Customer"
          className="insurance-reviews-component__check-icon"
          width="16" height="16"
          loading="lazy"
        />
        <span className="insurance-reviews-component__verified">Verified Customer</span>
      </div>
      <div className="insurance-reviews-component__stars" role="img" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} first={i === 0} />
        ))}
      </div>
    </div>
  )
}

export default function HomeContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero layout__section">
        <div className="hero__background">
          <picture>
            <source media="(min-width:1920px)" srcSet="https://res.cloudinary.com/dafclxaa8/image/upload/q_auto,f_auto,w_1920/v1746832704/life-insurance-comparison-canada-1920x650_njurrx.webp" type="image/webp" />
            <source media="(min-width:1200px)" srcSet="https://res.cloudinary.com/dafclxaa8/image/upload/q_auto,f_auto,w_1440/v1746832704/life-insurance-comparison-canada-1440x650_xk60iq.webp" type="image/webp" />
            <source media="(min-width:992px)" srcSet="https://res.cloudinary.com/dafclxaa8/image/upload/q_auto,f_auto,w_1024/v1746832704/life-insurance-comparison-canada-1024x650_arcfmg.webp" type="image/webp" />
            <img src="https://res.cloudinary.com/dafclxaa8/image/upload/q_auto,f_auto,w_640/v1746832704/life-insurance-comparison-canada-640x700_joqvcv.webp" alt="Life Insurance Comparison in Canada" className="hero__image" width="640" height="700" loading="eager" fetchPriority="high" />
          </picture>
        </div>
        <div className="layout__container hero__container">
          <div className="layout__grid">
            <div className="layout__grid-item layout__grid-item--full layout__grid-item--md-two-thirds layout__grid-item--lg-two-thirds">
              <div className="hero__content">
                <h1 className="text-white">
                  <span className="hero__title-line">A simple way to buy life insurance</span>
                </h1>
                <p className="text-large text-white hero__description">Compare, buy and save on life insurance rates instantly</p>
                <a href="/compare-insurance-quotes" className="button button--primary button--mobile-hero hero__cta">Compare Quotes Now</a>
                <div className="hero__trust text-small text-white">
                  <div className="hero__trust-item">
                    <svg className="hero__trust-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Best Rate Guarantee
                  </div>
                  <div className="hero__trust-separator">•</div>
                  <div className="hero__trust-item">
                    <svg className="hero__trust-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    30-Second Quote Process
                  </div>
                  <div className="hero__trust-separator">•</div>
                  <div className="hero__trust-item">
                    <svg className="hero__trust-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    100% free
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar" aria-label="Featured publications">
        <div className="trust-bar__container">
          <div className="trust-bar__mobile">
            <div className="trust-bar__scroll">
              <span className="trust-bar__label-mobile">Featured in</span>
              <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747883953/business-insider-2_ddotxz.svg" alt="Business Insider" className="trust-bar__logo-mobile" width="80" height="20" loading="lazy" />
              <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747275149/ctv-logo-2018_pehrck.svg" alt="CTV" className="trust-bar__logo-mobile" width="45" height="20" loading="lazy" />
              <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747275149/google-news-icon_sqtmtb.svg" alt="Google News" className="trust-bar__logo-mobile" width="80" height="20" loading="lazy" />
              <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747275149/the_globe_and_mail_htaxsj.svg" alt="The Globe and Mail" className="trust-bar__logo-mobile" width="80" height="20" loading="lazy" />
            </div>
          </div>
          <div className="trust-bar__desktop">
            <div className="trust-bar__content">
              <span className="trust-bar__label-desktop">Trusted by leading publications</span>
              <div className="trust-bar__logos">
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747883953/business-insider-2_ddotxz.svg" alt="Business Insider" className="trust-bar__logo-desktop trust-bar__logo-desktop--bi" width="160" height="36" loading="lazy" />
                <span className="trust-bar__dot" aria-hidden="true"></span>
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747275149/ctv-logo-2018_pehrck.svg" alt="CTV" className="trust-bar__logo-desktop trust-bar__logo-desktop--ctv" width="72" height="28" loading="lazy" />
                <span className="trust-bar__dot" aria-hidden="true"></span>
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747275149/google-news-icon_sqtmtb.svg" alt="Google News" className="trust-bar__logo-desktop trust-bar__logo-desktop--gnews" width="170" height="38" loading="lazy" />
                <span className="trust-bar__dot" aria-hidden="true"></span>
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747275149/the_globe_and_mail_htaxsj.svg" alt="The Globe and Mail" className="trust-bar__logo-desktop trust-bar__logo-desktop--globe" width="150" height="32" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="layout__container">
          <div className="why-choose-us__content">
            <h2 className="why-choose-us__title">Why Canadians Trust PolicyScanner</h2>
            <div className="why-choose-us__features-group why-choose-us__features-group--primary">
              <div className="why-choose-us__feature">
                <h3 className="why-choose-us__feature-title">Built by Canadians, for Canadians</h3>
                <p className="why-choose-us__feature-description">Local expertise you can trust. We understand what matters most for your life insurance journey.</p>
              </div>
              <div className="why-choose-us__feature">
                <h3 className="why-choose-us__feature-title">Security you can trust</h3>
                <p className="why-choose-us__feature-description">We never sell your data. While many others operate as lead generation companies, we don&apos;t.</p>
              </div>
            </div>
            <div className="why-choose-us__features-group why-choose-us__features-group--secondary">
              <div className="why-choose-us__feature">
                <h3 className="why-choose-us__feature-title">Compare 20+ insurers, for free</h3>
                <p className="why-choose-us__feature-description">Real rates from top Canadian insurers. No limitations, partnerships, or hidden fees.</p>
              </div>
              <div className="why-choose-us__feature">
                <h3 className="why-choose-us__feature-title">Licensed Advisors, not sales agents</h3>
                <p className="why-choose-us__feature-description">Our advisors help you find coverage, not hit quotas. Genuine advice for Canadians.</p>
              </div>
            </div>
            <div className="why-choose-us__image-container">
              <picture>
                <source media="(min-width: 1200px)" srcSet="https://res.cloudinary.com/dy4lolmvf/image/upload/w_640,h_360,c_fill,q_auto,f_auto/v1747840466/why-choose-us-2_dbopfz.webp" type="image/webp" width="640" height="360" />
                <source media="(min-width: 992px)" srcSet="https://res.cloudinary.com/dy4lolmvf/image/upload/w_570,h_322,c_fill,q_auto,f_auto/v1747840466/why-choose-us-2_dbopfz.webp" type="image/webp" width="570" height="322" />
                <source media="(min-width: 768px)" srcSet="https://res.cloudinary.com/dy4lolmvf/image/upload/w_480,h_270,c_fill,q_auto,f_auto/v1747840541/why-choose-us-mob_hcxwwp.webp" type="image/webp" width="480" height="270" />
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/w_360,h_204,c_fill,q_auto,f_auto/v1747840541/why-choose-us-mob_hcxwwp.webp" alt="Why Canadians trust PolicyScanner" className="why-choose-us__image" loading="lazy" width="360" height="204" />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="howitworks layout__section" aria-label="How It Works">
        <div className="layout__container">
          <div className="layout__grid">

            {/* Left Column: Content */}
            <div className="layout__grid-item layout__grid-item--lg-half">

              <div className="howitworks__left">
                <span className="howitworks__eyebrow">How It Works</span>
                <h2 className="howitworks__title">Get covered in<br />3 simple steps</h2>

                <ol className="howitworks__steps-list">
                  <li className="howitworks__step-item">
                    <div className="howitworks__step-num" aria-hidden="true">01</div>
                    <div className="howitworks__step-body">
                      <div className="howitworks__step-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div className="howitworks__step-text">
                        <h3 className="howitworks__step-title">Tell us about yourself</h3>
                        <p className="howitworks__step-desc">Answer a few quick questions — takes under 30 seconds</p>
                      </div>
                    </div>
                  </li>
                  <li className="howitworks__step-item">
                    <div className="howitworks__step-num" aria-hidden="true">02</div>
                    <div className="howitworks__step-body">
                      <div className="howitworks__step-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>
                      </div>
                      <div className="howitworks__step-text">
                        <h3 className="howitworks__step-title">Compare real quotes</h3>
                        <p className="howitworks__step-desc">See side-by-side rates from 20+ top Canadian insurers instantly</p>
                      </div>
                    </div>
                  </li>
                  <li className="howitworks__step-item">
                    <div className="howitworks__step-num" aria-hidden="true">03</div>
                    <div className="howitworks__step-body">
                      <div className="howitworks__step-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><polyline points="9 12 11 14 15 10"/></svg>
                      </div>
                      <div className="howitworks__step-text">
                        <h3 className="howitworks__step-title">Choose your policy</h3>
                        <p className="howitworks__step-desc">Pick the best plan and get covered — no agents, no pressure</p>
                      </div>
                    </div>
                  </li>
                </ol>

                <div className="howitworks__trust-row" aria-label="Key benefits">
                  <div className="howitworks__trust-pill">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    Best rate guarantee
                  </div>
                  <div className="howitworks__trust-pill">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    20+ insurers
                  </div>
                  <div className="howitworks__trust-pill">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    100% free
                  </div>
                </div>

                <a href="/compare-insurance-quotes" className="button button--primary howitworks__cta">
                  Compare Quotes Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>

            </div>

            {/* Right Column: Phone Mockup */}
            <div className="layout__grid-item layout__grid-item--lg-half">
              <HowItWorksPhone />

            </div>

          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="insurance-reviews-component" id="insurance-reviews-1">
        <div className="insurance-reviews-component__container">
          <header className="insurance-reviews-component__header">
            <h2 className="insurance-reviews-component__title">Real Stories from Real Canadians</h2>
          </header>
          <div className="insurance-reviews-component__carousel">
            <div className="insurance-reviews-component__wrapper" role="region" aria-label="Customer reviews carousel">
              <div className="insurance-reviews-component__track" role="list">

                <article className="insurance-reviews-component__card" role="listitem" aria-labelledby="reviewer-1">
                  <div className="insurance-reviews-component__content">
                    <div className="insurance-reviews-component__author">
                      <div className="insurance-reviews-component__author-info">
                        <h3 id="reviewer-1" className="insurance-reviews-component__name">Peter Winters</h3>
                        <StarsSection />
                      </div>
                    </div>
                    <p className="insurance-reviews-component__text">&ldquo;As someone new to life insurance, their educational resources were invaluable. The guides explained complex terms simply, and their support team answered all my questions patiently.&rdquo;</p>
                  </div>
                </article>

                <article className="insurance-reviews-component__card" role="listitem" aria-labelledby="reviewer-2">
                  <div className="insurance-reviews-component__content">
                    <div className="insurance-reviews-component__author">
                      <div className="insurance-reviews-component__author-info">
                        <h3 id="reviewer-2" className="insurance-reviews-component__name">Sarah Parker</h3>
                        <StarsSection />
                      </div>
                    </div>
                    <p className="insurance-reviews-component__text">&ldquo;Very impressed with the range of insurance providers available. Found options I hadn&apos;t considered before, and their unbiased comparisons helped me choose the best policy for my family.&rdquo;</p>
                  </div>
                </article>

                <article className="insurance-reviews-component__card" role="listitem" aria-labelledby="reviewer-3">
                  <div className="insurance-reviews-component__content">
                    <div className="insurance-reviews-component__author">
                      <div className="insurance-reviews-component__author-info">
                        <h3 id="reviewer-3" className="insurance-reviews-component__name">Michael Chen</h3>
                        <StarsSection />
                      </div>
                    </div>
                    <p className="insurance-reviews-component__text">&ldquo;The comparison tool saved me hours of research. Clean interface, detailed breakdowns, and no hidden fees. Highly recommend for anyone shopping for insurance.&rdquo;</p>
                  </div>
                </article>

                <article className="insurance-reviews-component__card" role="listitem" aria-labelledby="reviewer-4">
                  <div className="insurance-reviews-component__content">
                    <div className="insurance-reviews-component__author">
                      <div className="insurance-reviews-component__author-info">
                        <h3 id="reviewer-4" className="insurance-reviews-component__name">Jennifer Rodriguez</h3>
                        <StarsSection />
                      </div>
                    </div>
                    <p className="insurance-reviews-component__text">&ldquo;Fantastic customer service! They walked me through the entire process and helped me understand the different policy options. Made insurance shopping stress-free.&rdquo;</p>
                  </div>
                </article>

                <article className="insurance-reviews-component__card" role="listitem" aria-labelledby="reviewer-5">
                  <div className="insurance-reviews-component__content">
                    <div className="insurance-reviews-component__author">
                      <div className="insurance-reviews-component__author-info">
                        <h3 id="reviewer-5" className="insurance-reviews-component__name">David Thompson</h3>
                        <StarsSection />
                      </div>
                    </div>
                    <p className="insurance-reviews-component__text">&ldquo;Quick and efficient process. Got multiple quotes in minutes and found coverage that fit my budget perfectly. The platform is intuitive and user-friendly.&rdquo;</p>
                  </div>
                </article>

                <article className="insurance-reviews-component__card" role="listitem" aria-labelledby="reviewer-6">
                  <div className="insurance-reviews-component__content">
                    <div className="insurance-reviews-component__author">
                      <div className="insurance-reviews-component__author-info">
                        <h3 id="reviewer-6" className="insurance-reviews-component__name">Lisa Anderson</h3>
                        <StarsSection />
                      </div>
                    </div>
                    <p className="insurance-reviews-component__text">&ldquo;Transparent pricing and no surprises. They clearly explained all the terms and conditions, and I felt confident in my decision. Great experience overall!&rdquo;</p>
                  </div>
                </article>

              </div>
            </div>
            <nav className="insurance-reviews-component__indicators" role="tablist" aria-label="Review navigation">
              <button className="insurance-reviews-component__dot insurance-reviews-component__dot--active" role="tab" aria-selected={true} aria-label="View review 1" data-index={0}></button>
              <button className="insurance-reviews-component__dot" role="tab" aria-selected={false} aria-label="View review 2" data-index={1}></button>
              <button className="insurance-reviews-component__dot" role="tab" aria-selected={false} aria-label="View review 3" data-index={2}></button>
              <button className="insurance-reviews-component__dot" role="tab" aria-selected={false} aria-label="View review 4" data-index={3}></button>
              <button className="insurance-reviews-component__dot" role="tab" aria-selected={false} aria-label="View review 5" data-index={4}></button>
              <button className="insurance-reviews-component__dot" role="tab" aria-selected={false} aria-label="View review 6" data-index={5}></button>
            </nav>
          </div>
          <footer className="insurance-reviews-component__cta">
            <a href="/compare-insurance-quotes" className="button button--primary button--large" role="button">Get Your Free Quote</a>
          </footer>
        </div>
      </section>

      {/* Partners */}
      <section className="partners layout__section">
        <div className="layout__container">

          <div className="partners__header u-text-center">
            <h2>Compare 20+ Top Insurers in One Place</h2>
            <p className="text-secondary">Working with Canada&apos;s top insurance providers to find you the best coverage</p>
          </div>

          <div className="partners__grid" id="partnersGrid">

            {/* Always visible (6) */}
            <div className="partners__card">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841454/the-manufacturers-life-insurance-company_khfgho.webp" alt="Manulife" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841449/desjardins-financial-security_qbpmug.webp" alt="Desjardins Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841446/assumption-mutual-life-insurance-company_mggxkh.webp" alt="Assumption Life" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841453/the-canada-life-assurance-company_tn7ojx.webp" alt="Canada Life" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841447/bmo-life-assurance-company_oolost.webp" alt="BMO Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841452/sun-life-assurance-company-of-canada_bsrktt.webp" alt="Sun Life" className="partners__logo" loading="lazy" />
            </div>

            {/* Expandable partners (shown on mobile when toggled) */}
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841448/cooperators-life-insurance_fuexcq.webp" alt="Co-operators Life Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841451/rbc-life-insurance-company_k3vpbx.webp" alt="RBC Life Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841451/ivari1_qfp63g.webp" alt="Ivari" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841450/humania-assurance-inc_dwakdl.webp" alt="Humania Assurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841450/foresters-life-insurance-company_y7w0gn.webp" alt="Foresters Life Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841449/equitable-life-insurance-co-of-canada_dsgvyv.webp" alt="Equitable Life Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841448/canada-protection-plan-foresters-life_awgo1x.webp" alt="Canada Protection Plan" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841447/beneva-la-capitalessq-merger_jds6ym.webp" alt="Beneva" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841447/blue-cross_icobw0.webp" alt="Blue Cross" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841454/uv-insurance_ozzhv5.webp" alt="UV Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841453/the-empire-life-insurance-company_crue0q.webp" alt="Empire Life Insurance" className="partners__logo" loading="lazy" />
            </div>
            <div className="partners__card partners__card--expandable">
              <img src="https://res.cloudinary.com/dafclxaa8/image/upload/w_120,q_85,f_auto/v1746841450/industrial-alliance-life-insurance_pmzwdd.webp" alt="Industrial Alliance" className="partners__logo" loading="lazy" />
            </div>

          </div>

          {/* Show More Button (mobile only) */}
          <div className="partners__toggle u-text-center u-lg-hidden">
            <button className="button button--primary" id="partnersToggle" type="button" aria-expanded={false}>
              <span id="partnersText">Show More Partners</span>
              <svg id="partnersIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* Articles */}
      <section className="articles layout__section">
        <div className="layout__container">

          <header className="articles__header u-text-center">
            <h2 className="articles__title">Insights &amp; Advice for Smarter Insurance Decisions</h2>
            <p className="articles__subtitle text-secondary">
              Explore our core insurance options and get guidance tailored to your needs.
            </p>
          </header>

          <div className="articles__grid layout__grid">

            {/* Featured Article */}
            <div className="layout__grid-item layout__grid-item--full layout__grid-item--lg-half">
              <a href="/learn/insurance-guide" className="articles__link">
                <article className="articles__card articles__card--featured">
                  <div className="articles__image-container articles__image-container--featured">
                    <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746843001/life-insurance-link-card_z2kgr8.webp" alt="Insurance Guide for Canadian Families" className="articles__image" width="800" height="500" loading="lazy" decoding="async" />
                    <div className="articles__overlay"></div>
                    <span className="articles__category articles__category--featured">Guide</span>
                  </div>
                  <div className="articles__content">
                    <h3 className="articles__card-title">Insurance 101: The Complete Guide for Canadian Families</h3>
                    <div className="articles__meta">
                      <span className="articles__date">Updated January 15, 2026</span>
                      <span className="articles__read-time">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="articles__icon">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        12 min read
                      </span>
                    </div>
                    <p className="articles__excerpt">Everything you need to know about choosing the right insurance to protect your family and finances.</p>
                    <span className="articles__cta">
                      Read Complete Guide
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="articles__arrow">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>
                </article>
              </a>
            </div>

            {/* Insurance Types Sub-Grid */}
            <div className="layout__grid-item layout__grid-item--full layout__grid-item--lg-half">
              <div className="articles__sub-grid">

                <div className="articles__sub-item">
                  <a href="/insurance/term-life-insurance" className="articles__link">
                    <article className="articles__card">
                      <div className="articles__image-container">
                        <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746843002/term-life-insurance-link-card_monyuq.webp" alt="Term Life Insurance" className="articles__image" width="800" height="500" loading="lazy" decoding="async" />
                        <div className="articles__overlay"></div>
                        <span className="articles__category">Term</span>
                      </div>
                      <div className="articles__content">
                        <h3 className="articles__card-title">Term Life Insurance</h3>
                        <p className="articles__excerpt">Simple, low-cost coverage to protect your family during critical years like mortgages or raising kids.</p>
                        <span className="articles__cta">
                          Learn More
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="articles__arrow">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      </div>
                    </article>
                  </a>
                </div>

                <div className="articles__sub-item">
                  <a href="/insurance/whole-life-insurance" className="articles__link">
                    <article className="articles__card">
                      <div className="articles__image-container">
                        <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746843002/whole-life-insurance-link-card_usdkz5.webp" alt="Whole Life Insurance" className="articles__image" width="800" height="500" loading="lazy" decoding="async" />
                        <div className="articles__overlay"></div>
                        <span className="articles__category">Whole</span>
                      </div>
                      <div className="articles__content">
                        <h3 className="articles__card-title">Whole Life Insurance</h3>
                        <p className="articles__excerpt">Lifetime protection with cash value growth — ideal for estate planning and lifelong peace of mind.</p>
                        <span className="articles__cta">
                          Learn More
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="articles__arrow">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      </div>
                    </article>
                  </a>
                </div>

                <div className="articles__sub-item">
                  <a href="/insurance/critical-illness-insurance" className="articles__link">
                    <article className="articles__card">
                      <div className="articles__image-container">
                        <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746843000/critical-illness-insurance-link-card_fqap54.webp" alt="Critical Illness Insurance" className="articles__image" width="800" height="500" loading="lazy" decoding="async" />
                        <div className="articles__overlay"></div>
                        <span className="articles__category">Critical Illness</span>
                      </div>
                      <div className="articles__content">
                        <h3 className="articles__card-title">Critical Illness Insurance</h3>
                        <p className="articles__excerpt">Get a tax-free payout if you&apos;re diagnosed with a serious illness — so you can focus on recovery, not bills.</p>
                        <span className="articles__cta">
                          Learn More
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="articles__arrow">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      </div>
                    </article>
                  </a>
                </div>

                <div className="articles__sub-item">
                  <a href="/insurance/mortgage-insurance" className="articles__link">
                    <article className="articles__card">
                      <div className="articles__image-container">
                        <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746843001/mortgage-insurance-link-card_oioxi2.webp" alt="Mortgage Insurance" className="articles__image" width="800" height="500" loading="lazy" decoding="async" />
                        <div className="articles__overlay"></div>
                        <span className="articles__category">Mortgage</span>
                      </div>
                      <div className="articles__content">
                        <h3 className="articles__card-title">Mortgage Insurance</h3>
                        <p className="articles__excerpt">Ensure your home is protected and your loved ones aren&apos;t left with payments in case something happens.</p>
                        <span className="articles__cta">
                          Learn More
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="articles__arrow">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </span>
                      </div>
                    </article>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq layout__section" id="frequently-asked-questions">
        <div className="layout__container">
          <header className="faq__header">
            <h2 className="faq__title">Frequently Asked Questions</h2>
            <p className="faq__subtitle text-secondary">
              Get answers to common questions about life insurance and our services.
            </p>
          </header>
          <div className="faq__list">
            <div className="faq__item">
              <button className="faq__question" type="button" data-faq-target="faq-1" aria-expanded={false} aria-controls="faq-1">
                <span className="faq__question-text">How does PolicyScanner help me find the best life insurance?</span>
                <svg className="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="faq-1" className="faq__answer">
                <div className="faq__answer-content">
                  <p>We use advanced technology to compare policies from over 20 top Canadian insurance providers in real-time. Just answer a few quick questions about yourself and your needs, and we&apos;ll show you side-by-side comparisons of the best options personalized for your situation.</p>
                  <p>Unlike traditional brokers, our digital platform lets you browse at your own pace, with transparent information about coverage details and pricing. When you&apos;re ready to move forward, our licensed advisors are available to answer questions and guide you through the application process.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <button className="faq__question" type="button" data-faq-target="faq-2" aria-expanded={false} aria-controls="faq-2">
                <span className="faq__question-text">Do I need to pay for PolicyScanner&apos;s comparison service?</span>
                <svg className="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="faq-2" className="faq__answer">
                <div className="faq__answer-content">
                  <p>No! Our service is completely free for you to use. We&apos;re compensated by the insurance companies when you purchase a policy through us, but this never affects the price you pay. The rates you see on PolicyScanner are identical to what you&apos;d get directly from the insurer — sometimes even better due to promotions.</p>
                  <p>We believe everyone deserves access to straightforward insurance information without sales pressure or hidden fees.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <button className="faq__question" type="button" data-faq-target="faq-3" aria-expanded={false} aria-controls="faq-3">
                <span className="faq__question-text">What&apos;s the difference between term life and whole life insurance?</span>
                <svg className="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="faq-3" className="faq__answer">
                <div className="faq__answer-content">
                  <p>Term life insurance covers you for a specific period (e.g., 10, 20, or 30 years) and is usually more affordable. Whole life insurance provides lifetime coverage and builds cash value over time. Term is ideal for temporary needs like mortgage protection, while whole life is suited for estate planning and long-term wealth transfer.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <button className="faq__question" type="button" data-faq-target="faq-4" aria-expanded={false} aria-controls="faq-4">
                <span className="faq__question-text">How much life insurance coverage do I need?</span>
                <svg className="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="faq-4" className="faq__answer">
                <div className="faq__answer-content">
                  <p>Many experts suggest 10–15 times your annual income, but your personal situation matters most. Consider factors like:</p>
                  <ul>
                    <li>Income replacement for your family</li>
                    <li>Outstanding debts and mortgage</li>
                    <li>Future costs like education for children</li>
                    <li>Final expenses (funeral, estate settlement)</li>
                  </ul>
                  <p>Our online calculator can help you estimate a coverage amount, or you can speak to a licensed advisor for personalized guidance.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <button className="faq__question" type="button" data-faq-target="faq-5" aria-expanded={false} aria-controls="faq-5">
                <span className="faq__question-text">Can I get life insurance without a medical exam in Canada?</span>
                <svg className="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="faq-5" className="faq__answer">
                <div className="faq__answer-content">
                  <p>Yes! Many insurers offer no-medical or simplified issue life insurance. These plans often require just a few health questions without a physical exam. They&apos;re ideal for quicker approvals or for those who prefer a hassle-free application, although they typically come with slightly higher premiums than fully underwritten policies.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <button className="faq__question" type="button" data-faq-target="faq-6" aria-expanded={false} aria-controls="faq-6">
                <span className="faq__question-text">How long does it take to get approved for life insurance?</span>
                <svg className="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="faq-6" className="faq__answer">
                <div className="faq__answer-content">
                  <p>Approval timelines vary:</p>
                  <ul>
                    <li><strong>Simplified/no-medical policies:</strong> Often approved within 24–48 hours.</li>
                    <li><strong>Fully underwritten policies:</strong> Typically 2–6 weeks, depending on health and coverage.</li>
                  </ul>
                  <p>At PolicyScanner, we&apos;ll keep you updated every step of the way and work to minimize any delays.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
