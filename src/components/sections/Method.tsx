import { Section, SectionHeading } from "@/components/ui/Section";
import { methodSection, methodSteps } from "@/data/method";

/** Section 5 — Notre méthode, en quatre étapes. Frise horizontale sur desktop, verticale sur mobile. */
export function Method() {
  return (
    <Section id="methode" tone="darker" labelledBy="method-title">
      <SectionHeading id="method-title" {...methodSection} />

      <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        {/* Ligne de liaison entre les étapes */}
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-brand-3/60 via-white/10 to-transparent md:top-6 md:right-6 md:bottom-auto md:left-6 md:h-px md:w-auto md:bg-gradient-to-r"
        />
        {methodSteps.map((step) => (
          <li key={step.name} className="reveal relative pl-18 md:pl-0">
            <span className="absolute top-0 left-0 inline-flex size-12 items-center justify-center rounded-full border border-brand-3/30 bg-ink-2 font-display text-sm font-semibold text-brand-3 md:relative">
              {step.number}
            </span>
            <p className="pt-2.5 text-xs font-semibold tracking-[0.22em] text-brand-3 uppercase md:mt-8 md:pt-0">{step.name}</p>
            <h3 className="mt-2 font-display text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
