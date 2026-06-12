import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Leaf } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { shots, type Shot } from "@/lib/shots";
import { Reveal, RevealImage } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { FullBleed } from "@/components/full-bleed";
import { ImageStrip } from "@/components/image-strip";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.menu.title,
    description: dict.meta.menu.description,
    openGraph: {
      title: dict.meta.menu.title,
      description: dict.meta.menu.description,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/menu`])),
    },
  };
}

type MenuItem = {
  name: string;
  description: string;
  price: string;
  vegetarian: boolean;
  allergens: string;
};

const primiShots = [
  shots.menuPrimo1,
  shots.menuPrimo2,
  shots.menuPrimo3,
  shots.menuPrimo4,
  shots.menuPrimo5,
];

const anchorShots: Record<string, Shot> = {
  antipasti: shots.menuAntipasti,
  secondi: shots.menuSecondi,
  dolci: shots.menuDolci,
};

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.menuPage;

  const vegLabel = t.legendVegetarian;

  function ItemText({
    item,
    compact = false,
  }: {
    item: MenuItem;
    compact?: boolean;
  }) {
    return (
      <>
        <div className="flex items-baseline justify-between gap-6">
          <h3
            className={cn(
              "font-display font-light leading-snug text-cream",
              compact ? "text-xl" : "text-2xl sm:text-3xl",
            )}
          >
            {item.name}
            {item.vegetarian && (
              <Leaf
                size={14}
                aria-label={vegLabel}
                className="ml-2 inline-block text-gold"
              />
            )}
          </h3>
          <p className="shrink-0 font-mono text-sm tracking-wider text-gold">
            {item.price}
          </p>
        </div>
        <p className="mt-2 max-w-prose text-sm font-extralight leading-relaxed text-cream-muted">
          {item.description}
        </p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cream-muted/60">
          {t.allergensLabel}: {item.allergens}
        </p>
      </>
    );
  }

  /* Categoria compatta: lista testuale + foto àncora verticale a lato */
  function CompactCategory({
    category,
  }: {
    category: { id: string; name: string; items: MenuItem[] };
  }) {
    const anchor = anchorShots[category.id];
    return (
      <section aria-labelledby={`cat-${category.id}`} className="mx-auto max-w-[1200px] px-6">
        <div className={cn("grid gap-12", anchor && "lg:grid-cols-[7fr_5fr]")}>
          <Reveal>
            <h2
              id={`cat-${category.id}`}
              className="font-display text-3xl font-light text-cream sm:text-4xl"
            >
              {category.name}
            </h2>
            <div className="filetto mt-6" />
            <ul>
              {category.items.map((item) => (
                <li
                  key={item.name}
                  className="border-b border-line/50 py-6 last:border-b-0"
                >
                  <ItemText item={item} compact />
                </li>
              ))}
            </ul>
          </Reveal>
          {anchor && (
            <RevealImage delay={0.15} className="hidden lg:block">
              <div className="sticky top-28">
                <ImagePlaceholder shot={anchor} aspect="3/4" tone="dark" />
              </div>
            </RevealImage>
          )}
        </div>
      </section>
    );
  }

  const categories = t.categories;
  const antipasti = categories.find((c) => c.id === "antipasti")!;
  const primi = categories.find((c) => c.id === "primi")!;
  const secondi = categories.find((c) => c.id === "secondi")!;
  const contorni = categories.find((c) => c.id === "contorni")!;
  const dolci = categories.find((c) => c.id === "dolci")!;

  return (
    <main>
      {/* Hero: piatto fumante full-width, titolo sovrapposto */}
      <FullBleed shot={shots.menuHero} height="62svh" tone="dark">
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

      {/* Legenda */}
      <div className="mx-auto max-w-[1200px] px-6 pt-14">
        <Reveal>
          <div className="flex flex-col gap-2 border border-line/60 bg-elevated p-5 text-xs text-cream-muted sm:flex-row sm:items-center sm:gap-8">
            <p className="flex shrink-0 items-center gap-2">
              <Leaf size={13} className="text-gold" aria-hidden />
              {t.legendVegetarian}
            </p>
            <p>{t.legendAllergens}</p>
          </div>
        </Reveal>
      </div>

      <div className="space-y-24 py-20 lg:space-y-28">
        {/* Antipasti — compatta con àncora visiva */}
        <CompactCategory category={antipasti} />

        {/* Primi — editoriale: una foto grande dedicata per piatto */}
        <section
          aria-labelledby="cat-primi"
          className="border-y border-gold/15 bg-warm py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal className="text-center">
              <h2
                id="cat-primi"
                className="font-display text-4xl font-light text-gold-bright sm:text-5xl"
              >
                {primi.name}
              </h2>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">
                {t.pastaNote}
              </p>
              <div className="filetto mx-auto mt-8 w-16" />
            </Reveal>

            <div className="mt-16 space-y-16 lg:space-y-20">
              {primi.items.map((item, i) => (
                <div
                  key={item.name}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
                >
                  <RevealImage className={cn(i % 2 === 1 && "lg:order-2")}>
                    <div className="group overflow-hidden">
                      <div className="img-zoom">
                        <ImagePlaceholder
                          shot={primiShots[i]}
                          aspect="1/1"
                          tone={i % 2 === 0 ? "warm" : "dark"}
                          vignette
                        />
                      </div>
                    </div>
                  </RevealImage>
                  <Reveal
                    delay={0.12}
                    className={cn(i % 2 === 1 && "lg:order-1 lg:text-right")}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/70">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div className="mt-4">
                      <ItemText item={item} />
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pausa visiva: strip ingredienti */}
        <ImageStrip
          shots={[
            shots.menuStripUova,
            shots.menuStripFarina,
            shots.menuStripParmigiano,
            shots.menuStripErbe,
          ]}
          height="clamp(200px, 26vw, 320px)"
        />

        {/* Secondi — compatta con àncora */}
        <CompactCategory category={secondi} />

        {/* Contorni — compatta */}
        <CompactCategory category={contorni} />

        {/* Pausa visiva: full-bleed mani al lavoro */}
        <FullBleed shot={shots.menuPausa} height="52svh" tone="warm" />

        {/* Dolci — compatta con àncora */}
        <CompactCategory category={dolci} />

        {/* Carta dei vini */}
        <section aria-labelledby="cat-vini" className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="border border-gold/15 bg-elevated px-6 py-12 text-center sm:px-12">
              <h2
                id="cat-vini"
                className="font-display text-3xl font-light text-cream sm:text-4xl"
              >
                {t.wine.name}
              </h2>
              <div className="filetto mx-auto mt-6 w-16" />
              <p className="mx-auto mt-6 max-w-prose text-sm font-extralight leading-relaxed text-cream-muted">
                {t.wine.body}
              </p>
              <a href="#" className="btn btn-outline mt-8">
                {t.wine.cta}
              </a>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
