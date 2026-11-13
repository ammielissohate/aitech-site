import { z } from "zod";

/**
 * Validation d'une réalisation saisie dans l'admin.
 * Partagée entre le formulaire (navigateur) et la Server Action (serveur) :
 * le serveur revalide toujours, la validation côté navigateur n'est qu'un confort.
 */

export const PILLAR_VALUES = ["brand-positioning", "content-visibility", "digital-growth"] as const;
export const CONTEXT_VALUES = ["client-aitech", "salarie", "personnel", "formation"] as const;

export const MAX_IMAGES = 12;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 Mo par image
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024; // 250 Mo par vidéo
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

/** Seules les images hébergées sur le stockage Vercel Blob du site sont acceptées. */
export function isBlobImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Champ texte facultatif : une chaîne vide devient `null`. */
const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((value) => (value === "" ? null : value));

export const projectImageSchema = z.object({
  url: z.string().refine(isBlobImageUrl, "Image invalide : elle doit être envoyée depuis ce formulaire."),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().trim().max(200, "Le texte alternatif ne doit pas dépasser 200 caractères."),
  kind: z.enum(["image", "video"]).optional(),
  poster: z.string().refine(isBlobImageUrl, "Couverture de vidéo invalide.").optional(),
});

export const projectInputSchema = z.object({
  title: z.string().trim().min(3, "Indiquez un titre (3 caractères minimum).").max(120, "Le titre ne doit pas dépasser 120 caractères."),
  pillar: z.enum(PILLAR_VALUES, { error: "Choisissez le pôle concerné." }),
  context: z.enum(CONTEXT_VALUES, { error: "Indiquez le cadre de réalisation." }),
  clientName: optionalText(120, "Le nom du client ne doit pas dépasser 120 caractères."),
  year: z
    .string()
    .trim()
    .transform((value, ctx) => {
      if (value === "") return null;
      const year = Number(value);
      if (!Number.isInteger(year) || year < 1990 || year > 2100) {
        ctx.addIssue({ code: "custom", message: "Indiquez une année valide (ex. 2025)." });
        return z.NEVER;
      }
      return year;
    }),
  summary: z.string().trim().min(10, "Résumez le projet en une phrase (10 caractères minimum).").max(280, "Le résumé ne doit pas dépasser 280 caractères."),
  need: optionalText(800, "Le besoin ne doit pas dépasser 800 caractères."),
  solution: z.string().trim().min(10, "Décrivez la solution réalisée (10 caractères minimum).").max(1200, "La solution ne doit pas dépasser 1200 caractères."),
  result: optionalText(600, "Le résultat ne doit pas dépasser 600 caractères."),
  link: z
    .string()
    .trim()
    .transform((value, ctx) => {
      if (value === "") return null;
      try {
        const url = new URL(value);
        if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("protocol");
        return url.toString();
      } catch {
        ctx.addIssue({ code: "custom", message: "Indiquez une adresse web complète, par exemple https://exemple.com." });
        return z.NEVER;
      }
    }),
  published: z.boolean(),
  images: z
    .array(projectImageSchema)
    .min(1, "Ajoutez au moins une image ou une vidéo : c'est la preuve visuelle de votre travail.")
    .max(MAX_IMAGES, `${MAX_IMAGES} médias maximum par réalisation.`),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectField = keyof ProjectInput;
export type ProjectFieldErrors = Partial<Record<ProjectField, string>>;

/**
 * Lit les champs d'un FormData envoyé par l'éditeur.
 * Les images arrivent sous forme de JSON dans le champ caché `images`.
 */
export function projectInputFromFormData(formData: FormData): Record<string, unknown> {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  let images: unknown = [];
  try {
    images = JSON.parse(text("images") || "[]");
  } catch {
    images = null; // provoquera une erreur de validation explicite
  }

  return {
    title: text("title"),
    pillar: text("pillar"),
    context: text("context"),
    clientName: text("clientName"),
    year: text("year"),
    summary: text("summary"),
    need: text("need"),
    solution: text("solution"),
    result: text("result"),
    link: text("link"),
    published: formData.get("published") === "on",
    images,
  };
}

/** Valide et renvoie soit les données propres, soit un message par champ. */
export function validateProjectInput(
  input: Record<string, unknown>,
): { success: true; data: ProjectInput } | { success: false; errors: ProjectFieldErrors } {
  const parsed = projectInputSchema.safeParse(input);
  if (parsed.success) return { success: true, data: parsed.data };

  const errors: ProjectFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as ProjectField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}

/** Transforme un titre en identifiant d'URL : « Identité visuelle Café Ô » → « identite-visuelle-cafe-o ». */
export function slugify(title: string): string {
  return (
    title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "realisation"
  );
}
