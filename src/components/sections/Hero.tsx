import { ButtonLink } from "@/components/ui/Button";
import { heroContent } from "@/data/home";
import { HeroVisual } from "./HeroVisual";

/** Section 2 — La promesse. Premier écran : positionnement + deux CTA, sans chiffres inventés. */
export function Hero() {
  return (
    <section id="accueil" aria-labelledby="hero-title" className="relative overflow-hidden bg-ink">
      {/* Fond : trame fine + halo violet discret */}
      <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]"
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-5 pt-32 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <div className="lg:col-span-7">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-brand-3">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-3" />
            {heroContent.eyebrow}
          </p>

          <h1 id="hero-title" className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
            <span className="block">{heroContent.titleLines[0]}</span>
            <span className="text-gradient block pb-1">{heroContent.titleLines[1]}</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{heroContent.subtitle}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={heroContent.primaryCta.href} size="lg" withArrow>
              {heroContent.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={heroContent.secondaryCta.href} size="lg" variant="secondary">
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>

          <p className="mt-12 flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-muted uppercase">
            {heroContent.pillarsLine.map((pillar, index) => (
              <span key={pillar} className="inline-flex items-center gap-3">
                {index > 0 && <span aria-hidden="true" className="h-px w-6 bg-white/20" />}
                {pillar}
              </span>
            ))}
          </p>
        </div>

        <div className="lg:col-span-5">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
