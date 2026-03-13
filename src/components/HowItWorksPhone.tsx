'use client'

function callNextScreen() {
  if (typeof window !== 'undefined') {
    ;(window as any).nextScreen?.()
  }
}

export default function HowItWorksPhone() {
  return (
    <div className="howitworks__phone-container">
      <div className="howitworks__phone">
        <div className="howitworks__phone-frame">

          {/* Physical Buttons */}
          <div className="howitworks__phone-button howitworks__phone-button--power"></div>
          <div className="howitworks__phone-button howitworks__phone-button--volume-up"></div>
          <div className="howitworks__phone-button howitworks__phone-button--volume-down"></div>

          {/* Premium Light Reflections */}
          <div className="howitworks__phone-reflection howitworks__phone-reflection--edge"></div>
          <div className="howitworks__phone-reflection howitworks__phone-reflection--corner"></div>
          <div className="howitworks__phone-reflection howitworks__phone-reflection--surface"></div>

          {/* Screen Container */}
          <div className="howitworks__phone-screen">

            {/* Dynamic Island */}
            <div className="howitworks__phone-island">
              <div className="howitworks__phone-camera"></div>
              <div className="howitworks__phone-speaker"></div>
            </div>

            {/* Screen Content Container */}
            <div className="howitworks__phone-content">

              {/* Screen 1: Insurance Type Selection */}
              <div className="howitworks__screen howitworks__screen--active" data-screen="1">
                <div className="howitworks__status-bar">
                  <div className="howitworks__status-left"><span className="howitworks__time">9:41</span></div>
                  <div className="howitworks__status-right">
                    <div className="howitworks__signal"></div>
                    <div className="howitworks__wifi"></div>
                    <div className="howitworks__battery"><div className="howitworks__battery-level"></div></div>
                  </div>
                </div>
                <div className="howitworks__app-header">
                  <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746833395/policyscanner-logo_wjm5hq.webp" alt="PolicyScanner" className="howitworks__app-logo" width="120" height="24" loading="lazy" />
                  <div className="howitworks__app-progress"><div className="howitworks__progress-bar"></div></div>
                </div>
                <div className="howitworks__screen-content">
                  <h2 className="howitworks__screen-title">Select your insurance type</h2>
                  <div className="howitworks__options">
                    <div className="howitworks__option howitworks__option--selected">
                      <div className="howitworks__option-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                      </div>
                      <span className="howitworks__option-text">Term Life</span>
                    </div>
                    <div className="howitworks__option">
                      <div className="howitworks__option-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <span className="howitworks__option-text">Whole Life</span>
                    </div>
                    <div className="howitworks__option">
                      <div className="howitworks__option-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        </svg>
                      </div>
                      <span className="howitworks__option-text">Mortgage</span>
                    </div>
                  </div>
                  <button className="howitworks__continue-btn" onClick={callNextScreen} type="button">
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Screen 2: Coverage Amount & DOB */}
              <div className="howitworks__screen" data-screen="2">
                <div className="howitworks__status-bar">
                  <div className="howitworks__status-left"><span className="howitworks__time">9:41</span></div>
                  <div className="howitworks__status-right">
                    <div className="howitworks__signal"></div>
                    <div className="howitworks__wifi"></div>
                    <div className="howitworks__battery"><div className="howitworks__battery-level"></div></div>
                  </div>
                </div>
                <div className="howitworks__app-header">
                  <img src="https://res.cloudinary.com/dafclxaa8/image/upload/v1746833395/policyscanner-logo_wjm5hq.webp" alt="PolicyScanner" className="howitworks__app-logo" width="120" height="24" loading="lazy" />
                  <div className="howitworks__app-progress"><div className="howitworks__progress-bar" style={{width: '100%'}}></div></div>
                </div>
                <div className="howitworks__screen-content">
                  <h2 className="howitworks__screen-title">Almost there! Let&apos;s find your best rates</h2>
                  <div className="howitworks__form">
                    <div className="howitworks__form-group">
                      <label className="howitworks__form-label">How much coverage do you need?</label>
                      <select className="howitworks__form-select" defaultValue="$1M">
                        <option value="$100,000">$100,000</option>
                        <option value="$250,000">$250,000</option>
                        <option value="$500,000">$500,000</option>
                        <option value="$1M">$1M</option>
                        <option value="$2M">$2M</option>
                      </select>
                      <small className="howitworks__form-help">Most people choose $500k–$1M</small>
                    </div>
                    <div className="howitworks__form-group">
                      <label className="howitworks__form-label">Date of birth</label>
                      <div className="howitworks__form-row">
                        <input type="text" className="howitworks__form-input" defaultValue="15" placeholder="DD" readOnly />
                        <input type="text" className="howitworks__form-input" defaultValue="06" placeholder="MM" readOnly />
                        <input type="text" className="howitworks__form-input" defaultValue="2003" placeholder="YYYY" readOnly />
                      </div>
                      <div className="howitworks__form-info">
                        Insurance Age: <strong>22</strong>
                      </div>
                    </div>
                  </div>
                  <button className="howitworks__continue-btn" onClick={callNextScreen} type="button">
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Screen 3: Quote Results */}
              <div className="howitworks__screen" data-screen="3">
                <div className="howitworks__status-bar">
                  <div className="howitworks__status-left"><span className="howitworks__time">9:41</span></div>
                  <div className="howitworks__status-right">
                    <div className="howitworks__signal"></div>
                    <div className="howitworks__wifi"></div>
                    <div className="howitworks__battery"><div className="howitworks__battery-level"></div></div>
                  </div>
                </div>
                <div className="howitworks__quote-header">
                  <div className="howitworks__quote-brand">
                    <div className="howitworks__quote-logo">PS</div>
                  </div>
                  <div className="howitworks__quote-info">
                    <span className="howitworks__quote-coverage">$1M Coverage • 10 Years</span>
                  </div>
                </div>
                <div className="howitworks__quote-results">
                  <div className="howitworks__quote-card howitworks__quote-card--best">
                    <div className="howitworks__quote-company">
                      <img src="https://www.compulifeapi.com/images/logosapicanada/ASSU-small.png" alt="Assumption Life" className="howitworks__company-logo" width="80" height="30" loading="lazy" />
                      <div className="howitworks__best-badge">Best Value</div>
                    </div>
                    <div className="howitworks__quote-price">
                      <span className="howitworks__price">$28.50</span>
                      <span className="howitworks__period">per month</span>
                    </div>
                  </div>
                  <div className="howitworks__quote-features">
                    <div className="howitworks__feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Automatic Renewal</span>
                    </div>
                    <div className="howitworks__feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Conversion Privilege</span>
                    </div>
                  </div>
                  <button className="howitworks__get-rate-btn" onClick={callNextScreen} type="button">
                    Get This Rate
                  </button>
                </div>
              </div>

              {/* Screen 4: Completion */}
              <div className="howitworks__screen howitworks__screen--completion" data-screen="4">
                <div className="howitworks__completion">
                  <div className="howitworks__completion-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h2 className="howitworks__completion-title">Quote Complete!</h2>
                  <p className="howitworks__completion-text">Ready to get started with your personalized quote?</p>
                </div>
              </div>

            </div>

            {/* Home Indicator */}
            <div className="howitworks__phone-indicator"></div>

          </div>
        </div>
      </div>
    </div>
  )
}
