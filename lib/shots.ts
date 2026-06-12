/* ============================================================
   Manifest degli scatti — la "shopping list" per il servizio
   fotografico. Ogni placeholder nel sito pesca da qui: quando
   arriva la foto reale, salvarla in /public/photos/ con il nome
   indicato in `file` e sostituire il placeholder nel componente.
   Le didascalie descrivono lo scatto desiderato (brief fotografo).
   ============================================================ */

export type Shot = {
  file: string;
  caption: string;
  video?: boolean;
  poster?: string; // foto statica per i video (fallback prefers-reduced-motion)
};

export const shots = {
  /* ---------- Home ---------- */
  homeHero: {
    file: "home-hero-sfoglia.mp4",
    caption:
      "[video: sfoglia tirata al mattarello, mani al lavoro, loop muto, luce calda laterale]",
    video: true,
    poster: "home-hero-poster.jpg",
  },
  storyMattino: {
    file: "story-mattarello-farina.jpg",
    caption: "[foto: mattarello e farina sul piano di legno, prime luci del mattino, verticale]",
  },
  storySfoglia: {
    file: "story-sfoglia-controluce.jpg",
    caption: "[foto: sfoglia sottile sollevata in controluce, quasi trasparente, verticale]",
  },
  storyPiatto: {
    file: "story-tortellini-topdown.jpg",
    caption: "[foto: tortellini in brodo finiti, top-down su ceramica scura, vapore visibile]",
  },
  firmaTortellini: {
    file: "firma-tortellini-brodo.jpg",
    caption: "[foto: tortellini in brodo di cappone, primo piano 45°, luce calda da destra]",
  },
  firmaTagliatelle: {
    file: "firma-tagliatelle-ragu.jpg",
    caption: "[foto: tagliatelle al ragù bianco, forchettata sollevata, fondo scuro]",
  },
  firmaTortelli: {
    file: "firma-tortelli-zucca.jpg",
    caption: "[foto: tortelli di zucca, dettaglio del ripieno aperto, burro nocciola lucido]",
  },
  stripSala: {
    file: "strip-sala-vuota.jpg",
    caption: "[foto: sala vuota, luce calda serale]",
  },
  stripTavolo: {
    file: "strip-tavolo-apparecchiato.jpg",
    caption: "[foto: dettaglio tavolo apparecchiato, lino e ceramica]",
  },
  stripCantina: {
    file: "strip-cantina.jpg",
    caption: "[foto: cantina, bottiglie in penombra]",
  },
  stripSfoglia: {
    file: "strip-sfoglia-mani.jpg",
    caption: "[foto: mani che chiudono i tortellini, primo piano]",
  },
  stripCucina: {
    file: "strip-cucina.jpg",
    caption: "[foto: cucina in servizio, movimento e vapore]",
  },
  esperienzaSala: {
    file: "esperienza-sala.jpg",
    caption: "[foto: sala intera, atmosfera moderna-rustica, prospettiva dall'ingresso, verticale 4:5]",
  },
  esperienzaDettaglio: {
    file: "esperienza-ceramica.jpg",
    caption: "[foto: dettaglio ravvicinato — ceramica artigianale e lino sul tavolo, luce di taglio]",
  },
  atmosferaGiorno: {
    file: "atmosfera-giorno.jpg",
    caption: "[foto: sala di giorno, luce naturale dalla vetrina, verticale]",
  },
  atmosferaSera: {
    file: "atmosfera-sera.jpg",
    caption: "[foto: stesso angolo di sera, candele e luce calda, quadrata]",
  },

  /* ---------- Menu ---------- */
  menuHero: {
    file: "menu-hero-piatto.jpg",
    caption: "[foto: piatto fumante appena uscito dal passe, orizzontale largo, fondo scuro]",
  },
  menuPrimo1: {
    file: "menu-primo-tortellini.jpg",
    caption: "[foto: tortellini in brodo di cappone, top-down, quadrata]",
  },
  menuPrimo2: {
    file: "menu-primo-tagliatelle.jpg",
    caption: "[foto: tagliatelle al ragù bianco, top-down, quadrata]",
  },
  menuPrimo3: {
    file: "menu-primo-tortelli.jpg",
    caption: "[foto: tortelli di zucca e amaretti, top-down, quadrata]",
  },
  menuPrimo4: {
    file: "menu-primo-tagliolini.jpg",
    caption: "[foto: tagliolini al limone e bottarga, top-down, quadrata]",
  },
  menuPrimo5: {
    file: "menu-primo-gnocchi.jpg",
    caption: "[foto: gnocchi al bordeaux e gorgonzola, top-down, quadrata]",
  },
  menuAntipasti: {
    file: "menu-antipasti-anchor.jpg",
    caption: "[foto: battuta di Fassona al coltello, luce laterale, verticale]",
  },
  menuSecondi: {
    file: "menu-secondi-anchor.jpg",
    caption: "[foto: guancia di manzo al Barbera con purè, vapore, verticale]",
  },
  menuDolci: {
    file: "menu-dolci-anchor.jpg",
    caption: "[foto: zuppa inglese al cucchiaio, dettaglio strati, verticale]",
  },
  menuStripUova: {
    file: "menu-strip-uova.jpg",
    caption: "[foto: uova fresche e farina, still life scuro]",
  },
  menuStripFarina: {
    file: "menu-strip-impasto.jpg",
    caption: "[foto: impasto lavorato a mano, dettaglio]",
  },
  menuStripParmigiano: {
    file: "menu-strip-parmigiano.jpg",
    caption: "[foto: scaglie di Parmigiano su tagliere scuro]",
  },
  menuStripErbe: {
    file: "menu-strip-salvia.jpg",
    caption: "[foto: salvia fresca e burro, still life]",
  },
  menuPausa: {
    file: "menu-pausa-mani.jpg",
    caption: "[foto: mani che chiudono i tortellini in fila sul piano infarinato, orizzontale largo]",
  },

  /* ---------- Chi siamo ---------- */
  aboutHero: {
    file: "about-hero-chef.jpg",
    caption: "[foto: ritratto ambientato dello chef in sala vuota, luce calda dalla vetrina, orizzontale largo]",
  },
  aboutCap1: {
    file: "about-origini.jpg",
    caption: "[foto: ritratto dello chef o foto storica di famiglia in cucina, verticale 4:5]",
  },
  aboutCap2: {
    file: "about-filosofia.jpg",
    caption: "[foto: cassetta di verdure di stagione dal mercato o fornitore, verticale 4:5]",
  },
  aboutCap3: {
    file: "about-sfoglia.jpg",
    caption: "[foto: sfoglia al mattarello, farina sospesa in controluce, verticale 4:5]",
  },
  frammento1: {
    file: "frammenti-archivio.jpg",
    caption: "[foto: foto storica / archivio di famiglia]",
  },
  frammento2: {
    file: "frammenti-mani.jpg",
    caption: "[foto: mani infarinate, primo piano]",
  },
  frammento3: {
    file: "frammenti-ceramica.jpg",
    caption: "[foto: ceramiche artigianali impilate]",
  },
  frammento4: {
    file: "frammenti-brodo.jpg",
    caption: "[foto: pentola di brodo che sobbolle, vapore]",
  },
  frammento5: {
    file: "frammenti-cantina.jpg",
    caption: "[foto: etichette di vino, dettaglio]",
  },
  frammento6: {
    file: "frammenti-sala-dettaglio.jpg",
    caption: "[foto: angolo di sala, legno e luce]",
  },
  frammento7: {
    file: "frammenti-mercato.jpg",
    caption: "[foto: al mercato dal fornitore, reportage]",
  },
  aboutQuote: {
    file: "about-quote-sala-sera.jpg",
    caption: "[foto: sala di sera a luci basse, orizzontale larga, molto scura ai bordi]",
  },
  team1: {
    file: "team-chef.jpg",
    caption: "[ritratto: chef, b/n virato caldo, fondo neutro]",
  },
  team2: {
    file: "team-sous-chef.jpg",
    caption: "[ritratto: sous-chef, b/n virato caldo, fondo neutro]",
  },
  team3: {
    file: "team-sfoglina.jpg",
    caption: "[ritratto: sfoglina, b/n virato caldo, fondo neutro]",
  },
  team4: {
    file: "team-sala.jpg",
    caption: "[ritratto: responsabile di sala, b/n virato caldo, fondo neutro]",
  },

  /* ---------- Contatti ---------- */
  contattiEsterno: {
    file: "contatti-ingresso-sera.jpg",
    caption: "[foto: esterno del ristorante, ingresso illuminato di sera, orizzontale larga]",
  },
  contattiVerticale: {
    file: "contatti-tavolo.jpg",
    caption: "[foto: tavolo apparecchiato vicino alla finestra, verticale 3:4]",
  },
  contattiQuartiere: {
    file: "contatti-via.jpg",
    caption: "[foto: la via del ristorante, ora blu serale, orizzontale larga]",
  },
} as const satisfies Record<string, Shot>;
