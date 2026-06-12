import type { ReactNode } from "react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal, RevealImage } from "@/components/reveal";
import type { Shot } from "@/lib/shots";
import { cn } from "@/lib/utils";

/* Pattern C — Editorial split.
   Immagine al 50% della viewport fino al bordo del browser (non
   incassata nella griglia), testo nel 50% interno. `reverse` alterna
   il lato immagine tra una sezione e la successiva. */
export function EditorialSplit({
  shot,
  reverse = false,
  tone = "warm",
  children,
  className,
}: {
  shot: Shot;
  reverse?: boolean;
  tone?: "warm" | "dark" | "neutral";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid items-stretch lg:grid-cols-2", className)}>
      <RevealImage
        className={cn(
          "relative min-h-[55svh] lg:min-h-[80svh]",
          reverse && "lg:order-2",
        )}
      >
        <ImagePlaceholder shot={shot} fill tone={tone} vignette />
      </RevealImage>

      <Reveal
        delay={0.12}
        className={cn(
          "flex items-center px-6 py-20 sm:px-12 lg:px-20 lg:py-28",
          reverse && "lg:order-1",
        )}
      >
        <div className={cn("max-w-xl", reverse && "lg:ml-auto")}>{children}</div>
      </Reveal>
    </section>
  );
}
