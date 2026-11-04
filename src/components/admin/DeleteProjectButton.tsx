"use client";

import { Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/app/admin/actions";

/** Suppression d'une réalisation, avec confirmation (action irréversible : images comprises). */
export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteProjectAction}
      onSubmit={(event) => {
        if (!window.confirm(`Supprimer définitivement « ${title} » et ses images ?`)) event.preventDefault();
      }}
      className="ml-auto"
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10">
        <Trash2 aria-hidden="true" className="size-3.5" />
        <span className="sr-only">Supprimer {title}</span>
      </button>
    </form>
  );
}
