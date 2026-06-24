import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

type Payload = {
  nome?: string;
  email?: string;
  telefono?: string;
  tipoEvento?: string;
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
  const telefono = body.telefono?.toString().trim();
  const tipoEvento = body.tipoEvento?.toString().trim();
  const note = body.note?.toString().trim() || null;

  if (!nome || !email || !EMAIL_RE.test(email) || !telefono || !tipoEvento) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  // Niente database: la richiesta evento vive solo come email al ristorante.
  // Per questo l'invio NON è best-effort — se fallisce non resta traccia,
  // quindi restituiamo 500 e il form mostra l'errore.
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.RESTAURANT_EMAIL ?? "",
      replyTo: email,
      subject: `Richiesta evento · ${nome} · ${tipoEvento}`,
      html: emailEvento({ nome, email, telefono, tipoEvento, note }),
    });
  } catch (e) {
    console.error("[/api/eventi] invio email fallito:", e);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

function emailEvento(p: {
  nome: string;
  email: string;
  telefono: string;
  tipoEvento: string;
  note: string | null;
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
      <h1 style="margin:8px 0 0;color:#f2ead9;font:400 22px/1.3 Georgia,serif">Nuova richiesta evento</h1>
    </div>
    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse">
        ${riga("Nome", esc(p.nome))}
        ${riga("Email", esc(p.email))}
        ${riga("Telefono", esc(p.telefono))}
        ${riga("Tipo evento", esc(p.tipoEvento))}
        ${riga("Note", p.note ? esc(p.note) : "—")}
      </table>
      <p style="margin:24px 0 0;color:#8a7f6d;font:12px/1.6 Arial,sans-serif">Rispondi direttamente a questa email per ricontattare il cliente e organizzare insieme l'evento.</p>
    </div>
  </div>
</body></html>`;
}
