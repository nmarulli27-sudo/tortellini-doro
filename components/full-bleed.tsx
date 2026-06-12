"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import type { Shot } from "@/lib/shots";
import { cn } from "@/lib/utils";

/* Pattern A — Full-bleed cinematic.
   Immagine a tutta larghezza viewport, 80–100vh, parallax leggero
   (±30px), gradiente scuro inferiore per il testo sovrapposto. */
export function FullBleed({
  shot,
  height = "80svh",
  tone = "dark",
  align = "bottom",
  children,
  className,
}: {
  shot: Shot;
  height?: string;
  tone?: "warm" | "dark" | "neutral";
  align?: "bottom" | "center"; // "center" scurisce tutta l'immagine (es. citazione)
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
    >
      <motion.div className="absolute inset-[-30px]" style={{ y }}>
        <ImagePlaceholder shot={shot} fill tone={tone} vignette />
      </motion.div>

      {children && align === "bottom" && (
        <>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background:
                "linear-gradient(to top, rgba(14,12,10,0.92) 0%, rgba(14,12,10,0.45) 45%, transparent 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 z-10">{children}</div>
        </>
      )}

      {children && align === "center" && (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(14,12,10,0.82) 0%, rgba(14,12,10,0.55) 50%, rgba(14,12,10,0.78) 100%)",
            }}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </section>
  );
}
