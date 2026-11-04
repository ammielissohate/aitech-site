import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { problems, problemsSection } from "@/data/problems";

/** Section 3 — Les problèmes de nos clients. Le visiteur doit s'y reconnaître. */
export function Problems() {
  return (
    <Section id="constat" tone="light" labelledBy="problems-title">
      <SectionHeading id="problems-title" tone="light" {...problemsSection} />

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:gap-5">
        {problems.map((problem) => (
          <li
            key={problem.title}
            className="reveal group rounded-3xl border border-line-ink bg-white p-7 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-24px_rgb(91_33_182/0.35)] sm:p-8"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand-deep">
              <Icon name={problem.icon} className="size-6" />
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{problem.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-ink">{problem.description}</p>
          </li>
        ))}
      </ul>

      <div className="reveal mt-10 flex flex-col items-start gap-6 rounded-3xl bg-ink p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-lg leading-relaxed text-pretty">{problemsSection.transition.text}</p>
        <Link
          href="#solutions"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium transition hover:border-brand-3/60 hover:bg-white/5"
        >
          {problemsSection.transition.cta}
          <ArrowDown aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
