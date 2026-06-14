# DESIGN.md — Tortellino d'Oro

Ristorante italiano di pasta fresca fatta a mano: trattoria d'autore, eleganza scura e moderna, dettagli rustici (legno, ceramica, lino). Niente cliché folkloristici (bandiere, font finto-medievale, sfondi a quadri). Due sensazioni in pochi secondi: "qui si mangia bene davvero" e "questo posto ha cura per il dettaglio".

## Palette (hex esatti, definiti in `my-project/app/globals.css`)

```
--bg-deep:      #0E0C0A   nero caldo, sfondo principale
--bg-elevated:  #1A1612   superfici elevate, card
--bg-warm:      #251E18   sezioni alternate
--gold:         #C9A961   oro antico, accent principale
--gold-bright:  #E0C079   oro chiaro, hover/highlight
--bordeaux:     #6B1F2C   accent secondario
--cream:        #F2EAD9   testo principale
--cream-muted:  #B8AE9B   testo secondario
--line:         #3A312A   divisori sottili
```

## Tipografia (deciso dall'utente: seguire CLAUDE.md, NON il brief originale Cormorant/Inter)

- Display: **Fraunces** (corsivo per accenti, es. "d'Oro" in oro corsivo)
- Body/UI: **Bricolage Grotesque** (peso base 300, extralight per i lead)
- Etichette/eyebrow: **JetBrains Mono**, uppercase, tracking 0.2–0.3em

## Pattern ricorrenti

- Eyebrow mono oro → titolo Fraunces → testo cream-muted
- `.filetto`: linea dorata 1px sfumata come separatore
- `.btn-outline` / `.btn-fill`: bottoni oro, hover che riempie/svuota in 300ms
- Foto: placeholder `PhotoPlaceholder` con didascalia tecnica `[foto: …]` da sostituire con scatti reali (scuri, moody, luce laterale calda)
- Grain 4% su tutto (body::after in globals.css)
- Sezioni: py-24/py-32, max-w-[1200px]
- Animazioni: `components/reveal.tsx` (fade+slide-up allo scroll, once), reveal orchestrato al load solo nella hero. Niente autoplay/carousel.

## i18n

- IT (default) + EN, dizionari in `my-project/lib/i18n/{it,en}.json`, route `/{locale}/...`, redirect via `proxy.ts`. Slug italiani anche in EN (`/en/chi-siamo`).
- Italiano curato e misurato (mai gonfio di aggettivi); inglese idiomatico, non letterale.

## Da evitare

Cliché italiani, carousel automatici, stock photo generiche, emoji nei testi, oro su nero per testi piccoli (sotto soglia AA — usare cream o gold-bright).
