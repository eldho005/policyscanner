import { Zap, Shield, Search, Check } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast & Simple",
    desc: "Get your personalized quotes in less than 2 minutes by answering a few basic questions.",
    checks: ["Answer 5 quick questions", "See quotes instantly"],
    iconBg: "bg-primary-subtle",
    iconColor: "text-primary",
  },
  {
    icon: Shield,
    title: "Trusted Guidance",
    desc: "Work with licensed Canadian insurance professionals who have your best interests in mind.",
    checks: ["No pressure, ever", "100% confidential"],
    iconBg: "bg-accent-green-bg",
    iconColor: "text-accent-green",
  },
  {
    icon: Search,
    title: "Find Your Best Rate",
    desc: "Compare options from top Canadian insurers side by side to guarantee the best price.",
    checks: ["Unbiased recommendations", "Save time & money"],
    iconBg: "bg-accent-blue-bg",
    iconColor: "text-accent-blue",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-26 max-sm:py-18 cv-auto">
      <div className="max-w-[1120px] mx-auto px-7 scroll-reveal">
        <div className="text-center max-sm:text-left mb-12">
          <h2 className="font-display text-[2rem] max-sm:text-[1.7rem] font-semibold tracking-[-0.03em] mb-2 opsz-32">
            Insurance made simple
          </h2>
          <p className="text-sm text-foreground-secondary">
            We&apos;ve redesigned the life insurance process to put you first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-border rounded-lg p-7 hover:border-foreground-muted transition-colors"
            >
              <div className={`w-11 h-11 rounded-md ${f.iconBg} flex items-center justify-center mb-5`}>
                <f.icon size={22} className={f.iconColor} />
              </div>
              <h3 className="text-base font-bold mb-2 tracking-[-0.01em]">{f.title}</h3>
              <p className="text-[0.83rem] text-foreground-secondary leading-relaxed mb-5">
                {f.desc}
              </p>
              <div className="flex flex-col gap-2">
                {f.checks.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-[0.82rem] text-foreground-secondary">
                    <Check size={13} className="text-accent-green" strokeWidth={2.5} />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
