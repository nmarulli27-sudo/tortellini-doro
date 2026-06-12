import { ImagePlaceholder } from "@/components/image-placeholder";
import { RevealImage } from "@/components/reveal";
import type { Shot } from "@/lib/shots";
import { cn } from "@/lib/utils";

/* Pattern D — Image strip.
   Striscia orizzontale full-width di 4–5 immagini, altezza fissa,
   gap 2px: effetto "pellicola". Transizione tra sezioni. */
export function ImageStrip({
  shots: stripShots,
  height = "clamp(220px, 32vw, 380px)",
  className,
}: {
  shots: Shot[];
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("grid w-full gap-[2px]", className)}
      style={{
        height,
        gridTemplateColumns: `repeat(${stripShots.length}, minmax(0, 1fr))`,
      }}
    >
      {stripShots.map((shot, i) => (
        <RevealImage
          key={shot.file}
          delay={0.07 * i}
          className={cn("relative h-full", i > 2 && "hidden sm:block")}
        >
          <ImagePlaceholder shot={shot} fill tone={i % 2 === 0 ? "warm" : "dark"} />
        </RevealImage>
      ))}
    </div>
  );
}
