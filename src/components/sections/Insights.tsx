import Link from "next/link";

const articles = [
  {
    type: "lg" as const,
    tag: "Guide",
    title: "Term vs. Whole Life Insurance in Canada",
    desc: "Discover the key differences between the two main types of life insurance and find the best option for your family's future.",
    link: "Read the guide →",
    href: "/insights/term-vs-whole-life-insurance-canada",
    gradientClass: "gradient-warm-1",
  },
  {
    type: "sm" as const,
    title: "How much coverage do you need?",
    desc: "Use our smart calculator to find your ideal life insurance amount.",
    link: "Use calculator →",
    href: "/insights/how-much-life-insurance-coverage-do-you-need",
    gradientClass: "gradient-warm-2",
    image: "https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_400/v1774318010/article2_wvttq9.webp",
    imagePosition: "object-left",
  },
  {
    type: "sm" as const,
    title: "When is the best time to buy?",
    desc: "Why buying earlier can mean huge savings for the rest of your life.",
    link: "Learn more →",
    href: "/insights/best-time-to-buy-life-insurance",
    gradientClass: "gradient-warm-3",
    image: "https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_400/v1774318010/article3_blsbch.webp",
    imagePosition: "object-center",
  },
];

export default function Insights() {
  return (
    <section id="insights" className="py-26 max-sm:py-14 bg-background-warm cv-auto">
      <div className="max-w-[1120px] mx-auto px-7 scroll-reveal">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-10 max-sm:mb-7">
          <div>
            <h2 className="font-display text-[2rem] max-sm:text-[1.7rem] font-semibold tracking-[-0.025em] opsz-32">
              Life insurance insights
            </h2>
            <p className="text-sm text-foreground-secondary mt-1.5">
              Expert guides, comparisons, and practical resources to help you choose the right coverage for your family.
            </p>
          </div>
          <Link href="/insights/term-vs-whole-life-insurance-canada" className="text-sm font-semibold text-primary whitespace-nowrap flex items-center gap-1 py-2 -my-2">
            Explore all resources →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Large Card */}
          <Link href={articles[0].href} className="bg-white border border-border rounded-lg overflow-hidden hover:border-foreground-muted transition-colors group">
            <div className="h-[200px] relative overflow-hidden">
              <img
                src="https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_800/v1774318010/article1_vwc8dr.webp"
                alt={articles[0].title}
                className="w-full h-full object-cover object-left"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full text-[0.7rem] font-semibold text-primary">
                {articles[0].tag}
              </span>
            </div>
            <div className="p-5.5">
              <h3 className="text-base font-bold mb-2 leading-[1.35] tracking-[-0.01em] group-hover:text-primary transition-colors">{articles[0].title}</h3>
              <p className="text-[0.83rem] text-foreground-secondary leading-relaxed mb-3.5">{articles[0].desc}</p>
              <span className="text-[0.82rem] font-semibold text-primary inline-flex items-center gap-1">
                {articles[0].link}
              </span>
            </div>
          </Link>

          {/* Small Cards */}
          <div className="flex flex-col gap-5">
            {articles.slice(1).map((a) => (
              <Link key={a.title} href={a.href} className="bg-white border border-border rounded-lg overflow-hidden hover:border-foreground-muted transition-colors flex flex-col sm:flex-row group">
                <div className={`sm:w-[170px] h-[130px] sm:h-auto flex-shrink-0 overflow-hidden max-sm:hidden ${!a.image ? a.gradientClass : ""}`}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.title}
                      className={`w-full h-full object-cover ${a.imagePosition ?? "object-center"}`}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-5.5 flex flex-col justify-center">
                  <h3 className="text-base font-bold mb-2 leading-[1.35] tracking-[-0.01em] group-hover:text-primary transition-colors">{a.title}</h3>
                  <p className="text-[0.83rem] text-foreground-secondary leading-relaxed mb-3.5">{a.desc}</p>
                  <span className="text-[0.82rem] font-semibold text-primary inline-flex items-center gap-1">
                    {a.link}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
