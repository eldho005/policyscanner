"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const reviews = [
  {
    text: "Didn't think I'd actually leave a review for an insurance site but here we are. Got quotes in like 10 minutes while my kid napped. Way easier than I expected.",
    name: "Rahul V.",
    location: "Toronto, ON",
    initials: "RV",
    color: "bg-primary",
    stars: 5,
  },
  {
    text: "Second baby on the way and I kept putting this off. Finally sat down and did it on a lunch break. Honestly the hardest part was picking a beneficiary lol.",
    name: "Arun M.",
    location: "Markham, ON",
    initials: "AM",
    color: "bg-accent-green",
    stars: 5,
  },
  {
    text: "I liked being able to see everything side by side without someone calling me every five minutes. Ended up going with a policy I wouldn't have found on my own.",
    name: "Neha G.",
    location: "Mississauga, ON",
    initials: "NG",
    color: "bg-accent-blue",
    stars: 5,
  },
  {
    text: "Good experience overall. The advisor was helpful and not pushy which I appreciated. Only reason for 4 stars is I wish the site explained some of the terms better upfront.",
    name: "Amit B.",
    location: "Brampton, ON",
    initials: "AB",
    color: "bg-accent-purple",
    stars: 4,
  },
  {
    text: "Self employed, no group benefits, been avoiding this for years. The whole process was painless and nobody tried to upsell me on stuff I didn't need.",
    name: "Priya S.",
    location: "Oakville, ON",
    initials: "PS",
    color: "bg-accent-green",
    stars: 5,
  },
  {
    text: "Had some health concerns and assumed getting coverage would be a nightmare. The advisor was really patient and walked me through my options. Ended up with something that works.",
    name: "Sunita R.",
    location: "Ottawa, ON",
    initials: "SR",
    color: "bg-primary",
    stars: 5,
  },
  {
    text: "My wife and I both got quotes on a Saturday morning. Took maybe 20 minutes total for both of us. We've been meaning to do this for literally years.",
    name: "Rajesh P.",
    location: "Hamilton, ON",
    initials: "RP",
    color: "bg-accent-blue",
    stars: 5,
  },
  {
    text: "I'm in my late 50s so I was expecting the worst with pricing. It was actually more reasonable than I thought. Not cheap, but fair for what you get.",
    name: "Meera T.",
    location: "Kingston, ON",
    initials: "MT",
    color: "bg-accent-purple",
    stars: 4,
  },
  {
    text: "Realized I was probably overpaying when I saw what else was available. Switched to a better policy and it was honestly less hassle than cancelling a gym membership.",
    name: "Michael O.",
    location: "London, ON",
    initials: "MO",
    color: "bg-primary",
    stars: 5,
  },
  {
    text: "Called with a bunch of questions and the person I spoke to actually knew their stuff. Didn't feel like they were reading from a script which was refreshing.",
    name: "Divya K.",
    location: "Waterloo, ON",
    initials: "DK",
    color: "bg-accent-green",
    stars: 5,
  },
  {
    text: "Did the whole thing at midnight because that's parent life. No pressure, no follow-up calls at 8am the next day. Just the quotes in my inbox.",
    name: "Sreejith N.",
    location: "Barrie, ON",
    initials: "SN",
    color: "bg-accent-blue",
    stars: 5,
  },
  {
    text: "New to Canada and had no clue where to start with insurance here. This made it way less intimidating. The advisor was super patient with all my questions.",
    name: "Ananya P.",
    location: "Guelph, ON",
    initials: "AP",
    color: "bg-accent-purple",
    stars: 5,
  },
];

const CARDS_PER_PAGE = 4;
const PAGE_COUNT = Math.ceil(reviews.length / CARDS_PER_PAGE);
const ROTATE_MS = 3500;

const avgRating =
  Math.round(
    (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length) * 10
  ) / 10;

const aggregateRatingJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "PolicyScanner",
  url: "https://policyscanner.ca",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: String(avgRating),
    bestRating: "5",
    ratingCount: String(reviews.length),
  },
};

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" stroke="none">
      <polygon
        className={filled ? "star-fill" : ""}
        fill={filled ? undefined : "#e0dcd5"}
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

type Phase = "idle" | "exiting" | "entering";

export default function Reviews() {
  const { ref: sectionRef, visible: sectionVisible } = useReveal();
  const [page, setPage] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const nextPageRef = useRef(0);
  const pausedRef = useRef(false);

  const goTo = useCallback((next: number) => {
    nextPageRef.current = next;
    setPhase("exiting");
  }, []);

  // Phase machine: exiting → swap data → entering → idle
  useEffect(() => {
    if (phase === "exiting") {
      // Wait for exit animation to fully finish + a brief hold
      const t = setTimeout(() => {
        setPage(nextPageRef.current);
        setPhase("entering");
      }, 600);
      return () => clearTimeout(t);
    }
    if (phase === "entering") {
      // 900ms delay + 700ms duration + buffer
      const t = setTimeout(() => setPhase("idle"), 1700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Auto-rotate
  useEffect(() => {
    if (!sectionVisible || phase !== "idle") return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      goTo((page + 1) % PAGE_COUNT);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [sectionVisible, phase, page, goTo]);

  const pageReviews = reviews.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  return (
    <section
      id="reviews"
      className="py-26 max-sm:py-18"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
      />
      <div ref={sectionRef} className="max-w-[1120px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-14 items-start">
          {/* Left */}
          <div>
            <h2 className="font-display text-[2rem] max-sm:text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.2] mb-4 opsz-32">
              What our clients are saying
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-8">
              Join thousands of Ontarians who found their best insurance policy through PolicyScanner.
            </p>

            {/* Google Reviews Box */}
            <div className="bg-white border border-border rounded-md px-5 py-4.5 mb-4">
              <div className="flex items-center gap-2 mb-1">
                {/* Google "G" logo */}
                <svg width="22" height="22" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M44.5 20H24v8h11.8C34.1 33.3 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.5 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
                  <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.5 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#FBBC05" d="M24 44c5 0 9.6-1.7 13.1-4.6l-6.1-5C29.3 35.7 26.7 36 24 36c-5.5 0-10.1-3.7-11.8-8.7l-6.5 5C9.5 39.4 16.3 44 24 44z"/>
                  <path fill="#EA4335" d="M44.5 20H24v8h11.8c-.8 2.2-2.3 4-4.2 5.4l6.1 5c3.6-3.3 5.8-8.1 5.8-13.4 0-1.3-.1-2.7-.2-4z"/>
                </svg>
                <span className="text-sm font-semibold text-foreground">Google Reviews</span>
              </div>
              <div className="text-[0.8rem] text-foreground-muted">Rated 4.9/5</div>
            </div>

            <a
              href="https://g.page/r/CSTWjjGbW_3gEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 px-5 border border-border rounded-sm text-[0.82rem] font-medium text-foreground-secondary hover:border-foreground-muted hover:text-foreground transition-colors"
            >
              Read all reviews
            </a>

            {/* Page dots */}
            <div className="flex items-center justify-center gap-1 mt-6">
              {Array.from({ length: PAGE_COUNT }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { if (phase === "idle" && i !== page) goTo(i); }}
                  aria-label={`Show reviews page ${i + 1}`}
                  className="p-2 -m-0.5"
                >
                  <span className={`block rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-border hover:bg-foreground-muted"
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Review Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            {pageReviews.map((r, i) => {
              const isExiting = phase === "exiting";
              const isEntering = phase === "entering";

              return (
              <div
                key={`${page}-${r.name}`}
                className={`bg-white border border-border rounded-lg p-7 flex flex-col ${i >= 2 ? "max-sm:hidden" : ""} ${
                  isExiting
                    ? "opacity-0 -translate-y-2 scale-[0.98] transition-all duration-400 ease-[cubic-bezier(0.4,0,1,1)]"
                    : isEntering
                      ? "opacity-100 translate-y-0 scale-100 transition-all duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      : "opacity-100 translate-y-0 scale-100"
                }`}
                style={{
                  transitionDelay: isExiting ? `${i * 40}ms` : isEntering ? `${i * 80}ms` : "0ms",
                }}
              >
                <div className="flex gap-[3px] mb-4">
                  {[...Array(5)].map((_, si) => (
                    <StarIcon key={si} filled={si < r.stars} />
                  ))}
                </div>
                <p className="text-sm text-foreground-secondary leading-[1.65] flex-1 mb-5">
                  {r.text}
                </p>
                <div className="flex items-center gap-2.5 pt-4 border-t border-border-light">
                  <div
                    className={`w-9 h-9 rounded-full ${r.color} text-white flex items-center justify-center text-xs font-semibold`}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-[0.84rem] font-semibold text-foreground tracking-[-0.01em]">
                      {r.name}
                    </p>
                    <p className="text-[0.74rem] text-foreground-muted">{r.location}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
