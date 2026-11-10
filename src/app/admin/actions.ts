"use server";

import { del } from "@vercel/blob";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, isAdmin, isAuthConfigured, startSession } from "@/lib/auth/session";
import { safeRedirectPath, verifyPassword } from "@/lib/auth/token";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createProject,
  deleteProject,
  getProjectByIdForAdmin,
  PROJECTS_CACHE_TAG,
  updateProject,
} from "@/lib/projects/repository";
import { isBlobImageUrl, projectInputFromFormData, validateProjectInput, type ProjectFieldErrors } from "@/lib/projects/schema";
import { updateQuoteStatus } from "@/lib/quotes/repository";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/quotes/schema";
import { getFounderPhoto, setFounderPhoto, SETTINGS_CACHE_TAG } from "@/lib/settings";
import type { ProjectImage } from "@/types/content";

/**
 * Server Actions de l'espace admin.
 * Chaque action qui modifie des données revérifie la session : un formulaire
 * ou une requête forgée ne peut rien faire sans cookie admin valide.
 */

/* ─── Connexion ─── */

export interface LoginState {
  error?: string;
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "L'espace admin n'est pas configuré (ADMIN_PASSWORD et SESSION_SECRET)." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !verifyPassword(password, process.env.ADMIN_PASSWORD ?? "")) {
    // Petit délai : ralentit les tentatives répétées de deviner le mot de passe.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Mot de passe incorrect." };
  }

  await startSession();
  redirect(safeRedirectPath(formData.get("next"), "/admin"));
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}

/* ─── Réalisations ─── */

export interface SaveProjectState {
  errors?: ProjectFieldErrors;
  formError?: string;
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/connexion?next=/admin");
}

/** Supprime des images du stockage sans bloquer l'action si cela échoue (fichiers orphelins sans gravité). */
async function deleteImagesQuietly(images: ProjectImage[]): Promise<void> {
  if (images.length === 0 || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(images.map((image) => image.url));
  } catch (error) {
    console.error("[admin] Suppression d'images impossible :", error);
  }
}

export async function saveProjectAction(_previous: SaveProjectState, formData: FormData): Promise<SaveProjectState> {
  await requireAdmin();
  if (!isDatabaseConfigured()) {
    return { formError: "La base de données n'est pas configurée (DATABASE_URL)." };
  }

  const validation = validateProjectInput(projectInputFromFormData(formData));
  if (!validation.success) return { errors: validation.errors };

  const id = formData.get("id");
  let slug: string;

  try {
    if (typeof id === "string" && id !== "") {
      const previous = await getProjectByIdForAdmin(id);
      if (!previous) return { formError: "Cette réalisation n'existe plus." };

      const updated = await updateProject(id, validation.data);
      if (!updated) return { formError: "Cette réalisation n'existe plus." };
      slug = updated.slug;

      // Retire du stockage les images enlevées pendant la modification.
      const kept = new Set(validation.data.images.map((image) => image.url));
      await deleteImagesQuietly(previous.images.filter((image) => !kept.has(image.url)));
    } else {
      slug = (await createProject(validation.data)).slug;
    }
  } catch (error) {
    console.error("[admin] Enregistrement impossible :", error);
    return { formError: "L'enregistrement a échoué. Vérifiez la connexion à la base de données puis réessayez." };
  }

  // La galerie publique affiche immédiatement la nouvelle version.
  updateTag(PROJECTS_CACHE_TAG);
  redirect(validation.data.published ? `/realisations#projet-${slug}` : "/admin?brouillon=1");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || id === "") return;

  const images = await deleteProject(id);
  await deleteImagesQuietly(images);
  updateTag(PROJECTS_CACHE_TAG);
  redirect("/admin");
}

/* ─── Demandes de devis ─── */

export async function updateQuoteStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !(QUOTE_STATUSES as readonly unknown[]).includes(status)) return;
  // Une demande annulée libère son créneau d'appel (index unique partiel en base).
  await updateQuoteStatus(id, status as QuoteStatus);
  redirect("/admin/demandes");
}

/* ─── Paramètres : photo de profil ─── */

export interface SettingsState {
  error?: string;
  saved?: boolean;
}

export async function saveFounderPhotoAction(_previous: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  if (!isDatabaseConfigured()) return { error: "La base de données n'est pas configurée." };

  const remove = formData.get("remove") === "1";
  const previous = await getFounderPhoto();

  if (remove) {
    await setFounderPhoto(null);
  } else {
    const url = formData.get("url");
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));
    if (typeof url !== "string" || !isBlobImageUrl(url) || !Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      return { error: "Image invalide : envoyez-la depuis ce formulaire." };
    }
    await setFounderPhoto({ url, width, height });
  }

  // L'ancienne photo n'est plus utilisée : on la retire du stockage.
  if (previous && (remove || previous.url !== formData.get("url"))) {
    await deleteImagesQuietly([{ ...previous, alt: "" }]);
  }
  updateTag(SETTINGS_CACHE_TAG);
  return { saved: true };
}
