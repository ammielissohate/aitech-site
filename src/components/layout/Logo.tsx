import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** `dark` : pour fond sombre (« Tech » en blanc). `light` : pour fond clair (« Tech » en noir). */
  variant?: "dark" | "light";
  className?: string;
  /** Rend le logo cliquable vers l'accueil. */
  asLink?: boolean;
}

/**
 * Logo typographique AiTech.
 * « Ai » en violet, appuyé par un point-signal ; « Tech » en blanc ou en noir selon le fond.
 * Le nom est toujours écrit « AiTech » pour les technologies d'assistance.
 */
export function Logo({ variant = "dark", className, asLink = true }: LogoProps) {
  const mark = (
    <span className={cn("inline-flex items-baseline font-display text-[1.45rem] leading-none font-bold tracking-[-0.04em]", className)}>
      <span className="text-brand-3">Ai</span>
      <span className={variant === "dark" ? "text-white" : "text-ink"}>Tech</span>
      <span aria-hidden="true" className="ml-0.5 inline-block size-[0.32em] translate-y-[-0.05em] rounded-full bg-brand" />
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link href="/" aria-label="AiTech, retour à l'accueil" className="inline-flex rounded-md">
      {mark}
    </Link>
  );
}
