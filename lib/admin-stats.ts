/* Aggregazioni per la dashboard prenotazioni. Funzioni pure: ricevono le
   righe lette da Supabase e calcolano numeri e serie, senza I/O. */

export type Prenotazione = {
  id: string;
  created_at: string; // ISO timestamptz
  nome: string;
  email: string;
  telefono: string | null;
  data: string; // YYYY-MM-DD
  ora: string;
  coperti: number;
  note: string | null;
  stato: string; // in_attesa | confermata | rifiutata
  token: string;
};

export type ClienteAbituale = {
  email: string;
  nome: string;
  prenotazioni: number;
  copertiTotali: number;
  ultimaData: string;
};

export type Stats = {
  totale: number;
  confermate: number;
  inAttesa: number;
  rifiutate: number;
  copertiConfermati: number;
  clientiUnici: number;
  tassoConferma: number; // 0–1: confermate / (confermate + rifiutate)
  copertiMediConfermate: number;
  abituali: ClienteAbituale[];
};

export function computeStats(rows: Prenotazione[]): Stats {
  let confermate = 0;
  let inAttesa = 0;
  let rifiutate = 0;
  let copertiConfermati = 0;

  // Raggruppa per email (case-insensitive) per individuare i clienti abituali.
  const byEmail = new Map<
    string,
    ClienteAbituale & { _lastCreated: string }
  >();

  for (const row of rows) {
    const coperti = Number(row.coperti) || 0;
    if (row.stato === "confermata") {
      confermate++;
      copertiConfermati += coperti;
    } else if (row.stato === "in_attesa") {
      inAttesa++;
    } else if (row.stato === "rifiutata") {
      rifiutate++;
    }

    const key = row.email.trim().toLowerCase();
    const cur =
      byEmail.get(key) ??
      ({
        email: row.email,
        nome: row.nome,
        prenotazioni: 0,
        copertiTotali: 0,
        ultimaData: row.data,
        _lastCreated: row.created_at,
      } satisfies ClienteAbituale & { _lastCreated: string });

    cur.prenotazioni++;
    cur.copertiTotali += coperti;
    if (row.data > cur.ultimaData) cur.ultimaData = row.data;
    // Nome/email "canonici" = quelli della prenotazione più recente.
    if (row.created_at >= cur._lastCreated) {
      cur._lastCreated = row.created_at;
      cur.nome = row.nome;
      cur.email = row.email;
    }
    byEmail.set(key, cur);
  }

  const abituali: ClienteAbituale[] = [...byEmail.values()]
    .filter((c) => c.prenotazioni > 1)
    .sort(
      (a, b) =>
        b.prenotazioni - a.prenotazioni || b.copertiTotali - a.copertiTotali,
    )
    .map((c) => ({
      email: c.email,
      nome: c.nome,
      prenotazioni: c.prenotazioni,
      copertiTotali: c.copertiTotali,
      ultimaData: c.ultimaData,
    }));

  const decise = confermate + rifiutate;

  return {
    totale: rows.length,
    confermate,
    inAttesa,
    rifiutate,
    copertiConfermati,
    clientiUnici: byEmail.size,
    tassoConferma: decise > 0 ? confermate / decise : 0,
    copertiMediConfermate:
      confermate > 0 ? copertiConfermati / confermate : 0,
    abituali,
  };
}

export type SettimanaSerie = { label: string; count: number; coperti: number };

/* Serie settimanale (~13 bin) per il grafico a barre, dalla data `since`
   a `now`. Bin allineati a finestre di 7 giorni a partire da `since`. */
export function weeklySeries(
  rows: Prenotazione[],
  since: Date,
  now: Date,
): SettimanaSerie[] {
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const bins: { start: Date; count: number; coperti: number }[] = [];

  for (let t = since.getTime(); t < now.getTime(); t += WEEK) {
    bins.push({ start: new Date(t), count: 0, coperti: 0 });
  }
  if (bins.length === 0) {
    bins.push({ start: new Date(since), count: 0, coperti: 0 });
  }

  for (const row of rows) {
    const t = new Date(row.created_at).getTime();
    const idx = Math.floor((t - since.getTime()) / WEEK);
    if (idx >= 0 && idx < bins.length) {
      bins[idx].count++;
      bins[idx].coperti += Number(row.coperti) || 0;
    }
  }

  return bins.map((b) => ({
    label: `${b.start.getDate()}/${b.start.getMonth() + 1}`,
    count: b.count,
    coperti: b.coperti,
  }));
}

export type GiornoSerie = { label: string; count: number; coperti: number };

/* Prenotazioni e coperti per giorno della settimana (lun→dom), in base alla
   data del tavolo. `data` parsata come data locale per non sfasare il giorno. */
export function weekdaySeries(rows: Prenotazione[]): GiornoSerie[] {
  const labels = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const bins = labels.map((label) => ({ label, count: 0, coperti: 0 }));

  for (const row of rows) {
    const [y, m, d] = row.data.split("-").map(Number);
    if (!y || !m || !d) continue;
    // getDay(): 0=Dom … 6=Sab → indice lun-first 0=Lun … 6=Dom.
    const idx = (new Date(y, m - 1, d).getDay() + 6) % 7;
    bins[idx].count++;
    bins[idx].coperti += Number(row.coperti) || 0;
  }

  return bins;
}
