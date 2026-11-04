import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "light";
type ButtonSize = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // Violet plein, texte blanc (contraste ≈ 6:1).
  primary:
    "bg-brand text-white shadow-[0_8px_30px_-8px_rgb(124_58_237/0.7)] hover:bg-[#6d28d9] hover:shadow-[0_10px_36px_-6px_rgb(124_58_237/0.85)] active:scale-[0.98]",
  // Contour fin sur fond sombre.
  secondary: "border border-white/15 bg-white/[0.03] text-white hover:border-brand-3/60 hover:bg-white/[0.07]",
  // Lien textuel avec flèche.
  ghost: "px-0! text-brand-3 hover:text-white",
  // Bouton blanc sur fond violet (CTA final).
  light: "bg-white text-ink hover:bg-mist active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-5 text-[0.95rem] sm:px-7 sm:text-base",
};

/** Classes d'un bouton, réutilisables sur un <button> natif. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Affiche une flèche animée au survol. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}

/** Lien stylisé en bouton. Tous les CTA du site passent par ce composant. */
export function ButtonLink({ variant = "primary", size = "md", withArrow = false, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {withArrow && (
        <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}
