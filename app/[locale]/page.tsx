import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { shots } from "@/lib/shots";
import { HomeHero } from "@/components/home-hero";
import { Reveal, RevealImage } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { StickyStory } from "@/components/sticky-story";
import { ImageStrip } from "@/components/image-strip";
import { EditorialSplit } from "@/components/editorial-split";
import { AsymmetricDuo } from "@/components/asymmetric-duo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    openGraph: {
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Tortellino d'Oro",
    servesCuisine: "Italian",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via dei Sarti 12",
      postalCode: "20121",
      addressLocality: "Milano",
      addressCountry: "IT",
    },
    telephone: "+390200000000",
    email: dict.common.email,
    openingHours: ["Tu-Fr 12:30-14:30", "Tu-Fr 19:30-22:30", "Sa 19:30-23:00", "Su 12:30-15:00"],
    hasMenu: `/${locale}/menu`,
    priceRange: "€€",
  };

  const storyChapters = dict.story.chapters.map((chapter, i) => ({
    ...chapter,
    shot: [shots.storyMattino, shots.storySfoglia, shots.storyPiatto][i],
  }));

  const dishShots = [
    shots.firmaTortellini,
    shots.firmaTagliatelle,
    shots.firmaTortelli,
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />

      {/* 1 — Hero full-bleed cinematic (video placeholder) */}
      <HomeHero locale={locale} hero={dict.hero} />

      {/* 2 — Sticky-scroll storytelling: la filosofia in 3 capitoli */}
      <StickyStory chapters={storyChapters} className="py-12 lg:py-0" />

      {/* 3 — Piatti firma: foto all'80%, testo minimo */}
      <section className="bg-warm py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{dict.signature.eyebrow}</p>
              <h2 className="mt-4 font-display text-4xl font-light text-cream sm:text-5xl">
                {dict.signature.title}
              </h2>
            </div>
            <Link
              href={`/${locale}/menu`}
              className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-bright sm:block"
            >
              {dict.signature.cta} →
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-[2px] md:grid-cols-3">
            {dict.signature.dishes.map((dish, i) => (
              <RevealImage key={dish.name} delay={0.08 * i}>
                <Link
                  href={`/${locale}/menu`}
                  className="group block"
                  aria-label={dish.name}
                >
                  <div className="overflow-hidden">
                    <div className="img-zoom">
                      <ImagePlaceholder
                        shot={dishShots[i]}
                        aspect="3/4"
                        tone={i === 1 ? "dark" : "warm"}
                      />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 px-1 pb-2 pt-4">
                    <h3 className="font-display text-lg font-light leading-snug text-cream">
                      {dish.name}
                    </h3>
                    <p className="shrink-0 font-mono text-xs tracking-wider text-gold">
                      {dish.price}
                    </p>
                  </div>
                  <p className="px-1 text-xs font-extralight leading-relaxed text-cream-muted">
                    {dish.description}
                  </p>
                </Link>
              </RevealImage>
            ))}
          </div>

          <Reveal className="mt-10 text-center sm:hidden">
            <Link href={`/${locale}/menu`} className="btn btn-outline">
              {dict.signature.cta}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 4 — Image strip: trailer della location */}
      <ImageStrip
        shots={[
          shots.stripSala,
          shots.stripTavolo,
          shots.stripCantina,
          shots.stripSfoglia,
          shots.stripCucina,
        ]}
      />

      {/* 5 — L'esperienza: editorial split + split inverso */}
      <EditorialSplit shot={shots.esperienzaSala} tone="warm">
        <p className="eyebrow">{dict.experience.eyebrow}</p>
        <h2 className="mt-5 font-display text-4xl font-light leading-tight text-cream sm:text-5xl">
          {dict.experience.title}
        </h2>
        <p className="mt-7 text-base font-extralight leading-relaxed text-cream-muted">
          {dict.experience.body}
        </p>
      </EditorialSplit>

      <EditorialSplit shot={shots.esperienzaDettaglio} tone="dark" reverse>
        <h2 className="font-display text-3xl font-light leading-tight text-cream sm:text-4xl">
          {dict.experience2.title}
        </h2>
        <p className="mt-6 text-base font-extralight leading-relaxed text-cream-muted">
          {dict.experience2.body}
        </p>
      </EditorialSplit>

      {/* 6 — Atmosfera: asymmetric duo */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="eyebrow">{dict.atmosphere.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl font-light text-cream sm:text-4xl">
              {dict.atmosphere.title}
            </h2>
          </Reveal>
          <AsymmetricDuo
            large={shots.atmosferaGiorno}
            small={shots.atmosferaSera}
            className="mt-12"
          />
        </div>
      </section>

      {/* 7 — Vieni a trovarci (pre-footer) */}
      <section className="border-t border-line/60 bg-elevated py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <Reveal>
            <p className="eyebrow">{dict.visit.eyebrow}</p>
            <h2 className="mt-5 font-display text-4xl font-light text-cream sm:text-5xl">
              {dict.visit.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-3">
              <div>
                <h3 className="eyebrow">{dict.visit.addressLabel}</h3>
                <p className="mt-4 text-sm leading-relaxed text-cream">
                  {dict.common.address}
                </p>
              </div>
              <div>
                <h3 className="eyebrow">{dict.visit.hoursLabel}</h3>
                <ul className="mt-4 space-y-1 text-sm leading-relaxed text-cream">
                  {dict.common.hours.map((row) => (
                    <li key={row.days}>
                      <span className="text-cream-muted">{row.days}</span>
                      <br />
                      {row.times}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow">{dict.visit.phoneLabel}</h3>
                <p className="mt-4 text-sm text-cream">
                  <a
                    href={`tel:${dict.common.phoneHref}`}
                    className="transition-colors hover:text-gold-bright"
                  >
                    {dict.common.phone}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={`tel:${dict.common.phoneHref}`} className="btn btn-fill">
                {dict.visit.cta}
              </a>
              <Link href={`/${locale}/prenota`} className="btn btn-outline">
                {dict.visit.mapCta}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
