import type { Metadata } from "next";
import { Check } from "lucide-react";
import { FinalCta } from "@/components/sections/FinalCta";
import { FounderPortrait } from "@/components/sections/FounderPortrait";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { aboutSection, founder } from "@/data/about";
import { getPillarBySlug } from "@/data/services";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: aboutSection.seo.title,
  description: aboutSection.seo.description,
  alternates: { canonical: "/a-propos" },
  openGraph: { title: aboutSection.seo.title, description: aboutSection.seo.description, url: "/a-propos" },
};

/**
 * Page « À propos » : le fondateur, son approche et ce qu'il apporte à chaque pilier.
 * Tous les textes viennent de `src/data/about.ts`.
 */
export default function AboutPage() {
  const heading = founder.name ? `${founder.name}, ${founder.role.toLowerCase()}` : founder.role;

  return (
    <>
      {/* En-tête : texte + portrait */}
      <section aria-labelledby="about-title" className="relative overflow-hidden bg-ink pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -top-40 left-0 h-[420px] w-[700px] rounded-full bg-brand/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
              <span aria-hidden="true" className="h-px w-6 bg-brand-3" />
              {aboutSection.eyebrow}
            </p>
            <h1 id="about-title" className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
              {aboutSection.title}
            </h1>
            <p className="mt-6 text-sm font-medium text-white/80">
              {heading}
              {siteConfig.contact.location && <span className="text-muted"> · {siteConfig.contact.location}</span>}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{founder.intro}</p>
            <ButtonLink href={aboutSection.cta.href} size="lg" withArrow className="mt-10">
              {aboutSection.cta.label}
            </ButtonLink>
          </div>

          <div className="lg:col-span-5">
            <FounderPortrait founder={founder} />
          </div>
        </div>
      </section>

      {/* Parcours et vision */}
      <Section tone="light" labelledBy="story-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 id="story-title" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:col-span-4">
            Pourquoi AiTech existe
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-ink lg:col-span-8">
            {founder.story.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="reveal text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Compétences au service des trois piliers */}
      <Section tone="dark" labelledBy="expertise-title">
        <div className="max-w-3xl">
          <h2 id="expertise-title" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {aboutSection.expertiseTitle}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{aboutSection.expertiseIntro}</p>
        </div>

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {founder.expertiseByPillar.map((group) => {
            const pillar = getPillarBySlug(group.pillar);
            return (
              <li key={group.pillar} className="reveal rounded-3xl border border-line bg-ink-2 p-7">
                <div className="flex items-center gap-3">
                  {pillar && <Icon name={pillar.icon} className="size-5 text-brand-3" />}
                  <p className="text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
                    {pillar ? `${pillar.number} · ${pillar.dimension}` : group.title}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{group.title}</h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex gap-3">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-3" />
                      <span className="text-white/85">{skill}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-10 flex flex-col gap-4 rounded-3xl border border-line p-6 sm:flex-row sm:items-center">
          <p className="shrink-0 text-sm font-semibold text-white">{aboutSection.toolsTitle}</p>
          <ul className="flex flex-wrap gap-2">
            {founder.tools.map((tool) => (
              <li key={tool} className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-sm text-muted">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Façon de travailler */}
      <Section tone="darker" labelledBy="principles-title" className="pb-16 sm:pb-20">
        <h2 id="principles-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {aboutSection.principlesTitle}
        </h2>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {founder.principles.map((principle, index) => (
            <li key={principle.title} className="reveal bg-ink-2 p-7 sm:p-8">
              <span className="font-display text-sm font-semibold text-brand-3">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{principle.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{principle.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <FinalCta href="/#contact" />
    </>
  );
}
