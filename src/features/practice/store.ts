"use client";

import { useSyncExternalStore } from "react";
import { draftSchema, emptyDraft, type PracticeDraft } from "./model";

const KEY = "escalon-cero:practice:v1";
const EVENT = "escalon-cero:changed";
let cachedRaw: string | null | undefined;
let cachedDraft = emptyDraft;
let activeUserId: string | null = null;
let cachedKey = KEY;

function storageKey() {
  return activeUserId ? `${KEY}:${activeUserId}` : KEY;
}

export function setPracticeIdentity(userId: string | null) {
  if (activeUserId === userId) return;
  // A first sign-in takes an existing guest draft into the new account's local
  // namespace. Existing account drafts are never overwritten by guest content.
  if (!activeUserId && userId) {
    try {
      const guest = localStorage.getItem(KEY);
      const destination = `${KEY}:${userId}`;
      if (guest && !localStorage.getItem(destination)) {
        const parsed = draftSchema.safeParse(JSON.parse(guest));
        if (parsed.success && parsed.data.startedAt) {
          localStorage.setItem(destination, JSON.stringify(parsed.data));
          localStorage.removeItem(KEY);
        }
      }
    } catch {
      // Keep the guest copy intact if the browser cannot persist the transfer.
      return;
    }
  }
  activeUserId = userId;
  cachedRaw = undefined;
  window.dispatchEvent(new Event(EVENT));
}

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
    const key = storageKey();
    const raw = localStorage.getItem(key);
    if (key === cachedKey && raw === cachedRaw) return cachedDraft;
    cachedKey = key;
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
    localStorage.setItem(storageKey(), JSON.stringify(next));
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
