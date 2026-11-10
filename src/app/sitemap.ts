import type { MetadataRoute } from "next";
import { pillars } from "@/data/services";
import { siteConfig } from "@/data/site";

/** Sitemap généré automatiquement : accueil + une entrée par page solution. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    ...pillars.map((pillar) => ({
      url: `${siteConfig.url}/solutions/${pillar.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteConfig.url}/offres`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/realisations`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/a-propos`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
