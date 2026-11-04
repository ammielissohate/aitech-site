import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Fonctions pures de l'authentification admin (sans accès aux cookies : testables).
 *
 * Le jeton de session a la forme `<expiration en ms>.<signature HMAC-SHA256>`.
 * Sans le secret (SESSION_SECRET), il est impossible de fabriquer ou de prolonger un jeton.
 */

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Compare deux chaînes en temps constant (évite les attaques par mesure du temps de réponse). */
function safeEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function createSessionToken(secret: string, now: number): string {
  const expiresAt = now + SESSION_DURATION_MS;
  return `${expiresAt}.${sign(`admin:${expiresAt}`, secret)}`;
}

/** Vrai si le jeton est signé avec ce secret et n'a pas expiré. */
export function verifySessionToken(token: string | undefined, secret: string, now: number): boolean {
  if (!token) return false;
  const [expiresAtText, signature, ...rest] = token.split(".");
  if (!expiresAtText || !signature || rest.length > 0) return false;

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

  return safeEqual(signature, sign(`admin:${expiresAt}`, secret));
}

export function verifyPassword(input: string, expected: string): boolean {
  if (!expected) return false;
  return safeEqual(input, expected);
}

/**
 * Sécurise la redirection après connexion : uniquement un chemin interne
 * (évite qu'un lien piégé renvoie vers un site externe).
 */
export function safeRedirectPath(value: unknown, fallback = "/admin"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
