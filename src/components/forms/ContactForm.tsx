"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name") as string,
      email: data.get("email") as string,
      subject: data.get("subject") as string,
      message: data.get("message") as string,
    };

    try {
      const res = await fetch("https://formspree.io/f/xyzpjwpa", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setState("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">Message sent!</h3>
        <p className="text-[0.9rem] text-foreground-secondary">
          We&apos;ll get back to you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {state === "error" && (
        <div className="bg-accent-red/8 border border-accent-red/20 text-accent-red rounded-md px-3.5 py-2.5 text-sm">
          Something went wrong — please try again or email us directly at{" "}
          <a href="mailto:support@policyscanner.ca" className="underline">
            support@policyscanner.ca
          </a>
          .
        </div>
      )}

      <div>
        <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
          Full name
        </label>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          className="w-full px-3.5 py-3 border-[1.5px] border-border rounded-sm text-[0.9rem] text-foreground bg-white outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] transition-all"
        />
      </div>

      <div>
        <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
          Email address
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className="w-full px-3.5 py-3 border-[1.5px] border-border rounded-sm text-[0.9rem] text-foreground bg-white outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] transition-all"
        />
      </div>

      <div>
        <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
          Subject
        </label>
        <select
          name="subject"
          required
          defaultValue=""
          className="w-full px-3.5 py-3 border-[1.5px] border-border rounded-sm text-[0.9rem] text-foreground bg-white outline-none appearance-none pr-9 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] transition-all bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20fill=%27none%27%20stroke=%27%23888%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27M4%206l4%204%204-4%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
        >
          <option value="" disabled>Select a topic</option>
          <option value="quote">Help with my quote</option>
          <option value="coverage">Coverage question</option>
          <option value="partnership">Partnership inquiry</option>
          <option value="press">Press / media</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full px-3.5 py-3 border-[1.5px] border-border rounded-sm text-[0.9rem] text-foreground bg-white outline-none resize-y focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-3.5 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors btn-press disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Sending…" : "Send message"}
      </button>

      <p className="text-center text-xs text-foreground-muted leading-relaxed">
        By submitting this form, you agree to our{" "}
        <Link href="/privacy" className="text-foreground-secondary underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
