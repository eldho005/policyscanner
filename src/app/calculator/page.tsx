"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ArrowLeft, Check, Info } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

const inputCls =
  "w-full px-3.5 py-3 border-[1.5px] border-border rounded-sm font-body text-[0.9rem] text-foreground bg-white outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]";

const selectCls = `${inputCls} appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20fill=%27none%27%20stroke=%27%23888%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27M4%206l4%204%204-4%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]`;

/* ── Reusable section wrapper ──────────────────────────────── */
function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
        {label}
        {optional && <span className="ml-1.5 text-[0.72rem] text-foreground-muted font-normal">optional</span>}
      </label>
      {children}
      {hint && <p className="text-[0.73rem] text-foreground-muted mt-1">{hint}</p>}
    </div>
  );
}

function CurrencyInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const display = value ? parseInt(value, 10).toLocaleString("en-CA") : "";
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted text-[0.9rem]">$</span>
      <input
        type="text"
        inputMode="numeric"
        className={`${inputCls} pl-8`}
        placeholder={placeholder ?? "0"}
        value={display}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      />
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────────────── */
function StepIndicator({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Your income" },
    { n: 2, label: "Debts & family" },
  ];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-bold transition-colors
                  ${done ? "bg-primary text-white" : active ? "bg-primary text-white ring-4 ring-primary/15" : "bg-border text-foreground-muted"}`}
              >
                {done ? <Check size={13} strokeWidth={2.5} /> : s.n}
              </div>
              <span className={`text-[0.72rem] font-medium whitespace-nowrap ${active ? "text-foreground" : "text-foreground-muted"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-[1.5px] w-16 sm:w-24 mx-2 mb-5 transition-colors ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const EDU_OPTIONS = [
  { value: "20000", label: "$20k — community college" },
  { value: "40000", label: "$40k — university, commuter" },
  { value: "80000", label: "$80k — university, full costs" },
  { value: "120000", label: "$120k — professional degree" },
];

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [years, setYears] = useState("7");
  const [debt, setDebt] = useState("");
  const [mortgage, setMortgage] = useState("");
  const [children, setChildren] = useState("0");
  const [eduCost, setEduCost] = useState("40000");
  const [existing, setExisting] = useState("");

  const num = (s: string) => parseInt(s, 10) || 0;
  const step1Done = num(income) > 0;

  const result = useMemo(() => {
    const d = num(debt);
    const i = num(income) * num(years);
    const m = num(mortgage);
    const e = num(children) * num(eduCost);
    const total = d + i + m + e;
    const net = Math.max(total - num(existing), 0);
    return { d, i, m, e, total, net };
  }, [income, years, mortgage, debt, children, eduCost, existing]);

  const hasAnyInput = num(income) > 0 || num(debt) > 0;
  const monthlyLo = result.net > 0 ? Math.max(1, Math.round(result.net / 1000 * 0.035)) : 0;
  const monthlyHi = result.net > 0 ? Math.round(result.net / 1000 * 0.065) : 0;
  const coverageTier =
    result.net <= 0 ? null :
    result.net < 300_000 ? "Typical for renters or singles" :
    result.net < 750_000 ? "Common for young Canadian families" :
    result.net < 1_500_000 ? "Higher coverage for growing families" :
    "Comprehensive coverage";

  const maxRow = Math.max(result.d, result.i, result.m, result.e, 1);
  const dimeRows = [
    { key: "D", label: "Debts", value: result.d, color: "bg-primary/50" },
    { key: "I", label: "Income", value: result.i, color: "bg-accent-blue/50" },
    { key: "M", label: "Mortgage", value: result.m, color: "bg-accent-green/50" },
    { key: "E", label: "Education", value: result.e, color: "bg-accent-red/40" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="pt-14 pb-10 max-sm:pt-10 max-sm:pb-7">
          <div className="max-w-[900px] mx-auto px-7 text-center">
            <h1 className="font-display text-[2.2rem] max-sm:text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground mb-3 opsz-32">
              Life Insurance Calculator
            </h1>
            <p className="text-[0.92rem] text-foreground-secondary leading-relaxed max-w-[380px] mx-auto">
              Two steps. Get a personalized coverage estimate in under a minute.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-24 max-sm:pb-16">
          <div className="max-w-[900px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

              {/* ─── Wizard Card ─── */}
              <div className="bg-white border border-border rounded-lg p-7 sm:p-9">
                <StepIndicator step={step} />

                {/* Step 1: Income */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-[1.2rem] font-semibold text-foreground tracking-[-0.02em]">
                      What&apos;s your household income?
                    </h2>

                    <Field label="Annual household income">
                      <CurrencyInput value={income} onChange={setIncome} placeholder="e.g. 85,000" />
                    </Field>

                    <Field label="Years of income to replace" hint="Choose 0 if you don't want to factor this in">
                      <select className={selectCls} value={years} onChange={(e) => setYears(e.target.value)}>
                        {[0, 1, 5, 7, 10, 12, 15, 20].map((y) => (
                          <option key={y} value={String(y)}>
                            {y === 0 ? "0 years" : y === 1 ? "1 year" : `${y} years`}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="pt-1">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!step1Done}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[0.88rem] rounded-sm hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Debts, home & family */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-[1.2rem] font-semibold text-foreground tracking-[-0.02em]">
                      Any debts, mortgage, or children?
                    </h2>

                    <Field label="Outstanding debts" hint="Credit cards, car loans, lines of credit" optional>
                      <CurrencyInput value={debt} onChange={setDebt} placeholder="e.g. 25,000" />
                    </Field>

                    <Field label="Mortgage balance" hint="Leave blank if renting or paid off" optional>
                      <CurrencyInput value={mortgage} onChange={setMortgage} placeholder="e.g. 450,000" />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-5">
                      <Field label="Children" optional>
                        <select className={selectCls} value={children} onChange={(e) => setChildren(e.target.value)}>
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={String(n)}>
                              {n === 0 ? "None" : n === 5 ? "5+" : n}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Education cost per child" optional>
                        <select
                          className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}
                          value={eduCost}
                          onChange={(e) => setEduCost(e.target.value)}
                          disabled={children === "0"}
                        >
                          {EDU_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Existing life insurance" hint="Group benefits count — we'll subtract this" optional>
                      <CurrencyInput value={existing} onChange={setExisting} placeholder="0" />
                    </Field>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 px-4 py-3 border border-border text-foreground-secondary text-[0.88rem] font-medium rounded-sm hover:border-foreground-muted transition-colors"
                      >
                        <ArrowLeft size={14} />
                        Back
                      </button>
                      {hasAnyInput && (
                        <Link
                          href={`/quote?coverage=${result.net}`}
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[0.88rem] rounded-sm hover:bg-primary-hover transition-colors"
                        >
                          Compare Quotes
                          <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Results Panel ─── */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-white border border-border rounded-lg p-5 sm:p-6">
                  <p className="text-[0.75rem] font-medium text-foreground-muted uppercase tracking-wider mb-2">
                    Coverage estimate
                  </p>

                  {/* Big number */}
                  <div className="mb-5 pb-5 border-b border-border-light">
                    <div className="font-display text-[2.4rem] font-semibold text-primary tracking-[-0.03em] leading-none">
                      {fmt(result.net)}
                    </div>
                    {coverageTier && (
                      <p className="text-[0.75rem] text-foreground-secondary mt-1.5 leading-snug">{coverageTier}</p>
                    )}
                    {result.net > 0 && (
                      <p className="text-[0.72rem] text-foreground-muted mt-1">
                        ≈ ${monthlyLo}–${monthlyHi}/mo for a healthy adult
                      </p>
                    )}
                  </div>

                  {/* DIME breakdown */}
                  <div className="space-y-3.5">
                    {dimeRows.map((row) => (
                      <div key={row.key}>
                        <div className="flex justify-between text-[0.78rem] mb-1">
                          <span className="text-foreground-secondary">
                            <span className="font-semibold text-foreground">{row.key}</span> — {row.label}
                          </span>
                          <span className="font-medium text-foreground tabular-nums">{fmt(row.value)}</span>
                        </div>
                        <div className="h-1 bg-border-light rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.color} transition-[width] duration-500`}
                            style={{ width: row.value > 0 ? `${Math.round((row.value / maxRow) * 100)}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotals */}
                  {(result.total > 0 || num(existing) > 0) && (
                    <div className="mt-4 pt-3.5 border-t border-border-light space-y-1.5 text-[0.78rem]">
                      <div className="flex justify-between">
                        <span className="text-foreground-secondary">Total need</span>
                        <span className="font-medium text-foreground tabular-nums">{fmt(result.total)}</span>
                      </div>
                      {num(existing) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-foreground-secondary">Less existing</span>
                          <span className="font-medium text-accent-green tabular-nums">−{fmt(num(existing))}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 mt-3 p-3.5 bg-primary-subtle rounded-md">
                  <Info size={13} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-[0.72rem] text-foreground-muted leading-relaxed">
                    Estimate only. Monthly figures are illustrative — actual premiums vary by age, health, and insurer.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-16 max-w-[640px]">
              <h2 className="font-display text-[1.5rem] max-sm:text-[1.25rem] font-semibold text-foreground mb-4 tracking-[-0.02em]">
                What is the DIME method?
              </h2>
              <div className="space-y-4 text-[0.9rem] text-foreground-secondary leading-[1.7]">
                <p>
                  The <strong className="text-foreground font-semibold">DIME method</strong> is a straightforward formula used by financial advisors across Canada to estimate how much life insurance you need. It stands for:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="list-disc"><strong className="text-foreground font-semibold">Debt</strong> — All outstanding debts excluding your mortgage (car loans, credit cards, lines of credit, student loans).</li>
                  <li className="list-disc"><strong className="text-foreground font-semibold">Income</strong> — Your annual income multiplied by the number of years your family would need support. Most advisors recommend 7 to 10 years.</li>
                  <li className="list-disc"><strong className="text-foreground font-semibold">Mortgage</strong> — Your remaining mortgage balance, so your family can stay in their home.</li>
                  <li className="list-disc"><strong className="text-foreground font-semibold">Education</strong> — The estimated cost of post-secondary education for each of your children.</li>
                </ul>
                <p>
                  Add these four numbers together, subtract any existing life insurance you already have, and you get a practical estimate of the coverage your family needs.
                </p>
              </div>

              <h3 className="font-display text-[1.2rem] font-semibold text-foreground mt-10 mb-3 tracking-[-0.02em]">
                How accurate is this calculator?
              </h3>
              <p className="text-[0.9rem] text-foreground-secondary leading-[1.7]">
                The DIME method provides a reliable starting point, but every family is different. Factors like investment income, a spouse&apos;s earning potential, inflation, and specific financial goals can all affect your ideal coverage amount. We recommend using this estimate as a conversation starter with a licensed insurance advisor.
              </p>

              <h3 className="font-display text-[1.2rem] font-semibold text-foreground mt-10 mb-3 tracking-[-0.02em]">
                Ready to find your rate?
              </h3>
              <p className="text-[0.9rem] text-foreground-secondary leading-[1.7] mb-6">
                Once you know how much coverage you need, use PolicyScanner to compare quotes from 20+ Canadian insurers in under 2 minutes. It&apos;s free, confidential, and takes the guesswork out of buying life insurance.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors"
              >
                Compare Quotes Now
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
