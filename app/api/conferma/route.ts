import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const form = await request.formData();
  const token = form.get("token")?.toString().trim();
  const azione = form.get("azione")?.toString().trim();
  const localeRaw = form.get("locale")?.toString() ?? "";
  const locale = isLocale(localeRaw) ? localeRaw : defaultLocale;

  const base = new URL(request.url).origin;
  const back = (tok: string) =>
    NextResponse.redirect(new URL(`/${locale}/conferma/${tok}`, base), 303);

  if (!token || (azione !== "conferma" && azione !== "rifiuta")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: row } = await supabaseAdmin
    .from("prenotazioni")
    .select("stato, nome, email, data, ora, coperti")
    .eq("token", token)
    .maybeSingle();

  // Non trovata oppure già gestita: nessuna modifica, mostro lo stato attuale.
  if (!row || row.stato !== "in_attesa") {
    return back(token);
  }

  const nuovoStato = azione === "conferma" ? "confermata" : "rifiutata";

  const { error: updErr } = await supabaseAdmin
    .from("prenotazioni")
    .update({ stato: nuovoStato })
    .eq("token", token);

  if (updErr) {
    console.error("[/api/conferma] update fallito:", updErr.message);
    return back(token);
  }

  // Email automatica al cliente solo in caso di conferma (best-effort).
  if (nuovoStato === "confermata") {
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: row.email,
        subject:
          locale === "it"
            ? "La tua prenotazione è confermata — Tortellino d'Oro"
            : "Your reservation is confirmed — Tortellino d'Oro",
        html: emailCliente(locale, {
          nome: row.nome,
          data: row.data,
          ora: row.ora,
          coperti: row.coperti,
        }),
      });
    } catch (e) {
      console.error("[/api/conferma] invio email cliente fallito:", e);
    }
  }

  return back(token);
}

function emailCliente(
  locale: string,
  p: { nome: string; data: string; ora: string; coperti: number },
) {
  const it = locale === "it";
  const heading = it ? "Prenotazione confermata" : "Reservation confirmed";
  const hello = it ? `Ciao ${esc(p.nome)},` : `Hi ${esc(p.nome)},`;
  const intro = it
    ? "la tua prenotazione al Tortellino d'Oro è confermata. Ti aspettiamo."
    : "your reservation at Tortellino d'Oro is confirmed. We look forward to welcoming you.";
  const lblData = it ? "Data" : "Date";
  const lblOra = it ? "Ora" : "Time";
  const lblCoperti = it ? "Coperti" : "Guests";

  const riga = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 16px 6px 0;color:#8a7f6d;font:700 12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em">${label}</td>
       <td style="padding:6px 0;color:#1a1612;font:14px/1.5 Arial,sans-serif">${value}</td>
     </tr>`;

  return `<!doctype html>
<html lang="${it ? "it" : "en"}"><body style="margin:0;background:#f2ead9;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #e6dcc6;border-radius:8px;overflow:hidden">
    <div style="background:#0e0c0a;padding:24px 32px">
      <p style="margin:0;color:#c9a961;font:700 12px/1 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase">Tortellino d'Oro</p>
      <h1 style="margin:8px 0 0;color:#f2ead9;font:400 22px/1.3 Georgia,serif">${heading}</h1>
    </div>
    <div style="padding:28px 32px">
      <p style="margin:0 0 16px;color:#1a1612;font:14px/1.6 Arial,sans-serif">${hello} ${intro}</p>
      <table style="width:100%;border-collapse:collapse">
        ${riga(lblData, esc(p.data))}
        ${riga(lblOra, esc(p.ora))}
        ${riga(lblCoperti, String(p.coperti))}
      </table>
    </div>
  </div>
</body></html>`;
}
