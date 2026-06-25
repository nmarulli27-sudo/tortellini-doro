import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* Client lato server con accesso completo (service role key).
   Da usare SOLO nei Route Handler / Server Component, mai nel browser.

   Inizializzazione PIGRA: il client viene creato alla prima query, non
   all'import del modulo. Così un env var mancante non fa crashare l'intera
   route con "Internal Server Error" al caricamento — es. /admin può comunque
   reindirizzare al login prima di toccare Supabase.

   URL: si legge prima SUPABASE_URL (variabile runtime del Worker, NON inlinata
   in build) e in fallback NEXT_PUBLIC_SUPABASE_URL (usata in locale). Questo
   evita la trappola di Cloudflare in cui una NEXT_PUBLIC_* viene "congelata" in
   fase di build e non è più configurabile a runtime. */
let client: SupabaseClient | null = null;

function init(): SupabaseClient {
  if (client) return client;

  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase non configurato: imposta SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) " +
        "e SUPABASE_SERVICE_ROLE_KEY come variabili del Worker su Cloudflare.",
    );
  }

  client = createClient(url, key);
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const c = init();
    const value = Reflect.get(c as object, prop, receiver);
    return typeof value === "function" ? value.bind(c) : value;
  },
});
