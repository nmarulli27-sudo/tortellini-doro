"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { RevealImage } from "@/components/reveal";
import type { Shot } from "@/lib/shots";
import { cn } from "@/lib/utils";

export type StoryChapter = {
  eyebrow: string;
  title: string;
  body: string;
  shot: Shot;
};

/* Pattern F — Sticky-scroll storytelling.
   Desktop: immagine sticky a sinistra che cambia (crossfade) mentre
   i capitoli scorrono a destra. Mobile: sequenza verticale. */
export function StickyStory({
  chapters,
  className,
}: {
  chapters: StoryChapter[];
  className?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <section className={className}>
      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-2">
        <div className="relative">
          <div className="sticky top-0 h-screen p-12 xl:p-16">
            <div className="relative h-full w-full overflow-hidden">
              {chapters.map((chapter, i) => (
                <motion.div
                  key={chapter.shot.file}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <ImagePlaceholder shot={chapter.shot} fill tone="warm" vignette />
                </motion.div>
              ))}
              {/* indicatore capitolo */}
              <div className="absolute bottom-6 left-6 z-10 flex gap-2">
                {chapters.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-px w-8 transition-colors duration-500",
                      active === i ? "bg-gold" : "bg-cream/25",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {chapters.map((chapter, i) => (
            <motion.div
              key={chapter.title}
              className="flex min-h-screen items-center px-12 xl:px-20"
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.5 }}
            >
              <div className="max-w-md">
                <p className="eyebrow">{chapter.eyebrow}</p>
                <h3 className="mt-4 font-display text-4xl font-light italic leading-tight text-cream">
                  {chapter.title}
                </h3>
                <p className="mt-6 text-base font-extralight leading-relaxed text-cream-muted">
                  {chapter.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: alternanza immagine → testo */}
      <div className="space-y-16 px-6 py-8 lg:hidden">
        {chapters.map((chapter) => (
          <div key={chapter.title}>
            <RevealImage>
              <ImagePlaceholder shot={chapter.shot} aspect="4/5" tone="warm" />
            </RevealImage>
            <div className="mt-6">
              <p className="eyebrow">{chapter.eyebrow}</p>
              <h3 className="mt-3 font-display text-3xl font-light italic text-cream">
                {chapter.title}
              </h3>
              <p className="mt-4 text-base font-extralight leading-relaxed text-cream-muted">
                {chapter.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
