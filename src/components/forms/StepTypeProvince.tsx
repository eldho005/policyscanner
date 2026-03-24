"use client";

import SelectCard from "@/components/ui/SelectCard";
import { Clock, Infinity, Home, Heart, MapPin, Globe } from "lucide-react";

const typeOptions = [
  { value: "term", label: "Term Life", description: "Coverage for a set time period", icon: <Clock size={18} /> },
  { value: "whole", label: "Whole Life", description: "Coverage for life with savings", icon: <Infinity size={18} /> },
  { value: "mortgage", label: "Mortgage Insurance", description: "Helps pay off your mortgage", icon: <Home size={18} /> },
  { value: "critical", label: "Critical Illness", description: "Pays a lump sum in case of serious illness", icon: <Heart size={18} /> },
];

const termLengthOptions = [
  { value: "10", label: "10 Yrs" },
  { value: "15", label: "15 Yrs" },
  { value: "20", label: "20 Yrs" },
  { value: "25", label: "25 Yrs" },
  { value: "30", label: "30 Yrs" },
];

interface StepTypeProvinceProps {
  selectedType: string;
  selectedProvince: string;
  selectedTermLength: string;
  onSelectType: (val: string) => void;
  onSelectProvince: (val: string) => void;
  onSelectTermLength: (val: string) => void;
  onOtherProvince: () => void;
}

export default function StepTypeProvince({
  selectedType,
  selectedProvince,
  selectedTermLength,
  onSelectType,
  onSelectProvince,
  onSelectTermLength,
  onOtherProvince,
}: StepTypeProvinceProps) {
  return (
    <div>
      <h2 className="font-display text-[1.7rem] font-semibold leading-[1.2] tracking-[-0.025em] text-foreground mb-10">
        What type of coverage are you looking for?
      </h2>

      <div className="grid grid-cols-2 gap-3.5 max-[480px]:grid-cols-1">
        {typeOptions.map((opt) => (
          <SelectCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            selected={selectedType === opt.value}
            onClick={() => onSelectType(opt.value)}
          />
        ))}
      </div>

      {/* Term Length — only visible when type is "term" */}
      {selectedType === "term" && (
        <div className="mt-10 animate-fade-up">
          <p className="text-[0.95rem] font-semibold text-foreground mb-4">Preferred term length</p>
          <div className="grid grid-cols-5 gap-2 max-[480px]:grid-cols-3">
            {termLengthOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelectTermLength(opt.value)}
                className={`px-2 py-2.5 rounded-md text-[0.82rem] font-medium border-[1.5px] transition-all duration-150 ${
                  selectedTermLength === opt.value
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-white text-foreground-secondary hover:border-foreground-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[0.72rem] text-foreground-muted mt-2">
            You can compare other terms on the results page.
          </p>
        </div>
      )}

      <div className="mt-12">
        <p className="text-[0.95rem] font-semibold text-foreground mb-4">Which province are you in?</p>
        <div className="grid grid-cols-1 gap-3">
          <SelectCard
            label="Ontario"
            icon={<MapPin size={18} />}
            selected={selectedProvince === "ontario"}
            onClick={() => onSelectProvince("ontario")}
          />
          <button
            type="button"
            onClick={onOtherProvince}
            className="flex items-center gap-3 w-full px-4 py-3.5 bg-white border-[1.5px] border-border rounded-md text-left select-card-transition hover:border-foreground-muted hover:bg-background"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-blue-bg flex items-center justify-center text-accent-blue flex-shrink-0">
              <Globe size={18} />
            </div>
            <span className="text-sm font-medium text-foreground">Other Province</span>
          </button>
        </div>
      </div>
    </div>
  );
}
