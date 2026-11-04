import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createSessionToken, SESSION_DURATION_MS, verifySessionToken } from "./token";

/**
 * Session administrateur (une seule personne : le propriétaire du site).
 *
 * Variables d'environnement requises :
 *  - ADMIN_PASSWORD : le mot de passe de connexion ;
 *  - SESSION_SECRET : une longue chaîne aléatoire (32 caractères minimum) qui signe le cookie.
 */

export const SESSION_COOKIE = "aitech_admin";

function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET ?? "";
  return secret.length >= 32 ? secret : null;
}

/** Vrai si l'espace admin peut fonctionner (mot de passe et secret définis). */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && getSecret() !== null;
}

/**
 * Vrai si le visiteur actuel est l'administrateur.
 * Lit un cookie : à appeler uniquement dans un composant placé sous <Suspense>,
 * une Server Action ou un Route Handler.
 */
export async function isAdmin(): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Vérification à chaque requête (l'heure courante sert à contrôler l'expiration du jeton).
  await connection();
  return verifySessionToken(token, secret, Date.now());
}

/** Vérifie le jeton d'une requête brute (Route Handler d'envoi d'images). */
export function isAdminToken(token: string | undefined): boolean {
  const secret = getSecret();
  return secret !== null && verifySessionToken(token, secret, Date.now());
}

export async function startSession(): Promise<void> {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET manquant ou trop court (32 caractères minimum).");
  (await cookies()).set(SESSION_COOKIE, createSessionToken(secret, Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
