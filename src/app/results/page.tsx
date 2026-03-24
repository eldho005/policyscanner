"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Loader2 } from "lucide-react";
import { mockResults } from "@/data/mock-results";
import type { QuoteResult } from "@/lib/types/quote.types";
import ControlsBar, { type SortOption, type FilterOption } from "@/components/results/ControlsBar";
import QuoteCard from "@/components/results/QuoteCard";

const policyTypeLabels: Record<string, string> = {
  term: "Term Life Insurance",
  whole: "Whole Life Insurance",
  mortgage: "Mortgage Insurance",
  critical: "Critical Illness",
};

export default function ResultsPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteResult[]>(mockResults);
  const [policyType, setPolicyType] = useState("term");
  const [coverage, setCoverage] = useState(250000);
  const [term, setTerm] = useState(10);
  const [wholePay, setWholePay] = useState("100");
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteResult | null>(null);
  const [showNewQuoteConfirm, setShowNewQuoteConfirm] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [userRiskClass, setUserRiskClass] = useState("SP");
  const [formContext, setFormContext] = useState<{
    gender: string;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
    province: string;
    termLength?: string;
  } | null>(null);

  // Full form payload for re-fetching (includes tobacco, meds, dui, etc.)
  const fullFormRef = useRef<Record<string, unknown> | null>(null);
  // Session ID for DB persistence — avoids duplicate quote_session rows on re-fetch
  const sessionIdRef = useRef<string | null>(null);
  // Abort controller for in-flight refetch — prevents stale responses from overwriting fresh ones
  const refetchAbortRef = useRef<AbortController | null>(null);

  // ── Re-fetch quotes when user changes term, coverage, or WL pay period ─
  const refetchQuotes = useCallback(async (newCoverage: number, newTerm: number, newWholePay?: string) => {
    const form = fullFormRef.current;
    if (!form) return; // No form context — can't re-fetch

    // Cancel any in-flight request to prevent stale responses from overwriting
    if (refetchAbortRef.current) refetchAbortRef.current.abort();
    const controller = new AbortController();
    refetchAbortRef.current = controller;

    setRefetching(true);
    try {
      const payload = {
        ...form,
        coverage: newCoverage,
        termLength: policyType === "term" ? String(newTerm) : undefined,
        wholePay: policyType === "whole" ? (newWholePay ?? "100") : undefined,
        sessionId: sessionIdRef.current ?? undefined,
      };
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.results?.length > 0) {
          setQuotes(data.results);
          setFilter("All"); // reset filter — risk classes may differ at new coverage/term
          sessionStorage.setItem("ps_quote_results", JSON.stringify(data.results));
          if (data.meta?.userRiskClass) {
            setUserRiskClass(data.meta.userRiskClass);
            sessionStorage.setItem("ps_quote_meta", JSON.stringify(data.meta));
          }
          if (data.meta?.sessionId) {
            sessionIdRef.current = data.meta.sessionId;
            sessionStorage.setItem("ps_quote_session_id", data.meta.sessionId);
          }
        }
      }
    } catch (err) {
      // Ignore aborted requests — a newer request superseded this one
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Keep current quotes on other failures
    } finally {
      if (!controller.signal.aborted) setRefetching(false);
    }
  }, [policyType]);

  const handleCoverageChange = useCallback((val: number) => {
    setCoverage(val);
    refetchQuotes(val, term, wholePay);
  }, [term, wholePay, refetchQuotes]);

  const handleTermChange = useCallback((val: number) => {
    setTerm(val);
    refetchQuotes(coverage, val, wholePay);
  }, [coverage, wholePay, refetchQuotes]);

  const handleWholePayChange = useCallback((val: string) => {
    setWholePay(val);
    refetchQuotes(coverage, term, val);
  }, [coverage, term, refetchQuotes]);

  // Hydrate from sessionStorage (set by the quote page after API call)
  useEffect(() => {
    try {
      // TTL check — 30 minutes
      const ts = sessionStorage.getItem("ps_quote_ts");
      if (ts && Date.now() - Number(ts) > 30 * 60 * 1000) {
        sessionStorage.removeItem("ps_quote_results");
        sessionStorage.removeItem("ps_quote_form");
        sessionStorage.removeItem("ps_quote_meta");
        sessionStorage.removeItem("ps_quote_session_id");
        sessionStorage.removeItem("ps_quote_ts");
        router.push("/quote");
        return;
      }
      const stored = sessionStorage.getItem("ps_quote_results");
      const formCtx = sessionStorage.getItem("ps_quote_form");
      const metaStored = sessionStorage.getItem("ps_quote_meta");
      if (stored) {
        const parsed = JSON.parse(stored) as QuoteResult[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuotes(parsed);
          // Use the first result's coverage/term as initial fallback
          setCoverage(parsed[0].coverage);
          setTerm(parsed[0].term);
        }
      }
      if (metaStored) {
        const meta = JSON.parse(metaStored);
        if (meta.userRiskClass) setUserRiskClass(meta.userRiskClass);
      }
      const storedSessionId = sessionStorage.getItem("ps_quote_session_id");
      if (storedSessionId) sessionIdRef.current = storedSessionId;
      if (formCtx) {
        const ctx = JSON.parse(formCtx);
        // Store full form for re-fetch
        fullFormRef.current = ctx;
        if (ctx.type) setPolicyType(ctx.type);
        if (ctx.coverage) setCoverage(ctx.coverage);
        // Form context termLength is the authoritative source — override result-derived term
        if (ctx.termLength) {
          const parsedTerm = parseInt(ctx.termLength, 10);
          if (parsedTerm >= 10) setTerm(parsedTerm);
        }
        if (ctx.wholePay) setWholePay(ctx.wholePay);
        if (ctx.gender && ctx.dobDay && ctx.dobMonth && ctx.dobYear && ctx.province) {
          setFormContext({
            gender: ctx.gender,
            dobDay: ctx.dobDay,
            dobMonth: ctx.dobMonth,
            dobYear: ctx.dobYear,
            province: ctx.province,
            termLength: ctx.termLength,
          });
        }
      }
    } catch {
      // sessionStorage unavailable or corrupt — fall back to mock
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-[20px] backdrop-saturate-[1.4] border-b border-border-light">
        <div className="max-w-[960px] mx-auto px-7 flex items-center justify-between h-16">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="font-body text-[1.3rem] font-medium tracking-[-0.01em] text-foreground">
              Policy<span className="font-bold text-primary">Scanner</span>
            </Link>
            <span className="text-border font-light text-[1.1rem] hidden sm:inline">|</span>
            <span className="text-sm font-medium text-foreground-secondary hidden sm:inline">{policyTypeLabels[policyType]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewQuoteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-[0.82rem] font-medium text-foreground-secondary border border-border rounded-sm hover:border-foreground-muted hover:text-foreground transition-colors"
            >
              New Quote
            </button>
            <button
              onClick={() => router.push(`/quote?type=${policyType}&edit=1`)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-background transition-colors"
            >
              <span className="text-sm font-medium text-foreground-secondary max-sm:sr-only">Edit Profile</span>
              <div className="w-8 h-8 rounded-full bg-accent-blue-bg flex items-center justify-center text-accent-blue">
                <User size={15} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-[960px] mx-auto px-7 max-sm:px-4 pt-7 max-sm:pt-5 pb-20">
        {!showThankYou ? (
          <>
            {(() => {
              // ── Filter predicate ───────────────────────────────────────
              const applyFilter = (q: QuoteResult) => {
                if (filter === "No Medical") return q.tag === "no-medical";
                if (filter === "Elite") return q.riskClass === "SP";
                if (filter === "Preferred") return q.riskClass === "P";
                if (filter === "Regular") return q.riskClass === "R";
                if (filter === "Participating") return q.features.included.includes("Participating");
                if (filter === "Guaranteed") return q.features.included.includes("Non-Participating");
                return true; // "All"
              };

              // ── Sort comparator ────────────────────────────────────────
              const applySorting = (a: QuoteResult, b: QuoteResult) => {
                if (sort === "price-desc") return b.basePrice - a.basePrice;
                if (sort === "company-az") return a.brand.localeCompare(b.brand);
                return a.basePrice - b.basePrice;
              };

              // ── Available filter pills — derived from actual results ──
              const riskClassOrder: Record<string, string> = {
                SP: "Elite",
                P: "Preferred",
                R: "Regular",
              };
              const classSet = new Set(quotes.map((q) => q.riskClass));
              const classFilters: FilterOption[] = Object.entries(riskClassOrder)
                .filter(([code]) => classSet.has(code))
                .map(([code, label]) => ({
                  label,
                  count: quotes.filter((q) => q.riskClass === code).length,
                }));

              const noMedicalCount = quotes.filter((q) => q.tag === "no-medical").length;

              // Whole Life par / non-par filter pills
              const parFilters: FilterOption[] = [];
              if (policyType === "whole") {
                const parCount = quotes.filter((q) => q.features.included.includes("Participating")).length;
                const guaranteedCount = quotes.filter((q) => q.features.included.includes("Non-Participating")).length;
                if (parCount > 0) parFilters.push({ label: "Participating", count: parCount });
                if (guaranteedCount > 0) parFilters.push({ label: "Guaranteed", count: guaranteedCount });
              }

              const availableFilters: FilterOption[] = [
                { label: "All", count: quotes.length },
                ...classFilters,
                ...(noMedicalCount > 0 ? [{ label: "No Medical", count: noMedicalCount }] : []),
                ...parFilters,
              ];

              const filteredSorted = quotes.filter(applyFilter).sort(applySorting);

              return (
                <>
                  <ControlsBar
                    coverage={coverage}
                    term={term}
                    period={period}
                    filter={filter}
                    policyType={policyType}
                    sort={sort}
                    wholePay={wholePay}
                    availableFilters={availableFilters}
                    onCoverageChange={handleCoverageChange}
                    onTermChange={handleTermChange}
                    onWholePayChange={handleWholePayChange}
                    onPeriodChange={setPeriod}
                    onFilterChange={(val) => {
                      // Reset to "All" if clicking an unavailable filter
                      const valid = availableFilters.some((f) => f.label === val);
                      setFilter(valid ? val : "All");
                    }}
                    onSortChange={setSort}
                  />

                  {/* Rate Estimate Disclaimer */}
                  <div className="flex items-start gap-2.5 mb-6 max-sm:mb-4 px-4 max-sm:px-3 py-3 max-sm:py-2.5 bg-accent-blue-bg border border-accent-blue/20 rounded-md text-[0.78rem] max-sm:text-[0.72rem] text-foreground-secondary leading-relaxed">
                    <svg className="w-[14px] h-[14px] flex-shrink-0 mt-0.5 text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>
                      Based on your answers, you may qualify for <strong className="font-semibold text-foreground">{userRiskClass === "SP" ? "Elite" : userRiskClass === "P" ? "Preferred" : "Regular"}</strong> rates. Final premiums are determined after full underwriting and may vary. Request a callback from a PolicyScanner advisor.
                    </span>
                  </div>

                  {/* Quote Cards */}
                  <section className="relative">
                    {refetching && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-start justify-center pt-20">
                        <div className="flex items-center gap-2 text-sm text-foreground-secondary font-medium">
                          <Loader2 size={16} className="animate-spin text-primary" />
                          Updating quotes…
                        </div>
                      </div>
                    )}
                    {filteredSorted.map((q, i) => (
                      <QuoteCard
                        key={q.id}
                        quote={q}
                        isBest={i === 0 && sort === "price-asc" && filter === "All"}
                        period={period}
                        coverageAmount={coverage}
                        termYears={term}
                        policyType={policyType}
                        formContext={formContext ?? undefined}
                        onGetQuote={() => { setSelectedQuote(q); setShowThankYou(true); }}
                        index={i}
                      />
                    ))}
                  </section>
                </>
              );
            })()}
            <aside className="mt-10 bg-white border border-border rounded-lg p-7 flex items-center justify-between gap-6 flex-wrap max-[900px]:text-center max-[900px]:justify-center">
              <div>
                <h4 className="text-base font-bold tracking-[-0.01em]">Enjoying PolicyScanner?</h4>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  Help us improve our algorithms with your feedback.
                </p>
              </div>
              <a
                href="https://g.page/r/CSTWjjGbW_3gEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5.5 py-2.5 bg-white text-accent-blue font-semibold text-sm rounded-sm border-[1.5px] border-accent-blue/30 hover:border-accent-blue hover:bg-accent-blue-bg transition-colors"
              >
                Leave Review
              </a>
            </aside>
          </>
        ) : (
          /* Thank You View */
          <div className="max-w-[560px] mx-auto pt-10 animate-fade-up">
            <div className="bg-white border border-border rounded-lg p-10 max-sm:p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
              <div className="w-[72px] h-[72px] rounded-full bg-accent-green-bg mx-auto mb-6 flex items-center justify-center text-accent-green">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-display text-[1.7rem] max-sm:text-[1.4rem] font-semibold tracking-[-0.025em] mb-2">
                You&apos;re All Set!
              </h2>
              <p className="text-[0.9rem] max-sm:text-[0.84rem] text-foreground-secondary leading-relaxed mb-8">
                Your quote request has been securely submitted. A licensed advisor will be in touch shortly.
              </p>

              {/* Selected Plan Summary */}
              {selectedQuote && (
                <div className="bg-background border border-border rounded-md p-5 max-sm:p-4 mb-7 text-left">
                  <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-foreground-muted mb-3">Your Selected Plan</h4>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <div className="font-display text-[1.05rem] font-semibold text-foreground tracking-[-0.01em]">{selectedQuote.brand}</div>
                      <div className="text-[0.78rem] text-foreground-secondary">{selectedQuote.product}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-[1.3rem] font-bold text-foreground tracking-[-0.02em] leading-none">
                        ${(period === "yearly" ? selectedQuote.annualPrice : selectedQuote.basePrice).toFixed(2)}
                      </div>
                      <div className="text-[0.68rem] text-foreground-muted mt-0.5">/ {period === "yearly" ? "year" : "month"}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-[0.75rem] text-foreground-secondary border-t border-border-light pt-3">
                    <span>{selectedQuote.coverage >= 1_000_000 ? `$${selectedQuote.coverage / 1_000_000}M` : `$${(selectedQuote.coverage / 1_000).toFixed(0)}k`} coverage</span>
                    <span className="text-border">|</span>
                    <span>{policyType === "whole" ? "Lifetime" : `${selectedQuote.term} year term`}</span>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              <div className="flex justify-between relative mb-8 px-4 max-sm:px-1">
                <div className="absolute top-6 left-14 right-14 max-sm:left-10 max-sm:right-10 h-px bg-border" />
                <div className="flex flex-col items-center gap-2.5 relative z-[1]">
                  <div className="w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-full bg-dark border-[1.5px] border-dark text-white flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <span className="text-[0.65rem] max-sm:text-[0.6rem] font-bold uppercase tracking-[0.08em] text-foreground">Submitted</span>
                </div>
                <div className="flex flex-col items-center gap-2.5 relative z-[1]">
                  <div className="w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-full bg-white border-2 border-accent-blue text-accent-blue flex items-center justify-center font-display text-[1.1rem] max-sm:text-[0.95rem] font-semibold">
                    2
                  </div>
                  <span className="text-[0.65rem] max-sm:text-[0.6rem] font-bold uppercase tracking-[0.08em] text-accent-blue">Review</span>
                </div>
                <div className="flex flex-col items-center gap-2.5 relative z-[1]">
                  <div className="w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-full bg-white border-[1.5px] border-border text-foreground-muted flex items-center justify-center font-display text-[1.1rem] max-sm:text-[0.95rem] font-medium">
                    3
                  </div>
                  <span className="text-[0.65rem] max-sm:text-[0.6rem] font-bold uppercase tracking-[0.08em] text-foreground-muted">Finalize</span>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-background border border-border rounded-md p-6 max-sm:p-4 text-left mb-7">
                <h4 className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground mb-3.5">What Happens Next?</h4>
                <div className="flex items-start gap-3 text-sm max-sm:text-[0.82rem] text-foreground-secondary leading-relaxed mb-3">
                  <svg className="w-[15px] h-[15px] flex-shrink-0 mt-0.5 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Confirmation email sent to your inbox.</span>
                </div>
                <div className="flex items-start gap-3 text-sm max-sm:text-[0.82rem] text-foreground-secondary leading-relaxed mb-3">
                  <svg className="w-[15px] h-[15px] flex-shrink-0 mt-0.5 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span>A licensed advisor will call you within 1 business day to finalize your best rate.</span>
                </div>
                <div className="flex items-start gap-3 text-sm max-sm:text-[0.82rem] text-foreground-secondary leading-relaxed">
                  <svg className="w-[15px] h-[15px] flex-shrink-0 mt-0.5 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                  <span>No commitment — compare options before you decide.</span>
                </div>
              </div>

              <button
                onClick={() => { setShowThankYou(false); setSelectedQuote(null); }}
                className="w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
              >
                Compare More Plans
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Quote Confirmation Modal */}
      {showNewQuoteConfirm && (
        <div
          className="fixed inset-0 bg-dark/50 backdrop-blur-[3px] z-[200] flex items-center justify-center p-5"
          onClick={() => setShowNewQuoteConfirm(false)}
        >
          <div
            className="bg-white rounded-lg p-7 max-w-[360px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] mb-2.5">
              Start a new quote?
            </h3>
            <p className="text-[0.88rem] text-foreground-secondary leading-relaxed mb-6">
              This will take you back to the first step. Are you sure you want to continue?
            </p>
            <div className="flex gap-2.5">
              <Link
                href={`/quote?type=${policyType}`}
                className="flex-1 py-2.5 bg-primary text-white font-semibold text-sm rounded-sm text-center hover:bg-primary-hover transition-colors"
                onClick={() => setShowNewQuoteConfirm(false)}
              >
                Start New Quote
              </Link>
              <button
                onClick={() => setShowNewQuoteConfirm(false)}
                className="flex-1 py-2.5 text-[0.84rem] font-medium text-foreground-muted bg-background rounded-sm hover:text-foreground transition-colors border border-border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
