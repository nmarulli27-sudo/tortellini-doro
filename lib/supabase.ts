import { createClient } from "@supabase/supabase-js";

// Client lato server con accesso completo.
// Usa la chiave segreta: da usare SOLO nei Route Handler, mai nel browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

