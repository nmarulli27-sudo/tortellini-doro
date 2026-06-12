"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shot } from "@/lib/shots";

/* Mostra la foto/video reale da /public/photos/ (nome in shot.file) con
   fade-in "messa a fuoco". Se il file manca o non carica, resta il
   placeholder strutturato (didascalia di brief + nome file) come fallback.
   Trattamento immagine via classi `img-treatment` (+ `vignette` su hero). */
export function ImagePlaceholder({
  shot,
  aspect,
  tone = "warm",
  fill = false,
  vignette = false,
  className,
}: {
  shot: Shot;
  aspect?: string; // es. "16/9", "3/4", "1/1"
  tone?: "warm" | "dark" | "neutral";
  fill?: boolean; // occupa il contenitore (che definisce l'altezza)
  vignette?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  // Se il media è già pronto al mount (cache), onLoad non scatta: lo rileviamo qui.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setStatus("loaded");
    } else if (videoRef.current && videoRef.current.readyState >= 2) {
      setStatus("loaded");
    } else if (posterRef.current?.complete && posterRef.current.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, []);

  const backgrounds: Record<string, string> = {
    warm: "radial-gradient(110% 85% at 35% 25%, rgba(201,169,97,0.09), transparent 55%), radial-gradient(90% 70% at 70% 80%, rgba(107,31,44,0.14), transparent 60%), linear-gradient(155deg, #251E18 0%, #1A1612 70%)",
    dark: "radial-gradient(100% 80% at 50% 35%, rgba(201,169,97,0.07), transparent 55%), linear-gradient(170deg, #1A1612 0%, #0E0C0A 75%)",
    neutral:
      "radial-gradient(100% 80% at 50% 40%, rgba(242,234,217,0.04), transparent 60%), linear-gradient(160deg, #1A1612 0%, #14110E 80%)",
  };

  const Icon = shot.video ? Clapperboard : Camera;
  const src = `/photos/${shot.file}`;
  const posterSrc = shot.poster ? `/photos/${shot.poster}` : undefined;
  const alt = shot.caption.replace(/^\[(?:foto|video):\s*/i, "").replace(/\]$/, "");
  const showPlaceholder = status !== "loaded";

  return (
    <figure
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden border border-line",
        vignette && "vignette",
        fill ? "h-full w-full" : "w-full",
        className,
      )}
      style={{
        ...(fill ? {} : { aspectRatio: aspect?.replace("/", " / ") ?? "3 / 2" }),
        background: backgrounds[tone],
      }}
    >
      {/* grana sottile locale */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* placeholder strutturato — visibile finché il media non è caricato (o se manca) */}
      {showPlaceholder && (
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <Icon size={18} strokeWidth={1.25} className="text-gold/70" aria-hidden />
          <span className="max-w-xs text-xs italic leading-relaxed text-cream-muted/80">
            {shot.caption}
          </span>
          <span className="font-mono text-[9px] tracking-[0.15em] text-cream-muted/40">
            {shot.file}
          </span>
        </figcaption>
      )}

      {/* media reale */}
      {status !== "error" &&
        (shot.video ? (
          <>
            <video
              ref={videoRef}
              src={src}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setStatus("loaded")}
              onError={() => setStatus("error")}
              className={cn(
                "img-treatment absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:hidden",
                status === "loaded" ? "opacity-100" : "opacity-0",
              )}
            />
            {/* prefers-reduced-motion: foto statica al posto del video */}
            {posterSrc && (
              <img
                ref={posterRef}
                src={posterSrc}
                alt=""
                aria-hidden
                className="img-treatment absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
                onLoad={() => setStatus("loaded")}
              />
            )}
          </>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt=""
            aria-hidden
            loading={fill ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn(
              "img-treatment absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              status === "loaded" ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
    </figure>
  );
}
