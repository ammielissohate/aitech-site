import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ensureSchema, getSql, isDatabaseConfigured, isMissingTableError } from "@/lib/db";
import type { ProjectImage } from "@/types/content";

/**
 * Paramètres modifiables depuis l'admin (/admin/parametres).
 * Lecture publique mise en cache (tag `settings`), rafraîchie après chaque modification.
 */
export const SETTINGS_CACHE_TAG = "settings";

export type FounderPhoto = Omit<ProjectImage, "alt">;

export async function getFounderPhoto(): Promise<FounderPhoto | null> {
  "use cache";
  cacheTag(SETTINGS_CACHE_TAG);
  cacheLife("days");

  if (!isDatabaseConfigured()) return null;
  try {
    const rows = (await getSql()`SELECT value FROM settings WHERE key = 'founder_photo'`) as { value: FounderPhoto }[];
    return rows[0]?.value ?? null;
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

export async function setFounderPhoto(photo: FounderPhoto | null): Promise<void> {
  await ensureSchema();
  if (photo) {
    await getSql()`
      INSERT INTO settings (key, value) VALUES ('founder_photo', ${JSON.stringify(photo)}::jsonb)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    `;
  } else {
    await getSql()`DELETE FROM settings WHERE key = 'founder_photo'`;
  }
}
