"use client";
import { useState } from "react";

export default function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-4 h-4 rounded-full border border-foreground-muted/50 text-foreground-muted text-[0.6rem] font-bold flex items-center justify-center hover:bg-foreground-muted/10 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-56 bg-gray-900 text-white text-[0.75rem] leading-snug rounded-lg px-3 py-2.5 shadow-xl pointer-events-none"
        >
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          {text}
        </span>
      )}
    </span>
  );
}
