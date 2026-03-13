'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export default function AboutPage() {
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    await fetch('/api/contact', { method: 'POST', body: data })
    setSuccess(true)
    form.reset()
  }

  return (
    <PublicLayout extraCss={['/css/about.css']}>
      <div className="demo-container">
        <section className="about-hero">
          <div className="about-hero__container">
            <div className="about-hero__content">
              <div className="about-hero__text">
                <h1>About Us</h1>
              </div>
              <div className="about-hero__image">
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747840466/why-choose-us-2_dbopfz.webp" alt="PolicyScanner team helping Canadian families with insurance" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="story-container">
            <div className="story-content">
              <div className="story-text">
                <h2>Our Story</h2>
                <p>Finding life insurance in Canada shouldn&apos;t mean spending hours on the phone with different brokers or jumping between dozens of websites. That&apos;s why we built PolicyScanner.ca.</p>
                <p>We connect you directly with 20+ leading Canadian insurers in one place. Get real-time quotes, compare your options side-by-side, and make decisions with confidence&mdash;no sales pressure, no runaround.</p>
                <p>It&apos;s insurance shopping the way it should be: straightforward, transparent, and built for Canadians.</p>
              </div>
              <div className="story-image">
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747789035/life-insurance-link-card_kwfd4t.webp" alt="PolicyScanner life insurance comparison platform" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="different-section" id="who-we-are">
          <div className="story-container">
            <div className="story-content">
              <div className="story-text">
                <h2>How We&apos;re Different</h2>
                <h3>Comparison Shopping Made Simple</h3>
                <p>No need to visit multiple broker websites or fill out repetitive forms. Our modern platform lets you compare quotes from 20+ leading Canadian insurance companies side by side in under 30 seconds. Already have coverage? We can help you re-shop your policy to find better rates.</p>
                <h3>Advice That Puts You First</h3>
                <p>With licensed insurance professionals available and comprehensive educational resources, we provide answers whether you prefer speaking with someone directly or researching independently. Our guidance focuses on your needs, not our quotas.</p>
                <h3>How We Make Money</h3>
                <p>As an independent insurance broker, we earn commissions from insurance companies when you purchase a policy. These commissions are already built into insurance pricing, so working with us costs you nothing extra. We don&apos;t favor specific insurers based on commission rates&mdash;our recommendations are based solely on what works best for your situation.</p>
              </div>
              <div className="story-image">
                <img src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1747789036/term-life-insurance-link-card_fb28rx.webp" alt="PolicyScanner term life insurance comparison" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-container">
            <div className="trust-section__intro u-text-center">
              <h2>Your Security Is Our Priority</h2>
              <p className="text-large">In an industry where many companies profit from selling your personal information, we take a different approach. Your data security and privacy aren&apos;t just features&mdash;they&apos;re fundamental to who we are.</p>
              <p>We use industry-standard encryption, secure data storage, and strict access controls to protect your personal information. Unlike lead generation platforms, we never sell your data to third parties or spam you with unwanted calls from multiple brokers.</p>
            </div>
            <div className="trust-features">
              <div className="trust-feature">
                <div className="trust-feature__icon trust-feature__icon--teal">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div className="trust-feature__content">
                  <h4>SSL Encryption</h4>
                  <p className="text-small">Industry-standard security protocols protect all data transmission and storage.</p>
                </div>
              </div>
              <div className="trust-feature">
                <div className="trust-feature__icon trust-feature__icon--orange">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M4.93 4.93l14.14 14.14"></path>
                  </svg>
                </div>
                <div className="trust-feature__content">
                  <h4>No Data Sales</h4>
                  <p className="text-small">Your personal information is never sold to third parties or lead brokers.</p>
                </div>
              </div>
              <div className="trust-feature">
                <div className="trust-feature__icon trust-feature__icon--teal">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="trust-feature__content">
                  <h4>Privacy Compliant</h4>
                  <p className="text-small">Full compliance with PIPEDA and Canadian privacy regulations.</p>
                </div>
              </div>
              <div className="trust-feature">
                <div className="trust-feature__icon trust-feature__icon--orange">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
                  </svg>
                </div>
                <div className="trust-feature__content">
                  <h4>Secure Infrastructure</h4>
                  <p className="text-small">Modern security architecture with multiple layers of protection systems.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="licensing-section">
          <div className="trust-container">
            <div className="licensing-section__intro u-text-center">
              <h2>Licensed &amp; Regulated</h2>
              <p className="text-large">PolicyScanner operates as a licensed insurance brokerage, regulated by provincial insurance authorities across Canada. We maintain all required licenses and comply with Canadian insurance regulations to protect consumers.</p>
            </div>
            <div className="licensing-content">
              <p className="licensing-text">PolicyScanner operates as a licensed insurance brokerage in provinces across Canada, with all team members holding appropriate provincial licenses and maintaining full compliance with Canadian insurance regulations and consumer protection requirements.</p>
              <p className="licensing-text">We comply with all Canadian privacy laws including PIPEDA, ensuring your personal information is handled with the highest standards of security and privacy protection.</p>
            </div>

            <div className="contact-container" id="contact">
              <div className="contact-content">
                <h2>Contact Us</h2>
                <p>Have questions? We&apos;re here to help. Send us a message and we&apos;ll get back to you within 24 hours.</p>
                <form className="contact-form" onSubmit={handleSubmit}>
                  {success && (
                    <div style={{color: '#3c763d', backgroundColor: '#dff0d8', borderColor: '#d6e9c6', padding: '15px', marginBottom: '20px', border: '1px solid transparent', borderRadius: '4px'}}>
                      <strong>Success!</strong> Your message has been sent.
                    </div>
                  )}
                  <input type="text" name="name" placeholder="Your Name" required />
                  <input type="email" name="email" placeholder="Your Email" required />
                  <input type="text" name="subject" placeholder="Subject" required />
                  <textarea name="message" placeholder="Your Message" required></textarea>
                  <button type="submit">Send Message</button>
                </form>
                <div className="contact-legal">
                  <div className="contact-legal-links">
                    <a href="/privacy-policy" className="contact-legal-link">Privacy Policy</a>
                    <a href="/terms-of-service" className="contact-legal-link">Terms of Service</a>
                    <a href="/licensing-and-trust" className="contact-legal-link">Licensing Information</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
