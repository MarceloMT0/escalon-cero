"use client";

import { useSyncExternalStore } from "react";
import { draftSchema, emptyDraft, type PracticeDraft } from "./model";

const KEY = "escalon-cero:practice:v1";
const EVENT = "escalon-cero:changed";
let cachedRaw: string | null | undefined;
let cachedDraft = emptyDraft;

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function readDraft() {
  if (typeof window === "undefined") return emptyDraft;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedDraft;
    cachedRaw = raw;
    const parsed = raw && raw.length < 180000 ? draftSchema.safeParse(JSON.parse(raw)) : null;
    cachedDraft = parsed?.success ? parsed.data : emptyDraft;
  } catch {
    cachedDraft = emptyDraft;
  }
  return cachedDraft;
}
export function usePractice() {
  return useSyncExternalStore(subscribe, readDraft, () => emptyDraft);
}
export function saveDraft(draft: PracticeDraft) {
  const safe = draftSchema.parse(draft);
  const next = { ...safe, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    throw new Error(
      "No se pudo guardar. Revisa el espacio o los permisos del navegador y descarga una copia de tu trabajo.",
    );
  }
  window.dispatchEvent(new Event(EVENT));
  return next;
}
export function startPractice() {
  const current = readDraft();
  if (!current.startedAt) saveDraft({ ...current, startedAt: new Date().toISOString() });
}
