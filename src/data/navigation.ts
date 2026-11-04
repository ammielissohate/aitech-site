import type { NavItem } from "@/types/content";

/**
 * Navigation principale. Les liens commencent par « / » pour fonctionner
 * aussi depuis les pages solutions.
 */
export const mainNavigation: NavItem[] = [
  { label: "Accueil", href: "/#accueil" },
  { label: "Nos solutions", href: "/#solutions" },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/#contact" },
];

/** Appel à l'action répété dans la navigation. */
export const navigationCta: NavItem = { label: "Parlons de votre projet", href: "/#contact" };
