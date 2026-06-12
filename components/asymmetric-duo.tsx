import { ImagePlaceholder } from "@/components/image-placeholder";
import { RevealImage } from "@/components/reveal";
import type { Shot } from "@/lib/shots";
import { cn } from "@/lib/utils";

/* Pattern B — Asymmetric duo (60/40).
   Verticale grande + immagine più piccola con offset verticale
   di ~100px: ritmo, niente simmetria piatta. */
export function AsymmetricDuo({
  large,
  small,
  className,
}: {
  large: Shot;
  small: Shot;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid items-start gap-6 sm:grid-cols-[3fr_2fr] sm:gap-8",
        className,
      )}
    >
      <RevealImage>
        <ImagePlaceholder shot={large} aspect="4/5" tone="warm" vignette />
      </RevealImage>
      <RevealImage delay={0.15} className="sm:mt-[100px]">
        <ImagePlaceholder shot={small} aspect="1/1" tone="dark" />
      </RevealImage>
    </div>
  );
}
