"use client";

import { useState, type FormEvent } from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { it as itLocale, enUS } from "react-day-picker/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/* Fasce di servizio (vedi orari in i18n: pranzo 12:30–14:30, cena 19:30–22:30).
   Il lunedì è chiuso → disabilitato nel calendario. */
const LUNCH_SLOTS = ["12:30", "13:00", "13:30", "14:00", "14:30"];
const DINNER_SLOTS = ["19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];

/* Date → "YYYY-MM-DD" sui componenti locali (no toISOString: sfasa col fuso). */
function toISODate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

type FormLabels = Dictionary["contactPage"]["form"];

/* Form di prenotazione: invia i dati a /api/prenota (Route Handler → Supabase).
   Stati: idle → loading → sent | error. Stessa estetica del resto del sito
   (filetti, eyebrow maiuscolo, campi su bg-elevated, CTA dorata).
   Il payload usa le chiavi italiane delle colonne DB + il locale corrente
   (serve all'API per costruire il link di conferma /{locale}/conferma/{token}). */
export function BookingForm({
  labels,
  locale,
}: {
  labels: FormLabels;
  locale: Locale;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [missing, setMissing] = useState(false);

  const dpLocale = locale === "it" ? itLocale : enUS;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateLabel = date
    ? date.toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : labels.datePlaceholder;

  // Trigger di data/ora: stessa estetica dei campi (filetto, bg-elevated, angoli vivi).
  const controlClass =
    "flex h-auto w-full items-center gap-2 rounded-none border border-line bg-elevated px-4 py-3 text-left text-sm font-light text-cream transition-colors duration-300 hover:border-gold/40 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 data-[popup-open]:border-gold";

  const fieldClass =
    "w-full border border-line bg-elevated px-4 py-3 text-sm text-cream placeholder:text-cream-muted/50 transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

  const optional = (
    <span className="font-normal normal-case tracking-normal text-cream-muted/40">
      ({labels.optional})
    </span>
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !time) {
      setMissing(true);
      return;
    }
    const fd = new FormData(event.currentTarget);
    const payload = {
      nome: fd.get("name"),
      email: fd.get("email"),
      telefono: fd.get("phone"),
      data: toISODate(date),
      ora: time,
      coperti: fd.get("guests"),
      note: fd.get("notes"),
      locale,
    };

    setStatus("loading");
    try {
      const res = await fetch("/api/prenota", {
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
            {labels.phone} {optional}
          </label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="guests" className="eyebrow mb-2 block">
            {labels.guests} *
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={20}
            required
            placeholder={labels.guestsPlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <span className="eyebrow mb-2 block">{labels.date} *</span>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger
              className={cn(controlClass, !date && "text-cream-muted/50")}
            >
              <CalendarIcon className="size-4 shrink-0 text-gold/70" />
              <span className="flex-1 truncate capitalize">{dateLabel}</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setMissing(false);
                  if (d) setDateOpen(false);
                }}
                locale={dpLocale}
                disabled={[{ before: today }, { dayOfWeek: [1] }]}
                defaultMonth={date ?? today}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <span className="eyebrow mb-2 block">{labels.time} *</span>
          <Select
            value={time}
            onValueChange={(v) => {
              setTime((v as string | null) ?? "");
              setMissing(false);
            }}
          >
            <SelectTrigger className={cn(controlClass, "justify-between")}>
              <span className="flex items-center gap-2">
                <ClockIcon className="size-4 shrink-0 text-gold/70" />
                <SelectValue placeholder={labels.timePlaceholder} />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{labels.lunch}</SelectLabel>
                {LUNCH_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{labels.dinner}</SelectLabel>
                {DINNER_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {missing && (!date || !time) && (
        <p role="alert" className="text-xs text-gold-bright">
          {labels.selectDateTime}
        </p>
      )}

      <div>
        <label htmlFor="notes" className="eyebrow mb-2 block">
          {labels.notes} {optional}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
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
