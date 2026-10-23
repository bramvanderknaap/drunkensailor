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
//  afbeelding: (mag weg) een schilderij of foto in de map img/, met
//          onderschrift, maker, licentie en een link naar de bron.
//  schatting: wat de buit nu waard is. totaal = de hele lading in geld
//          van nu, bodem = wat er vermoedelijk nog op de zeebodem ligt,
//          deel = welk deel van de buit er nog ligt (1 = alles, 0,5 = de helft),
//          zekerheid = zeer laag, laag, middel of hoog. In uitleg staat
//          hoe het berekend is, in bronnen de links waar het vandaan komt.
//  diepte: meters = hoe diep het wrak (waarschijnlijk) ligt, voor de
//          dieptemeter (null als niemand het weet), kort = wat er groot
//          staat, tekst = uitleg, bron = [titel, link].
//  eerbetoon: (alleen bij status eerbetoon) geen schatschip maar een
//          eerbetoon. Het krijgt een gouden vrachtschip als teken, en
//          herdenking = een tekst ter nagedachtenis. Bij de schatting
//          staat dan in soort wat de lading was.
// ===================================================================

// De prijzen waarmee de schattingen zijn berekend (metaalwaarde).
window.PRIJZEN = {
  datum: "14 oktober 2026",
  goud: "€118 per gram",
  zilver: "€1,74 per gram"
};

window.STATUSSEN = {
  vermist:  { naam: "Niet teruggevonden",                   kort: "vermist",        kleur: "#ff6150", gloed: "rgba(255,97,80,.55)" },
  onzeker:  { naam: "Wrak niet definitief geïdentificeerd", kort: "onzeker",        kleur: "#c9a2ff", gloed: "rgba(201,162,255,.5)" },
  gevonden: { naam: "Ontdekt, vrijwel niet geborgen",       kort: "gevonden",       kleur: "#ffa94d", gloed: "rgba(255,169,77,.5)" },
  deels:    { naam: "Ontdekt, gedeeltelijk geborgen",       kort: "deels geborgen", kleur: "#8cc0ff", gloed: "rgba(140,192,255,.5)" },
  geborgen: { naam: "Ontdekt, vrijwel volledig geborgen",   kort: "geborgen",       kleur: "#f5f2e6", gloed: "rgba(245,242,230,.45)" },
  eerbetoon: { naam: "Eerbetoon (honorable mention)",       kort: "eerbetoon",      kleur: "#f4c24f", gloed: "rgba(244,194,79,.75)" }
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
    schatting: {
      totaal: "onbekend",
      bodem: "onbekend",
      deel: 1,
      zekerheid: "zeer laag",
      uitleg: "Er bestaat geen lijst van wat er aan boord was. Het vaak genoemde verhaal van ‘60 ton goud’ zou nu ongeveer €7 miljard waard zijn, maar daar is geen bron voor. Volgens Albuquerque zelf werd bijna niets gered: alleen een gouden kroon, een zwaard en een robijnen ring.",
      bronnen: [
        ["Wikipedia: Flor de la Mar", "https://en.wikipedia.org/wiki/Flor_de_la_Mar"],
        ["The Daily Beast: ‘$2.6 billion treasure’", "https://thedailybeast.com/the-dollar26-billion-treasure-still-lost-at-the-bottom-of-the-sea"]
      ]
    },
    diepte: {
      meters: null,
      kort: "onbekend",
      tekst: "Het schip liep op een zandbank voor Sumatra, dus het ligt waarschijnlijk in ondiep water, onder zand en modder.",
      bron: ["Wikipedia: Flor de la Mar", "https://en.wikipedia.org/wiki/Flor_de_la_Mar"]
    },
    noot: "Het wrak is nooit overtuigend geïdentificeerd. Bovendien is onzeker hoeveel van de oorspronkelijke lading na de schipbreuk kon worden gered.",
    afbeelding: {
      src: "img/flor-do-mar.jpg",
      onderschrift: "De Flor de la Mar, getekend in de Roteiro de Malaca (16e eeuw)",
      maker: "Roteiro de Malaca",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Frol_de_la_mar_in_roteiro_de_malaca.jpeg",
      positie: "50% 40%"
    },
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
    schatting: {
      totaal: "ca. €190 mln",
      bodem: "ca. €190 mln",
      deel: 1,
      zekerheid: "laag",
      uitleg: "Een brief uit 1641 schatte de lading op minstens £400.000. Ik reken met ongeveer 500.000 zilveren ‘pieces of eight’ en 400 zilverbaren (samen ca. 27 ton zilver) en de rest in goud (ca. 1,2 ton). Er is niets van geborgen. De vaak genoemde ‘100.000 pond goud’ (45 ton, ruim €5 miljard) past niet bij die £400.000 uit 1641. Bandbreedte: €80 tot 400 miljoen.",
      bronnen: [
        ["Wikipedia: Royal Merchant", "https://en.wikipedia.org/wiki/Royal_Merchant"]
      ]
    },
    diepte: {
      meters: 90,
      kort: "ca. 90 m",
      tekst: "Het wrak is niet gevonden; dit is de diepte van het gebied waar gezocht wordt.",
      bron: ["Divernet: Diver to check out ‘Eldorado of the Seas’", "https://divernet.com/scuba-news/diver-to-check-out-eldorado-of-the-seas"]
    },
    noot: "Een van de interessantste nog vermiste historische schatschepen in Europese wateren.",
    afbeelding: {
      src: "img/merchant-royal.jpg",
      onderschrift: "Ter illustratie: Engelse koopvaardijschepen uit dezelfde eeuw (1685)",
      maker: "Isaac Sailmaker",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Two_Views_of_an_East_Indiaman_of_the_Time_of_King_William_III_RMG_BHC1676.tiff",
      positie: "50% 35%"
    },
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
    schatting: {
      totaal: "ca. €160 mln",
      bodem: "ca. €160 mln",
      deel: 1,
      zekerheid: "middel",
      uitleg: "Volgens de Spaanse administratie vervoerde de Juncal 3.644.198 pesos aan zilver en munten. Dat is ongeveer 93 ton puur zilver, nu ca. €160 miljoen. Andere bronnen spreken van 120 tot 150 ton edelmetaal, tot ca. €260 miljoen. Het wrak is nooit gevonden, dus alles ligt er nog.",
      bronnen: [
        ["Hispanopedia: Nuestra Señora del Juncal", "https://es.hispanopedia.com/wiki/Nuestra_Se%C3%B1ora_del_Juncal"],
        ["IAL: Renewed search for the Juncal", "https://ial.uk.com/renewed-search-for-one-of-spains-greatest-treasure-galleons/"]
      ]
    },
    diepte: {
      meters: null,
      kort: "onbekend",
      tekst: "Het wrak is nooit gevonden; er wordt gezocht in de Golf van Campeche.",
      bron: ["Acción Cultural Española: de zoektocht naar de Juncal", "https://www.accioncultural.es/en/the-new-spain-fleet-and-the-search-for-the-galleon-nuestra-senora-del-juncal"]
    },
    noot: "Spanje en Mexico werken samen aan archeologisch onderzoek naar het verdwenen galjoen.",
    afbeelding: {
      src: "img/juncal.jpg",
      onderschrift: "Ter illustratie: een Spaans galjoen uit dezelfde tijd",
      maker: "Cornelis Verbeeck",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Spanish_Galleon_Firing_its_Cannon.jpg"
    },
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
    schatting: {
      totaal: "ca. €1 mrd (als het goud er was)",
      bodem: "ca. €1 mrd (als het goud er was)",
      deel: 1,
      zekerheid: "laag",
      uitleg: "Volgens de verhalen had het schip ongeveer £1 miljoen aan gouden munten aan boord, 7 tot 10 ton goud. Tegen de goudprijs van nu is dat €0,8 tot 1,2 miljard. Of dat goud echt aan boord was, is nooit bewezen, en het wrak is niet zeker geïdentificeerd. Hogere bedragen (tot €6,4 miljard) tellen ook de verzamelwaarde van oude munten mee.",
      bronnen: [
        ["Wikipedia: HMS Sussex (1693)", "https://en.wikipedia.org/wiki/HMS_Sussex_(1693)"],
        ["The Olive Press (2026)", "https://www.theolivepress.es/spain-news/2026/08/11/gibraltar-treasure-ship-search/"]
      ]
    },
    diepte: {
      meters: 800,
      kort: "ca. 800 m",
      tekst: "Als het gevonden wrak echt de Sussex is; dat is nooit bevestigd.",
      bron: ["Wikipedia: HMS Sussex (1693)", "https://en.wikipedia.org/wiki/HMS_Sussex_(1693)"]
    },
    noot: "Let op: zowel de precieze hoeveelheid goud aan boord als de identificatie van het onderzochte wrak zijn onzeker. In 2001 werd een mogelijke wraklocatie ontdekt, maar dat leverde geen bevestigde goudschat op.",
    afbeelding: {
      src: "img/hms-sussex.jpg",
      onderschrift: "Model van de HMS Sussex",
      maker: "Maker: zie bron",
      licentie: "CC BY-SA 2.5",
      bron: "https://commons.wikimedia.org/wiki/File:HMS_Sussex_(80)_model_starboard_broadside.jpg"
    },
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
    feiten: [["Historische waarde", "Naar schatting 7–12 miljoen Spaanse pesos."]],
    schatting: {
      totaal: "ca. €0,9 mrd",
      bodem: "ca. €0,9 mrd",
      deel: 1,
      zekerheid: "laag",
      uitleg: "Historisch 7 tot 12 miljoen pesos. Als dat allemaal zilver was, is het nu €0,3 tot 0,5 miljard. Ik neem aan dat ongeveer een derde van de waarde in goud was; dan kom je op €0,6 tot 1,1 miljard. Er zijn pas een paar voorwerpen geborgen. De vaak genoemde $17 tot 20 miljard telt ook archeologische en verzamelwaarde mee.",
      bronnen: [
        ["Wikipedia: San José (galjoen)", "https://en.wikipedia.org/wiki/Spanish_galleon_San_Jos%C3%A9"]
      ]
    },
    diepte: {
      meters: 600,
      kort: "ca. 600 m",
      tekst: "Te diep voor duikers; alleen robots kunnen erbij.",
      bron: ["Quartz: Colombia’s deep-water expedition", "https://qz.com/colombia-will-send-deep-water-expedition-to-explore-300-1851283140"]
    },
    noot: "Het wrak werd in 2015 ontdekt. Colombia heeft inmiddels enkele archeologische voorwerpen geborgen, maar de hoofdcollectie bevindt zich nog onder water.",
    afbeelding: {
      src: "img/san-jose.jpg",
      onderschrift: "De Slag bij Barú (Wager's Action, 1708), waarin de San José ontplofte en zonk",
      maker: "Samuel Scott (ca. 1743)",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Wager%27s_Action_off_Cartagena_28_May_1708.jpg"
    },
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
    schatting: {
      totaal: "ca. €120 mln (plus smaragden)",
      bodem: "ca. €50 mln (plus smaragden)",
      deel: 0.42,
      zekerheid: "laag",
      uitleg: "De Atocha vervoerde ongeveer 40 ton goud en zilver en 32 kg smaragden. Daarvan is ca. 24 ton zilver geborgen, plus 125 goudbaren en -schijven. Wat nog mist is vooral het achterschip, met waarschijnlijk het meeste goud en de smaragden. De ruim 16 ton zilver die nog mist is nu ca. €28 miljoen waard; met het ontbrekende goud schat ik ca. €50 miljoen. Op veilingen brengen Atocha-voorwerpen veel meer op dan hun metaalwaarde.",
      bronnen: [
        ["Wikipedia: Nuestra Señora de Atocha", "https://en.wikipedia.org/wiki/Nuestra_Se%C3%B1ora_de_Atocha"],
        ["Maritime Executive", "https://www.maritime-executive.com/editorials/the-world-s-most-valuable-shipwreck-the-nuestra-senora-de-atocha"]
      ]
    },
    diepte: {
      meters: 17,
      kort: "15 tot 17 m",
      tekst: "De grote vondst van 1985 lag op 17 meter (55 voet).",
      bron: ["Cayman Compass: in Mel Fisher’s footsteps", "https://www.caymancompass.com/2010/07/19/treasure-hunters-follow-in-mel-fishers-footsteps/"]
    },
    noot: "In juni 2026 werd opnieuw een zilverbaar van ongeveer 10 kg gevonden. Dit bevestigt dat er nog waardevolle voorwerpen aanwezig zijn.",
    afbeelding: {
      src: "img/atocha.jpg",
      onderschrift: "Ter illustratie: de Galeón Andalucía, een replica van een Spaans galjoen",
      maker: "Cephas",
      licentie: "CC BY-SA 4.0",
      bron: "https://commons.wikimedia.org/wiki/File:Gale%C3%B3n_Andaluc%C3%ADa_Quebec_City_02.jpg"
    },
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
    schatting: {
      totaal: "ca. €60 mln",
      bodem: "ca. €20 mln",
      deel: 0.33,
      zekerheid: "laag",
      uitleg: "Volgens het vrachtregister: 166.574 zilveren munten, ruim 550 zilverbaren en ruim 9.000 ounce goud (ca. 280 kg), samen ca. €60 miljoen. Spaanse duikers haalden in 1626 al een groot deel van het zilver op, en sinds 1980 is voor ruim $16 miljoen geborgen. Ik schat dat er nog ongeveer een derde ligt.",
      bronnen: [
        ["Wikipedia: Santa Margarita", "https://en.wikipedia.org/wiki/Santa_Margarita_(shipwreck)"]
      ]
    },
    diepte: {
      meters: 8,
      kort: "ca. 8 m",
      tekst: "Spaanse duikers konden er in 1626 al bij met een duikklok.",
      bron: ["Diving Almanac: Santa Margarita", "https://divingalmanac.com/spanish-salvage-wreck-santa-margarita"]
    },
    noot: "Bij eerdere expedities zijn miljoenen dollars aan kostbaarheden geborgen. De zoektocht naar overige delen van de lading gaat door.",
    afbeelding: {
      src: "img/santa-margarita.jpg",
      onderschrift: "Ter illustratie: Spaanse galjoenen uit dezelfde tijd (Slag bij Cádiz, 1608)",
      maker: "Aert Anthoniszoon",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Aert_Anthoniszoon,_Slag_bij_Cadix_(The_Battle_of_Cadix,_1608).png"
    },
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
    schatting: {
      totaal: "ca. €4,5 mln",
      bodem: "minder dan €0,5 mln",
      deel: 0.1,
      zekerheid: "middel",
      uitleg: "Twaalf kisten zilveren munten ter waarde van 250.000 gulden, ongeveer 2,6 ton zilver. In 1629 werden tien kisten opgehaald, en bij latere opgravingen kwamen nog ruim 10.000 munten boven. Er ligt dus hooguit een klein deel. Als verzamelobject is een munt uit dit wrak wel veel meer waard dan het zilver.",
      bronnen: [
        ["World History Encyclopedia: Wreck of the Batavia", "https://www.worldhistory.org/article/2391/wreck-of-the-batavia/"]
      ]
    },
    diepte: {
      meters: 6,
      kort: "ca. 6 m",
      tekst: "Op het Morning Reef, bij de Houtman Abrolhos.",
      bron: ["World History Encyclopedia: Wreck of the Batavia", "https://www.worldhistory.org/article/2391/wreck-of-the-batavia/"]
    },
    noot: "Het wrak is uitgebreid archeologisch onderzocht en beschermd.",
    afbeelding: {
      src: "img/batavia.jpg",
      onderschrift: "De replica van de Batavia in Lelystad",
      maker: "Gouwenaar",
      licentie: "CC0",
      bron: "https://commons.wikimedia.org/wiki/File:20140612_Batavia_replica2_Lelystad.jpg"
    },
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
    schatting: {
      totaal: "ca. €1,4 mln",
      bodem: "ca. €1 mln",
      deel: 0.75,
      zekerheid: "laag",
      uitleg: "Acht kisten zilveren munten ter waarde van 78.600 gulden, ongeveer 0,8 ton zilver. In 1963 werden ca. 10.000 munten geborgen. Hoeveel er nog ligt is niet bekend; ik schat ongeveer driekwart van het zilver. Dit is de metaalwaarde; op de verzamelmarkt zijn deze munten meer waard.",
      bronnen: [
        ["Wikipedia: Vergulde Draeck", "https://en.wikipedia.org/wiki/Vergulde_Draeck"]
      ]
    },
    diepte: {
      meters: 8,
      kort: "2 tot 8 m",
      tekst: "In gaten en grotten in een rif, ruim 5 km uit de kust.",
      bron: ["Diving WA Wrecks: Vergulde Draeck", "https://www.divingwawrecks.com/verguldedraeck"]
    },
    noot: "Er zijn inmiddels meer dan 8.500 zilveren munten geborgen. Dat betekent niet dat de volledige oorspronkelijke lading is teruggevonden.",
    afbeelding: {
      src: "img/vergulde-draeck.jpg",
      onderschrift: "Tekening van hoe de Vergulde Draeck er vermoedelijk uitzag",
      maker: "Steve Caffery, Gilt Dragon Research Group",
      licentie: "CC BY-SA 4.0",
      bron: "https://commons.wikimedia.org/wiki/File:Gilt_Dragon_2.jpg",
      positie: "50% 70%"
    },
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
    schatting: {
      totaal: "ca. €4,2 mln",
      bodem: "ca. €4 mln",
      deel: 0.95,
      zekerheid: "middel",
      uitleg: "Ongeveer 248.000 gulden aan zilver, ca. 2,4 ton. Het WA Maritime Museum bewaart ca. 14.000 munten, vooral kleine schellingen. Dat is maar een paar procent van de lading. Het meeste ligt nog verspreid tussen de rotsen.",
      bronnen: [
        ["Sterling & Currency: The silver coins of the Zuytdorp", "https://sterlingcurrency.com.au/blog/news-research/commonwealth-coins/the-silver-coins-of-the-zuytdorp-shipwreck"]
      ]
    },
    diepte: {
      meters: 5,
      kort: "een paar meter",
      tekst: "In de branding onder de kliffen. Duiken kan er maar een paar dagen per jaar.",
      bron: ["WA Museum: Zuytdorp", "https://museum.wa.gov.au/maritime-archaeology-db/roaring-40s/Zuytdorp"]
    },
    noot: "Het wrak is bijzonder moeilijk bereikbaar. Er zijn nog archeologische resten aanwezig en de vindplaats is streng beschermd.",
    afbeelding: {
      src: "img/zuytdorp.jpg",
      onderschrift: "Ter illustratie: het VOC-retourschip Popkensburg van de Kamer Middelburg (1775)",
      maker: "Anonieme schilder, Het Scheepvaartmuseum",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Anoniem_(schilder)_-_Het_retourschip_Popkensburg_van_de_Kamer_Middelburg_van_de_VOC_-_A.1907_-_Het_Scheepvaartmuseum.jpg"
    },
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
    feiten: [["Oorspronkelijke waarde", "De bekende lading was meer dan 300.000 gulden waard."]],
    schatting: {
      totaal: "ca. €5 tot 10 mln",
      bodem: "ca. €1 mln",
      deel: 0.13,
      zekerheid: "laag",
      uitleg: "De officiële lading was 300.000 gulden aan zilver en goud, nu ca. €5 miljoen. De bemanning had daarnaast veel zilver voor illegale handel, misschien evenveel. In 2005 werden ongeveer duizend zilverbaren opgehaald, en in 2017 en 2018 is het wrak opgegraven. Ik schat dat er nog maar weinig ligt; exacte cijfers zijn niet gepubliceerd.",
      bronnen: [
        ["Wikipedia: Rooswijk", "https://en.wikipedia.org/wiki/Rooswijk"],
        ["Historic England: The discovery of the Rooswijk", "https://heritagecalling.com/2023/07/12/the-discovery-of-the-rooswijk-shipwreck/"]
      ]
    },
    diepte: {
      meters: 24,
      kort: "ca. 24 m",
      tekst: "Bij de Goodwin Sands, voor de kust van Kent.",
      bron: ["Wikipedia: Rooswijk", "https://en.wikipedia.org/wiki/Rooswijk"]
    },
    noot: "Archeologen hebben duizenden voorwerpen geborgen, waaronder zilver dat bemanningsleden vermoedelijk illegaal wilden verhandelen.",
    afbeelding: {
      src: "img/rooswijk.jpg",
      onderschrift: "Ter illustratie: een Oost-Indiëvaarder voor Hoorn (vóór 1686)",
      maker: "Lorenzo a Castro",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:A_Castro,_Lorenzo_-_A_Dutch_East-Indiaman_off_Hoorn_-_Google_Art_Project.jpg"
    },
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
    schatting: {
      totaal: "ca. €700 mln",
      bodem: "ca. €600 mln",
      deel: 0.9,
      zekerheid: "laag",
      uitleg: "De Lutine had £1 tot 1,2 miljoen (van 1799) aan goud en zilver aan boord. Hoeveel daarvan goud was, is niet bekend. Bij £1,2 miljoen is het nu €230 miljoen waard als alles zilver was, en €1 miljard als alles goud was. Ik reken met ongeveer 60% goud, dus ca. €700 miljoen. Tot nu toe is ongeveer een tiende geborgen. De bekende €90 tot 95 miljoen is het bedrag van 1799 omgerekend met inflatie, niet met de goudprijs van nu. De Rijksdienst voor het Cultureel Erfgoed schat dat er nog ca. €20 miljoen ligt.",
      bronnen: [
        ["Rijksdienst voor het Cultureel Erfgoed: HMS Lutine", "https://mass.cultureelerfgoed.nl/hms-lutine"],
        ["Metal Detecting UK: Lutine", "https://detecting.org.uk/html/Lutine_Shipwreck.html"],
        ["Grace's Guide: HMS Lutine", "https://gracesguide.co.uk/HMS_Lutine"]
      ]
    },
    diepte: {
      meters: 10,
      kort: "2 tot 14 m",
      tekst: "Hoe diep precies verschilt per jaar, en het wrak ligt onder een laag zand. De zandbanken schuiven steeds, daarom is het zo moeilijk te bergen.",
      bron: ["Wikipedia: HMS Lutine", "https://en.wikipedia.org/wiki/HMS_Lutine_(1779)"]
    },
    noot: "De Lutine ligt in een gebied met sterk bewegende zandbanken. De beroemde scheepsbel werd in de negentiende eeuw geborgen.",
    afbeelding: {
      src: "img/hms-lutine.jpg",
      onderschrift: "De Lutine waait in de nacht van 9 op 10 oktober 1799 op de kust van Terschelling",
      maker: "Onbekende maker",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:HMS_Lutine_being_blown_ashore_onto_Terschelling_where_she_was_wrecked_on_the_night_of_9-10_October_1799.jpg"
    },
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
    schatting: {
      totaal: "ca. €9 mln",
      bodem: "ca. €9 mln",
      deel: 1,
      zekerheid: "middel",
      uitleg: "Volgens de lading had het schip 2.576 ounce goud aan boord, 73 tot 80 kg. Tegen de goudprijs van nu is dat ca. €9 miljoen. Er is nooit iets van geborgen. Oudere claims van ‘$20 miljoen’ kwamen van iemand die bekendstond om fraude.",
      bronnen: [
        ["Wikipedia: General Grant", "https://en.wikipedia.org/wiki/General_Grant_(sailing_ship)"]
      ]
    },
    diepte: {
      meters: 20,
      kort: "ca. 20 m",
      tekst: "Waarschijnlijk in of onder een ingestorte grot aan de westkust van Auckland Island.",
      bron: ["Otago Daily Times: Searching for the wreck of the General Grant", "https://www.odt.co.nz/regions/wanaka/searching-wreck-%E2%80%98general-grant%E2%80%99"]
    },
    noot: "Er zijn tientallen zoekpogingen ondernomen, maar het wrak is nog steeds niet overtuigend gevonden.",
    afbeelding: {
      src: "img/general-grant.jpg",
      onderschrift: "Het wrak van de General Grant bij de Auckland Islands (Illustrated London News, 1868)",
      maker: "William Tibbits",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Nla.obj-136180447_(cropped).png"
    },
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
    feiten: [["Historische waarde", "Volgens het Smithsonian ongeveer $2,19 miljoen aan goud bij het zinken."]],
    schatting: {
      totaal: "ca. €400 mln",
      bodem: "ca. €100 mln",
      deel: 0.25,
      zekerheid: "laag",
      uitleg: "Het Smithsonian noemt $2,19 miljoen aan goud in 1857, ongeveer 3,3 ton, nu ca. €390 miljoen. Tel je het goud van passagiers mee, dan noemen sommige bronnen tot 9 ton (ca. €1 miljard). Volgens Live Science lag er in 2014 nog een zending van $93.000 en $250.000 tot $1,28 miljoen aan goud van passagiers (bedragen van 1857). Dat is nu €60 tot 240 miljoen; daarna is er nog wat geborgen.",
      bronnen: [
        ["Wikipedia: SS Central America", "https://en.wikipedia.org/wiki/SS_Central_America"],
        ["Live Science (2014)", "https://www.livescience.com/45366-gold-rush-shipwreck.html"]
      ]
    },
    diepte: {
      meters: 2200,
      kort: "ca. 2.200 m",
      tekst: "Het goud is met een onderwaterrobot opgehaald.",
      bron: ["Scientific American: gold recovered from shipwreck", "https://www.scientificamerican.com/article/27-kilograms-of-gold-treasure-recovered-from-shipwreck-off-coast-of-south-carolina/"]
    },
    noot: "Er zijn grote hoeveelheden goud geborgen, onder meer in 1988 en 2014. De volledige oorspronkelijke hoeveelheid is moeilijk te reconstrueren.",
    afbeelding: {
      src: "img/ss-central-america.jpg",
      onderschrift: "Het zinken van de Central America (1857)",
      maker: "J. Childs",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Wreck_of_the_Central_America.jpg"
    },
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
    feiten: [["Bijzonder", "Een aanzienlijk deel van het goud lag onder het sediment begraven."]],
    schatting: {
      totaal: "ca. €4,3 mrd",
      bodem: "ca. €30 mln",
      deel: 0.007,
      zekerheid: "hoog",
      uitleg: "3.211 goudbaren ter waarde van £5 miljoen (1917), ongeveer 36,6 ton puur goud. Dat is nu ca. €4,3 miljard. Er ontbreken nog ongeveer 22 baren, samen ca. 250 kg goud, nu ca. €30 miljoen.",
      bronnen: [
        ["Wikipedia: SS Laurentic", "https://en.wikipedia.org/wiki/SS_Laurentic_(1908)"]
      ]
    },
    diepte: {
      meters: 40,
      kort: "ca. 40 m",
      tekst: "Marineduikers haalden het goud er tussen 1917 en 1924 uit.",
      bron: ["Go Visit Inishowen: SS Laurentic", "https://www.govisitinishowen.com/ss-laurentic-lough-swilly-gold/"]
    },
    noot: "Dit is een van de weinige gevallen waarbij de hoeveelheid ontbrekend goud redelijk nauwkeurig uit bergingsverslagen kan worden afgeleid.",
    afbeelding: {
      src: "img/ss-laurentic.jpg",
      onderschrift: "De SS Laurentic, vóór 1917",
      maker: "Onbekende fotograaf",
      licentie: "Publiek domein",
      bron: "https://commons.wikimedia.org/wiki/File:Laurentic,_hq.jpg"
    },
    wrak: [55.32, -7.6],
    lijn: [[53.39, -3.03, "Birkenhead"], [53.6, -3.7], [54.4, -5.1], [55.25, -6.4], WRAK, [55.6, -15.0], [50.0, -40.0], [44.64, -63.57, "Canada (Halifax)"]]
  },
  {
    naam: "Edmund Fitzgerald",
    jaar: 1975,
    land: "Verenigde Staten",
    status: "eerbetoon",
    route: "Superior (Wisconsin) → Detroit (Zug Island), over het Bovenmeer, de St. Marysrivier en het Huronmeer.",
    locatie: "Bovenmeer (Lake Superior), ongeveer 27 km van Whitefish Bay, in Canadese wateren.",
    verhaal: "Op 9 november 1975 vertrok de ‘Mighty Fitz’, bij haar tewaterlating het grootste schip op de Grote Meren, uit Superior met 26.000 ton ijzererts. Samen met de Arthur M. Anderson voer kapitein Ernest McSorley een zware novemberstorm in, met orkaanstoten en golven tot 11 meter hoog. Op 10 november raakte de Fitzgerald beschadigd, ging ze scheef liggen en viel haar radar uit. De Anderson bleef achter haar en loodste haar per radio door de storm. Rond 19.10 uur meldde de Fitzgerald nog rustig: “We are holding our own.” Kort daarna verdween het schip van het radarscherm, zonder noodsignaal. Alle 29 mannen aan boord kwamen om. Terwijl andere schepen een veilige haven zochten, keerde de bemanning van de Anderson op verzoek van de kustwacht midden in de storm om om te zoeken. Er werd niemand gevonden.",
    buit: "26.000 ton ijzererts: taconietkorrels uit Minnesota, voor de staalfabrieken bij Detroit.",
    feiten: [
      ["Lengte", "222 meter. Bij de tewaterlating in 1958 het langste schip op de Grote Meren."],
      ["Kapitein", "Ernest M. McSorley, die na deze reis met pensioen zou gaan."],
      ["Bemanning", "29 mannen. Niemand overleefde het en niemand werd gevonden."],
      ["Laatste bericht", "“We are holding our own.” (10 november 1975, rond 19.10 uur)"],
      ["Het lied", "‘The Wreck of the Edmund Fitzgerald’ van Gordon Lightfoot (1976) maakte het verhaal over de hele wereld bekend."],
      ["De scheepsbel", "In 1995 opgehaald en vervangen door een kopie met de namen van de bemanning. De echte bel hangt in het Great Lakes Shipwreck Museum op Whitefish Point."]
    ],
    eerbetoon: {
      herdenking: "Elk jaar op 10 november luidt het Great Lakes Shipwreck Museum de scheepsbel 29 keer, één keer voor ieder bemanningslid, en nog één keer voor alle zeelieden die op de Grote Meren zijn gebleven."
    },
    schatting: {
      totaal: "26.000 ton",
      soort: "ijzererts (taconiet)",
      bodem: "alles",
      deel: 1,
      zekerheid: "hoog",
      uitleg: "De Fitzgerald had 26.116 ‘long tons’ taconiet aan boord: kleine korrels ijzererts. Dat is ongeveer 26.500 gewone ton. Er is niets van geborgen; de lading ligt nog in het wrak. In geld is dat weinig vergeleken met de schatschepen: met een ertsprijs van rond de €90 per ton ruwweg €2 à 3 miljoen. De waarde van dit wrak zit niet in de lading, maar in het verhaal.",
      bronnen: [
        ["Wikipedia: SS Edmund Fitzgerald", "https://en.wikipedia.org/wiki/SS_Edmund_Fitzgerald"],
        ["Great Lakes Shipwreck Museum", "https://www.shipwreckmuseum.com/"]
      ]
    },
    diepte: {
      meters: 162,
      kort: "ca. 162 m",
      tekst: "Het wrak ligt in twee grote stukken op de bodem van het Bovenmeer. Het is een zeemansgraf: duiken mag alleen met een vergunning van de Canadese provincie Ontario.",
      bron: ["Wikipedia: SS Edmund Fitzgerald", "https://en.wikipedia.org/wiki/SS_Edmund_Fitzgerald"]
    },
    noot: "Geen schatschip, maar een eerbetoon aan de 29 mannen van de Edmund Fitzgerald, het bekendste wrak van de Grote Meren. Het wrak is wettelijk beschermd en er wordt niets geborgen.",
    afbeelding: {
      src: "img/edmund-fitzgerald.jpg",
      onderschrift: "De Edmund Fitzgerald in 1971",
      maker: "Greenmars",
      licentie: "CC BY-SA 3.0",
      bron: "https://commons.wikimedia.org/wiki/File:Edmund_Fitzgerald,_1971,_3_of_4_(restored;_cropped).jpg",
      positie: "50% 60%"
    },
    wrak: [46.998, -85.11],
    lijn: [[46.72, -92.07, "Superior"], [46.9, -91.6], [47.6, -89.5], [48.0, -87.6], [47.8, -86.4], [47.4, -85.98], WRAK, [46.75, -84.85], [46.5, -84.35, "Sault Ste. Marie"], [45.95, -83.9], [45.3, -82.9], [44.0, -82.4], [43.2, -82.3], [42.97, -82.42], [42.45, -82.7], [42.29, -83.1, "Detroit"]]
  }
];
