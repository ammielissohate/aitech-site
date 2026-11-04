"use client";

import Image from "next/image";
import Link from "next/link";
import { Images, Pencil, Plus } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { projectContextLabels, projectsSection } from "@/data/projects";
import { pillars } from "@/data/services";
import { cn } from "@/lib/cn";
import type { PillarSlug, Project } from "@/types/content";
import { ProjectLightbox } from "./ProjectLightbox";

type Filter = PillarSlug | "all";

interface ProjectGalleryProps {
  projects: Project[];
  /** Affiche les onglets par pôle (accueil, page Réalisations). */
  withFilters?: boolean;
  /** Pôle imposé (pages solutions) : sert aussi au bouton « + » de l'admin. */
  pillar?: PillarSlug;
  /** Nombre maximum de cartes affichées (le reste est accessible via /realisations). */
  limit?: number;
  /** Fond de la section, pour adapter les contrastes. */
  tone?: "light" | "dark";
}

/**
 * Galerie de réalisations : onglets par pôle, cartes avec couverture,
 * fiche détaillée en plein écran au clic.
 *
 * Les boutons « Ajouter » et « Modifier » portent la classe `admin-only` :
 * ils ne s'affichent que pour l'administrateur connecté (voir AdminBar).
 * Les droits sont de toute façon vérifiés côté serveur.
 */
export function ProjectGallery({ projects, withFilters = false, pillar, limit, tone = "light" }: ProjectGalleryProps) {
  const [filter, setFilter] = useState<Filter>(pillar ?? "all");
  const isLight = tone === "light";

  const availablePillars = pillars.filter((item) => projects.some((project) => project.pillar === item.slug));
  const filtered = filter === "all" ? projects : projects.filter((project) => project.pillar === filter);
  const visible = limit ? filtered.slice(0, limit) : filtered;
  const addHref = `/admin/editer${filter !== "all" ? `?pilier=${filter}` : ""}`;

  // La fiche ouverte est déduite de l'ancre de l'URL (#projet-<slug>) :
  // chaque réalisation a ainsi un lien partageable, et le bouton « retour » reste cohérent.
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  const hashSlug = hash.startsWith("#projet-") ? decodeURIComponent(hash.slice("#projet-".length)) : null;
  const openProject = hashSlug ? (projects.find((project) => project.slug === hashSlug) ?? null) : null;

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: projectsSection.allLabel },
    ...availablePillars.map((item) => ({ value: item.slug, label: item.name })),
  ];

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {withFilters && availablePillars.length > 1 ? (
          <div role="group" aria-label="Filtrer les réalisations par levier" className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  filter === item.value
                    ? isLight
                      ? "border-ink bg-ink text-white"
                      : "border-white bg-white text-ink"
                    : isLight
                      ? "border-line-ink bg-white text-muted-ink hover:border-ink/30 hover:text-ink"
                      : "border-line text-muted hover:border-white/30 hover:text-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        <Link
          href={addHref}
          className="admin-only items-center gap-2 rounded-full border-2 border-dashed border-amber-400 bg-amber-300/15 px-4 py-2 text-sm font-semibold text-amber-600"
        >
          <Plus aria-hidden="true" className="size-4" />
          Ajouter un travail
        </Link>
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <li key={project.id} className="reveal">
            <ProjectCard project={project} isLight={isLight} onOpen={() => setHash(`#projet-${project.slug}`)} />
          </li>
        ))}
      </ul>

      {limit && filtered.length > limit && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/realisations"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
              isLight ? "bg-ink text-white hover:bg-ink-3" : "bg-white text-ink hover:bg-mist",
            )}
          >
            {projectsSection.seeAll} ({filtered.length})
          </Link>
        </div>
      )}

      <ProjectLightbox project={openProject} onClose={() => setHash("")} />
    </div>
  );
}

function ProjectCard({ project, isLight, onOpen }: { project: Project; isLight: boolean; onOpen: () => void }) {
  const cover = project.images[0];
  const pillar = pillars.find((item) => item.slug === project.pillar);

  return (
    <article
      id={`projet-${project.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1",
        isLight
          ? "border-line-ink bg-white hover:shadow-[0_24px_60px_-28px_rgb(91_33_182/0.45)]"
          : "border-line bg-ink-2 hover:border-brand-3/40",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-2 to-brand-deep">
        {cover && (
          <Image
            src={cover.url}
            alt={cover.alt || project.title}
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="size-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        )}
        {project.images.length > 1 && (
          <span className="glass absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-white">
            <Images aria-hidden="true" className="size-3.5" />
            {project.images.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className={cn("text-xs font-semibold tracking-[0.18em] uppercase", isLight ? "text-brand-deep" : "text-brand-3")}>
          {pillar?.dimension}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
          {/* Le bouton couvre toute la carte (zone cliquable large, un seul élément focalisable). */}
          <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:content-['']">
            {project.title}
          </button>
        </h3>
        <p className={cn("mt-1 text-xs", isLight ? "text-muted-ink" : "text-muted")}>
          {projectContextLabels[project.context]}
          {project.year && ` · ${project.year}`}
        </p>
        <p className={cn("mt-3 line-clamp-3 text-sm leading-relaxed", isLight ? "text-muted-ink" : "text-muted")}>
          {project.summary}
        </p>
      </div>

      <Link
        href={`/admin/editer?id=${project.id}`}
        className="admin-only absolute top-3 left-3 z-10 items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-semibold text-ink"
      >
        <Pencil aria-hidden="true" className="size-3.5" /> Modifier
      </Link>
    </article>
  );
}

/* ─── Ancre de l'URL ─── */

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** Modifie l'ancre sans faire défiler la page, puis prévient les abonnés. */
function setHash(hash: string) {
  if (window.location.hash === hash) return;
  history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
