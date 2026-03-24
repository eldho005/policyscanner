"use client";

import { clsx } from "clsx";

interface SelectCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export default function SelectCard({ label, description, icon, selected, onClick }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 w-full px-4 rounded-md text-left select-card-transition",
        selected
          ? "py-[13.25px] border-2 border-primary bg-primary-subtle"
          : "py-3.5 border-[1.5px] border-border hover:border-foreground-muted hover:bg-background"
      )}
    >
      {icon && (
        <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="block text-[0.72rem] text-foreground-muted leading-snug mt-0.5">{description}</span>
        )}
      </div>
    </button>
  );
}
