import { getCloudClient } from "@/lib/supabase";
import { draftSchema, type PracticeDraft, type Evidence } from "./model";
import { readEvidence } from "./evidence";

async function signedInClient() {
  const client = await getCloudClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user)
    throw new Error("Inicia sesión desde Mi cuenta para sincronizar tu práctica.");
  return { client, user: data.user };
}
export async function saveCloudDraft(draft: PracticeDraft) {
  const safe = draftSchema.parse(draft);
  const { client, user } = await signedInClient();
  const evidence = await Promise.all(
    safe.evidence.map(async (entry) => {
      const blob = await readEvidence(entry.id);
      if (!blob && !entry.remotePath)
        throw new Error(`No se encontró el archivo ${entry.name}. Vuelve a adjuntarlo.`);
      const ext = entry.type === "application/pdf" ? "pdf" : entry.type.split("/")[1];
      const path = `${user.id}/${safe.activityId}/${entry.id}.${ext}`;
      if (blob) {
        const { error } = await client.storage
          .from("evidence")
          .upload(path, blob, { upsert: true, contentType: entry.type });
        if (error)
          throw new Error("No se pudo sincronizar una evidencia. Tu copia local se conserva.");
      }
      return { ...entry, remotePath: entry.remotePath ?? path };
    }),
  );
  const payload = { ...safe, evidence };
  const { error } = await client
    .from("practice_drafts")
    .upsert(
      { user_id: user.id, activity_id: safe.activityId, payload },
      { onConflict: "user_id,activity_id" },
    );
  if (error) throw new Error("No se pudo sincronizar la práctica. Tu copia local se conserva.");
  return payload;
}
export async function loadCloudDraft() {
  const { client, user } = await signedInClient();
  const { data, error } = await client
    .from("practice_drafts")
    .select("payload")
    .eq("user_id", user.id)
    .eq("activity_id", "qa-tienda")
    .maybeSingle();
  if (error) throw new Error("No se pudo recuperar tu práctica.");
  if (!data) throw new Error("Todavía no hay una práctica guardada en tu cuenta.");
  return draftSchema.parse(data.payload);
}
export async function readCloudEvidence(entry: Evidence): Promise<Blob> {
  if (!entry.remotePath)
    throw new Error("Esta evidencia solo está disponible en el navegador donde la adjuntaste.");
  const { client } = await signedInClient();
  const { data, error } = await client.storage.from("evidence").download(entry.remotePath);
  if (error) throw new Error("No se pudo abrir la evidencia.");
  return data;
}
