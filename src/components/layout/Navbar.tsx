"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  Heart,
  Home,
  Activity,
  ArrowRight,
} from "lucide-react";

/* ── Insurance type definitions ── */
const insuranceTypes = [
  {
    label: "Term Life Insurance",
    href: "/insurance/term-life",
    icon: <Shield size={18} />,
    desc: "Affordable coverage for a fixed period — 10, 20, or 30 years.",
  },
  {
    label: "Whole Life Insurance",
    href: "/insurance/whole-life",
    icon: <Heart size={18} />,
    desc: "Permanent coverage with a guaranteed cash value component.",
  },
  {
    label: "Mortgage Insurance",
    href: "/insurance/mortgage",
    icon: <Home size={18} />,
    desc: "Protect your family from mortgage debt if the unexpected happens.",
  },
  {
    label: "Critical Illness",
    href: "/insurance/critical-illness",
    icon: <Activity size={18} />,
    desc: "Lump-sum payout on diagnosis of a covered critical illness.",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileInsuranceOpen, setMobileInsuranceOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaRef = useRef<HTMLLIElement>(null);

  /* hover intent — open after short delay, close with grace period */
  const openMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  /* close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileInsuranceOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-[20px] backdrop-saturate-[1.4] border-b border-border-light">
      <div className="max-w-[1120px] mx-auto px-7 flex items-center justify-between h-16">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="font-body text-[1.3rem] font-medium tracking-[-0.01em] text-foreground"
          onClick={closeMobile}
        >
          Policy<span className="font-bold text-primary">Scanner</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {/* Insurance Types — mega menu trigger */}
          <li
            className="relative"
            ref={megaRef}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors py-5"
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              aria-haspopup="true"
            >
              Insurance Types
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mega dropdown */}
            <div
                className="absolute top-full -left-4 pt-1 z-50 mega-wrapper"
                data-open={megaOpen}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className="mega-panel w-[420px] bg-white border border-border-light rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                  <div className="p-2">
                    {insuranceTypes.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3.5 px-3.5 py-3 rounded-md hover:bg-background-warm transition-colors group"
                        onClick={() => setMegaOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[0.87rem] font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.label}
                          </div>
                          <div className="text-[0.78rem] text-foreground-muted leading-snug mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Compare quotes CTA */}
                  <div className="border-t border-border-light bg-background-warm/60 px-5 py-3.5">
                    <Link
                      href="/quote"
                      className="flex items-center justify-between text-[0.84rem] font-semibold text-primary hover:text-primary-hover transition-colors group"
                      onClick={() => setMegaOpen(false)}
                    >
                      <span>Compare Quotes Now</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
          </li>

          <li>
            <Link
              href="/#steps"
              className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </li>
          <li>
            <Link
              href="/#insights"
              className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
            >
              Resources
            </Link>
          </li>
          <li>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
            >
              Compare Quotes Now
            </Link>
          </li>
        </ul>

        {/* ── Mobile menu button ── */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 -mr-1.5 text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} strokeWidth={1.8} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white overflow-y-auto animate-[fadeIn_100ms_ease-out]">
          <div className="px-7 py-6 flex flex-col gap-1">
            {/* Insurance Types — collapsible */}
            <button
              className="flex items-center justify-between w-full py-4 text-sm font-medium text-foreground-secondary"
              onClick={() => setMobileInsuranceOpen((v) => !v)}
              aria-expanded={mobileInsuranceOpen}
            >
              Insurance Types
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${mobileInsuranceOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileInsuranceOpen && (
              <div className="ml-1 mb-2 flex flex-col gap-0.5">
                {insuranceTypes.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-md hover:bg-background-warm transition-colors"
                    onClick={closeMobile}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[0.85rem] font-medium text-foreground">
                        {item.label}
                      </div>
                      <div className="text-[0.75rem] text-foreground-muted leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/quote"
                  className="flex items-center gap-2 px-3 py-3.5 text-[0.84rem] font-semibold text-primary"
                  onClick={closeMobile}
                >
                  Compare Quotes
                  <ChevronRight size={14} />
                </Link>
              </div>
            )}

            <Link
              href="/#steps"
              className="py-4 text-sm font-medium text-foreground-secondary"
              onClick={closeMobile}
            >
              How It Works
            </Link>
            <Link
              href="/#insights"
              className="py-4 text-sm font-medium text-foreground-secondary"
              onClick={closeMobile}
            >
              Resources
            </Link>
            <Link
              href="/about"
              className="py-4 text-sm font-medium text-foreground-secondary"
              onClick={closeMobile}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="py-4 text-sm font-medium text-foreground-secondary"
              onClick={closeMobile}
            >
              Contact
            </Link>

            <div className="mt-4 pt-4 border-t border-border-light">
              <Link
                href="/quote"
                className="flex items-center justify-center w-full px-5 py-3.5 bg-primary text-white font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
                onClick={closeMobile}
              >
                Compare Quotes Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
