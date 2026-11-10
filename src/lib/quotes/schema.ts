import { z } from "zod";
import type { Offer } from "@/data/offers";
import { priceFor, type Currency, type PriceZone } from "@/lib/pricing";

/**
 * Demande de devis : validation (partagée navigateur / serveur) et calcul du prix.
 * Le prix n'est JAMAIS lu depuis le formulaire : il est recalculé à partir du catalogue.
 */

export const QUOTE_STATUSES = ["nouveau", "confirme", "gagne", "perdu", "annule"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  nouveau: "Nouveau",
  confirme: "Appel confirmé",
  gagne: "Contrat signé",
  perdu: "Non abouti",
  annule: "Annulé",
};

/** Durée de validité d'un devis. */
export const QUOTE_VALIDITY_DAYS = 30;

export const quoteRequestSchema = z
  .object({
    offerId: z.string().trim().min(1, "Choisissez une offre."),
    quantity: z.coerce.number().int("Quantité invalide.").min(1, "Quantité minimale : 1.").max(100, "Quantité trop élevée."),
    clientType: z.enum(["particulier", "entreprise"], { error: "Indiquez si vous êtes un particulier ou une entreprise." }),
    fullName: z.string().trim().min(2, "Indiquez votre nom complet.").max(100, "Nom trop long."),
    company: z.string().trim().max(120, "Nom d'entreprise trop long."),
    email: z.string().trim().pipe(z.email("Indiquez une adresse e-mail valide.")),
    whatsapp: z
      .string()
      .trim()
      .transform((value) => value.replace(/[^\d+]/g, ""))
      .refine((value) => /^\+?\d{8,15}$/.test(value), "Indiquez un numéro WhatsApp valide, avec l'indicatif (ex. +229…)."),
    message: z.string().trim().max(1000, "1000 caractères maximum."),
    callAt: z.string().min(1, "Choisissez un créneau pour l'appel."),
    /** Champ piège invisible : rempli uniquement par les robots. */
    website: z.string().max(0, "Envoi refusé."),
  })
  .superRefine((value, ctx) => {
    if (value.clientType === "entreprise" && value.company.length < 2) {
      ctx.addIssue({ code: "custom", path: ["company"], message: "Indiquez le nom de votre entreprise." });
    }
  });

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type QuoteField = keyof QuoteRequest;
export type QuoteFieldErrors = Partial<Record<QuoteField, string>>;

export function quoteRequestFromFormData(formData: FormData): Record<string, unknown> {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };
  return {
    offerId: text("offerId"),
    quantity: text("quantity") || "1",
    clientType: text("clientType"),
    fullName: text("fullName"),
    company: text("company"),
    email: text("email"),
    whatsapp: text("whatsapp"),
    message: text("message"),
    callAt: text("callAt"),
    website: text("website"),
  };
}

export function validateQuoteRequest(
  input: Record<string, unknown>,
): { success: true; data: QuoteRequest } | { success: false; errors: QuoteFieldErrors } {
  const parsed = quoteRequestSchema.safeParse(input);
  if (parsed.success) return { success: true, data: parsed.data };
  const errors: QuoteFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as QuoteField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}

export interface QuoteAmounts {
  quantity: number;
  unitPrice: number;
  total: number;
  currency: Currency;
}

/** Calcule le montant d'un devis à partir du catalogue (la quantité ne s'applique qu'aux offres à l'unité). */
export function computeQuote(offer: Offer, zone: PriceZone, requestedQuantity: number): QuoteAmounts {
  const quantity = offer.unit ? Math.min(Math.max(1, Math.floor(requestedQuantity)), offer.unit.max) : 1;
  const { amount: unitPrice, currency } = priceFor(offer.prices, zone);
  return { quantity, unitPrice, total: unitPrice * quantity, currency };
}

/** Référence lisible : AIT-AAMMJJ-XXXX (ex. AIT-261110-K7Q2). */
export function generateQuoteRef(date: Date, randomChars: string): string {
  const yy = String(date.getUTCFullYear()).slice(2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `AIT-${yy}${mm}${dd}-${randomChars.toUpperCase().slice(0, 4)}`;
}
