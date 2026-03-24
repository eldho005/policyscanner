"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service when available
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-background">
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold text-foreground-muted mb-4">500</p>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mb-3">
          Something went wrong
        </h1>
        <p className="text-foreground-muted mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white
                       font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-border
                       text-foreground font-semibold text-sm rounded-sm hover:bg-background-warm transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
