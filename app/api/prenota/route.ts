import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";

type Payload = {
  nome?: string;
  email?: string;
  telefono?: string;
  data?: string;
  ora?: string;
  coperti?: string | number;
  note?: string;
  locale?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const nome = body.nome?.toString().trim();
  const email = body.email?.toString().trim();
  const dataPren = body.data?.toString().trim();
  const ora = body.ora?.toString().trim();
  const coperti = Number(body.coperti);
  const telefono = body.telefono?.toString().trim() || null;
  const note = body.note?.toString().trim() || null;
  const locale = isLocale(body.locale ?? "")
    ? (body.locale as string)
    : defaultLocale;

  if (
    !nome ||
    !email ||
    !EMAIL_RE.test(email) ||
    !dataPren ||
    !ora ||
    !Number.isFinite(coperti) ||
    coperti < 1
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  // stato ('in_attesa') e token (uuid) sono valorizzati dai default della tabella.
  const { data: row, error } = await supabaseAdmin
    .from("prenotazioni")
    .insert({ nome, email, telefono, data: dataPren, ora, coperti, note })
    .select("token")
    .single();

  if (error || !row) {
    console.error("[/api/prenota] insert fallito:", error?.message);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  // Notifica al ristorante. Best-effort: la prenotazione è già salvata,
  // un errore d'invio non deve far fallire la richiesta del cliente.
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const confirmUrl = `${base}/${locale}/conferma/${row.token}`;
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.RESTAURANT_EMAIL ?? "",
      subject: `Nuova prenotazione · ${nome} · ${dataPren} ${ora}`,
      html: emailRistorante({
        nome,
        email,
        telefono,
        data: dataPren,
        ora,
        coperti,
        note,
        confirmUrl,
      }),
    });
  } catch (e) {
    console.error("[/api/prenota] invio email ristorante fallito:", e);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

function emailRistorante(p: {
  nome: string;
  email: string;
  telefono: string | null;
  data: string;
  ora: string;
  coperti: number;
  note: string | null;
  confirmUrl: string;
}) {
  const riga = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 16px 6px 0;color:#8a7f6d;font:700 12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;vertical-align:top">${label}</td>
       <td style="padding:6px 0;color:#1a1612;font:14px/1.5 Arial,sans-serif">${value}</td>
     </tr>`;

  return `<!doctype html>
<html lang="it"><body style="margin:0;background:#f2ead9;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #e6dcc6;border-radius:8px;overflow:hidden">
    <div style="background:#0e0c0a;padding:24px 32px">
      <p style="margin:0;color:#c9a961;font:700 12px/1 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase">Tortellino d'Oro</p>
      <h1 style="margin:8px 0 0;color:#f2ead9;font:400 22px/1.3 Georgia,serif">Nuova prenotazione</h1>
    </div>
    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse">
        ${riga("Nome", esc(p.nome))}
        ${riga("Email", esc(p.email))}
        ${riga("Telefono", p.telefono ? esc(p.telefono) : "—")}
        ${riga("Data", esc(p.data))}
        ${riga("Ora", esc(p.ora))}
        ${riga("Coperti", String(p.coperti))}
        ${riga("Note", p.note ? esc(p.note) : "—")}
      </table>
      <a href="${p.confirmUrl}" style="display:inline-block;margin-top:28px;background:#c9a961;color:#0e0c0a;font:700 13px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px">Apri la prenotazione</a>
      <p style="margin:20px 0 0;color:#8a7f6d;font:12px/1.6 Arial,sans-serif">Da questo link puoi confermare o rifiutare la richiesta. Il cliente riceverà una email solo dopo la conferma.</p>
    </div>
  </div>
</body></html>`;
}
