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
  ];
}
