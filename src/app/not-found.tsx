import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink px-5 pt-32 pb-20 sm:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-sm font-semibold tracking-[0.22em] text-brand-3 uppercase">Erreur 404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Cette page n&apos;existe pas.</h1>
        <p className="mt-5 text-lg text-muted">Le lien est peut-être incorrect, ou la page a été déplacée.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink href="/#contact" variant="secondary" size="lg">
            Parlons de votre projet
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
