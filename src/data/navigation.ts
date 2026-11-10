import type { NavItem } from "@/types/content";

/**
 * Navigation principale. Les liens commencent par « / » pour fonctionner
 * aussi depuis les pages solutions.
 */
export const mainNavigation: NavItem[] = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Offres", href: "/offres" },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/#contact" },
];

/** Appel à l'action répété dans la navigation. */
export const navigationCta: NavItem = { label: "Obtenir mon devis", href: "/offres" };
