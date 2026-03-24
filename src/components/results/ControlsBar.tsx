"use client";

import { clsx } from "clsx";

export type SortOption = "price-asc" | "price-desc" | "company-az";

export interface FilterOption {
  label: string;
  count: number;
}

interface ControlsBarProps {
  coverage: number;
  term: number;
  period: "monthly" | "yearly";
  filter: string;
  policyType: string;
  sort: SortOption;
  wholePay: string;
  availableFilters: FilterOption[];
  onCoverageChange: (val: number) => void;
  onTermChange: (val: number) => void;
  onWholePayChange: (val: string) => void;
  onPeriodChange: (val: "monthly" | "yearly") => void;
  onFilterChange: (val: string) => void;
  onSortChange: (val: SortOption) => void;
}

const coverageOptions = [
  { value: 50000, label: "$50,000" },
  { value: 100000, label: "$100,000" },
  { value: 250000, label: "$250,000" },
  { value: 500000, label: "$500,000" },
  { value: 1000000, label: "$1,000,000" },
  { value: 1500000, label: "$1,500,000" },
  { value: 2000000, label: "$2,000,000" },
];

const termOptions = [
  { value: 10, label: "10 Years" },
  { value: 15, label: "15 Years" },
  { value: 20, label: "20 Years" },
  { value: 25, label: "25 Years" },
  { value: 30, label: "30 Years" },
];

const wholePayOptions = [
  { value: "100", label: "100 Pay (Lifetime)" },
  { value: "20", label: "20 Pay" },
  { value: "10", label: "10 Pay" },
];

export default function ControlsBar({
  coverage,
  term,
  period,
  filter,
  policyType,
  sort,
  wholePay,
  availableFilters,
  onCoverageChange,
  onTermChange,
  onWholePayChange,
  onPeriodChange,
  onFilterChange,
  onSortChange,
}: ControlsBarProps) {
  // Total shown = count of the active filter
  const selectClass = "appearance-none bg-white border-[1.5px] border-border rounded-sm px-3 py-2 pr-9 text-[0.84rem] font-semibold text-foreground cursor-pointer outline-none focus:border-primary bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2714%27%20height=%2714%27%20fill=%27none%27%20stroke=%27%23888%27%20stroke-width=%272%27%3E%3Cpath%20d=%27M3%205l4%204%204-4%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]";

  return (
    <div className="sticky top-16 z-30 bg-white border border-border rounded-lg p-4.5 px-7 max-sm:p-2.5 max-sm:px-3.5 mb-8 max-sm:mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Row 1: Dropdowns + Sort + Period toggle */}
      <div className="flex items-end gap-5 max-sm:gap-2.5 flex-wrap max-[900px]:flex-col max-sm:flex-row max-[900px]:items-stretch max-sm:items-end">
        {/* Coverage */}
        <div className="flex flex-col gap-1 max-sm:flex-1 max-sm:min-w-0">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground-muted">Coverage</span>
          <select
            value={coverage}
            onChange={(e) => onCoverageChange(Number(e.target.value))}
            className={clsx(selectClass, "min-w-[130px] max-sm:min-w-0 max-sm:w-full")}
          >
            {coverageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Term — only shown for term life */}
        {policyType === "term" && (
          <div className="flex flex-col gap-1 max-sm:flex-1 max-sm:min-w-0">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground-muted">Term</span>
            <select
              value={term}
              onChange={(e) => onTermChange(Number(e.target.value))}
              className={clsx(selectClass, "min-w-[130px] max-sm:min-w-0 max-sm:w-full")}
            >
              {termOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Pay Period — only shown for whole life */}
        {policyType === "whole" && (
          <div className="flex flex-col gap-1 max-sm:flex-1 max-sm:min-w-0">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground-muted">Pay Period</span>
            <select
              value={wholePay}
              onChange={(e) => onWholePayChange(e.target.value)}
              className={clsx(selectClass, "min-w-[150px] max-sm:min-w-0 max-sm:w-full")}
            >
              {wholePayOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort — hidden on mobile, default sort is already price-asc */}
        <div className="flex flex-col gap-1 max-sm:hidden">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground-muted">Sort By</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={clsx(selectClass, "min-w-[150px]")}
          >
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="company-az">Company: A → Z</option>
          </select>
        </div>

        {/* Period Toggle */}
        <div className="flex bg-background border border-border rounded-sm p-[3px] max-sm:ml-auto">
          {(["monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={clsx(
                "px-4 py-2.5 max-sm:px-3.5 text-xs rounded-[4px] transition-all capitalize",
                period === p
                  ? "bg-white text-foreground font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                  : "text-foreground-muted font-medium"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Filter Pills — hidden on mobile, pushed to ml-auto on desktop */}
        <div className="flex items-center gap-3 max-[900px]:ml-0 ml-auto max-sm:hidden">
          <div className="flex gap-2">
            {availableFilters.map((f) => (
              <button
                key={f.label}
                onClick={() => onFilterChange(f.label)}
                className={clsx(
                  "px-3.5 py-1.5 text-xs font-medium rounded-full border-[1.5px] whitespace-nowrap tracking-[0.01em] transition-all",
                  filter === f.label
                    ? "bg-dark text-white border-dark font-semibold"
                    : "border-border text-foreground-muted hover:border-foreground-muted hover:text-foreground"
                )}
              >
                {f.label}
                {f.label !== "All" && (
                  <span className={clsx(
                    "ml-1.5 text-[0.6rem] font-bold tabular-nums",
                    filter === f.label ? "text-white/70" : "text-foreground-muted"
                  )}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Filter pills — mobile only */}
      <div className="hidden max-sm:flex gap-1.5 mt-2.5 overflow-x-auto -mx-1 px-1 pb-0.5">
        {availableFilters.map((f) => (
          <button
            key={f.label}
            onClick={() => onFilterChange(f.label)}
            className={clsx(
              "px-3.5 py-2 text-[0.72rem] font-medium rounded-full border-[1.5px] whitespace-nowrap transition-all",
              filter === f.label
                ? "bg-dark text-white border-dark font-semibold"
                : "border-border text-foreground-muted"
            )}
          >
            {f.label}
            {f.label !== "All" && (
              <span className={clsx(
                "ml-1 text-[0.58rem] font-bold tabular-nums",
                filter === f.label ? "text-white/70" : "text-foreground-muted"
              )}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
