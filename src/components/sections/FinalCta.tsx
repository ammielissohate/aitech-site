import { ButtonLink } from "@/components/ui/Button";
import { finalCtaContent } from "@/data/home";

/**
 * Section 8 — Appel à l'action final, visuellement fort, vers le formulaire.
 * `href` permet aux pages solutions de pointer vers le formulaire de l'accueil avec le service présélectionné.
 */
export function FinalCta({ href = finalCtaContent.cta.href }: { href?: string }) {
  return (
    <section aria-labelledby="final-cta-title" className="bg-ink px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="reveal relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-[#6a2fd6] to-[#3b1a7a] px-5 py-16 text-center sm:px-12 sm:py-24">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div aria-hidden="true" className="absolute -bottom-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-brand-3/40 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl">
          <h2 id="final-cta-title" className="font-display text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            {finalCtaContent.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-white/85">{finalCtaContent.text}</p>
          <ButtonLink href={href} variant="light" size="lg" withArrow className="mt-10">
            {finalCtaContent.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
