import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ensureSchema, getSql, isDatabaseConfigured, isMissingTableError } from "@/lib/db";
import type { PillarSlug, Project, ProjectContext, ProjectImage } from "@/types/content";
import { slugify, type ProjectInput } from "./schema";

/**
 * Accès aux réalisations en base.
 *
 * - Lectures publiques : mises en cache (`'use cache'` + tag `projects`), donc la galerie
 *   reste statique et rapide. Chaque modification dans l'admin appelle `updateTag("projects")`.
 * - Lectures admin et écritures : jamais en cache. Les écritures ne sont appelées
 *   que depuis des Server Actions qui vérifient la session admin.
 */

export const PROJECTS_CACHE_TAG = "projects";

interface ProjectRow {
  id: string;
  slug: string;
  published: boolean;
  title: string;
  pillar: string;
  context: string;
  client_name: string | null;
  year: number | null;
  summary: string;
  need: string | null;
  solution: string;
  result: string | null;
  link: string | null;
  images: ProjectImage[] | null;
  created_at: string | Date;
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    published: row.published,
    title: row.title,
    pillar: row.pillar as PillarSlug,
    context: row.context as ProjectContext,
    clientName: row.client_name,
    year: row.year,
    summary: row.summary,
    need: row.need,
    solution: row.solution,
    result: row.result,
    link: row.link,
    images: Array.isArray(row.images) ? row.images : [],
    createdAt: new Date(row.created_at).toISOString(),
  };
}

/* ─── Lectures publiques (en cache) ─── */

/** Réalisations publiées, de la plus récente à la plus ancienne. */
export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(PROJECTS_CACHE_TAG);
  cacheLife("days");

  if (!isDatabaseConfigured()) return [];
  try {
    const rows = (await getSql()`
      SELECT * FROM projects WHERE published = true ORDER BY year DESC NULLS LAST, created_at DESC
    `) as ProjectRow[];
    return rows.map(toProject);
  } catch (error) {
    // Base neuve : la table sera créée au premier ajout depuis l'admin.
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

/* ─── Lectures admin (jamais en cache) ─── */

export async function getAllProjectsForAdmin(): Promise<Project[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const rows = (await getSql()`SELECT * FROM projects ORDER BY created_at DESC`) as ProjectRow[];
    return rows.map(toProject);
  } catch (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export async function getProjectByIdForAdmin(id: string): Promise<Project | null> {
  if (!isDatabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  try {
    const rows = (await getSql()`SELECT * FROM projects WHERE id = ${id}`) as ProjectRow[];
    return rows[0] ? toProject(rows[0]) : null;
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

/* ─── Écritures (appelées uniquement depuis les Server Actions admin) ─── */

/** Trouve un slug libre : « mon-projet », puis « mon-projet-2 », etc. */
async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  const rows = (await getSql()`
    SELECT slug FROM projects WHERE (slug = ${base} OR slug LIKE ${`${base}-%`}) AND id IS DISTINCT FROM ${excludeId ?? null}::uuid
  `) as { slug: string }[];
  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  await ensureSchema();
  const slug = await uniqueSlug(input.title);
  const rows = (await getSql()`
    INSERT INTO projects (slug, published, title, pillar, context, client_name, year, summary, need, solution, result, link, images)
    VALUES (${slug}, ${input.published}, ${input.title}, ${input.pillar}, ${input.context}, ${input.clientName}, ${input.year},
            ${input.summary}, ${input.need}, ${input.solution}, ${input.result}, ${input.link}, ${JSON.stringify(input.images)}::jsonb)
    RETURNING *
  `) as ProjectRow[];
  return toProject(rows[0]);
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project | null> {
  await ensureSchema();
  const slug = await uniqueSlug(input.title, id);
  const rows = (await getSql()`
    UPDATE projects SET
      slug = ${slug}, published = ${input.published}, title = ${input.title}, pillar = ${input.pillar},
      context = ${input.context}, client_name = ${input.clientName}, year = ${input.year}, summary = ${input.summary},
      need = ${input.need}, solution = ${input.solution}, result = ${input.result}, link = ${input.link},
      images = ${JSON.stringify(input.images)}::jsonb, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as ProjectRow[];
  return rows[0] ? toProject(rows[0]) : null;
}

/** Supprime la réalisation et renvoie ses images (pour les retirer du stockage). */
export async function deleteProject(id: string): Promise<ProjectImage[]> {
  const rows = (await getSql()`DELETE FROM projects WHERE id = ${id} RETURNING images`) as Pick<ProjectRow, "images">[];
  return rows[0]?.images ?? [];
}
