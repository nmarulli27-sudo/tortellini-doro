"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type FormLabels = Dictionary["eventiPage"]["form"];

/* Form di richiesta eventi: invia i dati a /api/eventi (Route Handler → email
   al ristorante, niente DB). Stessa estetica del form di prenotazione
   (filetti, eyebrow maiuscolo, campi su bg-elevated, CTA dorata).
   Campi: email, telefono, tipo di evento (testo libero) e note. */
export function EventInquiryForm({
  labels,
  locale,
}: {
  labels: FormLabels;
  locale: Locale;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );

  const fieldClass =
    "w-full border border-line bg-elevated px-4 py-3 text-sm text-cream placeholder:text-cream-muted/50 transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

  const optional = (
    <span className="font-normal normal-case tracking-normal text-cream-muted/40">
      ({labels.optional})
    </span>
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = {
      nome: fd.get("name"),
      email: fd.get("email"),
      telefono: fd.get("phone"),
      tipoEvento: fd.get("eventType"),
      note: fd.get("notes"),
      locale,
    };

    setStatus("loading");
    try {
      const res = await fetch("/api/eventi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="animate-in fade-in zoom-in-95 border border-gold/30 bg-elevated/60 px-8 py-12 text-center duration-500"
      >
        <p className="eyebrow">{labels.successEyebrow}</p>
        <p className="mt-4 font-display text-3xl font-light text-cream">
          {labels.successTitle}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-cream-muted">
          {labels.success}
        </p>
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-2 block">
            {labels.name} *
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow mb-2 block">
            {labels.email} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="eyebrow mb-2 block">
            {labels.phone} *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="eventType" className="eyebrow mb-2 block">
            {labels.eventType} *
          </label>
          <input
            id="eventType"
            name="eventType"
            type="text"
            required
            placeholder={labels.eventTypePlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="eyebrow mb-2 block">
          {labels.notes} {optional}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          placeholder={labels.notesPlaceholder}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-fill disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? labels.submitting : labels.submit}
        </button>
        <p className="text-xs text-cream-muted">{labels.note}</p>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="border border-bordeaux/40 bg-bordeaux/10 px-4 py-3 text-sm text-cream"
        >
          {labels.error}
        </p>
      )}
    </form>
  );
}
