/**
 * Types partagés pour tous les contenus éditables du site.
 *
 * Les données vivent dans `src/data/*` ; les composants ne font que les afficher.
 * Ajouter ou modifier un contenu ne demande donc jamais de toucher aux composants.
 */

/** Clés d'icônes autorisées. La correspondance avec Lucide est faite dans `components/ui/Icon.tsx`. */
export type IconKey =
  | "fingerprint"
  | "megaphone"
  | "trending-up"
  | "eye"
  | "message-circle"
  | "mouse-pointer-click"
  | "compass"
  | "target"
  | "pen-tool"
  | "chart-line"
  | "puzzle"
  | "workflow"
  | "handshake"
  | "layers";

/** Identifiants des trois piliers. Utilisés dans les URLs (`/solutions/[slug]`) et le formulaire. */
export type PillarSlug = "brand-positioning" | "content-visibility" | "digital-growth";

/** Valeurs possibles du champ « Service recherché ». */
export type ServiceInterest = PillarSlug | "autre";

export interface NavItem {
  label: string;
  href: string;
}

export type SocialPlatform = "linkedin" | "instagram" | "facebook" | "tiktok" | "behance" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  /** Laisser vide pour masquer le lien sur le site. */
  url: string;
}

export interface Problem {
  title: string;
  description: string;
  icon: IconKey;
}

export interface Pillar {
  slug: PillarSlug;
  /** Numéro affiché sur la carte (« 01 »). */
  number: string;
  /** Nom court affiché en majuscules (BRAND, VISIBILITY, GROWTH). */
  dimension: string;
  name: string;
  icon: IconKey;
  /** Objectif du pilier, une phrase. */
  goal: string;
  /** Explication courte affichée sur la carte de la landing. */
  summary: string;
  /** Message commercial affiché en citation sur la page détaillée. */
  promise: string;
  /** Prestations principales, formulées comme des réponses à un besoin. */
  services: { title: string; description: string }[];
  /** Situations dans lesquelles ce pilier est pertinent (page détaillée). */
  signals: string[];
  /** Exemples de livrables possibles (page détaillée). Ce ne sont pas des réalisations. */
  deliverables: string[];
  /** Indicateurs de suivi proposés. Jamais de résultat promis. */
  indicators: string[];
  /** Outils mobilisés : ce sont des moyens, pas des prestations. */
  tools: string[];
  /** Titre et description SEO de la page détaillée. */
  seo: { title: string; description: string };
}

export interface MethodStep {
  number: string;
  name: string;
  title: string;
  description: string;
}

export interface Advantage {
  title: string;
  description: string;
  icon: IconKey;
}

export type ProjectCategory = "brand-design" | "content-visibility" | "web-experience";

/**
 * Cadre dans lequel le projet a été réalisé.
 * Sert à ne jamais présenter un employeur ou un projet personnel comme un client AiTech.
 */
export type ProjectContext = "client-aitech" | "salarie" | "personnel" | "formation";

export interface Project {
  id: string;
  /**
   * `draft` : visible uniquement en développement (`npm run dev`), avec un badge « À compléter ».
   * `published` : visible en production.
   */
  status: "draft" | "published";
  title: string;
  category: ProjectCategory;
  context: ProjectContext;
  /** Nom du client ou de l'organisation, uniquement si vous avez l'autorisation de l'afficher. */
  clientName?: string;
  description: string;
  /** Problème ou besoin initial, si connu. */
  need?: string;
  solution: string;
  /** Résultat uniquement s'il est documenté et vérifiable. */
  result?: string;
  /** Chemin depuis `public/`, par exemple `/projects/mon-projet.jpg`. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Lien externe optionnel (site en ligne, publication…). */
  link?: string;
  year?: number;
}
