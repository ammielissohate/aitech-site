import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { isAdmin } from "@/lib/auth/session";
import { getProjectByIdForAdmin } from "@/lib/projects/repository";
import { PILLAR_VALUES } from "@/lib/projects/schema";
import type { PillarSlug } from "@/types/content";

/**
 * Ajout (`/admin/editer?pilier=...`) ou modification (`/admin/editer?id=...`) d'une réalisation.
 */
export default function EditProjectPage({ searchParams }: PageProps<"/admin/editer">) {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <ArrowLeft aria-hidden="true" className="size-4" /> Mes réalisations
      </Link>
      <Suspense fallback={<div className="mt-8 h-[40rem] animate-pulse rounded-3xl bg-ink-2" />}>
        <EditorLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function EditorLoader({ searchParams }: { searchParams: PageProps<"/admin/editer">["searchParams"] }) {
  const query = await searchParams;
  const id = typeof query.id === "string" ? query.id : undefined;

  if (!(await isAdmin())) {
    redirect(`/connexion?next=${encodeURIComponent(id ? `/admin/editer?id=${id}` : "/admin/editer")}`);
  }

  const project = id ? await getProjectByIdForAdmin(id) : null;
  if (id && !project) redirect("/admin");

  const requestedPillar = typeof query.pilier === "string" ? query.pilier : "";
  const defaultPillar = (PILLAR_VALUES as readonly string[]).includes(requestedPillar)
    ? (requestedPillar as PillarSlug)
    : undefined;

  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {project ? "Modifier la réalisation" : "Ajouter une réalisation"}
      </h1>
      <p className="mt-2 text-muted">
        Les champs marqués d&apos;un astérisque sont obligatoires. La première image sert de couverture.
      </p>
      <ProjectEditor project={project ?? undefined} defaultPillar={defaultPillar} />
    </>
  );
}
