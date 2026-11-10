import type { Metadata } from "next";
import { Award, Briefcase, Check, GraduationCap, HandHeart, Languages, Medal, Trophy } from "lucide-react";
import { FinalCta } from "@/components/sections/FinalCta";
import { FounderPortrait } from "@/components/sections/FounderPortrait";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { aboutSection, founder } from "@/data/about";
import { getPillarBySlug } from "@/data/services";
import { getFounderPhoto } from "@/lib/settings";
import type { Founder } from "@/types/content";

export const metadata: Metadata = {
  title: aboutSection.seo.title,
  description: aboutSection.seo.description,
  alternates: { canonical: "/a-propos" },
  openGraph: { title: aboutSection.seo.title, description: aboutSection.seo.description, url: "/a-propos", type: "profile" },
};

const DISTINCTION_ICONS = { prix: Trophy, bourse: Medal, selection: HandHeart } satisfies Record<Founder["distinctions"][number]["kind"], unknown>;

/**
 * Page « À propos » : le fondateur, ses distinctions, son parcours, ce qu'il apporte.
 * Textes dans `src/data/about.ts`, photo dans les paramètres admin (mise en cache, tag `settings`).
 */
export default async function AboutPage() {
  const photo = await getFounderPhoto();

  // Données structurées « Person » pour le référencement du nom du fondateur.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
    address: { "@type": "PostalAddress", addressLocality: "Parakou", addressCountry: "BJ" },
    worksFor: { "@type": "Organization", name: "AiTech" },
    award: founder.distinctions.filter((item) => item.kind === "prix").map((item) => `${item.title} ${item.organization} (${item.year})`),
    knowsLanguage: founder.languages.map((language) => language.name),
    ...(photo ? { image: photo.url } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />

      {/* En-tête */}
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
              {founder.name} · {founder.location}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{founder.intro}</p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {founder.highlights.map((highlight) => (
                <div key={highlight.value} className="rounded-2xl border border-line bg-white/[0.03] p-4">
                  <dt className="sr-only">{highlight.label}</dt>
                  <dd>
                    <span className="block font-display text-xl font-semibold text-white">{highlight.value}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{highlight.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <ButtonLink href={aboutSection.cta.href} size="lg" withArrow className="mt-10">
              {aboutSection.cta.label}
            </ButtonLink>
          </div>

          <div className="lg:col-span-5">
            <FounderPortrait photo={photo} name={founder.name} role={founder.role} />
          </div>
        </div>
      </section>

      {/* Histoire */}
      <Section tone="light" labelledBy="story-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 id="story-title" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:col-span-4">
            {aboutSection.storyTitle}
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

      {/* Distinctions */}
      <Section tone="dark" labelledBy="distinctions-title">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
            <Award aria-hidden="true" className="size-4" /> Reconnaissance
          </p>
          <h2 id="distinctions-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {aboutSection.distinctionsTitle}
          </h2>
          <p className="mt-4 text-lg text-muted">{aboutSection.distinctionsIntro}</p>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {founder.distinctions.map((item) => {
            const DistinctionIcon = DISTINCTION_ICONS[item.kind];
            const isFirstPlace = item.title.includes("1re place");
            return (
              <li
                key={`${item.organization}-${item.year}-${item.title}`}
                className={`reveal rounded-3xl border p-6 ${isFirstPlace ? "border-amber-300/40 bg-gradient-to-b from-amber-300/10 to-ink-2" : "border-line bg-ink-2"}`}
              >
                <div className="flex items-center justify-between">
                  <DistinctionIcon aria-hidden="true" className={`size-6 ${isFirstPlace ? "text-amber-300" : "text-brand-3"}`} />
                  <span className="font-display text-sm font-semibold text-muted">{item.year}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm font-medium text-white/85">{item.organization}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Parcours + formation */}
      <Section tone="darker" labelledBy="experience-title">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="experience-title" className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight">
              <Briefcase aria-hidden="true" className="size-7 text-brand-3" /> {aboutSection.experienceTitle}
            </h2>
            <ol className="relative mt-10 space-y-8 border-l border-line pl-8">
              {founder.experiences.map((experience) => (
                <li key={`${experience.organization}-${experience.period}`} className="reveal relative">
                  <span aria-hidden="true" className="absolute top-1.5 -left-[2.3rem] size-3 rounded-full border-2 border-brand-3 bg-ink-2" />
                  <p className="text-xs font-semibold tracking-wider text-brand-3 uppercase">{experience.period}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">
                    {experience.role} <span className="font-normal text-muted">· {experience.organization}</span>
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {experience.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-12 lg:col-span-5">
            <div>
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
                <GraduationCap aria-hidden="true" className="size-6 text-brand-3" /> {aboutSection.educationTitle}
              </h2>
              <ul className="mt-6 space-y-4">
                {founder.education.map((item) => (
                  <li key={item.title} className="rounded-2xl border border-line bg-ink p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted">
                      {item.organization} · {item.period}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
                <Languages aria-hidden="true" className="size-6 text-brand-3" /> {aboutSection.languagesTitle}
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {founder.languages.map((language) => (
                  <li key={language.name} className="rounded-2xl border border-line bg-ink p-4">
                    <p className="font-semibold">{language.name}</p>
                    <p className="text-sm text-muted">{language.level}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Compétences au service des piliers */}
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

      <FinalCta href="/offres" />
    </>
  );
}
