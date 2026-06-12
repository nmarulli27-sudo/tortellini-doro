import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/social-icons";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { shots } from "@/lib/shots";
import { Reveal, RevealImage } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { FullBleed } from "@/components/full-bleed";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    openGraph: {
      title: dict.meta.contact.title,
      description: dict.meta.contact.description,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/contatti`])),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.contactPage;

  return (
    <main>
      {/* Hero full-bleed: ingresso illuminato di sera */}
      <FullBleed shot={shots.contattiEsterno} height="52svh" tone="dark">
        <div className="mx-auto max-w-[1200px] px-6 pb-12">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-cream sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-md text-base font-extralight leading-relaxed text-cream-muted">
            {t.subtitle}
          </p>
        </div>
      </FullBleed>

      {/* Info + form, con foto verticale che le accompagna */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-16 px-6 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            {/* Blocco informazioni */}
            <Reveal>
              <h2 className="font-display text-3xl font-light text-cream">
                {t.infoTitle}
              </h2>
              <div className="filetto mt-6" />

              <dl className="mt-8 space-y-6 text-sm">
                <div className="flex gap-4">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <dt className="eyebrow">{t.addressLabel}</dt>
                    <dd className="mt-2 leading-relaxed text-cream">
                      {dict.common.address}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <dt className="eyebrow">{t.phoneLabel}</dt>
                    <dd className="mt-2">
                      <a
                        href={`tel:${dict.common.phoneHref}`}
                        className="text-cream transition-colors hover:text-gold-bright"
                      >
                        {dict.common.phone}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <dt className="eyebrow">{t.emailLabel}</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${dict.common.email}`}
                        className="text-cream transition-colors hover:text-gold-bright"
                      >
                        {dict.common.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <h3 className="eyebrow mt-12">{t.hoursTitle}</h3>
              <table className="mt-4 w-full max-w-md text-sm">
                <tbody>
                  {dict.common.hours.map((row) => (
                    <tr key={row.days} className="border-b border-line/50">
                      <th
                        scope="row"
                        className="py-3 pr-4 text-left font-normal text-cream-muted"
                      >
                        {row.days}
                      </th>
                      <td className="py-3 text-right text-cream">{row.times}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="eyebrow mt-12">{t.socialTitle}</h3>
              <div className="mt-4 flex gap-5">
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  className="text-gold transition-colors hover:text-gold-bright"
                >
                  <InstagramIcon size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="text-gold transition-colors hover:text-gold-bright"
                >
                  <FacebookIcon size={20} />
                </a>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1} className="mt-16">
              <h2 className="font-display text-3xl font-light text-cream">
                {t.form.title}
              </h2>
              <div className="filetto mt-6" />
              <div className="mt-8">
                <ContactForm labels={t.form} email={dict.common.email} />
              </div>
            </Reveal>
          </div>

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

      {/* Mappa: foto della via come apertura, poi la mappa in stile scuro */}
      <section className="border-t border-line/60">
        <FullBleed shot={shots.contattiQuartiere} height="42svh" tone="dark">
          <div className="mx-auto max-w-[1200px] px-6 pb-10">
            <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
              {t.mapTitle}
            </h2>
          </div>
        </FullBleed>
        <iframe
          title={t.mapAria}
          src="https://www.google.com/maps?q=Via%20dei%20Sarti%2012%2C%2020121%20Milano&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[420px] w-full border-0"
          style={{ filter: "invert(0.88) hue-rotate(185deg) saturate(0.4) brightness(0.9)" }}
        />
      </section>
    </main>
  );
}
