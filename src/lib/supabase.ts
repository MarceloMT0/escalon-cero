import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const cloudConfigured = Boolean(url && key);
let client: SupabaseClient | undefined;

export async function getCloudClient() {
  if (!url || !key)
    throw new Error(
      "La sincronización de cuentas aún no está activada. Tu práctica sigue disponible en este navegador.",
    );
  if (!client) {
    const { createClient } = await import("@supabase/supabase-js");
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}
