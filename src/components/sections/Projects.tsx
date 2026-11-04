import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projectsSection } from "@/data/projects";
import { getPublishedProjects } from "@/lib/projects/repository";

/**
 * Section 6 — Nos réalisations (accueil).
 * Données lues en base et mises en cache ; sans réalisation publiée, un message honnête
 * remplace la galerie : rien n'est inventé.
 */
export async function Projects() {
  const projects = await getPublishedProjects();

  return (
    <Section id="realisations" tone="light" labelledBy="projects-title">
      <SectionHeading id="projects-title" tone="light" {...projectsSection} />

      {projects.length > 0 ? (
        <ProjectGallery projects={projects} withFilters limit={projectsSection.homeLimit} />
      ) : (
        <ProjectsEmptyState />
      )}
    </Section>
  );
}

/** État vide partagé (accueil et page Réalisations). */
export function ProjectsEmptyState() {
  return (
    <div className="reveal mt-14 flex flex-col items-start gap-6 rounded-3xl border border-dashed border-brand-deep/30 bg-white p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{projectsSection.emptyState.title}</h3>
        <p className="mt-3 leading-relaxed text-muted-ink">{projectsSection.emptyState.text}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-3">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-ink-3"
        >
          {projectsSection.emptyState.cta}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          href="/admin/editer"
          className="admin-only items-center justify-center gap-2 rounded-full border-2 border-dashed border-amber-400 bg-amber-300/15 px-5 py-3 text-sm font-semibold text-amber-700"
        >
          <Plus aria-hidden="true" className="size-4" /> Ajouter mon premier travail
        </Link>
      </div>
    </div>
  );
}
