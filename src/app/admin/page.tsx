import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, CircleAlert, Pencil, Plus } from "lucide-react";
import { Suspense } from "react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { buttonClasses } from "@/components/ui/Button";
import { projectContextLabels } from "@/data/projects";
import { pillars } from "@/data/services";
import { isAdmin, isAuthConfigured } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db";
import { getAllProjectsForAdmin } from "@/lib/projects/repository";

/**
 * Tableau de bord admin : toutes les réalisations (publiées et brouillons), par pôle.
 * Le contenu dépend du cookie de session : il est rendu sous <Suspense>.
 */
export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ink-2" />}>
        <AdminDashboard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AdminDashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  if (!(await isAdmin())) redirect("/connexion?next=/admin");

  const [projects, query] = await Promise.all([getAllProjectsForAdmin(), searchParams]);
  const savedAsDraft = query.brouillon === "1";

  const checks = [
    { label: "Connexion admin", ok: isAuthConfigured(), hint: "ADMIN_PASSWORD et SESSION_SECRET" },
    { label: "Base de données", ok: isDatabaseConfigured(), hint: "DATABASE_URL (intégration Neon)" },
    { label: "Stockage des images", ok: Boolean(process.env.BLOB_READ_WRITE_TOKEN), hint: "BLOB_READ_WRITE_TOKEN (Vercel Blob)" },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">Espace admin</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Mes réalisations</h1>
          <p className="mt-2 text-muted">
            {projects.length} réalisation{projects.length > 1 ? "s" : ""} · les brouillons ne sont visibles que par vous.
          </p>
        </div>
        <Link href="/admin/editer" className={buttonClasses("primary", "lg")}>
          <Plus aria-hidden="true" className="size-5" /> Ajouter un travail
        </Link>
      </div>

      {savedAsDraft && (
        <p role="status" className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-50">
          Brouillon enregistré. Il n&apos;apparaît pas sur le site tant que vous ne cochez pas « Publier ».
        </p>
      )}

      {checks.some((check) => !check.ok) && (
        <ul className="mt-8 grid gap-2 rounded-2xl border border-amber-300/30 bg-amber-300/5 p-5 text-sm sm:grid-cols-3">
          {checks.map((check) => (
            <li key={check.label} className="flex items-start gap-2">
              {check.ok ? (
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-300" />
              ) : (
                <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300" />
              )}
              <span>
                {check.label} {check.ok ? "configuré" : "à configurer"}
                {!check.ok && <span className="block text-xs text-muted">{check.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {pillars.map((pillar) => {
        const items = projects.filter((project) => project.pillar === pillar.slug);
        return (
          <section key={pillar.slug} aria-labelledby={`admin-${pillar.slug}`} className="mt-14">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <h2 id={`admin-${pillar.slug}`} className="font-display text-xl font-semibold">
                <span className="text-brand-3">{pillar.number}</span> {pillar.name}{" "}
                <span className="text-sm font-normal text-muted">({items.length})</span>
              </h2>
              <Link
                href={`/admin/editer?pilier=${pillar.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:border-brand-3/50"
              >
                <Plus aria-hidden="true" className="size-4" /> Ajouter
              </Link>
            </div>

            {items.length === 0 ? (
              <p className="mt-6 text-sm text-muted">Aucune réalisation pour ce pôle pour le moment.</p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project) => {
                  const cover = project.images[0];
                  return (
                    <li key={project.id} className="overflow-hidden rounded-2xl border border-line bg-ink-2">
                      <div className="relative aspect-[16/10] bg-ink-3">
                        {cover && (
                          <Image src={cover.url} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                        )}
                        <span
                          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            project.published ? "bg-emerald-300 text-ink" : "bg-white/85 text-ink"
                          }`}
                        >
                          {project.published ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display font-semibold">{project.title}</h3>
                        <p className="mt-1 text-xs text-muted">
                          {projectContextLabels[project.context]}
                          {project.year && ` · ${project.year}`} · {project.images.length} image{project.images.length > 1 ? "s" : ""}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <Link
                            href={`/admin/editer?id=${project.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                          >
                            <Pencil aria-hidden="true" className="size-3.5" /> Modifier
                          </Link>
                          {project.published && (
                            <Link href={`/realisations#projet-${project.slug}`} className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-white">
                              Voir
                            </Link>
                          )}
                          <DeleteProjectButton id={project.id} title={project.title} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}
