import type { SocialLink } from "@/types/content";

/** Résout l'URL publique du site (voir `siteConfig.url`). */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = explicit || (vercel ? `https://${vercel}` : "http://localhost:3000");
  return url.replace(/\/$/, "");
}

/**
 * Configuration générale du site : identité, coordonnées et réseaux sociaux.
 *
 * ➜ C'est le premier fichier à compléter avant la mise en ligne.
 *   Les champs laissés vides sont masqués automatiquement sur le site.
 *   Sans e-mail ni WhatsApp, le formulaire est désactivé (un avertissement l'indique en développement).
 */
export const siteConfig = {
  name: "AiTech",
  category: "Digital Growth Studio",
  pillarsLine: "Brand, Visibility & Acquisition",
  signature: "Votre image. Votre visibilité. Votre croissance.",
  description:
    "AiTech est un studio de croissance digitale qui aide les entreprises à construire une image forte, développer leur visibilité et transformer leur présence digitale en opportunités commerciales.",

  /**
   * URL publique du site (SEO, sitemap, Open Graph). Ordre de priorité :
   *  1. NEXT_PUBLIC_SITE_URL (recommandé : votre domaine définitif) ;
   *  2. le domaine de production fourni automatiquement par Vercel ;
   *  3. http://localhost:3000 en local.
   */
  url: resolveSiteUrl(),
  locale: "fr_FR",
  language: "fr",

  contact: {
    /** Adresse e-mail de réception des demandes. À COMPLÉTER. */
    email: "",
    /**
     * Numéro WhatsApp au format international, chiffres uniquement, sans « + » ni espaces.
     * Exemple pour le Bénin : "2290100000000". À COMPLÉTER.
     */
    whatsapp: "",
    /** Mention de localisation affichée dans la section contact et le footer. À COMPLÉTER. */
    location: "",
  },

  /** Réseaux sociaux. Un lien avec une URL vide n'est pas affiché. */
  socials: [
    { platform: "linkedin", label: "LinkedIn", url: "" },
    { platform: "instagram", label: "Instagram", url: "" },
    { platform: "facebook", label: "Facebook", url: "" },
    { platform: "tiktok", label: "TikTok", url: "" },
  ] satisfies SocialLink[] as SocialLink[],
} as const;

/** Réseaux sociaux réellement renseignés. */
export const activeSocials = siteConfig.socials.filter((social) => social.url.trim() !== "");
