import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { articles, getArticleBySlug, getRelatedArticles } from "@/data/articles";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AUTHOR_LINKEDIN = "https://www.linkedin.com/in/eldho-george-99b09350";
const AUTHOR_NAME = "Eldho George, LLQP RIBO";
const SITE_URL = "https://policyscanner.ca";

/* ── Static params for SSG ── */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

/* ── Dynamic metadata for SEO ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} — PolicyScanner.ca`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
    alternates: {
      canonical: `https://policyscanner.ca/insights/${slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.relatedSlugs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    image: article.image ?? undefined,
    url: `${SITE_URL}/insights/${article.slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_LINKEDIN,
      sameAs: [AUTHOR_LINKEDIN],
      jobTitle: "Licensed Insurance Advisor",
      knowsAbout: ["Life Insurance", "LLQP", "RIBO", "Canadian Insurance"],
    },
    publisher: {
      "@type": "Organization",
      name: "PolicyScanner",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* ── Hero / Header ── */}
        <header className="bg-background-warm border-b border-border-light">
          <div className="max-w-[720px] mx-auto px-7 pt-14 pb-12 max-sm:pt-10 max-sm:pb-9">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-[0.8rem] text-foreground-muted list-none">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="select-none">›</li>
                <li>
                  <Link href="/#insights" className="hover:text-foreground transition-colors">Insights</Link>
                </li>
                <li aria-hidden="true" className="select-none">›</li>
                <li className="text-foreground-secondary truncate max-w-[200px]">{article.title}</li>
              </ol>
            </nav>

            {/* Tag */}
            <span className="inline-block bg-primary-subtle text-primary text-[0.7rem] font-semibold px-2.5 py-1 rounded-full mb-4 tracking-[0.02em] uppercase">
              {article.tag}
            </span>

            {/* Title */}
            <h1 className="font-display text-[2.2rem] max-sm:text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.025em] opsz-48 text-foreground mb-4">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-[1.05rem] max-sm:text-[0.95rem] text-foreground-secondary leading-relaxed mb-6">
              {article.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-[0.8rem] text-foreground-muted">
              <a
                href={AUTHOR_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground-secondary hover:text-primary transition-colors"
              >
                {article.author}
              </a>
              <span className="w-1 h-1 rounded-full bg-foreground-muted" />
              <time>{article.date}</time>
              <span className="w-1 h-1 rounded-full bg-foreground-muted" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* ── Cover image (if available) ── */}
        {article.image && (
          <div className="max-w-[720px] mx-auto px-7 -mt-0">
            <div className="rounded-lg overflow-hidden border border-border-light mt-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-[320px] max-sm:h-[200px] object-cover"
              />
            </div>
          </div>
        )}

        {/* ── Table of Contents ── */}
        <div className="max-w-[720px] mx-auto px-7 mt-10 mb-4">
          <details className="group bg-white border border-border rounded-lg" open>
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none text-[0.85rem] font-semibold text-foreground">
              In this article
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-foreground-muted transition-transform group-open:rotate-180"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <ol className="px-6 pb-5 flex flex-col gap-2 list-decimal list-inside text-[0.84rem] text-foreground-secondary leading-relaxed">
              {article.sections.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="hover:text-primary transition-colors"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </div>

        {/* ── Article Body ── */}
        <article className="max-w-[720px] mx-auto px-7 pt-6 pb-16">
          {article.sections.map((section, i) => (
            <section key={i} id={`section-${i}`} className="mb-12 last:mb-0 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] max-sm:text-[1.2rem] font-semibold leading-[1.25] tracking-[-0.015em] opsz-32 text-foreground mb-4">
                {section.heading}
              </h2>
              {section.body.split("\n\n").map((paragraph, j) => (
                <p
                  key={j}
                  className="text-[0.95rem] text-foreground-secondary leading-[1.75] mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {/* ── CTA Banner ── */}
          <div className="mt-14 bg-primary-subtle border border-primary-light rounded-lg p-8 max-sm:p-6 text-center">
            <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-2">
              Ready to compare your options?
            </h3>
            <p className="text-[0.9rem] text-foreground-secondary mb-5 leading-relaxed">
              Get personalized life insurance quotes from 30+ Canadian insurers in under 2 minutes.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-7 py-3 bg-primary text-white font-semibold text-[0.9rem] rounded-sm hover:bg-primary-hover transition-colors"
            >
              Compare Quotes Now
            </Link>
          </div>
        </article>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <section className="bg-background-warm border-t border-border-light py-16 max-sm:py-12">
            <div className="max-w-[720px] mx-auto px-7">
              <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.015em] opsz-32 text-foreground mb-6">
                Continue reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/insights/${r.slug}`}
                    className="bg-white border border-border rounded-lg overflow-hidden hover:border-foreground-muted transition-colors group"
                  >
                    <div className={`h-[120px] ${r.image ? "" : r.gradientClass}`}>
                      {r.image && (
                        <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[0.68rem] font-semibold text-primary uppercase tracking-[0.04em]">
                        {r.tag}
                      </span>
                      <h3 className="text-[0.92rem] font-bold text-foreground leading-[1.35] mt-1.5 group-hover:text-primary transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-[0.78rem] text-foreground-muted mt-1.5">{r.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
