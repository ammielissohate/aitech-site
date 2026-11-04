/**
 * Initialise la base de données : crée la table des réalisations si besoin (idempotent).
 * Usage : npm run db:setup   (lit DATABASE_URL dans .env.local)
 * La table est aussi créée automatiquement au premier ajout depuis l'admin.
 */
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL manquante : lancez « npx vercel env pull .env.local » ou renseignez .env.local.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, published boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  pillar text NOT NULL CHECK (pillar IN ('brand-positioning', 'content-visibility', 'digital-growth')),
  context text NOT NULL CHECK (context IN ('client-aitech', 'salarie', 'personnel', 'formation')),
  client_name text, year integer, summary text NOT NULL, need text, solution text NOT NULL, result text, link text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
await sql`CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published, created_at DESC)`;
const [{ n }] = await sql`SELECT count(*)::int AS n FROM projects`;
const [{ v }] = await sql`SELECT version() AS v`;
console.log("OK - table projects prête,", n, "réalisation(s).", v.split(",")[0]);
