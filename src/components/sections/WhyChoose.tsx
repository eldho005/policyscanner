import { X, Check } from "lucide-react";

const comparisons = [
  {
    title: "Banks",
    type: "bad" as const,
    items: ["Limited options", "Higher premiums", "One-size-fits-all products"],
  },
  {
    title: "Traditional Brokers",
    type: "bad" as const,
    items: ["Push specific companies", "Slower, manual process", "Limited transparency"],
  },
  {
    title: "PolicyScanner",
    type: "good" as const,
    items: ["Compare 20+ insurers instantly", "Unbiased recommendations", "Licensed advisors when you need them"],
  },
];

export default function WhyChoose() {
  return (
    <section className="py-26 max-sm:py-18 bg-background-warm cv-auto">
      <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 scroll-reveal">
        <div>
          <h2 className="font-display text-[2rem] max-sm:text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.2] mb-4 opsz-32">
            Why thousands of Canadians choose PolicyScanner
          </h2>
          <p className="text-sm text-foreground-secondary leading-relaxed mb-8">
            We combine smart technology with real human advice — so you get the best policy without the stress.
          </p>
          <blockquote className="text-sm italic text-foreground-secondary border-l-2 border-primary pl-4">
            &ldquo;You don&apos;t work for an insurance company. Neither do we.&rdquo;
          </blockquote>
        </div>

        <div className="flex flex-col gap-4">
          {comparisons.map((c) => (
            <div
              key={c.title}
              className={`border rounded-lg p-6 ${
                c.type === "good"
                  ? "bg-accent-green-bg border-accent-green"
                  : "bg-white border-border"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    c.type === "good"
                      ? "bg-accent-green-mid"
                      : "bg-accent-red-bg"
                  }`}
                >
                  {c.type === "good" ? (
                    <Check size={12} className="text-accent-green" strokeWidth={2.5} />
                  ) : (
                    <X size={12} className="text-accent-red" strokeWidth={2.5} />
                  )}
                </div>
                <h4 className="font-bold text-sm">{c.title}</h4>
              </div>
              <ul className="space-y-2">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[0.84rem] text-foreground-secondary">
                    <span className="w-1 h-1 rounded-full bg-foreground-muted flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
