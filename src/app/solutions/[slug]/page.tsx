import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CircleDot } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { projectsSection } from "@/data/projects";
import { getPillarBySlug, pillars } from "@/data/services";
import { getPublishedProjects } from "@/lib/projects/repository";
import type { Pillar } from "@/types/content";

/** Les trois pages sont générées statiquement au build, à partir de `src/data/services.ts`. */
export function generateStaticParams() {
  return pillars.map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) return {};
  return {
    title: pillar.seo.title,
    description: pillar.seo.description,
    alternates: { canonical: `/solutions/${pillar.slug}` },
    openGraph: { title: pillar.seo.title, description: pillar.seo.description, url: `/solutions/${pillar.slug}` },
  };
}

/**
 * Page détaillée d'un pilier.
 * `params` est lu dans un composant enfant, sous <Suspense> : les visites directes reçoivent
 * la page complète (générée au build) et les navigations client affichent immédiatement
 * un squelette pendant le chargement (recommandation « instant navigation » de Next 16).
 */
export default function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  return (
    <Suspense fallback={<SolutionSkeleton />}>
      <SolutionContent params={params} />
    </Suspense>
  );
}

/** Squelette léger affiché uniquement pendant une navigation client. */
function SolutionSkeleton() {
  return (
    <section aria-busy="true" className="min-h-[70svh] bg-ink pt-36 pb-20 sm:pt-44">
      <div className="mx-auto max-w-7xl animate-pulse px-5 sm:px-8">
        <div className="h-4 w-40 rounded-full bg-white/10" />
        <div className="mt-12 h-13 w-13 rounded-2xl bg-white/10" />
        <div className="mt-8 h-14 w-full max-w-2xl rounded-2xl bg-white/10" />
        <div className="mt-6 h-5 w-full max-w-xl rounded-full bg-white/5" />
        <span className="sr-only">Chargement…</span>
      </div>
    </section>
  );
}

/** Contenu de la page : pour qui, prestations, livrables, indicateurs, puis contact. */
async function SolutionContent({ params }: { params: PageProps<"/solutions/[slug]">["params"] }) {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) notFound();

  const otherPillars = pillars.filter((item) => item.slug !== pillar.slug);
  const contactHref = `/#contact-${pillar.slug}`;

  return (
    <>
      {/* En-tête */}
      <section aria-labelledby="solution-title" className="relative overflow-hidden bg-ink pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -top-40 right-0 h-[420px] w-[700px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Link href="/#solutions" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
            <ArrowLeft aria-hidden="true" className="size-4" /> Toutes nos solutions
          </Link>
          <div className="mt-10 flex items-center gap-4">
            <span className="inline-flex size-13 items-center justify-center rounded-2xl border border-brand-3/25 bg-brand/15 text-brand-3">
              <Icon name={pillar.icon} className="size-6" />
            </span>
            <p className="text-xs font-semibold tracking-[0.22em] text-brand-3 uppercase">
              Pilier {pillar.number} · {pillar.dimension}
            </p>
          </div>
          <h1 id="solution-title" className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
            {pillar.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{pillar.goal}</p>
          <ButtonLink href={contactHref} size="lg" withArrow className="mt-10">
            Parlons de ce besoin
          </ButtonLink>
        </div>
      </section>

      {/* Pour qui ? */}
      <Section tone="light" labelledBy="signals-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="signals-title" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Ce levier est fait pour vous si…
            </h2>
            <blockquote className="mt-8 border-l-2 border-brand-deep pl-5 text-lg leading-relaxed text-muted-ink italic">
              « {pillar.promise} »
            </blockquote>
          </div>
          <ul className="grid gap-3 lg:col-span-7">
            {pillar.signals.map((signal) => (
              <li key={signal} className="reveal flex gap-4 rounded-2xl border border-line-ink bg-white p-5">
                <CircleDot aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-deep" />
                <span className="leading-relaxed">{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Prestations */}
      <Section tone="dark" labelledBy="services-title">
        <h2 id="services-title" className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Ce que nous mettons en place
        </h2>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {pillar.services.map((service, index) => (
            <li key={service.title} className="reveal bg-ink-2 p-7">
              <span className="font-display text-sm font-semibold text-brand-3">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{service.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Réalisations de ce pilier : la preuve par l'exemple */}
      <PillarProjects pillar={pillar} />

      {/* Livrables, indicateurs, outils */}
      <Section tone="darker" labelledBy="details-title">
        <h2 id="details-title" className="sr-only">
          Livrables, indicateurs et outils
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          <DetailList title="Exemples de livrables" items={pillar.deliverables} />
          <DetailList
            title="Indicateurs suivis ensemble"
            items={pillar.indicators}
            note="Ce sont des repères de travail, pas des résultats garantis : ils dépendent de votre marché et de votre activité."
          />
          <DetailList title="Outils mobilisés" items={pillar.tools} note="Des moyens au service de vos objectifs." />
        </div>
      </Section>

      {/* Autres piliers */}
      <Section tone="dark" labelledBy="others-title" className="pb-16 sm:pb-20">
        <h2 id="others-title" className="font-display text-2xl font-semibold tracking-tight">
          Les autres leviers
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {otherPillars.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/solutions/${other.slug}`}
                className="group flex items-center justify-between gap-6 rounded-3xl border border-line bg-ink-2 p-6 transition hover:border-brand-3/40"
              >
                <span className="flex items-center gap-4">
                  <Icon name={other.icon} className="size-6 text-brand-3" />
                  <span>
                    <span className="block text-xs font-semibold tracking-[0.2em] text-muted uppercase">
                      {other.number} · {other.dimension}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold">{other.name}</span>
                  </span>
                </span>
                <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta href={contactHref} />
    </>
  );
}

function DetailList({ title, items, note }: { title: string; items: string[]; note?: string }) {
  return (
    <div className="reveal rounded-3xl border border-line bg-ink p-7">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-3" />
            <span className="text-white/85">{item}</span>
          </li>
        ))}
      </ul>
      {note && <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">{note}</p>}
    </div>
  );
}

/** Galerie des réalisations publiées pour ce pilier (ou état vide honnête). */
async function PillarProjects({ pillar }: { pillar: Pillar }) {
  const projects = (await getPublishedProjects()).filter((project) => project.pillar === pillar.slug);

  return (
    <Section tone="light" labelledBy="pillar-projects-title">
      <div className="max-w-3xl">
        <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-deep uppercase">
          <span aria-hidden="true" className="h-px w-6 bg-brand-deep" />
          Réalisations
        </p>
        <h2 id="pillar-projects-title" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Nos travaux en {pillar.name}
        </h2>
      </div>

      {projects.length > 0 ? (
        <ProjectGallery projects={projects} pillar={pillar.slug} />
      ) : (
        <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-dashed border-brand-deep/30 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed text-muted-ink">{projectsSection.emptyPillar}</p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href={`/#contact-${pillar.slug}`} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink-3">
              Demander des exemples
            </Link>
            <Link
              href={`/admin/editer?pilier=${pillar.slug}`}
              className="admin-only items-center rounded-full border-2 border-dashed border-amber-400 bg-amber-300/15 px-5 py-3 text-sm font-semibold text-amber-700"
            >
              + Ajouter un travail
            </Link>
          </div>
        </div>
      )}
    </Section>
  );
}
