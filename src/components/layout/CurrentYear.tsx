"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();
/** Aucune année côté serveur : avec Cache Components, `new Date()` est interdit pendant le prérendu. */
const getServerYear = () => null;

/**
 * Année courante pour le copyright, calculée uniquement dans le navigateur.
 * La page reste entièrement statique et l'année est toujours à jour.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getYear, getServerYear);
  return <span>{year}</span>;
}
