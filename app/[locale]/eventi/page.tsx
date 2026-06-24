import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { shots } from "@/lib/shots";
import { Reveal, RevealImage } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { FullBleed } from "@/components/full-bleed";
import { EditorialSplit } from "@/components/editorial-split";
import { EventInquiryForm } from "@/components/event-inquiry-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.eventi.title,
    description: dict.meta.eventi.description,
    openGraph: {
      title: dict.meta.eventi.title,
      description: dict.meta.eventi.description,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/eventi`])),
    },
  };
}

export default async function EventiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.eventiPage;

  return (
    <main>
      {/* Hero full-bleed: la sala come palcoscenico dell'evento */}
      <FullBleed shot={shots.esperienzaSala} height="58svh" tone="dark">
        <div className="mx-auto max-w-[1200px] px-6 pb-12">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-cream sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-base font-extralight leading-relaxed text-cream-muted">
            {t.subtitle}
          </p>
        </div>
      </FullBleed>

      {/* Il servizio: editorial split con foto della sala */}
      <EditorialSplit shot={shots.stripSala} tone="warm">
        <p className="eyebrow">{t.intro.eyebrow}</p>
        <h2 className="mt-5 font-display text-3xl font-light leading-tight text-cream sm:text-4xl">
          {t.intro.title}
        </h2>
        <p className="mt-7 max-w-prose text-base font-extralight leading-relaxed text-cream-muted">
          {t.intro.body}
        </p>
      </EditorialSplit>

      {/* Le occasioni: griglia a tre formati */}
      <section className="border-t border-line/60 py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
              {t.formatsTitle}
            </h2>
            <div className="filetto mt-6" />
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
            {t.formats.map((format, i) => (
              <Reveal key={format.title} delay={0.08 * i}>
                <p className="font-mono text-xs tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-2xl font-light text-cream">
                  {format.title}
                </h3>
                <div className="filetto mt-5" />
                <p className="mt-5 text-sm font-extralight leading-relaxed text-cream-muted">
                  {format.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Il menu costruito insieme: editorial split inverso, atmosfera serale */}
      <EditorialSplit shot={shots.atmosferaSera} reverse tone="dark">
        <p className="eyebrow">{t.detail.eyebrow}</p>
        <h2 className="mt-5 font-display text-3xl font-light leading-tight text-cream sm:text-4xl">
          {t.detail.title}
        </h2>
        <p className="mt-7 max-w-prose text-base font-extralight leading-relaxed text-cream-muted">
          {t.detail.body}
        </p>
      </EditorialSplit>

      {/* Come funziona: tre passi + nota sul ricontatto */}
      <section className="border-t border-line/60 bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="eyebrow">{t.how.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-light text-cream sm:text-4xl">
              {t.how.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base font-extralight leading-relaxed text-cream-muted">
              {t.how.note}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {t.how.steps.map((step, i) => (
              <Reveal key={step.title} delay={0.08 * i}>
                <h3 className="font-display text-xl font-light text-gold-bright">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm font-extralight leading-relaxed text-cream-muted">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form di richiesta: stessa impaginazione della pagina Prenota */}
      <section className="border-t border-line/60 py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-16 px-6 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-3xl font-light text-cream">
              {t.form.title}
            </h2>
            <div className="filetto mt-6" />
            <div className="mt-8">
              <EventInquiryForm labels={t.form} locale={locale} />
            </div>
          </Reveal>

          {/* Foto verticale: tavolo apparecchiato, resta a fianco nello scroll */}
          <RevealImage delay={0.15} className="hidden lg:block">
            <div className="sticky top-28">
              <ImagePlaceholder
                shot={shots.contattiVerticale}
                aspect="3/4"
                tone="dark"
                vignette
              />
            </div>
          </RevealImage>
        </div>
      </section>
    </main>
  );
}
