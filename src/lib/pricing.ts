/**
 * Zones de prix et devises (fonctions pures, testées).
 *
 * Chaque offre a un prix par zone, fixé à la main dans `src/data/offers.ts` :
 *  - Afrique       → FCFA (avec l'équivalent en euros au taux fixe 655,957) ;
 *  - Europe        → euros ;
 *  - International → dollars US.
 * La zone est déterminée côté serveur à partir du pays du visiteur.
 */

export type PriceZone = "africa" | "europe" | "international";
export type Currency = "XOF" | "EUR" | "USD";

export type ZonePrices = Record<PriceZone, number>;

/** Parité fixe du franc CFA : 1 € = 655,957 FCFA. */
export const XOF_PER_EUR = 655.957;

export const ZONE_CURRENCY: Record<PriceZone, Currency> = {
  africa: "XOF",
  europe: "EUR",
  international: "USD",
};

export const ZONE_LABELS: Record<PriceZone, string> = {
  africa: "Afrique · prix en FCFA",
  europe: "Europe · prix en euros",
  international: "International · prix en dollars US",
};

// Codes ISO 3166-1 alpha-2.
const AFRICA = new Set(
  "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU YT MA MZ NA NE NG RE RW SH ST SN SC SL SO ZA SS SD TZ TG TN UG EH ZM ZW".split(" "),
);
const EUROPE = new Set(
  "AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM UA VA XK GP MQ GF".split(" "),
);

/**
 * Zone de prix d'un pays. Sans pays connu (développement local, pays masqué),
 * on retient l'Afrique : c'est le marché principal du studio.
 */
export function zoneForCountry(country: string | null | undefined): PriceZone {
  const code = (country ?? "").trim().toUpperCase();
  if (!code) return "africa";
  if (AFRICA.has(code)) return "africa";
  if (EUROPE.has(code)) return "europe";
  return "international";
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace(/ /g, " ");
}

/** Équivalent en euros d'un montant en FCFA (arrondi à l'euro). */
export function xofToEur(amount: number): number {
  return Math.round(amount / XOF_PER_EUR);
}

/** Prix d'une offre pour une zone, multiplié par la quantité. */
export function priceFor(prices: ZonePrices, zone: PriceZone, quantity = 1): { amount: number; currency: Currency } {
  return { amount: prices[zone] * quantity, currency: ZONE_CURRENCY[zone] };
}

/**
 * Économie réelle d'un pack par rapport aux mêmes éléments achetés à l'unité.
 * Renvoie 0 si le pack n'est pas moins cher (aucune fausse promotion).
 */
export function packSavings(packPrice: number, unitPrice: number, unitsInPack: number): number {
  return Math.max(0, unitPrice * unitsInPack - packPrice);
}
