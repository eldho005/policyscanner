import { Users, Clock, DollarSign } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Canadians Helped" },
  { icon: Clock, value: "2 min", label: "Average Quote Time" },
  { icon: DollarSign, value: "$18", unit: "/month", label: "Starting From" },
];

export default function Stats() {
  return (
    <section className="py-11 bg-dark">
      <div className="max-w-[1120px] mx-auto px-7 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 justify-center">
            <div className="w-11 h-11 rounded-full bg-stats-icon-bg flex items-center justify-center flex-shrink-0">
              <s.icon size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-display text-[1.65rem] font-semibold text-white leading-none tracking-[-0.02em] opsz-32">
                {s.value}
                {s.unit && <span className="font-body text-[0.55em] font-normal opacity-60">{s.unit}</span>}
              </h4>
              <span className="text-[0.72rem] font-medium text-stats-label uppercase tracking-[0.08em] mt-0.5 block">
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
