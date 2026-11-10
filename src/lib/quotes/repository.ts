import "server-only";
import { randomBytes } from "node:crypto";
import { ensureSchema, getSql, isDatabaseConfigured, isMissingTableError, isUniqueViolation } from "@/lib/db";
import type { Currency, PriceZone } from "@/lib/pricing";
import { generateQuoteRef, type QuoteAmounts, type QuoteRequest, type QuoteStatus } from "./schema";

/** Devis tel qu'enregistré en base. */
export interface Quote {
  id: string;
  ref: string;
  accessKey: string;
  status: QuoteStatus;
  clientType: "particulier" | "entreprise";
  fullName: string;
  company: string | null;
  email: string;
  whatsapp: string;
  country: string | null;
  zone: PriceZone;
  currency: Currency;
  offerId: string;
  offerName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  duration: string;
  message: string | null;
  callAt: string;
  createdAt: string;
}

interface QuoteRow {
  id: string;
  ref: string;
  access_key: string;
  status: QuoteStatus;
  client_type: "particulier" | "entreprise";
  full_name: string;
  company: string | null;
  email: string;
  whatsapp: string;
  country: string | null;
  zone: PriceZone;
  currency: Currency;
  offer_id: string;
  offer_name: string;
  quantity: number;
  unit_price: string | number;
  total: string | number;
  duration: string;
  message: string | null;
  call_at: string | Date;
  created_at: string | Date;
}

function toQuote(row: QuoteRow): Quote {
  return {
    id: row.id,
    ref: row.ref,
    accessKey: row.access_key,
    status: row.status,
    clientType: row.client_type,
    fullName: row.full_name,
    company: row.company,
    email: row.email,
    whatsapp: row.whatsapp,
    country: row.country,
    zone: row.zone,
    currency: row.currency,
    offerId: row.offer_id,
    offerName: row.offer_name,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    total: Number(row.total),
    duration: row.duration,
    message: row.message,
    callAt: new Date(row.call_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

/** Le créneau choisi vient d'être réservé par quelqu'un d'autre. */
export class SlotTakenError extends Error {
  constructor() {
    super("Ce créneau vient d'être réservé.");
  }
}

/** Créneaux déjà réservés (demandes non annulées) à partir d'une date. */
export async function getBookedCallIsos(from: Date): Promise<string[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const rows = (await getSql()`
      SELECT call_at FROM quotes WHERE status <> 'annule' AND call_at >= ${from.toISOString()}
    `) as { call_at: string | Date }[];
    return rows.map((row) => new Date(row.call_at).toISOString());
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

interface CreateQuoteInput {
  request: QuoteRequest;
  amounts: QuoteAmounts;
  offerName: string;
  duration: string;
  zone: PriceZone;
  country: string | null;
}

export async function createQuote({ request, amounts, offerName, duration, zone, country }: CreateQuoteInput): Promise<Quote> {
  await ensureSchema();
  const accessKey = randomBytes(18).toString("base64url");

  // Quelques tentatives au cas (très rare) où la référence aléatoire existe déjà.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const ref = generateQuoteRef(new Date(), randomBytes(4).toString("hex"));
    try {
      const rows = (await getSql()`
        INSERT INTO quotes (ref, access_key, client_type, full_name, company, email, whatsapp, country, zone, currency,
                            offer_id, offer_name, quantity, unit_price, total, duration, message, call_at)
        VALUES (${ref}, ${accessKey}, ${request.clientType}, ${request.fullName}, ${request.company || null}, ${request.email},
                ${request.whatsapp}, ${country}, ${zone}, ${amounts.currency}, ${request.offerId}, ${offerName},
                ${amounts.quantity}, ${amounts.unitPrice}, ${amounts.total}, ${duration}, ${request.message || null},
                ${new Date(request.callAt).toISOString()})
        RETURNING *
      `) as QuoteRow[];
      return toQuote(rows[0]);
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      const detail = String((error as { constraint?: string; detail?: string }).constraint ?? (error as { detail?: string }).detail ?? "");
      if (detail.includes("call_at")) throw new SlotTakenError();
      // Sinon : collision de référence, on réessaie avec une autre.
    }
  }
  throw new Error("Impossible de générer une référence de devis unique.");
}

/** Lecture publique d'un devis : nécessite la référence ET la clé secrète présente dans le lien. */
export async function getQuoteForClient(ref: string, accessKey: string): Promise<Quote | null> {
  if (!isDatabaseConfigured() || !ref || !accessKey) return null;
  try {
    const rows = (await getSql()`SELECT * FROM quotes WHERE ref = ${ref} AND access_key = ${accessKey}`) as QuoteRow[];
    return rows[0] ? toQuote(rows[0]) : null;
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

/* ─── Admin ─── */

export async function listQuotesForAdmin(): Promise<Quote[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const rows = (await getSql()`SELECT * FROM quotes ORDER BY call_at DESC LIMIT 300`) as QuoteRow[];
    return rows.map(toQuote);
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<void> {
  await getSql()`UPDATE quotes SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}
