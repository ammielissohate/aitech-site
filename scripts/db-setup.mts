/**
 * Initialise la base de données : crée les tables (réalisations, devis, paramètres) si besoin.
 * Réutilise exactement le SQL de l'application (src/lib/db.ts). Idempotent.
 *
 * Usage : npm run db:setup   (lit DATABASE_URL dans .env.local)
 * Les tables sont aussi créées automatiquement à la première écriture depuis le site.
 */
import { ensureSchema, getSql } from "../src/lib/db.ts";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL manquante : lancez « npx vercel env pull .env.local » ou renseignez .env.local.");
  process.exit(1);
}

await ensureSchema();
const tables = (await getSql()`
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
`) as { table_name: string }[];
console.log("Base prête. Tables :", tables.map((table) => table.table_name).join(", "));
