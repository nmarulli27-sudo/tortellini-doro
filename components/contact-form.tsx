"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type FormLabels = Dictionary["contactPage"]["form"];

/* In assenza di backend, l'invio compone un mailto: con il messaggio
   già compilato. Da sostituire con un endpoint quando disponibile. */
export function ContactForm({
  labels,
  email,
}: {
  labels: FormLabels;
  email: string;
}) {
  const [subject, setSubject] = useState<"general" | "booking">("general");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subjectText =
      subject === "booking" ? labels.subjectBooking : labels.subjectGeneral;
    const body = [
      `${labels.name}: ${data.get("name")}`,
      `${labels.email}: ${data.get("email")}`,
      `${labels.phone}: ${data.get("phone") || "—"}`,
      "",
      String(data.get("message")),
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `${subjectText} — Tortellino d'Oro`,
    )}&body=${encodeURIComponent(body)}`;
  };

  const fieldClass =
    "w-full border border-line bg-elevated px-4 py-3 text-sm text-cream placeholder:text-cream-muted/50 transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

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
            {labels.phone}
          </label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="subject" className="eyebrow mb-2 block">
            {labels.subject}
          </label>
          <select
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value as "general" | "booking")}
            className={fieldClass}
          >
            <option value="general">{labels.subjectGeneral}</option>
            <option value="booking">{labels.subjectBooking}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow mb-2 block">
          {labels.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-fill">
          {labels.submit}
        </button>
        <p className="text-xs text-cream-muted">{labels.note}</p>
      </div>
      <p className="text-xs text-cream-muted/60">{labels.mailtoNote}</p>
    </form>
  );
}
