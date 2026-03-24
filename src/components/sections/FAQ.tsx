"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does life insurance comparison work in Canada?",
    a: "We compare quotes from 20+ licensed Canadian insurance companies side by side. You answer a few questions about your age, health, and coverage needs — and we show you the best rates from carriers like Canada Life, Manulife, Sun Life, Industrial Alliance, and more. It takes under 2 minutes and there's no cost or obligation.",
  },
  {
    q: "How much does life insurance cost in Ontario?",
    a: "For a healthy 35-year-old non-smoker in Ontario, a $500,000 20-year term policy typically costs between $25 and $45 per month. Rates vary based on your age, smoking status, health history, and the type of policy you choose. Comparing multiple insurers is the best way to find the lowest rate — the same person can see prices differ by 30–40% across carriers.",
  },
  {
    q: "What's the difference between term and whole life insurance?",
    a: "Term life insurance covers you for a specific period (10, 20, or 30 years) and pays out only if you pass away during that term. It's the most affordable option. Whole life insurance covers you for your entire lifetime and builds cash value over time, but premiums are significantly higher — often 8 to 10 times more than term for the same coverage amount.",
  },
  {
    q: "How much life insurance coverage do I need?",
    a: "A common guideline is 10–15 times your annual income, but every family is different. Consider your mortgage balance, outstanding debts, number of dependents, childcare and education costs, and your spouse's income. Most Canadian financial advisors recommend enough coverage to replace your income for the years your family would need support.",
  },
  {
    q: "Do I need a medical exam to get life insurance?",
    a: "Not always. Many Canadian insurers now offer no-medical-exam policies for coverage amounts up to $500,000 or even $1,000,000, depending on your age and health profile. These simplified-issue policies use health questionnaires instead. However, fully underwritten policies with a medical exam typically offer the lowest premiums.",
  },
  {
    q: "Can I get life insurance if I have a pre-existing condition?",
    a: "Yes. Many Canadians with conditions like diabetes, high blood pressure, depression, or a history of cancer can still get coverage. Rates may be higher or you may be placed in a different risk class, but by comparing across 20+ insurers, you can find carriers that specialize in your specific condition and offer competitive rates.",
  },
  {
    q: "Is life insurance taxable in Canada?",
    a: "No — life insurance death benefits are paid out tax-free to your beneficiaries in Canada. This is one of the key advantages of life insurance over other forms of savings. The proceeds go directly to your named beneficiary, bypassing probate, which also means faster access to funds when your family needs them most.",
  },
  {
    q: "How long does it take to get approved for life insurance?",
    a: "With no-medical-exam policies, approval can happen in as little as 24–48 hours. Fully underwritten policies that require a medical exam typically take 3–6 weeks. By comparing quotes first, you can identify which carriers offer the fastest approval process for your specific situation.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-26 max-sm:py-18 bg-background-warm cv-auto">
      <div className="max-w-[760px] mx-auto px-7">
        <div className="text-center max-sm:text-left mb-12">
          <h2 className="font-display text-[2rem] max-sm:text-[1.7rem] font-semibold tracking-[-0.025em] opsz-32">
            Frequently asked questions
          </h2>
          <p className="text-sm text-foreground-secondary mt-2 max-w-[520px] max-sm:mx-0 mx-auto leading-relaxed">
            Everything you need to know about comparing life insurance in Canada.
          </p>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-border last:border-b-0"
            >
              <button
                onClick={() => toggle(i)}
                className="flex items-start justify-between gap-4 w-full py-5 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="text-[0.95rem] font-semibold text-foreground leading-[1.4] group-hover:text-primary transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 mt-0.5 text-foreground-muted transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[0.9rem] text-foreground-secondary leading-[1.75] pb-5">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
