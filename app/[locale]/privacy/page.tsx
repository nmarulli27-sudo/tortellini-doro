import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
    openGraph: {
      title: dict.meta.privacy.title,
      description: dict.meta.privacy.description,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
    },
  };
}

/* Sezione di policy: ancora + titolo Fraunces + filetto + corpo.
   scroll-mt compensa l'header fisso quando si arriva da un'ancora. */
function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
        <h2
          id={`${id}-h`}
          className="font-display text-2xl font-light text-cream sm:text-3xl"
        >
          {title}
        </h2>
        <div className="filetto mt-5" />
        <div className="mt-6 space-y-4 text-sm font-extralight leading-relaxed text-cream-muted sm:text-base">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.privacyPage;
  const email = dict.common.email;

  /* Indice ordinato: guida la sidebar sticky e gli id delle sezioni. */
  const toc = [
    { id: "titolare", label: t.controller.title },
    { id: "dati", label: t.data.title },
    { id: "allergie", label: t.health.title },
    { id: "finalita", label: t.purposes.title },
    { id: "destinatari", label: t.recipients.title },
    { id: "trasferimenti", label: t.transfers.title },
    { id: "cookie", label: t.cookies.title },
    { id: "conservazione", label: t.retention.title },
    { id: "diritti", label: t.rights.title },
    { id: "modifiche", label: t.changes.title },
  ];

  return (
    <main>
      {/* Hero testuale: niente foto, ma profondità atmosferica via gradienti */}
      <section className="relative overflow-hidden border-b border-line/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% -20%, rgba(201,169,97,0.10) 0%, transparent 55%), linear-gradient(to bottom, var(--bg-warm), var(--bg-deep))",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-36 sm:pt-40 lg:pb-24 lg:pt-48">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-light text-cream sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-extralight leading-relaxed text-cream-muted">
            {t.subtitle}
          </p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted/70">
            {t.updatedLabel}: {t.updatedDate}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[4fr_8fr] lg:gap-20">
          {/* Indice sticky — solo su schermi larghi */}
          <aside className="hidden lg:block">
            <nav aria-label={t.tocLabel} className="sticky top-28">
              <p className="eyebrow">{t.tocLabel}</p>
              <ol className="mt-6 space-y-3 font-mono text-[11px] uppercase tracking-[0.15em]">
                {toc.map((item, i) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="text-gold/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${item.id}`}
                      className="text-cream-muted transition-colors hover:text-gold-bright"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Corpo dell'informativa */}
          <div className="max-w-2xl space-y-16">
            <Reveal>
              <p className="text-base font-extralight leading-relaxed text-cream sm:text-lg">
                {t.intro}
              </p>
            </Reveal>

            {/* Titolare */}
            <PolicySection id="titolare" title={t.controller.title}>
              <p>{t.controller.body}</p>
              <p>
                <a
                  href={`mailto:${email}`}
                  className="text-gold transition-colors hover:text-gold-bright"
                >
                  {email}
                </a>
              </p>
              <p className="text-xs text-cream-muted/60">{t.controller.note}</p>
            </PolicySection>

            {/* Dati raccolti */}
            <PolicySection id="dati" title={t.data.title}>
              <p>{t.data.intro}</p>
              <ul className="mt-2 space-y-2">
                {t.data.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-gold/60" />
                    <span className="text-cream">{item}</span>
                  </li>
                ))}
              </ul>
            </PolicySection>

            {/* Allergie — categoria particolare, evidenziata come callout */}
            <Reveal>
              <section
                id="allergie"
                aria-labelledby="allergie-h"
                className="scroll-mt-28 border-l-2 border-bordeaux bg-elevated/60 px-6 py-7 sm:px-8 sm:py-8"
              >
                <h2
                  id="allergie-h"
                  className="font-display text-2xl font-light text-cream sm:text-3xl"
                >
                  {t.health.title}
                </h2>
                <div className="mt-6 space-y-4 text-sm font-extralight leading-relaxed text-cream-muted sm:text-base">
                  {t.health.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Finalità e basi giuridiche */}
            <PolicySection id="finalita" title={t.purposes.title}>
              <p>{t.purposes.intro}</p>
              <dl className="mt-2 space-y-6">
                {t.purposes.items.map((item) => (
                  <div
                    key={item.purpose}
                    className="border-b border-line/50 pb-6 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-cream">{item.purpose}</dt>
                    <dd className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-gold">
                      {item.basis}
                    </dd>
                  </div>
                ))}
              </dl>
            </PolicySection>

            {/* Destinatari / responsabili del trattamento */}
            <PolicySection id="destinatari" title={t.recipients.title}>
              <p>{t.recipients.intro}</p>
              <dl className="mt-2 space-y-6">
                {t.recipients.items.map((item) => (
                  <div key={item.name}>
                    <dt className="font-display text-lg font-light text-cream">
                      {item.name}
                    </dt>
                    <dd className="mt-1.5">{item.detail}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-cream-muted/80">{t.recipients.note}</p>
            </PolicySection>

            {/* Trasferimenti extra-UE */}
            <PolicySection id="trasferimenti" title={t.transfers.title}>
              <p>{t.transfers.body}</p>
            </PolicySection>

            {/* Cookie */}
            <PolicySection id="cookie" title={t.cookies.title}>
              {t.cookies.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </PolicySection>

            {/* Conservazione */}
            <PolicySection id="conservazione" title={t.retention.title}>
              <p>{t.retention.body}</p>
              <p className="text-xs text-cream-muted/60">{t.retention.note}</p>
            </PolicySection>

            {/* Diritti dell'interessato */}
            <PolicySection id="diritti" title={t.rights.title}>
              <p>{t.rights.intro}</p>
              <ul className="mt-2 space-y-2">
                {t.rights.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-gold/60" />
                    <span className="text-cream">{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                {t.rights.contactLabel}{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-gold transition-colors hover:text-gold-bright"
                >
                  {email}
                </a>
                .
              </p>
              <p>{t.rights.complaint}</p>
            </PolicySection>

            {/* Modifiche */}
            <PolicySection id="modifiche" title={t.changes.title}>
              <p>{t.changes.body}</p>
            </PolicySection>
          </div>
        </div>
      </div>
    </main>
  );
}
