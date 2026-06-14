## Design Rules — Read Before Every UI Task

### Typography — FORBIDDEN (never use these fonts):
Inter, Roboto, Open Sans, Lato, Arial, system-ui, Space Grotesk

### Typography — Required fonts for this project:
- Body:    Bricolage Grotesque — weights 200 and 800 (use extremes, not 400/600)
- Display: Fraunces — weights 100 and 900
- Mono:    JetBrains Mono
- Size:    Minimum 3× jump between body text and display headings

### Color Rules:
- One dominant color + one sharp accent. Not an even distribution.
- FORBIDDEN: purple-to-blue gradient on white backgrounds
- FORBIDDEN: teal/mint "SaaS" color schemes
- Use OKLCH via the @theme directive in globals.css
- All borders: 0.08–0.12 opacity only (the Vercel hairline pattern)

### Backgrounds:
- Hero sections: never flat/solid. Use layered gradient, mesh, or pattern.
- Add 3–8% opacity grain overlay to any flat surface.
- Atmospheric depth is required on hero sections.

### Motion (always use motion/react — never framer-motion):
- One orchestrated page-load reveal beats scattered micro-interactions.
- Stagger delays between list items: 50–100ms
- Spring physics for position/scale. Tween + ease-out for opacity.
- FORBIDDEN: auto-playing looping animations on page content
- FORBIDDEN: more than 1 marquee element per page

### Spacing:
- Section vertical padding: minimum 64px, preferred 96px
- Never use 24px section padding (that's the default AI tell)
- Max content width: 1200px centered

### Components:
- Always check the shadcn MCP before building any component.
- Never hand-roll something that exists in the shadcn registry.
- Use shadcn primitives as the base for all interactive elements.