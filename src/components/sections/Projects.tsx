import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getVisibleProjects, projectsSection } from "@/data/projects";
import { ProjectGallery } from "./ProjectGallery";

/**
 * Section 6 — Nos réalisations.
 * Sans projet publié, un message honnête remplace la galerie : aucune réalisation n'est inventée.
 */
export function Projects() {
  const projects = getVisibleProjects();

  return (
    <Section id="realisations" tone="light" labelledBy="projects-title">
      <SectionHeading id="projects-title" tone="light" {...projectsSection} />

      {projects.length > 0 ? (
        <ProjectGallery projects={projects} />
      ) : (
        <div className="reveal mt-14 flex flex-col items-start gap-6 rounded-3xl border border-dashed border-brand-deep/30 bg-white p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-semibold tracking-tight">{projectsSection.emptyState.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-ink">{projectsSection.emptyState.text}</p>
          </div>
          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-ink-3"
          >
            {projectsSection.emptyState.cta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      )}
    </Section>
  );
}
