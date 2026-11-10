import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Accès à la base Postgres (Neon).
 * La variable DATABASE_URL est ajoutée automatiquement par l'intégration Neon de Vercel.
 * Sans elle, le site fonctionne toujours : la galerie affiche simplement son état vide.
 */
let client: NeonQueryFunction<false, false> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL n'est pas définie : la base de données n'est pas configurée.");
  client ??= neon(url);
  return client;
}

/** Crée la table des réalisations si elle n'existe pas encore (idempotent). */
export async function ensureSchema(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        text NOT NULL UNIQUE,
      published   boolean NOT NULL DEFAULT false,
      title       text NOT NULL,
      pillar      text NOT NULL CHECK (pillar IN ('brand-positioning', 'content-visibility', 'digital-growth')),
      context     text NOT NULL CHECK (context IN ('client-aitech', 'salarie', 'personnel', 'formation')),
      client_name text,
      year        integer,
      summary     text NOT NULL,
      need        text,
      solution    text NOT NULL,
      result      text,
      link        text,
      images      jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at  timestamptz NOT NULL DEFAULT now(),
      updated_at  timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published, created_at DESC)`;

  // Demandes de devis et réservations d'appel.
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      ref           text NOT NULL UNIQUE,
      access_key    text NOT NULL,
      status        text NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'confirme', 'gagne', 'perdu', 'annule')),
      client_type   text NOT NULL CHECK (client_type IN ('particulier', 'entreprise')),
      full_name     text NOT NULL,
      company       text,
      email         text NOT NULL,
      whatsapp      text NOT NULL,
      country       text,
      zone          text NOT NULL,
      currency      text NOT NULL,
      offer_id      text NOT NULL,
      offer_name    text NOT NULL,
      quantity      integer NOT NULL DEFAULT 1,
      unit_price    numeric NOT NULL,
      total         numeric NOT NULL,
      duration      text NOT NULL,
      message       text,
      call_at       timestamptz NOT NULL,
      created_at    timestamptz NOT NULL DEFAULT now(),
      updated_at    timestamptz NOT NULL DEFAULT now()
    )
  `;
  // Un créneau ne peut être réservé qu'une fois (hors demandes annulées) : protège des doubles réservations.
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS quotes_call_at_active_idx ON quotes (call_at) WHERE status <> 'annule'`;
  await sql`CREATE INDEX IF NOT EXISTS quotes_created_idx ON quotes (created_at DESC)`;

  // Paramètres modifiables depuis l'admin (photo de profil…).
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key        text PRIMARY KEY,
      value      jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

/** Vrai si l'erreur Postgres signale une violation d'unicité (ex. créneau déjà réservé). */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "23505";
}

/** Vrai si l'erreur Postgres signale une table absente (base neuve, pas encore initialisée). */
export function isMissingTableError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "42P01";
}
