import "server-only";
import { headers } from "next/headers";
import { zoneForCountry, type PriceZone } from "@/lib/pricing";

/**
 * Pays et zone de prix du visiteur, d'après l'en-tête de géolocalisation de Vercel.
 * Lit les en-têtes de la requête : à utiliser sous <Suspense>, dans une Server Action ou un Route Handler.
 *
 * En local, aucun pays n'est fourni : on peut simuler un pays avec DEV_COUNTRY (ex. FR, US).
 */
export async function getVisitorCountry(): Promise<string | null> {
  const country = (await headers()).get("x-vercel-ip-country");
  if (country) return country.toUpperCase();
  if (process.env.NODE_ENV === "development" && process.env.DEV_COUNTRY) return process.env.DEV_COUNTRY.toUpperCase();
  return null;
}

export async function getVisitorZone(): Promise<PriceZone> {
  return zoneForCountry(await getVisitorCountry());
}
