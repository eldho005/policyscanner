import Link from "next/link";

const steps = [
  { num: 1, title: "Start Quote", desc: "Answer 5 quick questions about your needs to get started." },
  { num: 2, title: "Compare Options", desc: "Instantly see quotes from top Canadian insurers, side by side." },
  { num: 3, title: "Apply & Get Covered", desc: "Apply online or speak with an advisor — your choice." },
];

export default function Steps() {
  return (
    <section id="steps" className="py-26 max-sm:py-14 cv-auto">
      <div className="max-w-[1120px] mx-auto px-7 scroll-reveal">
        <div className="text-center max-sm:text-left mb-12 max-sm:mb-8">
          <h2 className="font-display text-[2rem] max-sm:text-[1.7rem] font-semibold tracking-[-0.03em] mb-2 opsz-32">
            Get covered in 3 simple steps
          </h2>
          <p className="text-sm text-foreground-secondary">
            No paperwork. No confusion. Just a fast, secure process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-sm:gap-6 mb-11 max-sm:mb-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-6 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-border" />

          {steps.map((s) => (
            <div key={s.num} className="text-center relative">
              <div className="w-12 h-12 rounded-full border-[1.5px] border-border bg-white flex items-center justify-center font-display text-[1.1rem] font-medium text-foreground mx-auto mb-4.5 relative z-[1]">
                {s.num}
              </div>
              <h3 className="text-base font-bold mb-2 tracking-[-0.01em]">{s.title}</h3>
              <p className="text-[0.85rem] text-foreground-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center max-sm:w-full px-5.5 py-3 bg-primary text-white font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
          >
            Compare Quotes Now
          </Link>
          <span className="block mt-3 text-xs text-foreground-muted">Takes less than 2 minutes</span>
        </div>
      </div>
    </section>
  );
}
