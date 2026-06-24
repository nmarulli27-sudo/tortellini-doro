import { supabaseAdmin } from "@/lib/supabase";
import type { Prenotazione } from "@/lib/admin-stats";

/* Browser delle prenotazioni: parsing dei filtri dalla query-string, query
   filtrata + paginata su Supabase, e helper per comporre i link mantenendo
   i parametri. Tutto lato server (usa la service_role). */

export const PAGE_SIZE = 25;

export type StatoFiltro = "all" | "in_attesa" | "confermata" | "rifiutata";
export type FasciaFiltro = "all" | "pranzo" | "cena";

export type BookingFilters = {
  stato: StatoFiltro;
  from: string; // YYYY-MM-DD oppure ""
  to: string;
  q: string; // già sanificata
  fascia: FasciaFiltro;
  page: number; // >= 1
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : (v ?? "")).toString().trim();
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseBookingFilters(sp: RawSearchParams): BookingFilters {
  const statoRaw = str(sp.stato);
  const stato: StatoFiltro =
    statoRaw === "in_attesa" ||
    statoRaw === "confermata" ||
    statoRaw === "rifiutata"
      ? statoRaw
      : "all";

  const fasciaRaw = str(sp.fascia);
  const fascia: FasciaFiltro =
    fasciaRaw === "pranzo" || fasciaRaw === "cena" ? fasciaRaw : "all";

  const from = DATE_RE.test(str(sp.from)) ? str(sp.from) : "";
  const to = DATE_RE.test(str(sp.to)) ? str(sp.to) : "";

  // Sanifica la ricerca: rimuove i caratteri che romperebbero/inietterebbero
  // la sintassi del filtro PostgREST `.or()`, poi tronca.
  const q = str(sp.q)
    .replace(/[,()*%]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

  const pageNum = Number.parseInt(str(sp.page), 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  return { stato, from, to, q, fascia, page };
}

export type BookingsResult = {
  rows: Prenotazione[];
  count: number;
  totalPages: number;
  page: number;
  error: boolean;
};

export async function fetchFilteredBookings(
  f: BookingFilters,
): Promise<BookingsResult> {
  const offset = (f.page - 1) * PAGE_SIZE;

  let query = supabaseAdmin
    .from("prenotazioni")
    .select(
      "id,created_at,nome,email,telefono,data,ora,coperti,note,stato,token",
      { count: "exact" },
    );

  if (f.stato !== "all") query = query.eq("stato", f.stato);
  if (f.from) query = query.gte("data", f.from);
  if (f.to) query = query.lte("data", f.to);
  // Le fasce di servizio non si sovrappongono (pranzo 12:30–14:30, cena 19:30–22:30),
  // quindi un confronto stringa su "HH:MM" con soglia 17:00 le separa nettamente.
  if (f.fascia === "pranzo") query = query.lt("ora", "17:00");
  else if (f.fascia === "cena") query = query.gte("ora", "17:00");
  if (f.q) {
    query = query.or(
      `nome.ilike.*${f.q}*,email.ilike.*${f.q}*,telefono.ilike.*${f.q}*`,
    );
  }

  query = query
    .order("data", { ascending: false })
    .order("ora", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("[admin-bookings] query fallita:", error.message);
    return { rows: [], count: 0, totalPages: 1, page: f.page, error: true };
  }

  const total = count ?? 0;
  return {
    rows: (data ?? []) as Prenotazione[],
    count: total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    page: f.page,
    error: false,
  };
}

/* Compone una query-string preservando i parametri correnti e applicando
   gli override (valore "" o null rimuove la chiave). */
export function buildAdminQuery(
  current: RawSearchParams,
  overrides: Record<string, string | number | null>,
): string {
  const params = new URLSearchParams();
  const keys = ["periodo", "stato", "from", "to", "q", "fascia", "page"];
  for (const k of keys) {
    const v = current[k];
    const s = Array.isArray(v) ? v[0] : v;
    if (s) params.set(k, s.toString());
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null || v === "") params.delete(k);
    else params.set(k, v.toString());
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
