import type { Project, ProjectCategory, ProjectContext } from "@/types/content";

/**
 * Réalisations affichées dans la section « Nos réalisations ».
 *
 * Pour ajouter un projet :
 *  1. Déposez l'image dans `public/projects/` (idéalement 1600 × 1000 px, en .jpg ou .webp).
 *  2. Copiez le modèle ci-dessous, complétez-le et passez `status` à "published".
 *
 * Règles :
 *  - `context` indique le cadre réel du projet. Un projet réalisé comme salarié
 *    ou un projet personnel n'est jamais présenté comme un client AiTech.
 *  - `clientName` uniquement avec l'autorisation du client.
 *  - `result` uniquement s'il est documenté et vérifiable.
 *
 * Les projets en `draft` sont visibles uniquement en développement.
 */
export const projectsSection = {
  eyebrow: "Nos réalisations",
  title: "Du travail concret. Des solutions pensées pour chaque besoin.",
  intro: "Une sélection de projets présentés avec leur besoin de départ et la solution apportée.",
  emptyState: {
    title: "Nos réalisations sont en cours de documentation.",
    text: "Nous préparons des fiches détaillées pour chaque projet. En attendant, nous pouvons vous présenter des exemples adaptés à votre secteur lors d'un premier échange.",
    cta: "Demander des exemples",
  },
};

export const projectCategories: { value: ProjectCategory; label: string }[] = [
  { value: "brand-design", label: "Brand & Design" },
  { value: "content-visibility", label: "Content & Visibility" },
  { value: "web-experience", label: "Web & Digital Experience" },
];

export const projectContextLabels: Record<ProjectContext, string> = {
  "client-aitech": "Projet client AiTech",
  salarie: "Réalisé dans le cadre d'un poste salarié",
  personnel: "Projet personnel",
  formation: "Projet de formation",
};

export const projects: Project[] = [
  // ─── MODÈLE À DUPLIQUER (visible uniquement en développement) ───
  {
    id: "modele-projet",
    status: "draft",
    title: "Titre du projet à compléter",
    category: "web-experience",
    context: "personnel",
    description: "Une phrase qui résume le projet et son objectif.",
    need: "Le besoin ou le problème de départ, s'il est connu.",
    solution: "Ce qui a été conçu et réalisé pour y répondre.",
    // result: "Uniquement un résultat documenté.",
    // image: { src: "/projects/mon-projet.jpg", alt: "Description de l'image", width: 1600, height: 1000 },
  },
];

/**
 * Projets à afficher selon l'environnement :
 * tous en développement, uniquement les projets publiés en production.
 */
export function getVisibleProjects(): Project[] {
  const isDevelopment = process.env.NODE_ENV === "development";
  return projects.filter((project) => project.status === "published" || isDevelopment);
}
