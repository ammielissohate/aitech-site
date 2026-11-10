import "server-only";
import { formatCallTime } from "@/lib/booking";
import { formatMoney } from "@/lib/pricing";
import type { Quote } from "@/lib/quotes/repository";

/**
 * Notification e-mail d'une nouvelle demande de devis, via l'API Resend.
 *
 * Variables d'environnement :
 *  - RESEND_API_KEY      : clé API Resend (obligatoire pour envoyer) ;
 *  - QUOTE_NOTIFY_EMAIL  : adresse qui reçoit les notifications ;
 *  - RESEND_FROM         : expéditeur (par défaut « AiTech <onboarding@resend.dev> »,
 *                          utilisable tant que vous n'avez pas vérifié de domaine).
 *
 * Sans configuration, rien n'est envoyé : la demande reste visible dans /admin/demandes.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_NOTIFY_EMAIL);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

export async function sendQuoteNotification(quote: Quote, siteUrl: string): Promise<void> {
  if (!isEmailConfigured()) return;

  const amount = formatMoney(quote.total, quote.currency);
  const call = formatCallTime(quote.callAt);
  const lines: [string, string][] = [
    ["Référence", quote.ref],
    ["Offre", `${quote.offerName}${quote.quantity > 1 ? ` × ${quote.quantity}` : ""}`],
    ["Montant", amount],
    ["Appel", `${call} (heure du Bénin)`],
    ["Client", `${quote.fullName}${quote.company ? ` — ${quote.company}` : ""} (${quote.clientType})`],
    ["E-mail", quote.email],
    ["WhatsApp", quote.whatsapp],
    ["Pays", quote.country ?? "inconnu"],
  ];
  if (quote.message) lines.push(["Message", quote.message]);

  const html = `
    <div style="font-family:Arial,sans-serif;color:#09090F">
      <h2 style="color:#7C3AED">Nouvelle demande de devis</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${lines.map(([label, value]) => `<tr><td style="color:#52525B">${label}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`).join("")}
      </table>
      <p><a href="${siteUrl}/admin/demandes" style="color:#7C3AED">Ouvrir les demandes dans l'admin</a></p>
    </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "AiTech <onboarding@resend.dev>",
        to: [process.env.QUOTE_NOTIFY_EMAIL],
        reply_to: quote.email,
        subject: `Nouveau devis ${quote.ref} · ${quote.offerName} · ${amount}`,
        html,
        text: lines.map(([label, value]) => `${label} : ${value}`).join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) console.error("[notify] Resend a refusé l'envoi :", response.status, await response.text());
  } catch (error) {
    console.error("[notify] Envoi de l'e-mail impossible :", error);
  }
}
