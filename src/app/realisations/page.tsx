import type { Metadata } from "next";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProjectsEmptyState } from "@/components/sections/Projects";
import { Section } from "@/components/ui/Section";
import { projectsSection } from "@/data/projects";
import { getPublishedProjects } from "@/lib/projects/repository";

export const metadata: Metadata = {
  title: projectsSection.page.seo.title,
  description: projectsSection.page.seo.description,
  alternates: { canonical: "/realisations" },
  openGraph: { title: projectsSection.page.seo.title, description: projectsSection.page.seo.description, url: "/realisations" },
};

/** Page « Réalisations » : toute la galerie, filtrable par levier. */
export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <section aria-labelledby="realisations-title" className="relative overflow-hidden bg-ink pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -top-40 right-0 h-[420px] w-[700px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-brand-3" />
            Portfolio
          </p>
          <h1 id="realisations-title" className="font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-6xl">
            {projectsSection.page.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{projectsSection.page.intro}</p>
        </div>
      </section>

      <Section tone="light" className="pt-12 sm:pt-16">
        {projects.length > 0 ? <ProjectGallery projects={projects} withFilters /> : <ProjectsEmptyState />}
      </Section>

      <div className="pt-24 sm:pt-32">
        <FinalCta href="/#contact" />
      </div>
    </>
  );
}
