import { isAdmin } from "@/lib/auth/session";
import { AdminBarClient } from "./AdminBarClient";

/**
 * Barre d'administration, rendue uniquement pour l'administrateur connecté.
 * Lit le cookie de session : elle doit être placée sous <Suspense> (voir layout.tsx),
 * ce qui laisse le reste de la page statique pour les visiteurs.
 */
export async function AdminBar() {
  if (!(await isAdmin())) return null;
  return <AdminBarClient />;
}
