import { Section, SectionHeading } from "@/components/ui/Section";
import { pillars, solutionsSection } from "@/data/services";
import { PillarCard } from "./PillarCard";

/** Section 4 — Nos solutions : les trois piliers. */
export function Solutions() {
  return (
    <Section id="solutions" tone="dark" labelledBy="solutions-title">
      <div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <SectionHeading id="solutions-title" {...solutionsSection} />

      <ul className="mt-16 grid gap-5 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <li key={pillar.slug}>
            <PillarCard pillar={pillar} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
