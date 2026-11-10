"use client";

import Link from "next/link";
import { Inbox, LayoutGrid, LogOut, Plus, Settings, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { logoutAction } from "@/app/admin/actions";

/**
 * Barre fixe en bas de l'écran pour l'administrateur.
 * Active aussi l'affichage des boutons `admin-only` (Ajouter / Modifier) sur tout le site.
 */
export function AdminBarClient() {
  useEffect(() => {
    document.documentElement.setAttribute("data-admin", "");
    return () => document.documentElement.removeAttribute("data-admin");
  }, []);

  return (
    <div
      role="region"
      aria-label="Barre d'administration"
      className="fixed inset-x-3 bottom-3 z-60 mx-auto print:hidden flex max-w-4xl items-center justify-between gap-3 rounded-2xl border border-amber-300/40 bg-ink-3/95 px-4 py-2.5 text-sm text-white shadow-[0_20px_60px_-15px_rgb(0_0_0/0.9)] backdrop-blur"
    >
      <span className="hidden items-center gap-2 font-medium text-amber-200 sm:inline-flex">
        <ShieldCheck aria-hidden="true" className="size-4" /> Mode admin
      </span>
      <nav aria-label="Administration" className="flex flex-1 items-center justify-end gap-1 sm:flex-none">
        <Link href="/admin/editer" className="inline-flex items-center gap-1.5 rounded-xl bg-amber-300 px-3 py-2 font-semibold text-ink hover:bg-amber-200">
          <Plus aria-hidden="true" className="size-4" /> Ajouter
        </Link>
        <Link href="/admin/demandes" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 hover:bg-white/10">
          <Inbox aria-hidden="true" className="size-4" /> <span className="sr-only sm:not-sr-only">Demandes</span>
        </Link>
        <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 hover:bg-white/10">
          <LayoutGrid aria-hidden="true" className="size-4" /> <span className="sr-only sm:not-sr-only">Travaux</span>
        </Link>
        <Link href="/admin/parametres" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 hover:bg-white/10">
          <Settings aria-hidden="true" className="size-4" /> <span className="sr-only sm:not-sr-only">Paramètres</span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-muted hover:bg-white/10 hover:text-white">
            <LogOut aria-hidden="true" className="size-4" />
            <span className="sr-only sm:not-sr-only">Déconnexion</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
