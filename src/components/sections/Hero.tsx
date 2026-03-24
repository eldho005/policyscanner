import Link from "next/link";
import { Shield, Clock, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-16 pb-12">
      <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-light rounded-full text-xs font-medium text-primary mb-7">
            <Shield size={13} />
            Licensed Canadian Brokerage
          </div>
          <h1 className="font-display text-[3.1rem] max-lg:text-[2.4rem] max-sm:text-[2rem] font-semibold leading-[1.14] tracking-[-0.035em] text-foreground mb-8 opsz-48">
            The best way to buy Life Insurance In Canada
          </h1>
          <div className="flex gap-3.5 mb-5.5">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center max-sm:w-full px-5.5 py-3 bg-primary text-white font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
            >
              Compare Quotes Now
            </Link>

          </div>
          <p className="text-[0.85rem] text-foreground-muted flex items-center gap-1.5">
            <Clock size={12} />
            Takes less than 2 minutes
            <span className="w-[3px] h-[3px] rounded-full bg-foreground-muted mx-1.5" />
            No obligation
          </p>
        </div>

        {/* Visual Card */}
        <div className="relative order-first lg:order-last">
          <div className="w-full h-[420px] max-lg:h-[300px] max-sm:h-[220px] rounded-lg overflow-hidden relative">
            <img
              src="https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_1200/v1774318010/Hero_psdnha.webp"
              alt="Happy mother and child"
              className="w-full h-full object-cover object-top"
              fetchPriority="high"
            />
          </div>

          {/* Floating Card - Top Right */}
          <div className="flex absolute top-6 -right-4 max-lg:right-2 max-sm:-right-2 max-sm:top-3 bg-white rounded-md shadow-lg border border-border-light px-4 py-3 max-sm:px-3 max-sm:py-2 items-center gap-3 max-sm:gap-2">
            <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 rounded-lg bg-accent-green-bg flex items-center justify-center">
              <Check size={16} className="text-accent-green max-sm:!w-[13px] max-sm:!h-[13px]" />
            </div>
            <div>
              <p className="text-xs max-sm:text-[0.68rem] font-semibold text-foreground">Compare 20+ insurers</p>
              <p className="text-[0.7rem] max-sm:text-[0.62rem] text-foreground-muted">100s from $18/mo</p>
            </div>
          </div>

          {/* Floating Card - Bottom Left */}
          <div className="block absolute bottom-6 -left-4 max-lg:left-2 max-sm:-left-2 max-sm:bottom-3 bg-white rounded-md shadow-lg border border-border-light px-4 py-3 max-sm:px-3 max-sm:py-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" stroke="none">
                    <polygon className="star-fill" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-xs max-sm:text-[0.68rem] font-semibold text-foreground">4.9/5</span>
              <span className="text-[0.7rem] max-sm:text-[0.62rem] text-foreground-muted">Canadians</span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.72rem] max-sm:text-[0.62rem] text-foreground-muted">
              <Shield size={12} className="text-accent-green" />
              Secure &amp; confidential
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
