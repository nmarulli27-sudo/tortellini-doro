import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

/* Autenticazione minima dell'area riservata (password singola).
   Il cookie di sessione contiene il valore di ADMIN_SESSION_SECRET: la
   dashboard lo riconfronta a ogni richiesta. Tutto lato server — né la
   password né il secret raggiungono mai il browser. */

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 giorni

/* Confronto a tempo costante: evita di rivelare la lunghezza/prefisso
   corretti misurando i tempi di risposta. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function verifyPassword(input: string | undefined | null): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  return safeEqual(input, expected);
}

/* Valore da scrivere nel cookie quando il login va a buon fine. */
export function adminSessionValue(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

/* Letto dai server component protetti: true solo se il cookie combacia
   con ADMIN_SESSION_SECRET. */
export async function verifyAdminSession(): Promise<boolean> {
  const expected = process.env.ADMIN_SESSION_SECRET;
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, expected);
}
