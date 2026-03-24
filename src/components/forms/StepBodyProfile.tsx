"use client";

import { useMemo, useState } from "react";
import SelectCard from "@/components/ui/SelectCard";

interface StepBodyProfileProps {
  gender: string;
  heightUnit: string;
  weightUnit: string;
  heightFt: string;
  heightIn: string;
  weightLbs: string;
  heightCm: string;
  weightKg: string;
  skipMeasurements: string;
  onSelect: (field: string, value: string) => void;
}

export default function StepBodyProfile({ gender, heightUnit, weightUnit, heightFt, heightIn, weightLbs, heightCm, weightKg, skipMeasurements, onSelect }: StepBodyProfileProps) {
  const isHeightMetric = heightUnit === "metric";
  const isWeightMetric = weightUnit === "metric";
  const skipped = skipMeasurements === "yes";
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  const bmi = useMemo(() => {
    if (skipped) return null;
    // Normalize height to metres
    let heightM = 0;
    if (isHeightMetric) {
      const cm = parseFloat(heightCm);
      if (!cm || cm < 100 || cm > 250) return null;
      heightM = cm / 100;
    } else {
      const ft = parseInt(heightFt, 10);
      const inches = parseInt(heightIn, 10) || 0;
      if (!ft || ft < 3 || ft > 7) return null;
      heightM = (ft * 12 + inches) * 0.0254;
    }
    // Normalize weight to kg
    let weightInKg = 0;
    if (isWeightMetric) {
      const kg = parseFloat(weightKg);
      if (!kg) return null;
      weightInKg = kg;
    } else {
      const lbs = parseInt(weightLbs, 10);
      if (!lbs) return null;
      weightInKg = lbs / 2.2046;
    }
    return weightInKg / (heightM * heightM);
  }, [skipped, isHeightMetric, isWeightMetric, heightFt, heightIn, weightLbs, heightCm, weightKg]);

  const bmiInfo = useMemo(() => {
    if (bmi === null) return null;
    if (bmi < 18.5) return { color: "text-amber-600",    bar: "bg-amber-400"    };
    if (bmi < 25)   return { color: "text-accent-green", bar: "bg-accent-green" };
    if (bmi < 30)   return { color: "text-amber-600",    bar: "bg-amber-400"    };
    if (bmi <= 35)  return { color: "text-red-500",      bar: "bg-red-400"      };
    return              { color: "text-red-600",      bar: "bg-red-600"      };
  }, [bmi]);

  return (
    <div>
      <h2 className="font-display text-[1.7rem] font-semibold leading-[1.2] tracking-[-0.025em] text-foreground mb-3">
        Your profile
      </h2>
      <p className="text-[0.9rem] text-foreground-secondary mb-10">
        Height and weight help us calculate your BMI — a key factor in determining your rate tier.
        <span className="block text-[0.78rem] text-foreground-muted mt-1">All measurements are approximate.</span>
      </p>

      {/* Gender */}
      <p className="text-[0.95rem] font-semibold text-foreground mb-4">Gender</p>
      <div className="grid grid-cols-2 gap-3.5 mb-10">
        <SelectCard label="Male"   selected={gender === "male"}   onClick={() => onSelect("gender", "male")}   />
        <SelectCard label="Female" selected={gender === "female"} onClick={() => onSelect("gender", "female")} />
      </div>

      {/* Height & Weight — two-column card layout */}
      {!skipped && (
        <div className="grid grid-cols-2 gap-3.5 mb-4">
          {/* Height card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.95rem] font-semibold text-foreground">Height</p>
              <div className="flex rounded-full bg-background border border-border p-[2px] text-[0.65rem] font-semibold leading-none">
                <button type="button" onClick={() => onSelect("heightUnit", "imperial")}
                  className={`px-3 py-1.5 rounded-full transition-all ${!isHeightMetric ? "bg-white text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-foreground-muted hover:text-foreground"}`}>
                  ft
                </button>
                <button type="button" onClick={() => onSelect("heightUnit", "metric")}
                  className={`px-3 py-1.5 rounded-full transition-all ${isHeightMetric ? "bg-white text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-foreground-muted hover:text-foreground"}`}>
                  cm
                </button>
              </div>
            </div>
            <div className="bg-white border-[1.5px] border-border rounded-md px-3.5 py-2.5">
              {isHeightMetric ? (
                <input
                  type="number" inputMode="numeric" placeholder="175"
                  value={heightCm}
                  onChange={(e) => onSelect("heightCm", e.target.value)}
                  min={100} max={250}
                  className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none placeholder:text-foreground-muted/40"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <select value={heightFt} onChange={(e) => onSelect("heightFt", e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none appearance-none cursor-pointer">
                    <option value="">ft</option>
                    {[3, 4, 5, 6, 7].map((v) => <option key={v} value={String(v)}>{v}&apos;</option>)}
                  </select>
                  <span className="text-border">|</span>
                  <select value={heightIn} onChange={(e) => onSelect("heightIn", e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none appearance-none cursor-pointer">
                    <option value="">in</option>
                    {Array.from({ length: 12 }, (_, i) => <option key={i} value={String(i)}>{i}&quot;</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Weight card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.95rem] font-semibold text-foreground">Weight</p>
              <div className="flex rounded-full bg-background border border-border p-[2px] text-[0.65rem] font-semibold leading-none">
                <button type="button" onClick={() => onSelect("weightUnit", "imperial")}
                  className={`px-3 py-1.5 rounded-full transition-all ${!isWeightMetric ? "bg-white text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-foreground-muted hover:text-foreground"}`}>
                  lbs
                </button>
                <button type="button" onClick={() => onSelect("weightUnit", "metric")}
                  className={`px-3 py-1.5 rounded-full transition-all ${isWeightMetric ? "bg-white text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-foreground-muted hover:text-foreground"}`}>
                  kg
                </button>
              </div>
            </div>
            <div className="bg-white border-[1.5px] border-border rounded-md px-3.5 py-2.5">
              <input
                type="number" inputMode="numeric"
                placeholder={isWeightMetric ? "70" : "160"}
                value={isWeightMetric ? weightKg : weightLbs}
                onChange={(e) => onSelect(isWeightMetric ? "weightKg" : "weightLbs", e.target.value)}
                min={isWeightMetric ? 30 : 75}
                max={isWeightMetric ? 300 : 500}
                className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none placeholder:text-foreground-muted/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Skip / undo link */}
      {!skipped ? (
        <button
          type="button"
          onClick={() => setShowSkipWarning(true)}
          className="block text-[0.76rem] text-foreground-muted hover:text-foreground underline underline-offset-2 transition-colors mt-1 mb-4"
        >
          I don&apos;t know my measurements — skip this
        </button>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-background border border-border-light rounded-md mb-4">
          <svg className="w-4 h-4 flex-shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[0.76rem] text-foreground-secondary flex-1">
            Measurements skipped — BMI won&apos;t affect your rate tier.
          </span>
          <button
            type="button"
            onClick={() => onSelect("skipMeasurements", "no")}
            className="text-[0.73rem] font-medium text-primary hover:underline flex-shrink-0"
          >
            Add them
          </button>
        </div>
      )}

      {/* BMI feedback card */}
      {bmi !== null ? (
        <div className="px-4 py-3.5 bg-background border border-border-light rounded-md animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.73rem] font-semibold uppercase tracking-[0.07em] text-foreground-muted">Your BMI</span>
            <span className={`text-[0.82rem] font-semibold ${bmiInfo?.color}`}>
              {bmi.toFixed(1)}
            </span>
          </div>
          {/* Scale track */}
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bmiInfo?.bar}`}
              style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[0.6rem] text-foreground-muted">18.5</span>
            <span className="text-[0.6rem] text-foreground-muted">25</span>
            <span className="text-[0.6rem] text-foreground-muted">30</span>
            <span className="text-[0.6rem] text-foreground-muted">35+</span>
          </div>
        </div>
      ) : (
        <div className="mb-4" />
      )}

      {/* Skip confirmation modal */}
      {showSkipWarning && (
        <div
          className="fixed inset-0 bg-dark/50 backdrop-blur-[3px] z-[500] flex items-center justify-center p-5"
          onClick={() => setShowSkipWarning(false)}
        >
          <div
            className="bg-white rounded-lg p-7 max-w-[360px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 mx-auto mb-5 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="font-display text-[1.15rem] font-semibold text-foreground text-center mb-2">
              Skip measurements?
            </h3>
            <p className="text-[0.85rem] text-foreground-secondary leading-relaxed text-center mb-6">
              Without your height and weight, your quoted rates may be less accurate.
            </p>
            <button
              onClick={() => setShowSkipWarning(false)}
              className="w-full py-3 bg-primary text-white font-semibold text-[0.88rem] rounded-sm hover:bg-primary-hover transition-colors mb-2"
            >
              Add my measurements
            </button>
            <button
              onClick={() => { onSelect("skipMeasurements", "yes"); setShowSkipWarning(false); }}
              className="w-full py-2.5 text-[0.82rem] font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              Skip anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
