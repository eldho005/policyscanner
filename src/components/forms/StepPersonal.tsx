"use client";

import SelectCard from "@/components/ui/SelectCard";
import Tooltip from "@/components/ui/Tooltip";

interface StepPersonalProps {
  tobacco: string;
  tobaccoType: string;
  meds: string;
  dui: string;
  familyHistory: string;
  onSelect: (field: string, value: string) => void;
}

const yesNoFields = [
  {
    key: "tobacco",
    label: "Tobacco or nicotine in the last 12 months?",
    tooltip: "Includes cigarettes, cigars, vaping, cannabis, and nicotine replacement products like patches or gum.",
  },
  {
    key: "meds",
    label: "Prescribed medication for blood pressure, cholesterol, or diabetes?",
    tooltip: "Any doctor-prescribed medication for these conditions — even if your levels are currently well-controlled.",
  },
  {
    key: "dui",
    label: "Any driving offences (DUI / impaired driving) in the past 5 years?",
    tooltip: "Criminal driving charges only. Minor traffic violations like speeding tickets don't count.",
  },
  {
    key: "familyHistory",
    label: "Immediate family member diagnosed with heart disease, cancer, or diabetes before age 65?",
    tooltip: "Includes biological parents and siblings only. The diagnosis must have occurred before age 65.",
  },
];

const tobaccoTypeOptions = [
  { value: "cigarettes", label: "Cigarettes" },
  { value: "cannabis",   label: "Cannabis" },
  { value: "vaping",     label: "Vaping / E-cigarettes" },
  { value: "other",      label: "Other" },
];

export default function StepPersonal({ tobacco, tobaccoType, meds, dui, familyHistory, onSelect }: StepPersonalProps) {
  const values: Record<string, string> = { tobacco, meds, dui, familyHistory };

  return (
    <div>
      <h2 className="font-display text-[1.7rem] font-semibold leading-[1.2] tracking-[-0.025em] text-foreground mb-3">
        Your health profile
      </h2>
      <p className="text-[0.9rem] text-foreground-secondary mb-10">
        Quick yes/no questions — these determine your rate tier.
        <span className="block text-[0.78rem] text-foreground-muted mt-1">Honest answers get you the most accurate quotes.</span>
      </p>

      {/* Yes/No Fields */}
      {yesNoFields.map((f) => (
        <div key={f.key}>
          <p className="text-[0.95rem] font-semibold text-foreground mb-4 flex items-center">
            {f.label}
            <Tooltip text={f.tooltip} />
          </p>
          <div className="grid grid-cols-2 gap-3.5 mb-8">
            <SelectCard label="Yes" selected={values[f.key] === "yes"} onClick={() => onSelect(f.key, "yes")} />
            <SelectCard label="No" selected={values[f.key] === "no"} onClick={() => onSelect(f.key, "no")} />
          </div>

          {/* Tobacco type follow-up */}
          {f.key === "tobacco" && tobacco === "yes" && (
              <div className="mb-8 -mt-4 animate-fade-up">
                <p className="text-[0.88rem] font-medium text-foreground-secondary mb-3">Which type?</p>
                <div className="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
                {tobaccoTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelect("tobaccoType", opt.value)}
                    className={`px-3 py-2.5 rounded-md text-[0.82rem] font-medium border-[1.5px] transition-all duration-150 ${
                      tobaccoType === opt.value
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border bg-white text-foreground-secondary hover:border-foreground-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[0.72rem] text-foreground-muted mt-1.5">
                Cannabis and vaping-only users often qualify for better rates.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
