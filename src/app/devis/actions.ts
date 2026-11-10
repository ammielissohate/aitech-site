"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { getOffer } from "@/data/offers";
import { siteConfig } from "@/data/site";
import { isValidCallSlot } from "@/lib/booking";
import { isDatabaseConfigured } from "@/lib/db";
import { sendQuoteNotification } from "@/lib/notify";
import { createQuote, SlotTakenError } from "@/lib/quotes/repository";
import { computeQuote, quoteRequestFromFormData, validateQuoteRequest, type QuoteFieldErrors } from "@/lib/quotes/schema";
import { getVisitorCountry } from "@/lib/visitor";
import { zoneForCountry } from "@/lib/pricing";

export interface SubmitQuoteState {
  errors?: QuoteFieldErrors;
  formError?: string;
  /** Le créneau a été pris entre-temps : le formulaire propose d'en choisir un autre. */
  slotTaken?: boolean;
}

/**
 * Crée un devis et réserve le créneau d'appel.
 * Tout est revérifié ici : offre, quantité, prix (recalculé selon le pays), créneau.
 */
export async function submitQuoteAction(_previous: SubmitQuoteState, formData: FormData): Promise<SubmitQuoteState> {
  if (!isDatabaseConfigured()) {
    return { formError: "Le service de devis est momentanément indisponible. Contactez-nous directement sur WhatsApp." };
  }

  const validation = validateQuoteRequest(quoteRequestFromFormData(formData));
  if (!validation.success) return { errors: validation.errors };
  const request = validation.data;

  const offer = getOffer(request.offerId);
  if (!offer) return { errors: { offerId: "Cette offre n'existe plus. Choisissez-en une autre." } };

  if (!isValidCallSlot(request.callAt, new Date())) {
    return { slotTaken: true, errors: { callAt: "Ce créneau n'est plus disponible. Choisissez-en un autre." } };
  }

  const country = await getVisitorCountry();
  const zone = zoneForCountry(country);
  const amounts = computeQuote(offer, zone, request.quantity);

  let ref: string;
  let accessKey: string;
  try {
    const quote = await createQuote({ request, amounts, offerName: offer.name, duration: offer.duration, zone, country });
    ref = quote.ref;
    accessKey = quote.accessKey;
    // L'e-mail part après la réponse : le visiteur n'attend pas.
    after(() => sendQuoteNotification(quote, siteConfig.url));
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return { slotTaken: true, errors: { callAt: "Ce créneau vient d'être réservé. Choisissez-en un autre." } };
    }
    console.error("[devis] Enregistrement impossible :", error);
    return { formError: "Votre devis n'a pas pu être enregistré. Réessayez dans un instant ou contactez-nous sur WhatsApp." };
  }

  redirect(`/devis/recu?ref=${encodeURIComponent(ref)}&cle=${encodeURIComponent(accessKey)}`);
}
