import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionTone = "dark" | "darker" | "light";

const tones: Record<SectionTone, string> = {
  dark: "bg-ink text-white",
  darker: "bg-ink-2 text-white",
  light: "bg-mist text-ink",
};

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  className?: string;
  /** Identifiant du titre, relié via aria-labelledby. */
  labelledBy?: string;
  children: ReactNode;
}

/** Conteneur de section : fond, espacements verticaux et largeur maximale homogènes. */
export function Section({ id, tone = "dark", className, labelledBy, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative overflow-hidden py-24 sm:py-32", tones[tone], className)}>
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: SectionTone;
  align?: "left" | "center";
  className?: string;
}

/** En-tête de section : sur-titre, titre (h2) et introduction. */
export function SectionHeading({ id, eyebrow, title, intro, tone = "dark", align = "left", className }: SectionHeadingProps) {
  const isLight = tone === "light";
  return (
    <div className={cn("reveal max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase",
          isLight ? "text-brand-deep" : "text-brand-3",
        )}
      >
        <span aria-hidden="true" className={cn("h-px w-6", isLight ? "bg-brand-deep" : "bg-brand-3")} />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-6 text-lg leading-relaxed text-pretty", isLight ? "text-muted-ink" : "text-muted")}>{intro}</p>
      )}
    </div>
  );
}
