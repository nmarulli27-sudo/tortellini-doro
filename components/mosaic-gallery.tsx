"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Plus } from "lucide-react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { RevealImage } from "@/components/reveal";
import type { Shot } from "@/lib/shots";
import { cn } from "@/lib/utils";

/* Layout 3-2-3: span di colonna/riga e proporzioni miste. */
const cells = [
  "col-span-2 row-span-2", // grande orizzontale
  "col-span-1 row-span-1",
  "col-span-1 row-span-2", // verticale
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1", // orizzontale basso
  "col-span-1 row-span-1",
];

/* Pattern E — Mosaic gallery.
   Griglia asimmetrica con hover zoom (1.03, 600ms) e cursore
   personalizzato dorato (solo desktop, pointer fine). */
export function MosaicGallery({
  shots: galleryShots,
  className,
}: {
  shots: Shot[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 35 });
  const springY = useSpring(y, { stiffness: 400, damping: 35 });

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => setCursorVisible(false)}
    >
      <div className="grid auto-rows-[180px] grid-cols-2 gap-[2px] sm:auto-rows-[220px] sm:grid-cols-4">
        {galleryShots.slice(0, cells.length).map((shot, i) => (
          <RevealImage
            key={shot.file}
            delay={0.05 * i}
            className={cn("group relative overflow-hidden", cells[i])}
          >
            <div className="img-zoom h-full w-full">
              <ImagePlaceholder
                shot={shot}
                fill
                tone={i % 3 === 0 ? "warm" : i % 3 === 1 ? "dark" : "neutral"}
              />
            </div>
          </RevealImage>
        ))}
      </div>

      {/* Cursore dorato — solo dove c'è interazione, solo pointer fine */}
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-deep/70 backdrop-blur-sm transition-opacity duration-300 [@media(pointer:fine)]:flex",
          cursorVisible ? "opacity-100" : "opacity-0",
        )}
        style={{ x: springX, y: springY }}
      >
        <Plus size={16} className="text-gold" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}
