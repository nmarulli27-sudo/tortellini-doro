import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  computeStats,
  weeklySeries,
  weekdaySeries,
  type Prenotazione,
} from "@/lib/admin-stats";
import {
  buildAdminQuery,
  fetchFilteredBookings,
  parseBookingFilters,
  PAGE_SIZE,
  type RawSearchParams,
} from "@/lib/admin-bookings";
import { TrendChart, StatusDonut, WeekdayChart } from "@/components/admin/charts";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard prenotazioni · Tortellino d'Oro",
  robots: { index: false, follow: false },
};

const PERIODI = [3, 6, 12] as const;

function formatData(d: string) {
  const [y, m, day] = d.split("-");
  return day && m && y ? `${day}/${m}/${y}` : d;
}

function formatRicevuta(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
  });
}

function StatoPill({ stato }: { stato: string }) {
  const styles: Record<string, string> = {
    confermata: "border-gold/40 bg-gold/10 text-gold-bright",
    in_attesa: "border-line bg-warm text-cream-muted",
    rifiutata: "border-bordeaux/50 bg-bordeaux/15 text-cream-muted",
  };
  const labels: Record<string, string> = {
    confermata: "Confermata",
    in_attesa: "In attesa",
    rifiutata: "Rifiutata",
  };
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        styles[stato] ?? "border-line text-cream-muted"
      }`}
    >
      {labels[stato] ?? stato}
    </span>
  );
}

const controlClass =
  "w-full border border-line bg-deep px-3 py-2.5 text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

export default async function AdminDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  if (!(await verifyAdminSession())) redirect(`/${locale}/admin/login`);

  const sp = await searchParams;
  const adminBase = `/${locale}/admin`;

  // Periodo della panoramica (KPI + grafici), su created_at.
  const periodoRaw = Number.parseInt(
    Array.isArray(sp.periodo) ? (sp.periodo[0] ?? "") : (sp.periodo ?? ""),
    10,
  );
  const periodo = PERIODI.includes(periodoRaw as (typeof PERIODI)[number])
    ? periodoRaw
    : 3;

  const now = new Date();
  const since = new Date(now);
  since.setMonth(since.getMonth() - periodo);

  const { data, error } = await supabaseAdmin
    .from("prenotazioni")
    .select(
      "id,created_at,nome,email,telefono,data,ora,coperti,note,stato,token",
    )
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Prenotazione[];
  const stats = computeStats(rows);
  const trend = weeklySeries(rows, since, now);
  const weekday = weekdaySeries(rows);

  // Browser delle prenotazioni: filtri + paginazione, su tutto lo storico.
  const filters = parseBookingFilters(sp);
  const browser = await fetchFilteredBookings(filters);
  const fromRow = browser.count === 0 ? 0 : (browser.page - 1) * PAGE_SIZE + 1;
  const toRow = Math.min(browser.page * PAGE_SIZE, browser.count);
  const hasActiveFilters =
    filters.stato !== "all" ||
    filters.fascia !== "all" ||
    !!filters.from ||
    !!filters.to ||
    !!filters.q;

  const cards = [
    { label: "Prenotazioni", value: stats.totale, hint: `ultimi ${periodo} mesi` },
    {
      label: "Confermate",
      value: stats.confermate,
      hint: `${Math.round(stats.tassoConferma * 100)}% di conferma`,
    },
    { label: "In attesa", value: stats.inAttesa, hint: "da gestire" },
    { label: "Rifiutate", value: stats.rifiutate, hint: "nel periodo" },
    {
      label: "Coperti confermati",
      value: stats.copertiConfermati,
      hint: "da prenotazioni confermate",
    },
    {
      label: "Coperti medi",
      value: stats.copertiMediConfermate.toFixed(1),
      hint: "per prenotazione confermata",
    },
    { label: "Clienti unici", value: stats.clientiUnici, hint: "per email" },
    {
      label: "Clienti abituali",
      value: stats.abituali.length,
      hint: "più di una prenotazione",
    },
  ];

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-28 lg:pt-32">
      {/* Intestazione + logout */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Area riservata</p>
          <h1 className="mt-3 font-display text-4xl font-light text-cream sm:text-5xl">
            Prenotazioni
          </h1>
          <p className="mt-2 text-sm text-cream-muted">
            Panoramica degli ultimi {periodo} mesi (per data di invio).
          </p>
        </div>
        <form method="post" action="/api/admin/logout">
          <button
            type="submit"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted underline decoration-gold/40 underline-offset-4 transition-colors hover:text-cream"
          >
            Esci →
          </button>
        </form>
      </div>

      {/* Selettore periodo */}
      <div className="mt-8 flex items-center gap-3">
        <span className="eyebrow">Periodo</span>
        <div className="flex gap-2">
          {PERIODI.map((p) => (
            <Link
              key={p}
              href={`${adminBase}${buildAdminQuery(sp, { periodo: p })}`}
              className={`border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                p === periodo
                  ? "border-gold/50 bg-gold/10 text-gold-bright"
                  : "border-line text-cream-muted hover:text-cream"
              }`}
            >
              {p} mesi
            </Link>
          ))}
        </div>
      </div>

      <div className="filetto mt-6" />

      {error && (
        <p
          role="alert"
          className="mt-8 border border-bordeaux/40 bg-bordeaux/10 px-4 py-3 text-sm text-cream"
        >
          Impossibile leggere le prenotazioni da Supabase. Riprova più tardi.
        </p>
      )}

      {/* KPI */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={0.05 * (i % 4)}>
            <div className="h-full border border-line/60 bg-elevated px-6 py-6">
              <p className="eyebrow">{c.label}</p>
              <p className="mt-3 font-display text-4xl font-light text-cream">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-cream-muted">{c.hint}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Grafici Recharts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="h-full border border-line/60 bg-elevated px-6 py-6">
            <p className="eyebrow">Andamento settimanale</p>
            <p className="mt-1 text-xs text-cream-muted">
              Prenotazioni e coperti per settimana
            </p>
            <div className="mt-5">
              <TrendChart data={trend} />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-full border border-line/60 bg-elevated px-6 py-6">
            <p className="eyebrow">Ripartizione per stato</p>
            <div className="mt-5">
              <StatusDonut
                confermate={stats.confermate}
                inAttesa={stats.inAttesa}
                rifiutate={stats.rifiutate}
                tassoConferma={stats.tassoConferma}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-4">
        <Reveal>
          <div className="border border-line/60 bg-elevated px-6 py-6">
            <p className="eyebrow">Per giorno della settimana</p>
            <div className="mt-5">
              <WeekdayChart data={weekday} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Clienti abituali */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-light text-cream">
          Clienti abituali
        </h2>
        <p className="mt-1 text-sm text-cream-muted">
          Più di una prenotazione nel periodo, per numero di volte.
        </p>
        <div className="filetto mt-5" />

        {stats.abituali.length === 0 ? (
          <p className="mt-6 text-sm text-cream-muted">
            Nessun cliente con più di una prenotazione negli ultimi {periodo}{" "}
            mesi.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="py-3 pr-4 font-normal text-cream-muted">
                    Cliente
                  </th>
                  <th className="py-3 pr-4 font-normal text-cream-muted">
                    Email
                  </th>
                  <th className="py-3 pr-4 text-right font-normal text-cream-muted">
                    Prenotazioni
                  </th>
                  <th className="py-3 pr-4 text-right font-normal text-cream-muted">
                    Coperti tot.
                  </th>
                  <th className="py-3 text-right font-normal text-cream-muted">
                    Ultima
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.abituali.map((c) => (
                  <tr key={c.email} className="border-b border-line/50">
                    <td className="py-3 pr-4 text-cream">{c.nome}</td>
                    <td className="py-3 pr-4 text-cream-muted">{c.email}</td>
                    <td className="py-3 pr-4 text-right font-mono text-gold-bright">
                      {c.prenotazioni}
                    </td>
                    <td className="py-3 pr-4 text-right text-cream">
                      {c.copertiTotali}
                    </td>
                    <td className="py-3 text-right text-cream-muted">
                      {formatData(c.ultimaData)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Browser prenotazioni: filtri + paginazione su tutto lo storico */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-light text-cream">
          Tutte le prenotazioni
        </h2>
        <p className="mt-1 text-sm text-cream-muted">
          Filtra e sfoglia l&rsquo;intero storico.
        </p>
        <div className="filetto mt-5" />

        {/* Filtri (GET form, server-side) */}
        <form
          method="get"
          action={adminBase}
          className="mt-6 grid gap-4 border border-line/60 bg-elevated px-5 py-5 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          <input type="hidden" name="periodo" value={periodo} />
          <div>
            <label htmlFor="f-stato" className="eyebrow mb-2 block">
              Stato
            </label>
            <select
              id="f-stato"
              name="stato"
              defaultValue={filters.stato}
              className={controlClass}
            >
              <option value="all">Tutti</option>
              <option value="in_attesa">In attesa</option>
              <option value="confermata">Confermata</option>
              <option value="rifiutata">Rifiutata</option>
            </select>
          </div>
          <div>
            <label htmlFor="f-from" className="eyebrow mb-2 block">
              Dal (tavolo)
            </label>
            <input
              id="f-from"
              name="from"
              type="date"
              defaultValue={filters.from}
              className={controlClass}
            />
          </div>
          <div>
            <label htmlFor="f-to" className="eyebrow mb-2 block">
              Al (tavolo)
            </label>
            <input
              id="f-to"
              name="to"
              type="date"
              defaultValue={filters.to}
              className={controlClass}
            />
          </div>
          <div>
            <label htmlFor="f-fascia" className="eyebrow mb-2 block">
              Fascia
            </label>
            <select
              id="f-fascia"
              name="fascia"
              defaultValue={filters.fascia}
              className={controlClass}
            >
              <option value="all">Tutte</option>
              <option value="pranzo">Pranzo</option>
              <option value="cena">Cena</option>
            </select>
          </div>
          <div>
            <label htmlFor="f-q" className="eyebrow mb-2 block">
              Ricerca
            </label>
            <input
              id="f-q"
              name="q"
              type="text"
              defaultValue={filters.q}
              placeholder="Nome, email, telefono"
              className={controlClass}
            />
          </div>
          <div className="flex gap-3 sm:col-span-2 lg:col-span-5">
            <button type="submit" className="btn btn-fill">
              Applica filtri
            </button>
            {hasActiveFilters && (
              <Link
                href={`${adminBase}${buildAdminQuery(sp, {
                  stato: null,
                  from: null,
                  to: null,
                  q: null,
                  fascia: null,
                  page: null,
                })}`}
                className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted underline decoration-gold/40 underline-offset-4 transition-colors hover:text-cream"
              >
                Azzera
              </Link>
            )}
          </div>
        </form>

        {browser.error ? (
          <p
            role="alert"
            className="mt-6 border border-bordeaux/40 bg-bordeaux/10 px-4 py-3 text-sm text-cream"
          >
            Impossibile caricare le prenotazioni. Riprova.
          </p>
        ) : browser.count === 0 ? (
          <p className="mt-6 text-sm text-cream-muted">
            Nessuna prenotazione corrisponde ai filtri.
          </p>
        ) : (
          <>
            <p className="mt-6 text-xs text-cream-muted">
              {fromRow}–{toRow} di {browser.count}
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-3 pr-4 font-normal text-cream-muted">
                      Cliente
                    </th>
                    <th className="py-3 pr-4 font-normal text-cream-muted">
                      Data
                    </th>
                    <th className="py-3 pr-4 font-normal text-cream-muted">
                      Ora
                    </th>
                    <th className="py-3 pr-4 text-right font-normal text-cream-muted">
                      Coperti
                    </th>
                    <th className="py-3 pr-4 font-normal text-cream-muted">
                      Stato
                    </th>
                    <th className="py-3 text-right font-normal text-cream-muted">
                      Ricevuta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {browser.rows.map((r) => (
                    <tr key={r.id} className="border-b border-line/50">
                      <td className="py-3 pr-4">
                        <span className="block text-cream">{r.nome}</span>
                        <span className="block text-xs text-cream-muted">
                          {r.telefono ?? r.email}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-cream">
                        {formatData(r.data)}
                      </td>
                      <td className="py-3 pr-4 text-cream">{r.ora}</td>
                      <td className="py-3 pr-4 text-right text-cream">
                        {r.coperti}
                      </td>
                      <td className="py-3 pr-4">
                        <StatoPill stato={r.stato} />
                      </td>
                      <td className="py-3 text-right text-cream-muted">
                        {formatRicevuta(r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginazione */}
            {browser.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between gap-4">
                {browser.page > 1 ? (
                  <Link
                    href={`${adminBase}${buildAdminQuery(sp, {
                      page: browser.page - 1,
                    })}`}
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted underline decoration-gold/40 underline-offset-4 transition-colors hover:text-cream"
                  >
                    ← Precedenti
                  </Link>
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted/30">
                    ← Precedenti
                  </span>
                )}
                <span className="font-mono text-[11px] uppercase tracking-wider text-cream-muted">
                  Pagina {browser.page} di {browser.totalPages}
                </span>
                {browser.page < browser.totalPages ? (
                  <Link
                    href={`${adminBase}${buildAdminQuery(sp, {
                      page: browser.page + 1,
                    })}`}
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted underline decoration-gold/40 underline-offset-4 transition-colors hover:text-cream"
                  >
                    Successive →
                  </Link>
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted/30">
                    Successive →
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
