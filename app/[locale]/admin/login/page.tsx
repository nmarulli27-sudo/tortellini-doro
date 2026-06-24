import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Area riservata · Tortellino d'Oro",
  robots: { index: false, follow: false },
};

const fieldClass =
  "w-full border border-line bg-deep px-4 py-3 text-sm text-cream placeholder:text-cream-muted/50 transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  // Già autenticato: salta il login.
  if (await verifyAdminSession()) redirect(`/${locale}/admin`);

  return (
    <main className="flex min-h-[80svh] items-center justify-center px-6 py-28">
      <div className="w-full max-w-sm border border-line/60 bg-elevated px-8 py-10">
        <p className="eyebrow">Area riservata</p>
        <h1 className="mt-3 font-display text-3xl font-light text-cream">
          Accedi
        </h1>
        <div className="filetto mt-6" />

        <form method="post" action="/api/admin/login" className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="eyebrow mb-2 block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className={fieldClass}
            />
          </div>
          <button type="submit" className="btn btn-fill w-full">
            Entra
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-5 border border-bordeaux/40 bg-bordeaux/10 px-4 py-3 text-sm text-cream"
          >
            Password errata. Riprova.
          </p>
        )}
      </div>
    </main>
  );
}
