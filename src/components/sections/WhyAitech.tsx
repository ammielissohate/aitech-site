import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { advantages, whySection } from "@/data/advantages";

/** Section 7 — Pourquoi AiTech ? Studio indépendant, sans revendiquer de ressources inexistantes. */
export function WhyAitech() {
  return (
    <Section id="pourquoi" tone="dark" labelledBy="why-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading id="why-title" {...whySection} />
          <div className="reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="#contact" variant="secondary" withArrow>
              Parlons de votre projet
            </ButtonLink>
            <ButtonLink href="/a-propos" variant="ghost">
              Découvrir le fondateur
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:col-span-7">
          {advantages.map((advantage) => (
            <li key={advantage.title} className="reveal bg-ink p-7 sm:p-8">
              <Icon name={advantage.icon} className="size-6 text-brand-3" />
              <h3 className="mt-6 font-display text-lg font-semibold">{advantage.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{advantage.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
