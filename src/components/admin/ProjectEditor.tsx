"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { AlertCircle, ArrowDown, ArrowUp, ImagePlus, Loader2, Play, Save, Star, Trash2 } from "lucide-react";
import { useActionState, useId, useRef, useState, type ReactNode } from "react";
import { saveProjectAction, type SaveProjectState } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/Button";
import { projectContextLabels } from "@/data/projects";
import { pillars } from "@/data/services";
import { cn } from "@/lib/cn";
import { isVideo, previewSrc } from "@/lib/media";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
  MAX_VIDEO_BYTES,
  slugify,
  type ProjectField,
} from "@/lib/projects/schema";
import type { PillarSlug, Project, ProjectContext, ProjectImage } from "@/types/content";

interface ProjectEditorProps {
  project?: Project;
  defaultPillar?: PillarSlug;
}

/** Lit les dimensions d'une image locale (nécessaires à next/image pour éviter les décalages de mise en page). */
async function readImageSize(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

/**
 * Lit les dimensions d'une vidéo locale et en extrait une image de couverture (vers 1 s).
 * Tout se passe dans le navigateur, avant l'envoi.
 */
async function readVideoCover(file: File): Promise<{ width: number; height: number; cover: Blob | null }> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Vidéo illisible par le navigateur."));
    });
    const width = video.videoWidth;
    const height = video.videoHeight;
    video.currentTime = Math.min(1, (video.duration || 2) / 4);
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      setTimeout(resolve, 4000); // sécurité si l'évènement n'arrive pas
    });
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1600 / Math.max(width, height));
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const cover = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    return { width, height, cover };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Formulaire d'ajout / modification d'une réalisation.
 *
 * Les images et vidéos partent directement du navigateur vers Vercel Blob (route /api/admin/upload,
 * réservée à l'admin), puis leurs adresses sont envoyées avec le formulaire.
 * Pour une vidéo, une image de couverture est générée automatiquement.
 */
export function ProjectEditor({ project, defaultPillar }: ProjectEditorProps) {
  const [state, formAction, isSaving] = useActionState<SaveProjectState, FormData>(saveProjectAction, {});
  const [images, setImages] = useState<ProjectImage[]>(project?.images ?? []);
  const [uploading, setUploading] = useState<{ name: string; percentage: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errors = state.errors ?? {};

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);
    const files = Array.from(fileList).slice(0, MAX_IMAGES - images.length);

    for (const file of files) {
      const video = ALLOWED_VIDEO_TYPES.includes(file.type);
      if (!video && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setUploadError(`« ${file.name} » n'est pas accepté : images (JPEG, PNG, WebP, AVIF, GIF) ou vidéos (MP4, WebM, MOV).`);
        continue;
      }
      if (file.size > (video ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
        setUploadError(`« ${file.name} » dépasse ${video ? "250" : "10"} Mo. Compressez-le avant de l'envoyer.`);
        continue;
      }

      try {
        setUploading({ name: file.name, percentage: 0 });
        const extension = file.name.split(".").pop()?.toLowerCase() ?? (video ? "mp4" : "jpg");
        const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
        const onUploadProgress = ({ percentage }: { percentage: number }) =>
          setUploading({ name: file.name, percentage: Math.round(percentage) });

        if (video) {
          const { width, height, cover } = await readVideoCover(file);
          const blob = await upload(`realisations/${baseName}.${extension}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/upload",
            contentType: file.type,
            multipart: file.size > 20 * 1024 * 1024, // envoi en plusieurs morceaux pour les grosses vidéos
            onUploadProgress,
          });
          const poster = cover
            ? (
                await upload(`realisations/${baseName}-couverture.webp`, cover, {
                  access: "public",
                  handleUploadUrl: "/api/admin/upload",
                  contentType: "image/webp",
                })
              ).url
            : undefined;
          setImages((current) => [...current, { url: blob.url, width, height, alt: "", kind: "video", poster }]);
        } else {
          const size = await readImageSize(file);
          const blob = await upload(`realisations/${baseName}.${extension}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/upload",
            contentType: file.type,
            onUploadProgress,
          });
          setImages((current) => [...current, { url: blob.url, ...size, alt: "" }]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur inconnue.";
        setUploadError(`Envoi de « ${file.name} » impossible : ${message}`);
      }
    }

    setUploading(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} noValidate className="mt-10 space-y-10">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {(state.formError || Object.keys(errors).length > 0) && (
        <p role="alert" className="flex gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
          {state.formError ?? "Certains champs sont à corriger avant l'enregistrement."}
        </p>
      )}

      {/* ── Images ── */}
      <fieldset className="rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
        <legend className="px-2 font-display text-lg font-semibold">Images et vidéos *</legend>
        <p className="text-sm text-muted">
          Jusqu&apos;à {MAX_IMAGES} médias : images (10 Mo max.) ou vidéos de motion design (250 Mo max.). Le premier sert de
          couverture : utilisez les flèches pour réordonner.
        </p>

        {images.length > 0 && (
          <ul className="mt-6 space-y-3">
            {images.map((image, index) => (
              <li key={image.url} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink p-3 sm:flex-row sm:items-center">
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-ink-3 sm:w-36">
                  {previewSrc(image) && <Image src={previewSrc(image)!} alt="" fill sizes="144px" className="object-cover" />}
                  {isVideo(image) && (
                    <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold">
                      <Play aria-hidden="true" className="size-3 fill-white" /> Vidéo
                    </span>
                  )}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold">
                      <Star aria-hidden="true" className="size-3" /> Couverture
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor={`alt-${index}`} className="text-xs font-medium text-muted">
                    Description de l&apos;image (accessibilité et SEO)
                  </label>
                  <input
                    id={`alt-${index}`}
                    value={image.alt}
                    maxLength={200}
                    placeholder="Ex. : Logo et carte de visite du cabinet"
                    onChange={(event) =>
                      setImages((current) =>
                        current.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)),
                      )
                    }
                    className={inputClasses()}
                  />
                </div>
                <div className="flex gap-1 sm:flex-col">
                  <IconButton label="Monter l'image" disabled={index === 0} onClick={() => moveImage(index, -1)}>
                    <ArrowUp className="size-4" />
                  </IconButton>
                  <IconButton label="Descendre l'image" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)}>
                    <ArrowDown className="size-4" />
                  </IconButton>
                  <IconButton label="Retirer l'image" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} danger>
                    <Trash2 className="size-4" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}

        <label
          className={cn(
            "mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 px-6 py-10 text-center transition hover:border-brand-3/60 hover:bg-white/[0.02]",
            (uploading || images.length >= MAX_IMAGES) && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <>
              <Loader2 aria-hidden="true" className="size-7 animate-spin text-brand-3" />
              <span className="text-sm" aria-live="polite">
                Envoi de « {uploading.name} »… {uploading.percentage} %
              </span>
            </>
          ) : (
            <>
              <ImagePlus aria-hidden="true" className="size-7 text-brand-3" />
              <span className="text-sm font-medium">Choisir des images ou des vidéos</span>
              <span className="text-xs text-muted">JPEG, PNG, WebP, AVIF, GIF · MP4, WebM, MOV</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(",")}
            multiple
            disabled={Boolean(uploading) || images.length >= MAX_IMAGES}
            onChange={(event) => handleFiles(event.target.files)}
            className="sr-only"
          />
        </label>
        {(uploadError || errors.images) && <ErrorText>{uploadError ?? errors.images}</ErrorText>}
      </fieldset>

      {/* ── Informations ── */}
      <fieldset className="grid gap-6 rounded-3xl border border-line bg-ink-2 p-6 sm:grid-cols-2 sm:p-8">
        <legend className="px-2 font-display text-lg font-semibold">Informations</legend>

        <Field name="title" label="Titre *" error={errors.title} className="sm:col-span-2">
          {(props) => <input {...props} defaultValue={project?.title} maxLength={120} placeholder="Ex. : Identité visuelle d'un cabinet de conseil" />}
        </Field>

        <Field name="pillar" label="Pôle *" error={errors.pillar}>
          {(props) => (
            <select {...props} defaultValue={project?.pillar ?? defaultPillar ?? ""}>
              <option value="" disabled>
                Choisir un pôle
              </option>
              {pillars.map((pillar) => (
                <option key={pillar.slug} value={pillar.slug}>
                  {pillar.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field name="context" label="Cadre de réalisation *" error={errors.context} hint="Un projet salarié ou personnel n'est jamais présenté comme un client AiTech.">
          {(props) => (
            <select {...props} defaultValue={project?.context ?? ""}>
              <option value="" disabled>
                Choisir
              </option>
              {(Object.keys(projectContextLabels) as ProjectContext[]).map((context) => (
                <option key={context} value={context}>
                  {projectContextLabels[context]}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field name="clientName" label="Client ou organisation" error={errors.clientName} hint="Uniquement avec son accord.">
          {(props) => <input {...props} defaultValue={project?.clientName ?? ""} maxLength={120} />}
        </Field>

        <Field name="year" label="Année" error={errors.year}>
          {(props) => <input {...props} defaultValue={project?.year ?? ""} inputMode="numeric" maxLength={4} placeholder="2025" />}
        </Field>

        <Field name="summary" label="Résumé (affiché sur la carte) *" error={errors.summary} className="sm:col-span-2">
          {(props) => <textarea {...props} defaultValue={project?.summary} rows={2} maxLength={280} />}
        </Field>

        <Field name="need" label="Besoin de départ" error={errors.need} className="sm:col-span-2">
          {(props) => <textarea {...props} defaultValue={project?.need ?? ""} rows={3} maxLength={800} />}
        </Field>

        <Field name="solution" label="Solution réalisée *" error={errors.solution} className="sm:col-span-2">
          {(props) => <textarea {...props} defaultValue={project?.solution} rows={4} maxLength={1200} />}
        </Field>

        <Field name="result" label="Résultat" error={errors.result} hint="Uniquement s'il est documenté et vérifiable." className="sm:col-span-2">
          {(props) => <textarea {...props} defaultValue={project?.result ?? ""} rows={2} maxLength={600} />}
        </Field>

        <Field name="link" label="Lien vers le projet en ligne" error={errors.link} className="sm:col-span-2">
          {(props) => <input {...props} defaultValue={project?.link ?? ""} type="url" inputMode="url" placeholder="https://" />}
        </Field>
      </fieldset>

      {/* ── Publication ── */}
      <div className="flex flex-col gap-6 rounded-3xl border border-line bg-ink-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project ? project.published : true}
            className="mt-1 size-5 accent-[#7C3AED]"
          />
          <span>
            <span className="block font-medium">Publier sur le site</span>
            <span className="text-sm text-muted">Décochez pour garder un brouillon, visible uniquement par vous.</span>
          </span>
        </label>
        <button type="submit" disabled={isSaving || Boolean(uploading)} className={buttonClasses("primary", "lg")}>
          {isSaving ? <Loader2 aria-hidden="true" className="size-5 animate-spin" /> : <Save aria-hidden="true" className="size-5" />}
          {isSaving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

/* ─── Sous-composants ─── */

interface FieldControlProps {
  id: string;
  name: ProjectField;
  className: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

function Field({
  name,
  label,
  error,
  hint,
  className,
  children,
}: {
  name: ProjectField;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: FieldControlProps) => ReactNode;
}) {
  const id = useId();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        name,
        className: cn(inputClasses(error), "py-3"),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-red-300">
      <AlertCircle aria-hidden="true" className="size-4 shrink-0" /> {children}
    </p>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-line transition disabled:opacity-30",
        danger ? "text-red-300 hover:bg-red-500/10" : "hover:bg-white/10",
      )}
    >
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

function inputClasses(error?: string) {
  return cn(
    "block w-full rounded-xl border bg-ink px-4 text-base text-white placeholder:text-muted/60 transition min-h-12",
    "focus:border-brand-3 focus:ring-3 focus:ring-brand/30 focus:outline-none",
    error ? "border-red-400/70" : "border-white/12 hover:border-white/25",
  );
}
