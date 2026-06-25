import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminSessionValue,
  isAdminPasswordConfigured,
  verifyPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = form.get("password")?.toString() ?? "";

  // Redirect relativo all'host della richiesta: niente env var da sbagliare,
  // funziona su workers.dev e su un eventuale dominio custom.
  const base = new URL(request.url).origin;

  // Variabile non impostata sul Worker: messaggio diverso, così si capisce
  // che è un problema di configurazione e non di password.
  if (!isAdminPasswordConfigured()) {
    return NextResponse.redirect(
      new URL("/it/admin/login?error=config", base),
      303,
    );
  }

  // Password errata: torno al login con l'avviso (nessun cookie impostato).
  if (!verifyPassword(password)) {
    return NextResponse.redirect(
      new URL("/it/admin/login?error=1", base),
      303,
    );
  }

  // Password corretta: imposto il cookie di sessione e vado alla dashboard.
  const res = NextResponse.redirect(new URL("/it/admin", base), 303);
  res.cookies.set(ADMIN_COOKIE, adminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
