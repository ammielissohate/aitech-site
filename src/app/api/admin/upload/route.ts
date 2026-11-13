import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminToken, SESSION_COOKIE } from "@/lib/auth/session";
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_VIDEO_BYTES } from "@/lib/projects/schema";

/**
 * Autorise l'envoi direct d'images depuis le navigateur vers Vercel Blob.
 *
 * Le navigateur demande d'abord un jeton d'envoi à cette route : il n'est délivré
 * qu'à l'administrateur connecté, rangées dans `realisations/` (images et vidéos) ou `profil/` (images).
 * Les tailles limites fines (10 Mo par image) sont contrôlées dans le formulaire.
 * L'image ne transite pas par le serveur du site (pas de limite de taille des fonctions).
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Le stockage d'images n'est pas configuré (BLOB_READ_WRITE_TOKEN)." }, { status: 503 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const token = request.headers
          .get("cookie")
          ?.split(";")
          .map((part) => part.trim())
          .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
          ?.slice(SESSION_COOKIE.length + 1);

        if (!isAdminToken(token)) throw new Error("Non autorisé : connectez-vous à l'espace admin.");
        if (!pathname.startsWith("realisations/") && !pathname.startsWith("profil/")) {
          throw new Error("Emplacement de fichier non autorisé.");
        }

        return {
          // Les vidéos ne sont acceptées que pour les réalisations (pas pour la photo de profil).
          allowedContentTypes: pathname.startsWith("realisations/") ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES] : ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Envoi refusé.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
