"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pencil, Play, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { projectContextLabels } from "@/data/projects";
import { pillars } from "@/data/services";
import { cn } from "@/lib/cn";
import { isVideo, previewSrc } from "@/lib/media";
import type { Project } from "@/types/content";

interface ProjectLightboxProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Fiche détaillée d'une réalisation, ouverte par-dessus la galerie.
 * <dialog> natif : focus piégé, fermeture par Échap ou clic sur le fond.
 * Navigation entre les images au clavier (flèches gauche / droite).
 */
export function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [shownProjectId, setShownProjectId] = useState<string | null>(null);

  // Revient à la première image quand on ouvre une autre réalisation (ajustement pendant le rendu).
  if (project && project.id !== shownProjectId) {
    setShownProjectId(project.id);
    setImageIndex(0);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  if (!project) {
    return <dialog ref={dialogRef} onClose={onClose} className="hidden" aria-hidden="true" />;
  }

  const images = project.images;
  const current = images[Math.min(imageIndex, images.length - 1)];
  const pillar = pillars.find((item) => item.slug === project.pillar);
  const hasMany = images.length > 1;
  const goTo = (index: number) => setImageIndex((index + images.length) % images.length);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="lightbox-title"
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
      onKeyDown={(event) => {
        // Les flèches servent à avancer dans la vidéo quand elle a le focus.
        if (!hasMany || event.target instanceof HTMLVideoElement) return;
        if (event.key === "ArrowRight") goTo(imageIndex + 1);
        if (event.key === "ArrowLeft") goTo(imageIndex - 1);
      }}
      className="project-lightbox m-auto max-h-[92dvh] w-[min(72rem,calc(100%-1.5rem))] max-w-none overflow-hidden rounded-3xl border border-line bg-ink-2 p-0 text-white"
    >
      <div className="grid max-h-[92dvh] overflow-y-auto lg:grid-cols-[1.5fr_1fr] lg:overflow-hidden">
        {/* Images */}
        <div className="relative flex flex-col bg-ink lg:max-h-[92dvh]">
          <div className="relative flex min-h-64 flex-1 items-center justify-center p-3 sm:p-5">
            {current && isVideo(current) && (
              <video
                key={current.url}
                src={current.url}
                poster={current.poster}
                controls
                playsInline
                preload="metadata"
                aria-label={current.alt || project.title}
                className="max-h-[60dvh] w-auto max-w-full rounded-xl bg-black lg:max-h-[78dvh]"
              />
            )}
            {current && !isVideo(current) && (
              <Image
                key={current.url}
                src={current.url}
                alt={current.alt || project.title}
                width={current.width}
                height={current.height}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="max-h-[60dvh] w-auto rounded-xl object-contain lg:max-h-[78dvh]"
              />
            )}
            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(imageIndex - 1)}
                  className="glass absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                  <span className="sr-only">Image précédente</span>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(imageIndex + 1)}
                  className="glass absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                  <span className="sr-only">Image suivante</span>
                </button>
              </>
            )}
          </div>

          {hasMany && (
            <div className="flex gap-2 overflow-x-auto border-t border-line p-3" role="group" aria-label="Images de la réalisation">
              {images.map((image, index) => (
                <button
                  key={`${index}-${image.url}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-current={index === imageIndex}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition",
                    index === imageIndex ? "border-brand-3" : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  {previewSrc(image) ? (
                    <Image src={previewSrc(image)!} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-ink-3" />
                  )}
                  {isVideo(image) && (
                    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="size-5 fill-white text-white" />
                    </span>
                  )}
                  <span className="sr-only">
                    Afficher {isVideo(image) ? "la vidéo" : "l'image"} {index + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="flex flex-col p-6 sm:p-8 lg:max-h-[92dvh] lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">{pillar?.name}</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="-mt-2 -mr-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line hover:bg-white/5"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
          <h2 id="lightbox-title" className="mt-2 font-display text-2xl font-semibold tracking-tight text-balance">
            {project.title}
          </h2>
          <p className="mt-2 text-xs text-muted">
            {projectContextLabels[project.context]}
            {project.clientName && ` · ${project.clientName}`}
            {project.year && ` · ${project.year}`}
          </p>
          <p className="mt-5 leading-relaxed text-white/85">{project.summary}</p>

          <dl className="mt-6 space-y-5 border-t border-line pt-6 text-sm">
            {project.need && <Detail label="Besoin">{project.need}</Detail>}
            <Detail label="Solution">{project.solution}</Detail>
            {project.result && <Detail label="Résultat">{project.result}</Detail>}
          </dl>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-brand-3/50"
              >
                Voir le projet en ligne <ArrowUpRight aria-hidden="true" className="size-4" />
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            )}
            <Link
              href={`/#contact-${project.pillar}`}
              onClick={() => dialogRef.current?.close()}
              className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#6d28d9]"
            >
              Un projet similaire ? Parlons-en
            </Link>
            <Link
              href={`/admin/editer?id=${project.id}`}
              className="admin-only items-center gap-1.5 rounded-full border border-amber-300/40 px-4 py-2 text-sm text-amber-200"
            >
              <Pencil aria-hidden="true" className="size-4" /> Modifier
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-white">{label}</dt>
      <dd className="mt-1 leading-relaxed whitespace-pre-line text-muted">{children}</dd>
    </div>
  );
}
