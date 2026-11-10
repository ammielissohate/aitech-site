import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { Suspense } from "react";
import { updateQuoteStatusAction } from "@/app/admin/actions";
import { isAdmin } from "@/lib/auth/session";
import { formatCallTime } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { isEmailConfigured } from "@/lib/notify";
import { formatMoney } from "@/lib/pricing";
import { listQuotesForAdmin, type Quote } from "@/lib/quotes/repository";
import { QUOTE_STATUS_LABELS, QUOTE_STATUSES } from "@/lib/quotes/schema";

/** Demandes de devis et appels réservés (admin). */
export default function QuoteRequestsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ink-2" />}>
        <QuoteRequests />
      </Suspense>
    </div>
  );
}

async function QuoteRequests() {
  if (!(await isAdmin())) redirect("/connexion?next=/admin/demandes");

  const { quotes, upcoming, past } = await loadQuotes();

  return (
    <>
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">Espace admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Demandes de devis</h1>
      <p className="mt-2 text-muted">
        {upcoming.length} appel{upcoming.length > 1 ? "s" : ""} à venir · {quotes.length} demande{quotes.length > 1 ? "s" : ""} au total.
      </p>
      {!isEmailConfigured() && (
        <p className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/5 p-4 text-sm text-amber-100">
          Les notifications par e-mail ne sont pas encore actives (RESEND_API_KEY et QUOTE_NOTIFY_EMAIL). Les demandes arrivent quand même ici.
        </p>
      )}

      <QuoteList title="Appels à venir" quotes={upcoming} empty="Aucun appel prévu pour le moment." />
      <QuoteList title="Historique" quotes={past} empty="Aucune demande passée." />
    </>
  );
}

/** Sépare les appels à venir (du plus proche au plus lointain) de l'historique. */
async function loadQuotes() {
  const quotes = await listQuotesForAdmin();
  const now = Date.now();
  const upcoming = quotes.filter((quote) => new Date(quote.callAt).getTime() >= now && quote.status !== "annule").reverse();
  const past = quotes.filter((quote) => !upcoming.includes(quote));
  return { quotes, upcoming, past };
}

function QuoteList({ title, quotes, empty }: { title: string; quotes: Quote[]; empty: string }) {
  return (
    <section className="mt-12">
      <h2 className="border-b border-line pb-3 font-display text-xl font-semibold">{title}</h2>
      {quotes.length === 0 ? (
        <p className="mt-5 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {quotes.map((quote) => (
            <li key={quote.id} className="rounded-2xl border border-line bg-ink-2 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-semibold first-letter:uppercase">
                    <CalendarClock aria-hidden="true" className="size-4 text-brand-3" /> {formatCallTime(quote.callAt)}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold">
                    {quote.offerName}
                    {quote.quantity > 1 && ` × ${quote.quantity}`} · {formatMoney(quote.total, quote.currency)}
                  </p>
                  <p className="text-sm text-muted">
                    {quote.fullName}
                    {quote.company && ` — ${quote.company}`} · {quote.clientType} · {quote.country ?? "pays inconnu"} · réf. {quote.ref}
                  </p>
                  {quote.message && <p className="mt-3 max-w-2xl text-sm whitespace-pre-line text-white/80">« {quote.message} »</p>}
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <a
                      href={`https://wa.me/${quote.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15"
                    >
                      <MessageCircle aria-hidden="true" className="size-4" /> {quote.whatsapp}
                    </a>
                    <a href={`mailto:${quote.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15">
                      <Mail aria-hidden="true" className="size-4" /> {quote.email}
                    </a>
                    <Link
                      href={`/devis/recu?ref=${encodeURIComponent(quote.ref)}&cle=${encodeURIComponent(quote.accessKey)}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted hover:text-white"
                    >
                      <ExternalLink aria-hidden="true" className="size-4" /> Voir le devis
                    </Link>
                  </div>
                </div>

                <form action={updateQuoteStatusAction} className="flex shrink-0 items-center gap-2">
                  <input type="hidden" name="id" value={quote.id} />
                  <label htmlFor={`status-${quote.id}`} className="sr-only">
                    Statut de la demande {quote.ref}
                  </label>
                  <select
                    id={`status-${quote.id}`}
                    name="status"
                    defaultValue={quote.status}
                    className={cn(
                      "h-10 rounded-xl border bg-ink px-3 text-sm",
                      quote.status === "nouveau" ? "border-amber-300/60" : "border-white/15",
                    )}
                  >
                    {QUOTE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {QUOTE_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="h-10 rounded-xl bg-white/10 px-3 text-sm hover:bg-white/15">
                    Enregistrer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
