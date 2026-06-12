"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { shots } from "@/lib/shots";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

/* Hero full-bleed cinematic: video placeholder a tutto schermo
   (fallback statico con prefers-reduced-motion quando arriverà il
   video reale), testo minimo in basso su gradiente scuro. */
export function HomeHero({
  locale,
  hero,
}: {
  locale: Locale;
  hero: Dictionary["hero"];
}) {
  return (
    <section className="relative h-svh w-full overflow-hidden">
      {/* Quando arriverà il video reale:
          <video autoPlay muted loop playsInline poster="/photos/home-hero-tortellini.webp"
                 className="img-treatment h-full w-full object-cover motion-reduce:hidden">
            <source src="/photos/home-hero-sfoglia.mp4" type="video/mp4" />
          </video>
          + <img> statico visibile solo con motion-reduce */}
      <ImagePlaceholder shot={shots.homeHero} fill tone="dark" vignette />

      {/* Gradiente inferiore per leggibilità */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(to top, rgba(14,12,10,0.94) 0%, rgba(14,12,10,0.5) 50%, transparent 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-[1200px] px-6 pb-16 sm:pb-20">
          <motion.h1
            className="font-display text-6xl font-light leading-[1.02] text-cream sm:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            Tortellino <em className="text-gold">d&rsquo;Oro</em>
          </motion.h1>

          <motion.div
            className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
          >
            <p className="text-base font-extralight text-cream-muted sm:text-lg">
              {hero.subtitle}
            </p>
            <Link href={`/${locale}/menu`} className="btn btn-fill shrink-0">
              {hero.ctaMenu}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
