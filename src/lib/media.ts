import type { ProjectImage } from "@/types/content";

/** Vrai si le média est une vidéo. */
export function isVideo(media: ProjectImage): boolean {
  return media.kind === "video";
}

/**
 * Image à afficher en aperçu (carte, miniature) : l'image elle-même,
 * ou la couverture d'une vidéo. `null` si une vidéo n'a pas de couverture.
 */
export function previewSrc(media: ProjectImage | undefined): string | null {
  if (!media) return null;
  return isVideo(media) ? (media.poster ?? null) : media.url;
}
