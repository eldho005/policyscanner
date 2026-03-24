import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-footer-text pt-16 pb-8 cv-auto">
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-10 mb-13">
          {/* Brand */}
          <div>
            <div className="font-body text-[1.25rem] font-medium text-white mb-3.5 tracking-[-0.01em]">
              Policy<span className="font-bold text-primary">Scanner</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[280px] font-light">
              Canada&apos;s smartest way to compare life insurance. Licensed brokerage helping Canadians find the right coverage.
            </p>
          </div>

          {/* Insurance */}
          <div>
            <h5 className="text-footer-heading text-xs uppercase tracking-[0.1em] mb-4.5 font-semibold">Insurance</h5>
            <ul className="space-y-3.5">
              <li><Link href="/insurance/term-life" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Term Life</Link></li>
              <li><Link href="/insurance/whole-life" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Whole Life</Link></li>
              <li><Link href="/insurance/critical-illness" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Critical Illness</Link></li>
              <li><Link href="/insurance/mortgage" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Mortgage</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-footer-heading text-xs uppercase tracking-[0.1em] mb-4.5 font-semibold">Resources</h5>
            <ul className="space-y-3.5">
              <li><Link href="/insights/term-vs-whole-life-insurance-canada" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Blog</Link></li>
              <li><Link href="/calculator" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Calculators</Link></li>
              <li><Link href="/insights/how-much-life-insurance-coverage-do-you-need" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Guides</Link></li>
              <li><Link href="/#faq" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-footer-heading text-xs uppercase tracking-[0.1em] mb-4.5 font-semibold">Company</h5>
            <ul className="space-y-3.5">
              <li><Link href="/about" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Contact</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Careers</Link></li>
              <li><Link href="/about" className="text-sm hover:text-footer-hover transition-colors py-1 inline-block">Partners</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-footer-border pt-6 pb-2">
          <p className="text-[0.72rem] leading-relaxed text-footer-text/60 mb-5">
            <strong className="text-footer-text/80 font-medium">Disclaimer:</strong> PolicyScanner is a comparison platform and not an insurance provider. We do not offer financial advice. All quotes are subject to change and are based on the information provided at the time of submission. Please consult a licensed advisor for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <span>&copy; 2026 PolicyScanner.ca. All rights reserved.</span>
            <div className="flex gap-7">
              <Link href="/privacy" className="hover:text-footer-hover transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-footer-hover transition-colors">Terms of Service</Link>
              <Link href="/licensing" className="hover:text-footer-hover transition-colors">FSRA #41964M</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
