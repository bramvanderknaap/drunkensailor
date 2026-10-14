// ===================================================================
//  DE SCHEPEN
//  Dit is het enige bestand dat je hoeft aan te passen om schepen toe
//  te voegen of teksten te veranderen. Kopieer een blok { ... },
//  plak het onderaan de lijst (vergeet de komma niet) en vul het in.
//
//  wrak:   [breedtegraad, lengtegraad] van de (vermoedelijke) wrakplek.
//          Noord en oost zijn positief, zuid en west negatief.
//  route:  punten waarlangs het schip voer, in volgorde. Een punt met
//          een naam is een haven; punten zonder naam zijn alleen bochten
//          zodat de lijn over zee loopt. Zet het woord WRAK op de plek
//          waar het schip verging: tot daar wordt de lijn doorgetrokken,
//          daarna gestippeld (het deel dat het schip nooit voer).
//  status: een van: vermist, onzeker, gevonden, deels, geborgen
//          (zie STATUSSEN hieronder voor de kleuren en namen).
// ===================================================================

window.STATUSSEN = {
  vermist:  { naam: "Niet teruggevonden",                  kleur: "#c2412d" },
  onzeker:  { naam: "Wrak niet definitief geïdentificeerd", kleur: "#8a5cc2" },
  gevonden: { naam: "Ontdekt, vrijwel niet geborgen",      kleur: "#d9822b" },
  deels:    { naam: "Ontdekt, gedeeltelijk geborgen",      kleur: "#c9a227" },
  geborgen: { naam: "Ontdekt, vrijwel volledig geborgen",  kleur: "#2f9e7e" }
};

const WRAK = "WRAK";

window.SCHEPEN = [
  {
    naam: "Flor do Mar",
    jaar: 1511,
    land: "Portugal",
    status: "vermist",
    route: "Malakka (Maleisië) → Goa (India), uiteindelijk bestemd voor Portugal.",
    locatie: "Vermoedelijk voor de kust van Noord-Sumatra, Indonesië.",
    verhaal: "Na de Portugese verovering van Malakka vervoerde het schip kostbaarheden die waren buitgemaakt in de stad. Het verging tijdens een storm.",
    buit: "Goud, juwelen, kostbare voorwerpen en diplomatieke geschenken.",
    feiten: [],
    waarde: "Onbekend. Schattingen van miljarden dollars circuleren, maar zijn niet onderbouwd met een betrouwbare inventaris.",
    noot: "Het wrak is nooit overtuigend geïdentificeerd. Bovendien is onzeker hoeveel van de oorspronkelijke lading na de schipbreuk kon worden gered.",
    wrak: [4.5, 98.6],
    lijn: [[2.19, 102.25, "Malakka"], [3.3, 100.6], WRAK, [5.9, 95.1], [5.8, 80.6], [7.6, 77.1], [15.49, 73.82, "Goa"]]
  },
  {
    naam: "Merchant Royal",
    jaar: 1641,
    land: "Engeland",
    status: "vermist",
    route: "Cádiz (Spanje) → Vlaanderen, met mogelijk een tussenstop in Engeland.",
    locatie: "Atlantische Oceaan, voor de kust van Cornwall.",
    verhaal: "Het Engelse handelsschip vervoerde onder meer edelmetaal voor de betaling van Spaanse troepen in de Nederlanden. Door lekkage en slecht weer zonk het schip.",
    buit: "Goud, zilver, munten en mogelijk juwelen.",
    feiten: [["Historische waarde", "In een document uit 1641 werd het verlies op minstens £400.000 geschat."]],
    waarde: "Onbekend. Een moderne schatting van £150–300 miljoen is gepubliceerd, maar is geen geverifieerde taxatie.",
    noot: "Een van de interessantste nog vermiste historische schatschepen in Europese wateren.",
    wrak: [49.85, -6.4],
    lijn: [[36.53, -6.3, "Cádiz"], [36.9, -9.4], [43.2, -10.0], [48.3, -6.4], WRAK, [50.0, -4.0], [50.5, -1.5], [51.0, 1.5], [51.05, 2.37, "Vlaanderen"]]
  },
  {
    naam: "Nuestra Señora del Juncal",
    jaar: 1631,
    land: "Spanje",
    status: "vermist",
    route: "Veracruz (Mexico) → Havana → Spanje.",
    locatie: "Golf van Mexico, voor de kust van Campeche.",
    verhaal: "Het galjoen was onderdeel van de Spaanse zilvervloot. Tijdens een zware storm verging het schip met zijn kostbare handelslading.",
    buit: "Zilveren munten, zilverbaren, zijde, cacao en andere koloniale handelswaar.",
    feiten: [],
    waarde: "Onbekend. Er is geen betrouwbaar vastgesteld bedrag voor de resterende lading.",
    noot: "Spanje en Mexico werken samen aan archeologisch onderzoek naar het verdwenen galjoen.",
    wrak: [21.3, -91.4],
    lijn: [[19.2, -96.13, "Veracruz"], [20.6, -94.0], WRAK, [22.6, -86.6], [23.14, -82.36, "Havana"], [24.3, -80.6], [25.6, -79.9], [28.5, -79.6], [32.5, -75.5], [36.0, -55.0], [38.5, -28.0], [36.9, -9.4], [36.53, -6.3, "Cádiz"]]
  },
  {
    naam: "HMS Sussex",
    jaar: 1694,
    land: "Engeland",
    status: "onzeker",
    route: "Engelse vlootexpeditie richting de Middellandse Zee.",
    locatie: "Voor Gibraltar.",
    verhaal: "Het Britse oorlogsschip zonk tijdens een storm. Volgens historische aanwijzingen vervoerde het mogelijk geld om de hertog van Savoye als bondgenoot te behouden.",
    buit: "Gouden en zilveren munten (mogelijk).",
    feiten: [["Vermeende historische waarde", "Ongeveer £1 miljoen."]],
    waarde: "Niet vast te stellen.",
    noot: "Let op: zowel de precieze hoeveelheid goud aan boord als de identificatie van het onderzochte wrak zijn onzeker. In 2001 werd een mogelijke wraklocatie ontdekt, maar dat leverde geen bevestigde goudschat op.",
    wrak: [36.0, -5.25],
    lijn: [[50.78, -1.1, "Engeland"], [50.0, -3.5], [48.5, -6.0], [43.2, -10.0], [36.9, -9.4], [35.95, -6.2], WRAK, [36.8, 0.0], [38.5, 6.0, "Middellandse Zee"]]
  },
  {
    naam: "San José",
    jaar: 1708,
    land: "Spanje",
    status: "gevonden",
    route: "Portobelo (Panama) → Cartagena → Havana → Cádiz.",
    locatie: "Caribische Zee, voor Cartagena (Colombia).",
    verhaal: "Het galjoen werd tijdens de Spaanse Successieoorlog aangevallen door Britse oorlogsschepen en zonk in de Slag bij Barú.",
    buit: "Goud, zilver, edelstenen en handelswaar.",
    feiten: [["Diepte", "Circa 600 meter."], ["Historische waarde", "Naar schatting 7–12 miljoen Spaanse pesos."]],
    waarde: "Moderne schattingen lopen in de miljarden dollars, maar de werkelijke marktwaarde is niet vastgesteld.",
    noot: "Het wrak werd in 2015 ontdekt. Colombia heeft inmiddels enkele archeologische voorwerpen geborgen, maar de hoofdcollectie bevindt zich nog onder water.",
    wrak: [10.15, -75.85],
    lijn: [[9.55, -79.65, "Portobelo"], [9.95, -77.5], WRAK, [10.42, -75.6, "Cartagena"], [12.8, -77.6], [18.4, -82.4], [21.6, -85.2], [23.14, -82.36, "Havana"], [24.3, -80.6], [25.6, -79.9], [28.5, -79.6], [32.5, -75.5], [36.0, -55.0], [38.5, -28.0], [36.9, -9.4], [36.53, -6.3, "Cádiz"]]
  },
  {
    naam: "Nuestra Señora de Atocha",
    jaar: 1622,
    land: "Spanje",
    status: "deels",
    route: "Portobelo → Cartagena → Havana → Spanje.",
    locatie: "Florida Keys, Verenigde Staten.",
    verhaal: "Het galjoen verging in een orkaan. In 1985 ontdekte Mel Fisher het belangrijkste deel van de kostbare lading.",
    buit: "Zilverbaren, gouden voorwerpen, munten en smaragden.",
    feiten: [["Oorspronkelijke lading", "Onder meer 1.038 zilverbaren en 125 goudbaren of gouden schijven, volgens het Mel Fisher Maritime Museum."]],
    waarde: "Onbekend. De bergingsorganisatie verwacht nog aanzienlijke vondsten.",
    noot: "In juni 2026 werd opnieuw een zilverbaar van ongeveer 10 kg gevonden. Dit bevestigt dat er nog waardevolle voorwerpen aanwezig zijn.",
    wrak: [24.45, -82.25],
    lijn: [[9.55, -79.65, "Portobelo"], [9.95, -77.5], [10.42, -75.6, "Cartagena"], [12.8, -77.6], [18.4, -82.4], [21.6, -85.2], [23.14, -82.36, "Havana"], WRAK, [24.3, -80.6], [25.6, -79.9], [28.5, -79.6], [32.5, -75.5], [36.0, -55.0], [38.5, -28.0], [36.9, -9.4], [36.53, -6.3, "Spanje"]]
  },
  {
    naam: "Santa Margarita",
    jaar: 1622,
    land: "Spanje",
    status: "deels",
    route: "Portobelo → Cartagena → Havana → Spanje.",
    locatie: "Florida Keys.",
    verhaal: "Dit galjoen verging tijdens dezelfde orkaan als de Atocha. Het wrak werd in 1980 ontdekt.",
    buit: "Goudbaren, gouden sieraden, zilveren munten en parels.",
    feiten: [],
    waarde: "Onbekend.",
    noot: "Bij eerdere expedities zijn miljoenen dollars aan kostbaarheden geborgen. De zoektocht naar overige delen van de lading gaat door.",
    wrak: [24.55, -82.05],
    lijn: [[9.55, -79.65, "Portobelo"], [9.95, -77.5], [10.42, -75.6, "Cartagena"], [12.8, -77.6], [18.4, -82.4], [21.6, -85.2], [23.14, -82.36, "Havana"], WRAK, [24.3, -80.6], [25.6, -79.9], [28.5, -79.6], [32.5, -75.5], [36.0, -55.0], [38.5, -28.0], [36.9, -9.4], [36.53, -6.3, "Spanje"]]
  },
  {
    naam: "Batavia",
    jaar: 1629,
    land: "Nederland",
    status: "deels",
    route: "Texel → Kaap de Goede Hoop → Batavia (Jakarta).",
    locatie: "Houtman Abrolhos, West-Australië.",
    verhaal: "Het VOC-schip liep op een rif. Daarna volgden een muiterij en de moord op meer dan honderd overlevenden.",
    buit: "Twaalf kisten zilveren munten, zilverwerk en kostbare voorwerpen.",
    feiten: [["Historische berging", "In 1629 werden tien van de twaalf geldkisten teruggehaald."]],
    waarde: "Onbekend. Bij latere opgravingen zijn ook munten uit de achtergebleven kisten gevonden.",
    noot: "Het wrak is uitgebreid archeologisch onderzocht en beschermd.",
    wrak: [-28.49, 113.79],
    lijn: [[53.05, 4.8, "Texel"], [51.2, 1.8], [49.9, -3.0], [48.3, -6.4], [43.0, -11.0], [28.0, -17.5], [15.0, -25.0], [0.0, -25.0], [-20.0, -28.0], [-33.0, -10.0], [-34.9, 12.0], [-33.9, 18.42, "Kaap de Goede Hoop"], [-37.5, 40.0], [-37.5, 90.0], [-31.0, 108.0], WRAK, [-22.0, 111.5], [-10.0, 107.0], [-6.0, 105.7], [-6.12, 106.8, "Batavia"]]
  },
  {
    naam: "Vergulde Draeck",
    jaar: 1656,
    land: "Nederland",
    status: "deels",
    route: "Texel → Kaap de Goede Hoop → Batavia.",
    locatie: "Bij Ledge Point, West-Australië.",
    verhaal: "Het VOC-schip liep 's nachts op een rif. Veel overlevenden bereikten de kust, maar verdwenen vervolgens.",
    buit: "Acht kisten zilveren munten ter waarde van 78.600 gulden, plus handelswaar.",
    feiten: [],
    waarde: "Onbekend.",
    noot: "Er zijn inmiddels meer dan 8.500 zilveren munten geborgen. Dat betekent niet dat de volledige oorspronkelijke lading is teruggevonden.",
    wrak: [-31.22, 115.32],
    lijn: [[53.05, 4.8, "Texel"], [51.2, 1.8], [49.9, -3.0], [48.3, -6.4], [43.0, -11.0], [28.0, -17.5], [15.0, -25.0], [0.0, -25.0], [-20.0, -28.0], [-33.0, -10.0], [-34.9, 12.0], [-33.9, 18.42, "Kaap de Goede Hoop"], [-37.5, 40.0], [-37.5, 90.0], [-33.0, 112.0], WRAK, [-22.0, 111.5], [-10.0, 107.0], [-6.0, 105.7], [-6.12, 106.8, "Batavia"]]
  },
  {
    naam: "Zuytdorp",
    jaar: 1712,
    land: "Nederland",
    status: "deels",
    route: "Nederland → Kaap de Goede Hoop → Batavia.",
    locatie: "Zuytdorp Cliffs, West-Australië.",
    verhaal: "Het VOC-schip verging tegen de steile Australische kust. Geen enkele overlevende bereikte Batavia.",
    buit: "Een grote hoeveelheid zilveren munten.",
    feiten: [["Historische waarde", "Ongeveer 250.000 gulden aan zilver."]],
    waarde: "Onbekend.",
    noot: "Het wrak is bijzonder moeilijk bereikbaar. Er zijn nog archeologische resten aanwezig en de vindplaats is streng beschermd.",
    wrak: [-27.18, 113.92],
    lijn: [[53.05, 4.8, "Nederland"], [51.2, 1.8], [49.9, -3.0], [48.3, -6.4], [43.0, -11.0], [28.0, -17.5], [15.0, -25.0], [0.0, -25.0], [-20.0, -28.0], [-33.0, -10.0], [-34.9, 12.0], [-33.9, 18.42, "Kaap de Goede Hoop"], [-37.5, 40.0], [-37.5, 90.0], [-30.0, 110.0], WRAK, [-22.0, 111.5], [-10.0, 107.0], [-6.0, 105.7], [-6.12, 106.8, "Batavia"]]
  },
  {
    naam: "Rooswijk",
    jaar: 1740,
    land: "Nederland",
    status: "deels",
    route: "Texel → Batavia.",
    locatie: "Goodwin Sands, voor de Engelse kust.",
    verhaal: "Het VOC-schip strandde kort na vertrek. Alle 237 opvarenden kwamen om.",
    buit: "Zilverbaren, zilveren munten en particuliere handelswaar.",
    feiten: [["Diepte", "Ongeveer 20–25 meter."], ["Oorspronkelijke waarde", "De bekende lading was meer dan 300.000 gulden waard."]],
    waarde: "Onbekend.",
    noot: "Archeologen hebben duizenden voorwerpen geborgen, waaronder zilver dat bemanningsleden vermoedelijk illegaal wilden verhandelen.",
    wrak: [51.27, 1.55],
    lijn: [[53.05, 4.8, "Texel"], [52.0, 3.0], WRAK, [51.0, 1.6], [49.9, -3.0], [48.3, -6.4], [43.0, -11.0], [28.0, -17.5], [15.0, -25.0], [0.0, -25.0], [-20.0, -28.0], [-33.0, -10.0], [-34.9, 12.0], [-33.9, 18.42, "Kaap de Goede Hoop"], [-37.5, 40.0], [-37.5, 90.0], [-31.0, 108.0], [-22.0, 111.5], [-10.0, 107.0], [-6.0, 105.7], [-6.12, 106.8, "Batavia"]]
  },
  {
    naam: "HMS Lutine",
    jaar: 1799,
    land: "Groot-Brittannië",
    status: "deels",
    route: "Great Yarmouth (Engeland) → Hamburg (Duitsland).",
    locatie: "Tussen Vlieland en Terschelling.",
    verhaal: "Het Britse fregat vervoerde een grote hoeveelheid edelmetaal om een financiële crisis in Hamburg te helpen verlichten.",
    buit: "Goud- en zilverbaren en munten.",
    feiten: [["Historische waarde", "Volgens Lloyd's ongeveer £1 miljoen."]],
    waarde: "Onbekend, maar een aanzienlijk deel van de oorspronkelijke lading is nooit verantwoord als geborgen.",
    noot: "De Lutine ligt in een gebied met sterk bewegende zandbanken. De beroemde scheepsbel werd in de negentiende eeuw geborgen.",
    wrak: [53.33, 5.05],
    lijn: [[52.6, 1.75, "Great Yarmouth"], [53.1, 3.5], WRAK, [53.75, 6.5], [54.0, 8.3], [53.55, 9.97, "Hamburg"]]
  },
  {
    naam: "General Grant",
    jaar: 1866,
    land: "Verenigde Staten",
    status: "vermist",
    route: "Melbourne (Australië) → Londen.",
    locatie: "Auckland Islands, ten zuiden van Nieuw-Zeeland.",
    verhaal: "Het schip werd tegen de kust van een afgelegen eiland gedreven en verging. Slechts vijftien mensen overleefden de ramp.",
    buit: "Goud en reguliere handelswaar.",
    feiten: [["Vermoedelijke hoeveelheid goud", "2.576 troy ounce, ongeveer 80,1 kg."]],
    waarde: "Niet vastgesteld; zelfs de aanwezigheid van de volledige opgegeven hoeveelheid goud is niet definitief bevestigd.",
    noot: "Er zijn tientallen zoekpogingen ondernomen, maar het wrak is nog steeds niet overtuigend gevonden.",
    wrak: [-50.6, 165.95],
    // Deze route steekt de datumgrens over: lengtegraden boven 180 lopen
    // door in de Grote Oceaan (293 = 67° west, Kaap Hoorn).
    lijn: [[-37.85, 144.9, "Melbourne"], [-39.6, 147.5], [-46.0, 160.0], WRAK, [-54.0, 200.0], [-57.0, 260.0], [-56.8, 292.7, "Kaap Hoorn"], [-42.0, 315.0], [0.0, 333.0], [30.0, 338.0], [47.0, 352.0], [50.0, 358.0], [51.48, 360.6, "Londen"]]
  },
  {
    naam: "SS Central America",
    jaar: 1857,
    land: "Verenigde Staten",
    status: "deels",
    route: "Colón (Panama) → Havana → New York.",
    locatie: "Atlantische Oceaan, voor de Amerikaanse oostkust.",
    verhaal: "Het stoomschip vervoerde goud uit de Californische goudkoorts en zonk tijdens een orkaan.",
    buit: "Goudbaren, gouden munten en goudstof.",
    feiten: [["Diepte", "Ongeveer 2.400 meter."], ["Historische waarde", "Volgens het Smithsonian ongeveer $2,19 miljoen aan goud bij het zinken."]],
    waarde: "Onbekend.",
    noot: "Er zijn grote hoeveelheden goud geborgen, onder meer in 1988 en 2014. De volledige oorspronkelijke hoeveelheid is moeilijk te reconstrueren.",
    wrak: [31.6, -77.0],
    lijn: [[9.36, -79.9, "Colón"], [12.8, -80.6], [18.4, -82.4], [21.6, -85.2], [23.14, -82.36, "Havana"], [24.3, -80.6], [25.6, -79.9], [28.5, -79.6], WRAK, [35.0, -74.8], [40.45, -73.9, "New York"]]
  },
  {
    naam: "SS Laurentic",
    jaar: 1917,
    land: "Groot-Brittannië",
    status: "geborgen",
    route: "Birkenhead (Engeland) → Canada, via Noord-Ierland.",
    locatie: "Voor de kust van Donegal, Ierland.",
    verhaal: "Het schip vervoerde goud voor Britse oorlogsbetalingen en zonk nadat het op Duitse zeemijnen was gelopen.",
    buit: "3.211 goudbaren, met een totale historische waarde van ongeveer £5 miljoen.",
    feiten: [["Diepte", "Ongeveer 40 meter."], ["Bijzonder", "Een aanzienlijk deel van het goud lag onder het sediment begraven."]],
    waarde: "Volgens verschillende bergingsverslagen ontbreken nog ongeveer 20–22 goudbaren. Het exacte aantal is niet eenduidig.",
    noot: "Dit is een van de weinige gevallen waarbij de hoeveelheid ontbrekend goud redelijk nauwkeurig uit bergingsverslagen kan worden afgeleid.",
    wrak: [55.32, -7.6],
    lijn: [[53.39, -3.03, "Birkenhead"], [53.6, -3.7], [54.4, -5.1], [55.25, -6.4], WRAK, [55.6, -15.0], [50.0, -40.0], [44.64, -63.57, "Canada (Halifax)"]]
  }
];
