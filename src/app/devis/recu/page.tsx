import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck2, CheckCircle2 } from "lucide-react";
import { Suspense } from "react";
import { Logo } from "@/components/layout/Logo";
import { QuoteActions } from "@/components/quote/QuoteActions";
import { LocalCallTime } from "@/components/quote/LocalCallTime";
import { siteConfig } from "@/data/site";
import { formatCallTime } from "@/lib/booking";
import { formatMoney, xofToEur } from "@/lib/pricing";
import { getQuoteForClient } from "@/lib/quotes/repository";
import { QUOTE_VALIDITY_DAYS } from "@/lib/quotes/schema";

export const metadata: Metadata = {
  title: "Votre devis",
  robots: { index: false, follow: false },
};

/** Devis obtenu : accessible uniquement avec la référence ET la clé secrète du lien. */
export default function QuoteReceiptPage({ searchParams }: PageProps<"/devis/recu">) {
  return (
    <section className="bg-ink pt-28 pb-24 sm:pt-32 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 print:max-w-none print:px-0">
        <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-3xl bg-ink-2" />}>
          <QuoteReceipt searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function QuoteReceipt({ searchParams }: { searchParams: PageProps<"/devis/recu">["searchParams"] }) {
  const query = await searchParams;
  const ref = typeof query.ref === "string" ? query.ref : "";
  const key = typeof query.cle === "string" ? query.cle : "";
  const quote = await getQuoteForClient(ref, key);

  if (!quote) {
    return (
      <div className="rounded-3xl border border-line bg-ink-2 p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">Devis introuvable</h1>
        <p className="mt-3 text-muted">Le lien est incomplet ou a expiré. Utilisez le lien exact reçu à la création de votre devis.</p>
        <Link href="/offres" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold">
          Voir les offres
        </Link>
      </div>
    );
  }

  const created = new Date(quote.createdAt);
  const validUntil = new Date(created.getTime() + QUOTE_VALIDITY_DAYS * 24 * 60 * 60 * 1000);
  const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Porto-Novo" });
  const whatsappDigits = siteConfig.contact.whatsapp.replace(/\D/g, "");

  return (
    <>
      {/* Confirmation (écran uniquement) */}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-emerald-300" />
          <div>
            <h1 className="font-display text-xl font-semibold">Votre devis est prêt, {quote.fullName.split(" ")[0]} !</h1>
            <p className="mt-1 text-sm text-emerald-50/80">
              Votre appel est réservé. Gardez ce lien : il vous permet de retrouver votre devis à tout moment.
            </p>
          </div>
        </div>
      </div>

      <QuoteActions
        refCode={quote.ref}
        callAt={quote.callAt}
        offerName={quote.offerName}
        whatsapp={whatsappDigits}
      />

      {/* Document du devis */}
      <article className="mt-6 rounded-3xl bg-white p-6 text-ink sm:p-10 print:mt-0 print:rounded-none print:p-0">
        <header className="flex flex-col gap-6 border-b border-line-ink pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo variant="light" asLink={false} />
            <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-muted-ink uppercase">{siteConfig.category}</p>
            <p className="mt-3 text-sm text-muted-ink">
              {siteConfig.contact.location}
              {whatsappDigits && <> · WhatsApp +{whatsappDigits}</>}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-2xl font-semibold">Devis</p>
            <p className="text-sm text-muted-ink">N° {quote.ref}</p>
            <p className="text-sm text-muted-ink">Émis le {dateFormat.format(created)}</p>
            <p className="text-sm text-muted-ink">Valable jusqu&apos;au {dateFormat.format(validUntil)}</p>
          </div>
        </header>

        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-ink uppercase">Client</p>
            <p className="mt-2 font-semibold">{quote.fullName}</p>
            {quote.company && <p className="text-sm">{quote.company}</p>}
            <p className="text-sm text-muted-ink">{quote.clientType === "entreprise" ? "Entreprise" : "Particulier"}</p>
            <p className="text-sm text-muted-ink">{quote.email}</p>
            <p className="text-sm text-muted-ink">{quote.whatsapp}</p>
          </div>
          <div className="rounded-2xl bg-mist p-4">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-ink uppercase">
              <CalendarCheck2 aria-hidden="true" className="size-4 text-brand-deep" /> Appel de lancement
            </p>
            <p className="mt-2 font-semibold first-letter:uppercase">{formatCallTime(quote.callAt)}</p>
            <p className="text-sm text-muted-ink">Heure du Bénin (UTC+1) · 30 minutes</p>
            <LocalCallTime iso={quote.callAt} />
          </div>
        </section>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line-ink text-xs tracking-wider text-muted-ink uppercase">
              <th className="py-3 font-semibold">Prestation</th>
              <th className="py-3 text-right font-semibold">Qté</th>
              <th className="py-3 text-right font-semibold">Prix unitaire</th>
              <th className="py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line-ink">
              <td className="py-4">
                <p className="font-semibold">{quote.offerName}</p>
                <p className="text-muted-ink">Délai de réalisation : {quote.duration}</p>
              </td>
              <td className="py-4 text-right">{quote.quantity}</td>
              <td className="py-4 text-right">{formatMoney(quote.unitPrice, quote.currency)}</td>
              <td className="py-4 text-right font-semibold">{formatMoney(quote.total, quote.currency)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs rounded-2xl bg-ink p-5 text-white print:border print:border-ink print:bg-white print:text-ink">
            <p className="text-sm opacity-80">Total</p>
            <p className="font-display text-3xl font-semibold">{formatMoney(quote.total, quote.currency)}</p>
            {quote.currency === "XOF" && <p className="text-xs opacity-70">≈ {formatMoney(xofToEur(quote.total), "EUR")}</p>}
            <p className="mt-3 text-xs opacity-80">
              Acompte de 50 % au démarrage : {formatMoney(Math.round(quote.total / 2), quote.currency)}
            </p>
          </div>
        </div>

        {quote.message && (
          <section className="mt-8">
            <p className="text-xs font-semibold tracking-wider text-muted-ink uppercase">Votre projet</p>
            <p className="mt-2 text-sm whitespace-pre-line">{quote.message}</p>
          </section>
        )}

        <section className="mt-8 border-t border-line-ink pt-6 text-xs leading-relaxed text-muted-ink">
          <p className="font-semibold text-ink">Conditions</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Devis indicatif établi à partir de l&apos;offre choisie ; le périmètre final est confirmé lors de l&apos;appel.</li>
            <li>Paiement en deux fois : 50 % au démarrage du projet, 50 % à la livraison.</li>
            <li>Le délai de réalisation court à partir de la réception de l&apos;acompte et des éléments nécessaires.</li>
            <li>Devis valable {QUOTE_VALIDITY_DAYS} jours.</li>
          </ul>
        </section>
      </article>

      <div className="mt-8 rounded-3xl border border-line bg-ink-2 p-6 print:hidden">
        <p className="font-display text-lg font-semibold">Et maintenant ?</p>
        <ol className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          {[
            "Nous étudions votre demande avant l'appel.",
            "Lors de l'appel, nous validons ensemble le périmètre et le planning.",
            "Vous versez l'acompte : le projet démarre.",
          ].map((text, index) => (
            <li key={text} className="flex gap-3">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-3/40 text-xs font-semibold text-brand-3">
                {index + 1}
              </span>
              <span className="text-muted">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
