import type { ProjectContext } from "@/types/content";

/**
 * Textes de la galerie de réalisations.
 *
 * Les réalisations elles-mêmes ne sont plus dans ce fichier : elles s'ajoutent
 * depuis le site, dans l'espace admin (/connexion), et sont enregistrées en base.
 */
export const projectsSection = {
  eyebrow: "Nos réalisations",
  title: "Du travail concret. Des solutions pensées pour chaque besoin.",
  intro: "Parcourez nos réalisations par levier : image de marque, visibilité et croissance digitale.",
  allLabel: "Tous les travaux",
  seeAll: "Voir toutes les réalisations",
  /** Nombre de réalisations affichées sur la page d'accueil (les autres sont sur /realisations). */
  homeLimit: 6,
  emptyState: {
    title: "Nos réalisations sont en cours de documentation.",
    text: "Nous préparons des fiches détaillées pour chaque projet. En attendant, nous pouvons vous présenter des exemples adaptés à votre secteur lors d'un premier échange.",
    cta: "Demander des exemples",
  },
  /** État vide sur une page solution, quand ce pôle n'a pas encore de réalisation publiée. */
  emptyPillar: "Les réalisations de ce levier sont en cours de documentation. Demandez-nous des exemples adaptés à votre secteur.",
  page: {
    title: "Nos réalisations",
    intro:
      "Identités visuelles, contenus, sites et parcours de conversion : chaque projet est présenté avec son besoin de départ et la solution apportée.",
    seo: {
      title: "Réalisations : branding, contenus et sites web",
      description:
        "Découvrez les réalisations de AiTech : identités visuelles, contenus pour les réseaux sociaux, sites web et landing pages.",
    },
  },
};

export const projectContextLabels: Record<ProjectContext, string> = {
  "client-aitech": "Projet client AiTech",
  salarie: "Réalisé dans le cadre d'un poste salarié",
  personnel: "Projet personnel",
  formation: "Projet de formation",
};
