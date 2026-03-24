"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import StepTypeProvince from "@/components/forms/StepTypeProvince";
import StepBodyProfile from "@/components/forms/StepBodyProfile";
import StepPersonal from "@/components/forms/StepPersonal";
import StepCoverageContact from "@/components/forms/StepCoverageContact";

interface FormData {
  type: string;
  province: string;
  termLength: string;
  wholePay: string;
  gender: string;
  tobacco: string;
  tobaccoType: string;
  meds: string;
  dui: string;
  familyHistory: string;
  skipMeasurements: string;
  heightUnit: string;
  weightUnit: string;
  heightFt: string;
  heightIn: string;
  weightLbs: string;
  heightCm: string;
  weightKg: string;
  coverage: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  fullName: string;
  email: string;
  phone: string;
}

export default function QuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stepAnim, setStepAnim] = useState("animate-step-enter");
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderSteps, setLoaderSteps] = useState<{ text: string; done: boolean }[]>([]);
  const loaderTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const loaderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState<FormData>({
    type: "",
    province: "",
    termLength: "20",
    wholePay: "100",
    gender: "",
    tobacco: "",
    tobaccoType: "",
    meds: "",
    dui: "",
    familyHistory: "",
    skipMeasurements: "",
    heightUnit: "imperial",
    weightUnit: "imperial",
    heightFt: "",
    heightIn: "",
    weightLbs: "",
    heightCm: "",
    weightKg: "",
    coverage: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const updateForm = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    const editMode = params.get("edit");
    const coverageParam = params.get("coverage");

    // In edit mode, restore full form from sessionStorage so fields are pre-filled
    if (editMode) {
      // TTL check — if expired, start fresh
      const ts = sessionStorage.getItem("ps_quote_ts");
      if (ts && Date.now() - Number(ts) > 30 * 60 * 1000) {
        sessionStorage.removeItem("ps_quote_results");
        sessionStorage.removeItem("ps_quote_form");
        sessionStorage.removeItem("ps_quote_meta");
        sessionStorage.removeItem("ps_quote_session_id");
        sessionStorage.removeItem("ps_quote_ts");
        // Don't pre-fill — fall through to fresh start
      } else {
        try {
          const stored = sessionStorage.getItem("ps_quote_form");
          if (stored) {
            const ctx = JSON.parse(stored);
            /* eslint-disable react-hooks/set-state-in-effect -- One-time mount hydration from sessionStorage/URL params */
            setForm((prev) => ({
              ...prev,
              type: ctx.type || prev.type,
              province: ctx.province || "ontario",
              termLength: ctx.termLength || prev.termLength,
              wholePay: ctx.wholePay || prev.wholePay,
              gender: ctx.gender || prev.gender,
              tobacco: ctx.tobacco || prev.tobacco,
              tobaccoType: ctx.tobaccoType || prev.tobaccoType,
              meds: ctx.meds || prev.meds,
              dui: ctx.dui || prev.dui,
              familyHistory: ctx.familyHistory || prev.familyHistory,
              skipMeasurements: ctx.skipMeasurements || prev.skipMeasurements,
              heightUnit: ctx.heightUnit || "imperial",
              weightUnit: ctx.weightUnit || "imperial",
              heightFt: ctx.heightFt ? String(ctx.heightFt) : prev.heightFt,
              heightIn: ctx.heightIn != null ? String(ctx.heightIn) : prev.heightIn,
              weightLbs: ctx.weightLbs ? String(ctx.weightLbs) : prev.weightLbs,
              heightCm: ctx.heightCm ? String(ctx.heightCm) : prev.heightCm,
              weightKg: ctx.weightKg ? String(ctx.weightKg) : prev.weightKg,
              coverage: ctx.coverage ? String(ctx.coverage) : prev.coverage,
              dobDay: ctx.dobDay || prev.dobDay,
              dobMonth: ctx.dobMonth || prev.dobMonth,
              dobYear: ctx.dobYear || prev.dobYear,
              fullName: ctx.fullName || prev.fullName,
              email: ctx.email || prev.email,
              phone: ctx.phone || prev.phone,
            }));
          }
        } catch { /* ignore */ }
        setStep(2);
      }
    } else {
      if (typeParam) {
        setForm((prev) => ({ ...prev, type: typeParam }));
      }
    }

    if (coverageParam) {
      const validAmounts = ["50000", "100000", "250000", "500000", "1000000", "1500000", "2000000"];
      const nearest = validAmounts.reduce((prev, curr) =>
        Math.abs(Number(curr) - Number(coverageParam)) < Math.abs(Number(prev) - Number(coverageParam)) ? curr : prev
      );
      setForm((prev) => ({ ...prev, coverage: nearest }));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Cleanup loader timers on unmount
  useEffect(() => {
    return () => {
      loaderTimersRef.current.forEach(clearTimeout);
      if (loaderIntervalRef.current) clearInterval(loaderIntervalRef.current);
    };
  }, []);

  const isStep1Valid = form.type && form.province;
  const heightFilled = form.heightUnit === "metric" ? !!form.heightCm : !!form.heightFt;
  const weightFilled = form.weightUnit === "metric" ? !!form.weightKg : !!form.weightLbs;
  const isStep2Valid = !!(form.gender && (
    form.skipMeasurements === "yes" ||
    (heightFilled && weightFilled)
  ));
  const isStep3Valid = !!(form.tobacco && form.meds && form.dui && form.familyHistory
    && (form.tobacco === "no" || form.tobaccoType));
  const isStep4Valid = (() => {
    const d = parseInt(form.dobDay, 10);
    const m = parseInt(form.dobMonth, 10);
    const y = parseInt(form.dobYear, 10);
    const dobComplete = form.dobDay.length === 2 && form.dobMonth.length === 2 && form.dobYear.length === 4;
    let dobValid = false;
    if (dobComplete && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const daysInMonth = new Date(y, m, 0).getDate();
      if (d <= daysInMonth) {
        const today = new Date();
        const bThisYear = new Date(today.getFullYear(), m - 1, d);
        const baseAge = today.getFullYear() - y - (today < bThisYear ? 1 : 0);
        const lastBday = bThisYear <= today ? bThisYear : new Date(today.getFullYear() - 1, m - 1, d);
        const nextBday = bThisYear > today ? bThisYear : new Date(today.getFullYear() + 1, m - 1, d);
        const nearestAge = (nextBday.getTime() - today.getTime()) < (today.getTime() - lastBday.getTime()) ? baseAge + 1 : baseAge;
        dobValid = nearestAge >= 18 && nearestAge <= 70;
      }
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneValid = form.phone.replace(/\D/g, "").length === 10;
    return !!(form.coverage && dobValid && form.fullName.trim().length >= 2 && emailValid && phoneValid);
  })();

  const goToStep = (n: number) => {
    const forward = n > step;
    setStepAnim(forward ? "animate-step-exit" : "animate-step-exit-back");

    setTimeout(() => {
      setStep(n);
      setStepAnim(forward ? "animate-step-enter" : "animate-step-enter-back");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  const handleGetQuotes = () => {
    // Brief delay so button press registers visually
    setTimeout(() => {
      setShowLoaderModal(true);
      setLoaderProgress(0);
      setLoaderSteps([]);
    }, 120);

    /* ── Fire the real API call immediately ──────────────────── */
    const coverageNum = parseInt(form.coverage.replace(/\D/g, ""), 10) || 250000;
    const apiPayload = {
      type: form.type,
      province: form.province,
      gender: form.gender,
      tobacco: form.tobacco,
      tobaccoType: form.tobaccoType || undefined,
      meds: form.meds,
      dui: form.dui,
      familyHistory: form.familyHistory || "no",
      ...(form.heightUnit === "metric"
        ? { heightCm: parseFloat(form.heightCm) || undefined }
        : { heightFt: parseInt(form.heightFt, 10) || undefined, heightIn: parseInt(form.heightIn, 10) || 0 }
      ),
      ...(form.weightUnit === "metric"
        ? { weightKg: parseFloat(form.weightKg) || undefined }
        : { weightLbs: parseInt(form.weightLbs, 10) || undefined }
      ),
      coverage: coverageNum,
      termLength: form.type === "term" ? form.termLength : undefined,
      wholePay: form.type === "whole" ? form.wholePay : undefined,
      dobDay: form.dobDay,
      dobMonth: form.dobMonth,
      dobYear: form.dobYear,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone.replace(/\D/g, ""),
    };

    const apiPromise = fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiPayload),
    })
      .then((res) => res.json())
      .catch(() => null);

    /* ── Phase-driven loader ──────────────────────────────────
       Each step has an independent appear time (shows spinner)
       and done time (shows green check). Gaps between a step's
       appear→done simulate actual processing; gaps between
       steps simulate handoff latency.
       ──────────────────────────────────────────────────────── */
    const phases = [
      { text: "Verifying your eligibility…",  appear:  200, done:  950 },
      { text: "Scanning 14 carriers…",        appear: 1100, done: 2650 },
      { text: "Ranking your best rates…",     appear: 2800, done: 3600 },
    ];

    loaderTimersRef.current = [];
    phases.forEach(({ text, appear, done }) => {
      loaderTimersRef.current.push(
        setTimeout(() => {
          setLoaderSteps((prev) => [...prev, { text, done: false }]);
        }, appear)
      );
      loaderTimersRef.current.push(
        setTimeout(() => {
          setLoaderSteps((prev) =>
            prev.map((s) => (s.text === text ? { ...s, done: true } : s))
          );
        }, done)
      );
    });

    /* ── Progress bar: piecewise easing tied to 3 phases ─────
       Phase 1 (verify):  0→22%   fast   (0–950ms)
       Phase 2 (scan):   22→78%   slow ← intentional stall (950–2650ms)
       Phase 3 (rank):   78→100%  medium (2650–3600ms)
       ──────────────────────────────────────────────────────── */
    const totalMs = 3700;
    const start = Date.now();
    let lastProgress = 0;

    loaderIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / totalMs, 1);

      let progress: number;
      if (t < 0.26) {
        // Phase 1: 0→22% fast
        progress = (t / 0.26) * 22;
      } else if (t < 0.72) {
        // Phase 2: 22→78% slow stall (scanning carries)
        progress = 22 + ((t - 0.26) / 0.46) * 56;
      } else {
        // Phase 3: 78→100% medium
        progress = 78 + ((t - 0.72) / 0.28) * 22;
      }

      progress = Math.max(progress + (Math.random() - 0.3) * 1.2, lastProgress);
      if (t < 1) progress = Math.min(progress, 99);
      lastProgress = progress;
      setLoaderProgress(progress);

      if (t >= 1) {
        if (loaderIntervalRef.current) clearInterval(loaderIntervalRef.current);
        setLoaderProgress(100);

        // Wait for API result, then navigate
        apiPromise.then((data) => {
          if (data?.success && data.results?.length > 0) {
            sessionStorage.setItem("ps_quote_results", JSON.stringify(data.results));
            sessionStorage.setItem("ps_quote_meta", JSON.stringify(data.meta));
          }
          if (data?.meta?.sessionId) {
            sessionStorage.setItem("ps_quote_session_id", data.meta.sessionId);
          }
          // Timestamp for TTL expiry (30 min)
          sessionStorage.setItem("ps_quote_ts", String(Date.now()));
          // Fire-and-forget lead capture
          fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: data?.meta?.sessionId ?? undefined,
              fullName: form.fullName,
              email: form.email,
              phone: form.phone.replace(/\D/g, ""),
              province: form.province,
              policyType: form.type,
              coverage: coverageNum,
              term: form.type === "term" ? parseInt(form.termLength, 10) || 20 : 0,
              userRiskClass: data?.meta?.userRiskClass ?? "R",
            }),
          }).catch(() => {/* silent */});
          // Store full form context for results page (re-fetch needs all fields)
          sessionStorage.setItem("ps_quote_form", JSON.stringify({
            type: form.type,
            coverage: coverageNum,
            termLength: form.termLength,
            wholePay: form.wholePay,
            gender: form.gender,
            tobacco: form.tobacco,
            tobaccoType: form.tobaccoType || undefined,
            meds: form.meds,
            dui: form.dui,
            familyHistory: form.familyHistory || "no",
            heightUnit: form.heightUnit,
            weightUnit: form.weightUnit,
            ...(form.heightUnit === "metric"
              ? { heightCm: parseFloat(form.heightCm) || undefined }
              : { heightFt: parseInt(form.heightFt, 10) || undefined, heightIn: parseInt(form.heightIn, 10) || 0 }
            ),
            ...(form.weightUnit === "metric"
              ? { weightKg: parseFloat(form.weightKg) || undefined }
              : { weightLbs: parseInt(form.weightLbs, 10) || undefined }
            ),
            dobDay: form.dobDay,
            dobMonth: form.dobMonth,
            dobYear: form.dobYear,
            province: form.province,
            fullName: form.fullName,
            email: form.email,
            phone: form.phone.replace(/\D/g, ""),
          }));
          setTimeout(() => {
            setShowLoaderModal(false);
            router.push("/results");
          }, 500);
        });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-[20px] backdrop-saturate-[1.4] border-b border-border-light">
        <div className="max-w-[560px] mx-auto px-6 flex items-center justify-between h-[60px]">
          <Link href="/" className="font-body text-[1.2rem] font-medium tracking-[-0.01em] text-foreground">
            Policy<span className="font-bold text-primary">Scanner</span>
          </Link>
          <div className="text-[0.8rem] font-medium text-foreground-muted tracking-[0.01em]">
            Step {step} of 4
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-[60px] left-0 w-full h-[3px] bg-border-light z-40">
        <div
          className="h-full bg-primary transition-[width] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* Main */}
      <main className="max-w-[560px] mx-auto px-6 pt-14 pb-28">
        <div className={stepAnim}>
          {/* Step 1 */}
          {step === 1 && (
            <StepTypeProvince
              selectedType={form.type}
              selectedProvince={form.province}
              selectedTermLength={form.termLength}
              onSelectType={(val) => updateForm("type", val)}
              onSelectProvince={(val) => updateForm("province", val)}
              onSelectTermLength={(val) => updateForm("termLength", val)}
              onOtherProvince={() => setShowProvinceModal(true)}
            />
          )}

          {/* Step 2 — Body Profile */}
          {step === 2 && (
            <StepBodyProfile
              gender={form.gender}
              heightUnit={form.heightUnit}
              weightUnit={form.weightUnit}
              heightFt={form.heightFt}
              heightIn={form.heightIn}
              weightLbs={form.weightLbs}
              heightCm={form.heightCm}
              weightKg={form.weightKg}
              skipMeasurements={form.skipMeasurements}
              onSelect={updateForm}
            />
          )}

          {/* Step 3 — Health History */}
          {step === 3 && (
            <StepPersonal
              tobacco={form.tobacco}
              tobaccoType={form.tobaccoType}
              meds={form.meds}
              dui={form.dui}
              familyHistory={form.familyHistory}
              onSelect={updateForm}
            />
          )}

          {/* Step 4 — Coverage & Contact */}
          {step === 4 && (
            <StepCoverageContact
              coverage={form.coverage}
              dobDay={form.dobDay}
              dobMonth={form.dobMonth}
              dobYear={form.dobYear}
              fullName={form.fullName}
              email={form.email}
              phone={form.phone}
              onChange={updateForm}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6">
          {step === 1 && (
            <button
              disabled={!isStep1Valid}
              onClick={() => goToStep(2)}
              className="flex items-center justify-center w-full py-3.5 px-6 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors btn-press disabled:bg-border disabled:text-foreground-muted disabled:cursor-not-allowed"
            >
              Continue
            </button>
          )}

          {step === 2 && (
            <>
              <button
                disabled={!isStep2Valid}
                onClick={() => goToStep(3)}
                className="flex items-center justify-center w-full py-3.5 px-6 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors btn-press disabled:bg-border disabled:text-foreground-muted disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <button onClick={() => goToStep(1)} className="flex items-center justify-center w-full py-2.5 mt-2 text-[0.85rem] font-medium text-foreground-muted hover:text-foreground transition-colors">
                ← Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                disabled={!isStep3Valid}
                onClick={() => goToStep(4)}
                className="flex items-center justify-center w-full py-3.5 px-6 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors btn-press disabled:bg-border disabled:text-foreground-muted disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <button onClick={() => goToStep(2)} className="flex items-center justify-center w-full py-2.5 mt-2 text-[0.85rem] font-medium text-foreground-muted hover:text-foreground transition-colors">
                ← Back
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <button
                disabled={!isStep4Valid}
                onClick={handleGetQuotes}
                className="flex items-center justify-center w-full py-3.5 px-6 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors btn-press disabled:bg-border disabled:text-foreground-muted disabled:cursor-not-allowed"
              >
                Get My Quotes
              </button>
              <button onClick={() => goToStep(3)} className="flex items-center justify-center w-full py-2.5 mt-2 text-[0.85rem] font-medium text-foreground-muted hover:text-foreground transition-colors">
                ← Back
              </button>
            </>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-foreground-muted">
            <Lock size={12} className="text-accent-blue" />
            Your information is secure &amp; private
          </div>
        </div>
      </main>

      {/* Province Modal */}
      {showProvinceModal && (
        <div
          className="fixed inset-0 bg-dark/50 backdrop-blur-[3px] z-[1000] flex items-center justify-center p-5 animate-modal-overlay"
          onClick={() => setShowProvinceModal(false)}
        >
          <div className="bg-white rounded-lg p-6 sm:p-10 max-w-[400px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-accent-blue-bg mx-auto mb-5 flex items-center justify-center text-accent-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <h3 className="font-display text-[1.25rem] font-semibold text-foreground mb-2">Outside Ontario?</h3>
            <p className="text-sm text-foreground-secondary mb-7 leading-relaxed">
              We&apos;re currently serving Ontario only, but expanding to other provinces soon!
            </p>
            <button
              onClick={() => setShowProvinceModal(false)}
              className="w-full py-3.5 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors"
            >
              Okay, got it
            </button>
          </div>
        </div>
      )}

      {/* Loader Modal */}
      {showLoaderModal && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-[3px] z-[1000] flex items-center justify-center p-5 animate-modal-overlay">
          <div className="bg-white rounded-lg p-6 sm:p-10 max-w-[400px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-modal-content">
            <div className="w-14 h-14 mx-auto mb-5">
              <div className="w-14 h-14 border-3 border-primary-light border-t-primary rounded-full animate-spin-custom" />
            </div>
            <h3 className="font-display text-[1.25rem] font-semibold text-foreground mb-2">Finding your best rates</h3>
            <div className="text-left flex flex-col gap-2.5 my-5 min-h-[60px]">
              {loaderSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[0.84rem] text-foreground-secondary animate-fade-up">
                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-accent-green-bg text-accent-green" : "bg-primary-light"}`}>
                    {s.done ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    ) : (
                      <div className="w-2.5 h-2.5 border-[1.5px] border-primary-light border-t-primary rounded-full animate-spin-custom" />
                    )}
                  </div>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-border-light rounded-sm overflow-hidden mt-5">
              <div className="h-full bg-primary rounded-sm transition-[width] duration-100 ease-linear" style={{ width: `${loaderProgress}%` }} />
            </div>
            <p className="text-xs text-foreground-muted mt-2 text-right">{Math.round(loaderProgress)}%</p>
          </div>
        </div>
      )}


    </div>
  );
}
