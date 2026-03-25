import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";

const SITE = "https://www.policyscanner.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/quote`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/calculator`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/licensing`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    // Note: /results is intentionally excluded — it has noindex (personalised page)
  ];

  const insurancePages: MetadataRoute.Sitemap = [
    "term-life",
    "whole-life",
    "mortgage",
    "critical-illness",
  ].map((type) => ({
    url: `${SITE}/insurance/${type}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const insightPages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE}/insights/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...insurancePages, ...insightPages];
}
