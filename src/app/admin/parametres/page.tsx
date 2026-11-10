import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ProfilePhotoForm } from "@/components/admin/ProfilePhotoForm";
import { isAdmin } from "@/lib/auth/session";
import { getFounderPhoto } from "@/lib/settings";

/** Paramètres du site modifiables sans toucher au code. */
export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-3xl bg-ink-2" />}>
        <Settings />
      </Suspense>
    </div>
  );
}

async function Settings() {
  if (!(await isAdmin())) redirect("/connexion?next=/admin/parametres");
  const photo = await getFounderPhoto();

  return (
    <>
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">Espace admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Paramètres</h1>
      <section className="mt-10 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Photo de profil</h2>
        <p className="mt-2 text-sm text-muted">
          Affichée sur la page À propos. Format portrait conseillé (par exemple 1200 × 1500 px), 10 Mo maximum.
        </p>
        <ProfilePhotoForm current={photo} />
      </section>
    </>
  );
}
