"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { saveFounderPhotoAction, type SettingsState } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/Button";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, slugify } from "@/lib/projects/schema";

interface Photo {
  url: string;
  width: number;
  height: number;
}

/**
 * Envoi de la photo de profil : l'image part vers Vercel Blob,
 * puis son adresse est enregistrée dans les paramètres du site.
 */
export function ProfilePhotoForm({ current }: { current: Photo | null }) {
  const [state, formAction, isSaving] = useActionState<SettingsState, FormData>(saveFounderPhotoAction, {});
  const [photo, setPhoto] = useState<Photo | null>(current);
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return setError("Format accepté : JPEG, PNG, WebP, AVIF ou GIF.");
    if (file.size > MAX_IMAGE_BYTES) return setError("L'image dépasse 10 Mo.");
    try {
      setUploading(0);
      const bitmap = await createImageBitmap(file);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const blob = await upload(`profil/${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type,
        onUploadProgress: ({ percentage }) => setUploading(Math.round(percentage)),
      });
      setPhoto({ url: blob.url, ...size });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Envoi impossible.");
    } finally {
      setUploading(null);
    }
  }

  const changed = photo?.url !== current?.url;

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="url" value={photo?.url ?? ""} />
      <input type="hidden" name="width" value={photo?.width ?? ""} />
      <input type="hidden" name="height" value={photo?.height ?? ""} />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative aspect-[4/5] w-40 shrink-0 overflow-hidden rounded-2xl border border-line bg-ink-3">
          {photo ? (
            <Image src={photo.url} alt="Aperçu de la photo de profil" fill sizes="160px" className="object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center font-display text-4xl font-bold text-brand-3">Ai</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className={buttonClasses("secondary", "md", "cursor-pointer")}>
            {uploading !== null ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-4" />}
            {uploading !== null ? `Envoi… ${uploading} %` : photo ? "Changer de photo" : "Choisir une photo"}
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              disabled={uploading !== null}
              onChange={(event) => handleFile(event.target.files?.[0])}
              className="sr-only"
            />
          </label>
          <button type="submit" disabled={!changed || !photo || isSaving || uploading !== null} className={buttonClasses("primary", "md")}>
            {isSaving ? "Enregistrement…" : "Enregistrer la photo"}
          </button>
          {current && (
            <button type="submit" name="remove" value="1" className="inline-flex items-center gap-1.5 text-sm text-red-300 hover:text-red-200">
              <Trash2 aria-hidden="true" className="size-4" /> Retirer la photo
            </button>
          )}
        </div>
      </div>

      {(error || state.error) && (
        <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-red-300">
          <AlertCircle aria-hidden="true" className="size-4" /> {error ?? state.error}
        </p>
      )}
      {state.saved && !changed && (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
          <CheckCircle2 aria-hidden="true" className="size-4" /> Photo enregistrée : elle est visible sur la page À propos.
        </p>
      )}
    </form>
  );
}
