import { z } from "zod";

/**
 * Logique du formulaire de contact, indépendante de l'interface (et donc testable).
 *
 * Fonctionnement retenu : le site ne transmet rien lui-même. Il valide les champs,
 * prépare un message, puis ouvre WhatsApp ou la messagerie du visiteur.
 * C'est le visiteur qui confirme l'envoi dans son application.
 */

export const SERVICE_VALUES = ["brand-positioning", "content-visibility", "digital-growth", "autre"] as const;

/** Limite volontaire : les liens `mailto:` deviennent peu fiables au-delà d'environ 2 000 caractères. */
export const MESSAGE_MAX_LENGTH = 1200;

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom complet.")
    .max(100, "Votre nom ne doit pas dépasser 100 caractères."),
  email: z.string().trim().pipe(z.email("Indiquez une adresse e-mail valide, par exemple nom@entreprise.com.")),
  company: z
    .string()
    .trim()
    .min(2, "Indiquez votre entreprise ou votre activité.")
    .max(120, "Ce champ ne doit pas dépasser 120 caractères."),
  service: z.enum(SERVICE_VALUES, { error: "Choisissez le service qui correspond le mieux à votre besoin." }),
  message: z
    .string()
    .trim()
    .min(20, "Décrivez votre besoin en quelques phrases (20 caractères minimum).")
    .max(MESSAGE_MAX_LENGTH, `Votre description ne doit pas dépasser ${MESSAGE_MAX_LENGTH} caractères.`),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactFormValues;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactValidationResult =
  | { success: true; data: ContactFormValues }
  | { success: false; errors: ContactFieldErrors };

/**
 * Valide des données brutes (issues d'un FormData ou d'un objet) et renvoie
 * soit les valeurs nettoyées, soit un message d'erreur par champ.
 */
export function validateContact(input: Record<string, unknown>): ContactValidationResult {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) return { success: true, data: parsed.data };

  const errors: ContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    // On garde le premier message de chaque champ : un seul message clair à la fois.
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}

/** Construit le texte du message envoyé à AiTech. */
export function buildContactMessage(values: ContactFormValues, serviceLabel: string): string {
  return [
    "Bonjour AiTech,",
    "",
    values.message,
    "",
    "—",
    `Nom : ${values.fullName}`,
    `Entreprise / activité : ${values.company}`,
    `E-mail : ${values.email}`,
    `Service recherché : ${serviceLabel}`,
  ].join("\n");
}

/** Normalise un numéro WhatsApp : ne garde que les chiffres (format attendu par wa.me). */
export function normalizeWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Lien WhatsApp avec message prérempli, ou `null` si aucun numéro n'est configuré. */
export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const digits = normalizeWhatsAppNumber(phone);
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Lien `mailto:` avec objet et corps préremplis, ou `null` si aucune adresse n'est configurée. */
export function buildMailtoUrl(email: string, subject: string, body: string): string | null {
  const address = email.trim();
  if (!z.email().safeParse(address).success) return null;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
