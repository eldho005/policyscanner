"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Plus, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import Tooltip from "@/components/ui/Tooltip";
import type { QuoteResult } from "@/lib/types/quote.types";

interface QuoteCardProps {
  quote: QuoteResult;
  isBest: boolean;
  period: "monthly" | "yearly";
  coverageAmount: number;
  termYears: number;
  policyType: string;
  formContext?: {
    gender: string;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
    province: string;
    termLength?: string;
  };
  onGetQuote: () => void;
  index?: number;
}

export default function QuoteCard({
  quote,
  isBest,
  period,
  coverageAmount,
  termYears,
  policyType,
  formContext: _formContext,
  onGetQuote,
  index = 0,
}: QuoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"included" | "riders">("included");
  const [quoting, setQuoting] = useState(false);

  const handleGetQuote = () => {
    if (quoting) return;
    setQuoting(true);
    setTimeout(() => {
      onGetQuote();
    }, 950);
  };

  // Price calculation — use API prices directly when available,
  // fall back to multiplier-based calculation for mock data
  let price: number;
  if (quote.annualPrice && quote.annualPrice > 0) {
    // API-sourced data: prices are already accurate for the requested params
    price = period === "yearly" ? quote.annualPrice : quote.basePrice;
  } else {
    // Legacy mock fallback
    let multiplier = coverageAmount / 250000;
    if (policyType === "whole") multiplier *= 5;
    else if (policyType === "critical") multiplier *= 4;
    else {
      if (termYears === 15) multiplier *= 1.15;
      else if (termYears === 20) multiplier *= 1.4;
      else if (termYears === 25) multiplier *= 1.6;
      else if (termYears === 30) multiplier *= 1.9;
      else if (termYears >= 40) multiplier *= 2.5;
    }
    price = quote.basePrice * multiplier;
    if (period === "yearly") price *= 12;
  }

  // Until Age display
  const untilAgeLabel = policyType === "whole"
    ? "Lifetime"
    : quote.untilAge > 100
      ? "Lifetime"
      : `Until age ${quote.untilAge}`;

  const tagStyles: Record<string, string> = {
    "best-value": "bg-primary-light text-primary",
    "no-medical": "bg-accent-blue-bg text-accent-blue",
    "standard": "bg-background text-foreground-muted border border-border",
  };

  const riskClassLabels: Record<string, string> = {
    SP: "Elite",
    P: "Preferred",
    R: "Regular",
    S: "Simplified",
    G: "Guaranteed",
  };

  const isPar = policyType === "whole" && quote.features.included.includes("Participating");
  const isNonPar = policyType === "whole" && quote.features.included.includes("Non-Participating");

  const features = activeTab === "riders" ? quote.features.riders : quote.features.included;

  return (
    <article
      className={clsx(
        "bg-white border rounded-lg mb-4 max-sm:mb-3 transition-all duration-200 animate-card-in",
        isBest
          ? "border-primary/30 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          : "border-border hover:border-foreground-muted/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Best Value accent bar */}
      {isBest && (
        <div className="px-7 max-sm:px-4 py-2 bg-primary-light/60 border-b border-primary/10 rounded-t-lg">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-primary">
            Best Value
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 max-sm:p-4">
        {/* Desktop/Tablet — single row */}
        <div className="flex items-center gap-6 max-sm:hidden">
          {/* Brand + Badges */}
          <div className="w-[260px] flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-1">
              {quote.logoUrl ? (
                <Image
                  src={quote.logoUrl}
                  alt={quote.brand}
                  width={120}
                  height={28}
                  className="max-h-7 max-w-[100px] w-auto h-auto object-contain object-left flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="font-display text-[1.1rem] font-semibold text-foreground tracking-[-0.02em]">
                  {quote.brand}
                </div>
              )}
              {quote.tag === "no-medical" && (
                <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.04em]", tagStyles[quote.tag])}>
                  {quote.tagLabel}
                </span>
              )}
              {quote.riskClass && riskClassLabels[quote.riskClass] && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.62rem] font-medium bg-accent-green-bg text-accent-green border border-accent-green/15">
                  {riskClassLabels[quote.riskClass]}
                </span>
              )}
            </div>
            <div className="text-[0.76rem] text-foreground-secondary leading-snug truncate">
              {quote.product}
            </div>
            {isPar && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[0.68rem] text-accent-blue font-medium">Participating</span>
                <Tooltip text="May earn dividends from the insurer's profits. Cash value can grow beyond the guaranteed minimum." />
              </div>
            )}
            {isNonPar && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[0.68rem] text-accent-green font-medium">Guaranteed</span>
                <Tooltip text="Fixed premiums and guaranteed cash values. No dividends — simple and predictable." />
              </div>
            )}
          </div>

          {/* Centre stat */}
          <div className="flex-1 px-6 border-l border-r border-border-light flex items-center justify-center">
            <div className="text-center">
              <div className="text-[0.62rem] font-medium uppercase tracking-[0.06em] text-foreground-muted/70 mb-0.5">Coverage</div>
              <div className="text-[0.78rem] text-foreground-secondary leading-snug">
                {policyType === "whole" || quote.untilAge > 100 ? "Lifetime" : `Until age ${quote.untilAge}`}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="w-[110px] flex-shrink-0 text-right">
            <div className="font-display text-[1.8rem] font-bold text-foreground tracking-[-0.03em] leading-none">
              <span className="font-body text-[1.05rem] align-top mt-[3px] inline-block">$</span>{price.toFixed(2)}
            </div>
            <div className="text-[0.72rem] text-foreground-muted mt-0.5">
              / {period === "yearly" ? "year" : "month"}
            </div>
            {quote.waiverOfPremium > 0 && period === "monthly" && (
              <div className="text-[0.68rem] text-foreground-muted mt-0.5">
                +<span className="font-body">${quote.waiverOfPremium.toFixed(2)}</span> disability waiver
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleGetQuote}
            disabled={quoting}
            className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors flex-shrink-0 disabled:opacity-80 disabled:cursor-default min-w-[100px]"
          >
            {quoting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-custom inline-block" />
                Preparing…
              </span>
            ) : "Get Quote"}
          </button>
        </div>

        {/* Mobile — stacked */}
        <div className="hidden max-sm:block">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              {quote.logoUrl ? (
                <Image
                  src={quote.logoUrl}
                  alt={quote.brand}
                  width={100}
                  height={24}
                  className="max-h-6 max-w-[80px] w-auto h-auto object-contain object-left mb-1"
                  unoptimized
                />
              ) : (
                <div className="font-display text-[1.05rem] font-semibold text-foreground tracking-[-0.02em] mb-0.5">
                  {quote.brand}
                </div>
              )}
              <div className="text-[0.72rem] text-foreground-secondary">
                {quote.product}
              </div>
              {isPar && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[0.68rem] text-accent-blue font-medium">Participating</span>
                  <Tooltip text="May earn dividends from the insurer's profits. Cash value can grow beyond the guaranteed minimum." />
                </div>
              )}
              {isNonPar && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[0.68rem] text-accent-green font-medium">Guaranteed</span>
                  <Tooltip text="Fixed premiums and guaranteed cash values. No dividends — simple and predictable." />
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-display text-[1.5rem] font-bold text-foreground tracking-[-0.03em] leading-none">
                <span className="font-body text-[0.9rem] align-top mt-[2px] inline-block">$</span>{price.toFixed(2)}
              </div>
              <div className="text-[0.65rem] text-foreground-muted mt-0.5">
                / {period === "yearly" ? "yr" : "mo"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-3.5">
            {quote.tag === "no-medical" && (
              <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.62rem] font-semibold uppercase tracking-[0.04em]", tagStyles[quote.tag])}>
                {quote.tagLabel}
              </span>
            )}
            {quote.riskClass && riskClassLabels[quote.riskClass] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-accent-green-bg text-accent-green border border-accent-green/15">
                {riskClassLabels[quote.riskClass]}
              </span>
            )}
            <span className="text-[0.62rem] text-foreground-muted ml-auto">{untilAgeLabel}</span>
          </div>

          <button
            onClick={handleGetQuote}
            disabled={quoting}
            className="w-full py-2.5 bg-primary text-white font-semibold text-[0.82rem] rounded-sm hover:bg-primary-hover transition-colors disabled:opacity-80 disabled:cursor-default"
          >
            {quoting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin-custom inline-block" />
                Preparing…
              </span>
            ) : "Get Quote"}
          </button>
        </div>
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-border-light text-[0.72rem] font-medium text-foreground-muted hover:text-foreground-secondary transition-colors"
      >
        <span>{expanded ? "Hide details" : "View details"}</span>
        <ChevronDown
          size={13}
          className={clsx("transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>

      {/* Collapsible Features */}
      {expanded && (
        <div className="border-t border-border-light bg-background rounded-b-lg animate-fade-in">
          <div className="flex px-7 max-sm:px-4 border-b border-border-light bg-white">
            <button
              onClick={() => setActiveTab("included")}
              className={clsx(
                "py-2.5 mr-7 text-[0.72rem] font-bold uppercase tracking-[0.08em] border-b-2 transition-all",
                activeTab === "included"
                  ? "text-foreground border-accent-blue"
                  : "text-foreground-muted border-transparent hover:text-foreground-secondary"
              )}
            >
              Included
            </button>
            <button
              onClick={() => setActiveTab("riders")}
              className={clsx(
                "py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] border-b-2 transition-all",
                activeTab === "riders"
                  ? "text-foreground border-accent-blue"
                  : "text-foreground-muted border-transparent hover:text-foreground-secondary"
              )}
            >
              Riders
            </button>
          </div>
          <div className="px-7 max-sm:px-4 py-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-1.5">
            {features.map((feat) => (
              <div key={feat} className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                {activeTab === "riders" ? (
                  <Plus size={13} className="text-primary flex-shrink-0" strokeWidth={2.5} />
                ) : (
                  <Check size={13} className="text-foreground-muted flex-shrink-0" strokeWidth={2.5} />
                )}
                {feat}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
