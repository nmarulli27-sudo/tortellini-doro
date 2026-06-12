import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { shots } from "@/lib/shots";
import { Reveal, RevealImage } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { FullBleed } from "@/components/full-bleed";
import { EditorialSplit } from "@/components/editorial-split";
import { MosaicGallery } from "@/components/mosaic-gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    openGraph: {
      title: dict.meta.about.title,
      description: dict.meta.about.description,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/chi-siamo`])),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.aboutPage;

  const sectionShots = [shots.aboutCap1, shots.aboutCap2, shots.aboutCap3];
  const fragmentShots = [
    shots.frammento1,
    shots.frammento2,
    shots.frammento3,
    shots.frammento4,
    shots.frammento5,
    shots.frammento6,
    shots.frammento7,
  ];
  const teamShots = [shots.team1, shots.team2, shots.team3, shots.team4];

  return (
    <main>
      {/* 1 — Hero full-bleed: ritratto dello chef in sala */}
      <FullBleed shot={shots.aboutHero} height="78svh" tone="dark">
        <div className="mx-auto max-w-[1200px] px-6 pb-14">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl font-light leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
        </div>
      </FullBleed>

      {/* 2 — La storia in 3 capitoli: editorial split alternati */}
      {t.sections.map((section, i) => (
        <EditorialSplit
          key={section.eyebrow}
          shot={sectionShots[i]}
          tone={i % 2 === 0 ? "warm" : "dark"}
          reverse={i % 2 === 1}
        >
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 className="mt-5 font-display text-3xl font-light leading-tight text-cream sm:text-4xl">
            {section.title}
          </h2>
          <p className="mt-7 max-w-prose text-base font-extralight leading-relaxed text-cream-muted">
            {section.body}
          </p>
        </EditorialSplit>
      ))}

      {/* 3 — Frammenti: mosaic gallery */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="text-center">
            <p className="eyebrow">{t.fragments.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl font-light text-cream sm:text-5xl">
              {t.fragments.title}
            </h2>
          </Reveal>
        </div>
        <div className="mx-auto mt-14 max-w-[1400px] px-6">
          <MosaicGallery shots={fragmentShots} />
        </div>
      </section>

      {/* 4 — Citazione sopra una foto full-bleed sfumata in scuro */}
      <FullBleed shot={shots.aboutQuote} height="68svh" tone="dark" align="center">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <div className="filetto mx-auto mb-8 w-16" />
          <blockquote className="font-display text-3xl font-light italic leading-snug text-gold sm:text-4xl lg:text-5xl">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="filetto mx-auto mt-8 w-16" />
        </Reveal>
      </FullBleed>

      {/* 5 — Il team: griglia di ritratti */}
      <section className="border-t border-line/60 bg-warm py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="text-center">
            <p className="eyebrow">{t.team.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl font-light text-cream sm:text-5xl">
              {t.team.title}
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {t.team.members.map((member, i) => (
              <RevealImage key={member.role} delay={0.08 * i}>
                <ImagePlaceholder
                  shot={teamShots[i]}
                  aspect="3/4"
                  tone="neutral"
                />
                <h3 className="mt-4 font-display text-xl font-light text-cream">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-gold/80">
                  {member.role}
                </p>
              </RevealImage>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
