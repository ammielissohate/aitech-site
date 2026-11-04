import type { SocialPlatform } from "@/types/content";

/**
 * Icônes simplifiées des réseaux sociaux.
 * Lucide ne fournit plus d'icônes de marques : ces pictogrammes minimalistes
 * sont dessinés ici au même style (trait de 1.6, 24 × 24).
 */
export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (platform) {
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.3 6.7v.1" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M13 21v-8h3M13 13h-2.5M13 13v-2.2c0-1.3.8-2 2-2h1.2" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.4 2.4 2 4 4.5 4.3" />
        </svg>
      );
    case "behance":
      return (
        <svg {...common}>
          <path d="M3 7h5a2.5 2.5 0 0 1 0 5H3V7Zm0 5h5.5a2.5 2.5 0 0 1 0 5H3v-5ZM15 8h5M14 14h7a3.5 3.5 0 1 0-1 2.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10 9.5 4.5 2.5-4.5 2.5v-5Z" />
        </svg>
      );
  }
}
