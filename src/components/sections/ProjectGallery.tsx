"use client";

import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";
import { projectCategories, projectContextLabels } from "@/data/projects";
import { cn } from "@/lib/cn";
import type { Project, ProjectCategory } from "@/types/content";

type Filter = ProjectCategory | "all";

/** Galerie filtrable. Les filtres sans projet ne sont pas affichés. */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const availableCategories = projectCategories.filter((category) =>
    projects.some((project) => project.category === category.value),
  );
  const visibleProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const filters: { value: Filter; label: string }[] = [{ value: "all", label: "Tous les projets" }, ...availableCategories];

  return (
    <div className="mt-12">
      {availableCategories.length > 1 && (
        <div role="group" aria-label="Filtrer les réalisations par catégorie" className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                filter === item.value
                  ? "border-ink bg-ink text-white"
                  : "border-line-ink bg-white text-muted-ink hover:border-ink/30 hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const categoryLabel = projectCategories.find((category) => category.value === project.category)?.label;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line-ink bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-ink-2 to-brand-deep">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="size-full object-cover transition duration-700 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-white/60">
            <ImageOff aria-hidden="true" className="size-7" />
            <span className="text-xs">Image à ajouter</span>
          </div>
        )}
        {project.status === "draft" && (
          <span className="absolute top-4 left-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-ink">
            À compléter · visible en développement uniquement
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-deep uppercase">{categoryLabel}</p>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-1 text-xs text-muted-ink">
          {projectContextLabels[project.context]}
          {project.clientName && ` · ${project.clientName}`}
          {project.year && ` · ${project.year}`}
        </p>
        <p className="mt-4 leading-relaxed text-muted-ink">{project.description}</p>

        <dl className="mt-5 space-y-3 border-t border-line-ink pt-5 text-sm">
          {project.need && (
            <div>
              <dt className="font-semibold">Besoin</dt>
              <dd className="mt-0.5 text-muted-ink">{project.need}</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold">Solution</dt>
            <dd className="mt-0.5 text-muted-ink">{project.solution}</dd>
          </div>
          {project.result && (
            <div>
              <dt className="font-semibold">Résultat</dt>
              <dd className="mt-0.5 text-muted-ink">{project.result}</dd>
            </div>
          )}
        </dl>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-deep hover:text-ink"
          >
            Voir le projet <span className="sr-only">{project.title} (nouvel onglet)</span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}
