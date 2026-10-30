import { get, set, del } from "idb-keyval";
import { evidenceSchema, type Evidence } from "./model";

export async function addEvidence(file: File): Promise<Evidence> {
  const entry = evidenceSchema.safeParse({
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type,
    size: file.size,
  });
  if (!entry.success) throw new Error("Usa PNG, JPG, WebP o PDF de hasta 2 MB.");
  await set(`evidence:${entry.data.id}`, file);
  return entry.data;
}
export async function readEvidence(id: string): Promise<Blob | undefined> {
  return get(`evidence:${id}`);
}
export async function removeEvidence(id: string) {
  await del(`evidence:${id}`);
}
