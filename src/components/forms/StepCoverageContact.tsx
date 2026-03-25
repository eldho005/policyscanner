"use client";

import { useRef, useState, useCallback } from "react";
import { FormSelect } from "@/components/ui/FormFields";
import { coverageAmounts } from "@/data/mock-form";

interface StepCoverageContactProps {
  coverage: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  fullName: string;
  email: string;
  phone: string;
  onChange: (field: string, value: string) => void;
}

/* ── Helpers ──────────────────────────────────────────────── */

/** Strip non-digits */
function digits(s: string) { return s.replace(/\D/g, ""); }

/** Compute nearest age (insurance standard: round to closest birthday) */
function nearestAge(day: number, month: number, year: number): number | null {
  const today = new Date();
  const dob = new Date(year, month - 1, day);
  if (isNaN(dob.getTime())) return null;

  // next birthday this year or next
  const bThisYear = new Date(today.getFullYear(), month - 1, day);
  const lastBday = bThisYear <= today ? bThisYear : new Date(today.getFullYear() - 1, month - 1, day);
  const nextBday = bThisYear > today ? bThisYear : new Date(today.getFullYear() + 1, month - 1, day);

  const msToLast = today.getTime() - lastBday.getTime();
  const msToNext = nextBday.getTime() - today.getTime();

  const baseAge = today.getFullYear() - year - (today < bThisYear ? 1 : 0);
  return msToNext < msToLast ? baseAge + 1 : baseAge;
}

/** Format raw digits into (XXX) XXX-XXXX */
function formatPhone(raw: string): string {
  const d = digits(raw).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Is DOB within valid range? (18–70 inclusive) */
function isDobValid(day: string, month: string, year: string): boolean {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  // Check the day is valid for the month
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d > daysInMonth) return false;
  const age = nearestAge(d, m, y);
  if (age === null) return false;
  return age >= 18 && age <= 70;
}

export default function StepCoverageContact({
  coverage,
  dobDay,
  dobMonth,
  dobYear,
  fullName,
  email,
  phone,
  onChange,
}: StepCoverageContactProps) {
  const mmRef = useRef<HTMLInputElement>(null);
  const yyRef = useRef<HTMLInputElement>(null);

  // Blur-triggered error flags
  const [touched, setTouched] = useState({
    dob: false,
    name: false,
    email: false,
    phone: false,
  });

  const markTouched = useCallback((field: keyof typeof touched) => {
    setTouched((p) => ({ ...p, [field]: true }));
  }, []);

  /* ── DOB handlers — digits only, auto-advance, reject 00 ── */
  const handleDay = (raw: string) => {
    const v = digits(raw).slice(0, 2);
    if (v === "00") return;
    onChange("dobDay", v);
    if (v.length === 2) mmRef.current?.focus();
  };

  const handleMonth = (raw: string) => {
    const v = digits(raw).slice(0, 2);
    if (v === "00") return;
    onChange("dobMonth", v);
    if (v.length === 2) yyRef.current?.focus();
  };

  const handleYear = (raw: string) => {
    onChange("dobYear", digits(raw).slice(0, 4));
  };

  /* ── Phone handler — strip leading country code 1 from autofill ── */
  const handlePhone = (raw: string) => {
    let d = digits(raw);
    if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
    onChange("phone", formatPhone(d));
  };

  /* ── Name handler — letters, spaces, hyphens, apostrophes */
  const handleName = (raw: string) => {
    onChange("fullName", raw.replace(/[^a-zA-ZÀ-ÿ '\-]/g, ""));
  };

  /* ── Computed states ──────────────────────────────────── */
  const dobComplete = dobDay.length === 2 && dobMonth.length === 2 && dobYear.length === 4;
  const dobValid = dobComplete && isDobValid(dobDay, dobMonth, dobYear);
  const dobError = touched.dob && dobComplete && !dobValid;

  const computedAge = dobValid
    ? nearestAge(parseInt(dobDay, 10), parseInt(dobMonth, 10), parseInt(dobYear, 10))
    : null;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = touched.email && email.length > 0 && !emailValid;

  const phoneDigits = digits(phone).length;
  const phoneError = touched.phone && phoneDigits > 0 && phoneDigits !== 10;

  const nameError = touched.name && fullName.length > 0 && fullName.trim().length < 2;

  const inputBase = "flex-1 min-w-0 px-2 py-3 border-[1.5px] rounded-sm text-[0.9rem] text-foreground text-center outline-none transition-all";
  const inputNormal = `${inputBase} border-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]`;
  const inputError = `${inputBase} border-accent-red focus:border-accent-red focus:shadow-[0_0_0_3px_oklch(0.65_0.2_25/0.12)]`;
  const inputValid = `${inputBase} border-accent-green focus:border-accent-green focus:shadow-[0_0_0_3px_oklch(0.7_0.15_155/0.12)]`;

  const dobInputClass = dobError ? inputError : (dobValid ? inputValid : inputNormal);

  return (
    <div>
      <h2 className="font-display text-[1.7rem] font-semibold leading-[1.2] tracking-[-0.025em] text-foreground mb-3">
        Almost there — let&apos;s find your best rates
      </h2>
      <p className="text-[0.9rem] text-foreground-secondary mb-10">
        We need a few details to pull personalized quotes.
      </p>

      {/* Coverage & DOB Card */}
      <div className="bg-white border border-border rounded-lg p-7 mb-8 overflow-hidden">
        <FormSelect
          label="Coverage amount"
          value={coverage}
          onChange={(e) => onChange("coverage", e.target.value)}
        >
          <option value="" disabled>Select coverage amount</option>
          {coverageAmounts.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </FormSelect>

        <div className="mb-0">
          <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
            Date of birth
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              className={dobInputClass}
              placeholder="DD"
              maxLength={2}
              inputMode="numeric"
              value={dobDay}
              onChange={(e) => handleDay(e.target.value)}
              onBlur={() => markTouched("dob")}
            />
            <input
              ref={mmRef}
              type="tel"
              className={dobInputClass}
              placeholder="MM"
              maxLength={2}
              inputMode="numeric"
              value={dobMonth}
              onChange={(e) => handleMonth(e.target.value)}
              onBlur={() => markTouched("dob")}
            />
            <input
              ref={yyRef}
              type="tel"
              className={dobInputClass}
              placeholder="YYYY"
              maxLength={4}
              inputMode="numeric"
              value={dobYear}
              onChange={(e) => handleYear(e.target.value)}
              onBlur={() => markTouched("dob")}
            />
          </div>

          {/* Age feedback or error */}
          {dobComplete ? (
            <p className={`text-[0.78rem] mt-1.5 ${dobError ? "text-accent-red" : "text-foreground-muted"}`}>
              {dobError
                ? "Age must be between 18 and 70"
                : computedAge != null
                  ? `Nearest age: ${computedAge}`
                  : null}
            </p>
          ) : touched.dob && (dobDay || dobMonth || dobYear) ? (
            <p className="text-[0.78rem] mt-1.5 text-foreground-muted">Please complete your date of birth</p>
          ) : null}
        </div>
      </div>

      {/* Contact Card */}
      <p className="text-[0.95rem] font-semibold text-foreground mb-4">Your contact details</p>
      <div className="bg-white border border-border rounded-lg p-7">
        <div className="mb-6">
          <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
            Full name
          </label>
          <input
            className={`w-full px-3.5 py-3 border-[1.5px] rounded-sm font-body text-[0.9rem] text-foreground bg-white transition-all outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] ${nameError ? "border-accent-red" : "border-border"}`}
            placeholder="Your full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => handleName(e.target.value)}
            onBlur={() => markTouched("name")}
          />
          {nameError && (
            <p className="text-[0.78rem] mt-1 text-accent-red">Please enter your full name</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
            Email address
          </label>
          <input
            type="email"
            className={`w-full px-3.5 py-3 border-[1.5px] rounded-sm font-body text-[0.9rem] text-foreground bg-white transition-all outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] ${emailError ? "border-accent-red" : "border-border"}`}
            placeholder="you@email.com"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => markTouched("email")}
          />
          {emailError && (
            <p className="text-[0.78rem] mt-1 text-accent-red">Please enter a valid email</p>
          )}
        </div>
        <div className="mb-0">
          <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
            Phone number
          </label>
          <div className="flex gap-2">
            <select className="w-[100px] flex-shrink-0 px-3 py-3 border-[1.5px] border-border rounded-sm text-[0.9rem] text-foreground bg-white outline-none appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20fill=%27none%27%20stroke=%27%23888%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27M4%206l4%204%204-4%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]">
              <option value="+1">🇨🇦 +1</option>
            </select>
            <input
              type="tel"
              className={`flex-1 px-3.5 py-3 border-[1.5px] rounded-sm text-[0.9rem] text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] ${phoneError ? "border-accent-red" : "border-border"}`}
              placeholder="5551234567"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => handlePhone(e.target.value)}
              onBlur={() => markTouched("phone")}
            />
          </div>
          {phoneError && (
            <p className="text-[0.78rem] mt-1 text-accent-red">Please enter a valid phone number</p>
          )}
        </div>
      </div>

      <div className="mt-5 text-center space-y-2">
        <p className="text-[0.75rem] text-foreground-muted leading-relaxed">
          By clicking &ldquo;Get My Quotes&rdquo;, you agree to our{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-foreground-secondary underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>
          {" "}and{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-foreground-secondary underline underline-offset-2 hover:text-foreground transition-colors">Terms &amp; Conditions</a>.
          {" "}You also consent to receiving a quote confirmation email and follow-up communications from a licensed PolicyScanner advisor. You may opt out at any time.
        </p>
        <p className="text-[0.72rem] text-foreground-muted">
          PolicyScanner Brokerage Inc. · FSRA{" "}
          <a href="/licensing" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">#41964M</a>
          {" "}· All advisors LLQP-certified
        </p>
      </div>
    </div>
  );
}
