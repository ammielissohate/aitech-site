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

/** Présentation du fondateur (page /a-propos). La photo se gère depuis l'admin (/admin/parametres). */
export interface Founder {
  name: string;
  role: string;
  location: string;
  /** Phrase d'accroche sous le titre. */
  intro: string;
  /** Quelques paragraphes courts : parcours et vision. */
  story: string[];
  /** Chiffres et faits vérifiables mis en avant. */
  highlights: { value: string; label: string }[];
  /** Prix, concours, bourses et sélections. */
  distinctions: { year: string; title: string; organization: string; detail: string; kind: "prix" | "bourse" | "selection" }[];
  /** Expériences professionnelles, de la plus récente à la plus ancienne. */
  experiences: { role: string; organization: string; period: string; points: string[] }[];
  /** Diplômes et formations certifiantes. */
  education: { title: string; organization: string; period: string; detail?: string }[];
  languages: { name: string; level: string }[];
  /** Compétences regroupées par pilier : elles servent les offres, elles n'en sont pas. */
  expertiseByPillar: { pillar: PillarSlug; title: string; skills: string[] }[];
  /** Outils utilisés au quotidien (moyens, pas prestations). */
  tools: string[];
  /** Façon de travailler, 3 points maximum. */
  principles: { title: string; description: string }[];
}

/**
 * Cadre dans lequel le projet a été réalisé.
 * Sert à ne jamais présenter un employeur ou un projet personnel comme un client AiTech.
 */
export type ProjectContext = "client-aitech" | "salarie" | "personnel" | "formation";

/** Image d'une réalisation, hébergée sur Vercel Blob. */
export interface ProjectImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Réalisation du portfolio, enregistrée en base (gérée depuis l'admin du site).
 * Chaque réalisation est rattachée à l'un des trois piliers.
 */
export interface Project {
  id: string;
  /** Identifiant lisible, utilisé dans l'ancre de partage (#projet-<slug>). */
  slug: string;
  /** `false` = brouillon, visible uniquement dans l'espace admin. */
  published: boolean;
  title: string;
  pillar: PillarSlug;
  context: ProjectContext;
  /** Nom du client ou de l'organisation, uniquement avec son autorisation. */
  clientName: string | null;
  year: number | null;
  /** Résumé court affiché sur la carte. */
  summary: string;
  /** Besoin ou problème de départ, si connu. */
  need: string | null;
  solution: string;
  /** Résultat uniquement s'il est documenté et vérifiable. */
  result: string | null;
  /** Lien externe optionnel (site en ligne, publication…). */
  link: string | null;
  /** La première image sert de couverture. */
  images: ProjectImage[];
  createdAt: string;
}
