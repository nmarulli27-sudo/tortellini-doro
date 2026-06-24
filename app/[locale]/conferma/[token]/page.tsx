import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { supabaseAdmin } from "@/lib/supabase";
import { Reveal } from "@/components/reveal";

// Legge sempre lo stato aggiornato (anche dopo il redirect 303 post-azione).
export const dynamic = "force-dynamic";

type Prenotazione = {
  nome: string;
  email: string;
  telefono: string | null;
  data: string;
  ora: string;
  coperti: number;
  note: string | null;
  stato: "in_attesa" | "confermata" | "rifiutata";
  token: string;
};

export default async function ConfermaPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.confermaPage;

  const { data, error } = await supabaseAdmin
    .from("prenotazioni")
    .select("nome, email, telefono, data, ora, coperti, note, stato, token")
    .eq("token", token)
    .maybeSingle();

  const prenotazione = (error ? null : data) as Prenotazione | null;

  let title = t.notFoundTitle;
  let intro = t.notFoundIntro;
  if (prenotazione?.stato === "in_attesa") {
    title = t.pendingTitle;
    intro = t.pendingIntro;
  } else if (prenotazione?.stato === "confermata") {
    title = t.confirmedTitle;
    intro = t.confirmedIntro;
  } else if (prenotazione?.stato === "rifiutata") {
    title = t.rejectedTitle;
    intro = t.rejectedIntro;
  }

  const fields: Array<[string, string]> = prenotazione
    ? [
        [t.fields.nome, prenotazione.nome],
        [t.fields.email, prenotazione.email],
        [t.fields.telefono, prenotazione.telefono || t.empty],
        [t.fields.data, prenotazione.data],
        [t.fields.ora, prenotazione.ora],
        [t.fields.coperti, String(prenotazione.coperti)],
        [t.fields.note, prenotazione.note || t.empty],
      ]
    : [];

  return (
    <main className="mx-auto flex min-h-[80svh] max-w-2xl flex-col justify-center px-6 py-32">
      <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-light text-cream sm:text-5xl">
          {title}
        </h1>
        <div className="filetto mt-6" />
        <p className="mt-6 max-w-md text-sm font-extralight leading-relaxed text-cream-muted">
          {intro}
        </p>

        {prenotazione && (
          <>
            <div className="mt-8">
              <span className="inline-block border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cream">
                {t.statusLabel}: {t.status[prenotazione.stato]}
              </span>
            </div>

            <dl className="mt-8 divide-y divide-line/40 border-y border-line/40">
              {fields.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3">
                  <dt className="eyebrow shrink-0">{label}</dt>
                  <dd className="text-right text-sm text-cream">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {prenotazione?.stato === "in_attesa" && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <form method="post" action="/api/conferma">
              <input type="hidden" name="token" value={prenotazione.token} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="azione" value="conferma" />
              <button type="submit" className="btn btn-fill w-full sm:w-auto">
                {t.confirm}
              </button>
            </form>
            <form method="post" action="/api/conferma">
              <input type="hidden" name="token" value={prenotazione.token} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="azione" value="rifiuta" />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 border border-bordeaux/60 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-cream-muted transition-colors duration-300 hover:border-bordeaux hover:bg-bordeaux/15 hover:text-cream sm:w-auto"
              >
                {t.reject}
              </button>
            </form>
          </div>
        )}
      </Reveal>
    </main>
  );
}
