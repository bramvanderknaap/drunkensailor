// ===================================================================
//  DE KAART
//  Dit bestand tekent de wereldbol (of de platte kaart), de scheepjes,
//  de routes en de panelen. De gegevens zelf staan in js/schepen.js.
//  De bol wordt getekend met MapLibre (gratis, geen sleutel nodig).
// ===================================================================

(function () {
  const STATUSSEN = window.STATUSSEN;
  const SCHEPEN = window.SCHEPEN.slice().sort((a, b) => a.jaar - b.jaar);
  SCHEPEN.forEach(s => { s.id = maakId(s.naam); });

  const actieveStatussen = new Set(Object.keys(STATUSSEN));
  let gekozen = null;
  const smal = window.matchMedia("(max-width: 899px)");

  // Een scheepje met drie masten, in de kleur van de tekst eromheen.
  const SCHIP_SVG = `<svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
    <path d="M2.5 21.5h27l-4 5.5H7z"/>
    <path d="M27.5 21.5 31 16.5l.6.4-3.2 4.6z"/>
    <rect x="9.3" y="6" width="1.1" height="15.5"/><rect x="15.5" y="3" width="1.1" height="18.5"/><rect x="21.6" y="6" width="1.1" height="15.5"/>
    <path d="M6.5 8.2q3.4-1 6.8 0l-.4 4.6q-3-.9-6 0zM6 14q3.9-1.1 7.8 0l-.5 5.4q-3.4-1-6.8 0z"/>
    <path d="M12.3 5q3.8-1.1 7.6 0l-.4 5q-3.4-1-6.8 0zM11.7 11.3q4.4-1.2 8.8 0l-.5 6.6q-3.9-1.1-7.8 0z"/>
    <path d="M18.8 8.2q3.3-1 6.6 0l-.4 4.6q-2.9-.9-5.8 0zM18.4 14q3.7-1.1 7.4 0l-.5 5.4q-3.2-1-6.4 0z"/>
    <path d="M16.6 3h3.2l-.8.9.8.9h-3.2z"/>
  </svg>`;

  // ---------- weergave: wereldbol of platte kaart ----------
  // De keuze wordt onthouden in de browser (als dat mag).
  let weergave = "globe";
  try { if (localStorage.getItem("schatschepen-weergave") === "mercator") weergave = "mercator"; } catch (e) {}
  document.body.dataset.weergave = weergave;

  // De panelen beginnen net onder de bovenbalk; hoe hoog die is, hangt
  // af van de schermbreedte.
  const balk = document.querySelector(".balk");
  const meetBalk = () => {
    document.querySelector(".scherm").style.setProperty("--balk", balk.offsetHeight + "px");
  };
  meetBalk();

  // ---------- kaart en ondergrond ----------
  const leeg = { type: "FeatureCollection", features: [] };
  const lijn = (coords, eigenschappen = {}) => ({ type: "Feature", properties: eigenschappen, geometry: { type: "LineString", coordinates: coords } });

  // Rasterlijnen om de 30 graden (met tussenpunten, zodat ze op de bol
  // netjes meebuigen).
  const raster = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const c = []; for (let lat = -85; lat <= 85; lat += 5) c.push([lon, lat]);
    raster.push(lijn(c));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const c = []; for (let lon = -180; lon <= 180; lon += 5) c.push([lon, lat]);
    raster.push(lijn(c, { evenaar: lat === 0 }));
  }

  // Het land klaarmaken voor de bol. Antarctica is in het bestand in twee
  // open stukken geknipt; die plakken we weer aan elkaar. En de kustlijn
  // tekenen we zonder de kunstmatige naden op de datumgrens en de zuidpool.
  const landVlakken = [], kustLijnen = [];
  const naad = (a, b) => (Math.abs(a[0]) === 180 && Math.abs(b[0]) === 180) || (a[1] <= -84.9 && b[1] <= -84.9);
  window.LAND.features.forEach(f => {
    const g = f.geometry;
    (g.type === "Polygon" ? [g.coordinates] : g.coordinates).forEach(vlak => {
      const eerste = vlak[0], laatste = eerste[eerste.length - 1];
      if (eerste[0][0] !== laatste[0] || eerste[0][1] !== laatste[1]) {
        const ring = [].concat(...vlak);
        ring.push(ring[0]);
        vlak = [ring];
      }
      landVlakken.push(vlak);
      vlak.forEach(ring => {
        let stuk = [ring[0]];
        for (let i = 1; i < ring.length; i++) {
          if (naad(ring[i - 1], ring[i])) { if (stuk.length > 1) kustLijnen.push(stuk); stuk = [ring[i]]; }
          else stuk.push(ring[i]);
        }
        if (stuk.length > 1) kustLijnen.push(stuk);
      });
    });
  });
  const LAND = { type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: landVlakken } };
  const KUST = { type: "Feature", properties: {}, geometry: { type: "MultiLineString", coordinates: kustLijnen } };

  const WATER_KLEUR = "#134443";
  const kaart = new maplibregl.Map({
    container: "kaart",
    style: {
      version: 8,
      projection: { type: weergave },
      sky: {
        "sky-color": "#0b3236",
        "horizon-color": "#2c7a73",
        "fog-color": "#0b3236",
        "sky-horizon-blend": 0.6,
        "horizon-fog-blend": 0.5,
        "fog-ground-blend": 0.8,
        "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 4, 0.7, 7, 0]
      },
      sources: {
        land: { type: "geojson", data: LAND },
        kust: { type: "geojson", data: KUST },
        raster: { type: "geojson", data: { type: "FeatureCollection", features: raster } },
        achter: { type: "geojson", data: leeg },
        gevaren: { type: "geojson", data: leeg },
        gepland: { type: "geojson", data: leeg }
      },
      layers: [
        { id: "zee", type: "background", paint: { "background-color": WATER_KLEUR, "background-opacity": weergave === "globe" ? 1 : 0 } },
        { id: "raster", type: "line", source: "raster", paint: {
          "line-color": "rgba(170, 235, 220, 1)",
          "line-opacity": ["case", ["==", ["get", "evenaar"], true], 0.14, 0.07], "line-width": 1 } },
        { id: "kust-gloed", type: "line", source: "kust", paint: { "line-color": "#6edcc8", "line-width": 5, "line-blur": 4, "line-opacity": 0.3 } },
        { id: "land", type: "fill", source: "land", paint: { "fill-color": "#0c2d2c", "fill-antialias": true } },
        { id: "kust", type: "line", source: "kust", paint: { "line-color": "#4f9f8f", "line-width": 0.8, "line-opacity": 0.8 } },
        { id: "achter", type: "line", source: "achter", layout: { "line-cap": "round" },
          paint: { "line-color": "#f4c24f", "line-width": 2, "line-dasharray": [0, 4], "line-opacity": 0.32 } },
        { id: "gepland", type: "line", source: "gepland", layout: { "line-cap": "round" },
          paint: { "line-color": "#e8f2ee", "line-width": 2.5, "line-dasharray": [0, 3.4], "line-opacity": 0.5 } },
        { id: "gevaren-gloed", type: "line", source: "gevaren", paint: { "line-color": "#f4c24f", "line-width": 7, "line-blur": 6, "line-opacity": 0.28 } },
        { id: "gevaren", type: "line", source: "gevaren", layout: { "line-cap": "round" },
          paint: { "line-color": "#f4c24f", "line-width": 3, "line-dasharray": [0, 3] } }
      ]
    },
    center: [10, 18],
    zoom: beginZoom(),
    minZoom: 0,
    maxZoom: 8,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: { compact: true, customAttribution: "Kustlijnen: Natural Earth" },
    maplibreLogo: false
  });
  kaart.touchZoomRotate.disableRotation();
  kaart.keyboard.disableRotation();

  // Hoe ver ingezoomd we beginnen: de hele bol in beeld.
  function beginZoom() {
    const klein = Math.min(window.innerWidth, window.innerHeight) < 700;
    if (weergave === "mercator") return klein ? 0 : 1.5;
    return klein ? 0.9 : 1.9;
  }

  // ---------- namen van zeeën en oceanen ----------
  // [naam, breedtegraad, lengtegraad, soort, draaiing in graden]
  // soort: oceaan (altijd te zien), zee (vanaf zoom 3), klein (vanaf zoom 5).
  const ZEEEN = [
    ["Atlantische Oceaan", 31, -44, "oceaan"], ["Atlantische Oceaan", -20, -18, "oceaan"],
    ["Stille Oceaan", 15, -145, "oceaan"], ["Stille Oceaan", -32, -115, "oceaan"], ["Stille Oceaan", 22, 165, "oceaan"],
    ["Indische Oceaan", -22, 78, "oceaan"],
    ["Noordelijke IJszee", 84, 60, "oceaan"],
    ["Zuidelijke Oceaan", -56, 20, "oceaan"], ["Zuidelijke Oceaan", -58, -120, "oceaan"], ["Zuidelijke Oceaan", -56, 140, "oceaan"],

    ["Noordzee", 56, 3.5, "zee"], ["Oostzee", 56.2, 19.2, "zee"], ["Noorse Zee", 68, 2, "zee"],
    ["Barentszzee", 74, 40, "zee"], ["Middellandse Zee", 34.5, 18, "zee"], ["Zwarte Zee", 43.3, 34, "zee"],
    ["Rode Zee", 20.5, 38.4, "zee", 58], ["Arabische Zee", 15, 64, "zee"], ["Golf van\nBengalen", 15.5, 88.5, "zee"],
    ["Zuid-Chinese\nZee", 12, 113.5, "zee"], ["Oost-Chinese\nZee", 29, 126.5, "zee"], ["Japanse Zee", 41, 133.5, "zee"],
    ["Filipijnenzee", 18, 132, "zee"], ["Javazee", -5, 111, "zee"], ["Koraalzee", -17, 155, "zee"],
    ["Tasmanzee", -38, 160, "zee"], ["Beringzee", 57, -178, "zee"], ["Golf van Alaska", 56, -145, "zee"],
    ["Hudsonbaai", 60, -85, "zee"], ["Labradorzee", 58, -54, "zee"], ["Golf van\nMexico", 25.5, -90, "zee"],
    ["Caribische Zee", 15.2, -72, "zee"], ["Golf van\nBiskaje", 45.3, -5, "zee"], ["Golf van Guinee", 2, 3, "zee"],

    ["Het Kanaal", 50.15, -2, "klein", -12], ["Keltische Zee", 51, -8.6, "klein"], ["Ierse Zee", 53.75, -4.9, "klein"],
    ["Perzische Golf", 27, 51.5, "klein", 32], ["Straat Malakka", 2.8, 100.8, "klein", 40],
    ["Kanaal van\nMozambique", -18.5, 41.2, "klein"]
  ];
  ZEEEN.forEach(([naam, lat, lon, soort, draai = 0]) => {
    const el = document.createElement("div");
    el.className = "zeenaam " + soort;
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<span style="--draai:${draai}deg">${naam.split("\n").map(esc).join("<br>")}</span>`;
    new maplibregl.Marker({ element: el, opacityWhenCovered: 0 }).setLngLat([lon, lat]).addTo(kaart);
  });
  // Welke namen te zien zijn hangt af van hoe ver je bent ingezoomd.
  // (Dezelfde stappen als op de oude kaart: zoom 1 is de hele wereld.)
  function zetNamen() {
    const z = String(Math.max(1, Math.floor(kaart.getZoom() + 1)));
    const c = kaart.getContainer();
    if (c.dataset.zoom !== z) c.dataset.zoom = z;
  }
  kaart.on("zoom", zetNamen);
  zetNamen();

  // ---------- routes ----------
  // Elke route splitsen we in het stuk dat gevaren is (tot het wrak)
  // en het stuk dat het schip nooit heeft gevaren.
  // Let op: de kaart wil [lengtegraad, breedtegraad], schepen.js gebruikt
  // [breedtegraad, lengtegraad]; daarom draaien we ze hier om.
  function splitsRoute(s) {
    const gevaren = [], gepland = [], havens = [];
    const wrak = [s.wrak[1], s.wrak[0]];
    let voorbijWrak = false;
    s.lijn.forEach(p => {
      if (p === "WRAK") { gevaren.push(wrak); gepland.push(wrak); voorbijWrak = true; return; }
      (voorbijWrak ? gepland : gevaren).push([p[1], p[0]]);
      if (p[2]) havens.push(p);
    });
    return { gevaren, gepland, havens };
  }

  function zetBron(id, data) {
    const bron = kaart.getSource(id);
    if (bron) bron.setData(data);
  }

  // ---------- scheepjes ----------
  const markers = {};
  SCHEPEN.forEach(s => {
    const st = STATUSSEN[s.status];
    const el = document.createElement("button");
    el.type = "button";
    el.className = "schip-icoon";
    el.setAttribute("aria-label", `${s.naam} (${s.jaar})`);
    el.style.setProperty("--kleur", st.kleur);
    el.style.setProperty("--gloed", st.gloed);
    el.innerHTML = `${SCHIP_SVG}<span class="schip-tip">${esc(s.naam)} · ${s.jaar}</span>`;
    el.addEventListener("click", e => { e.stopPropagation(); kies(s.id); });
    markers[s.id] = new maplibregl.Marker({ element: el, offset: [0, -8], opacityWhenCovered: 0 }).setLngLat([s.wrak[1], s.wrak[0]]);
  });

  // ---------- havens van de gekozen route ----------
  let havenMarkers = [];

  // ---------- filters (bovenbalk) ----------
  const filters = document.getElementById("filters");
  Object.entries(STATUSSEN).forEach(([sleutel, st]) => {
    const aantal = SCHEPEN.filter(s => s.status === sleutel).length;
    if (!aantal) return;
    const knop = document.createElement("button");
    knop.className = "bron";
    knop.type = "button";
    knop.id = "filter-" + sleutel;
    knop.title = st.naam;
    knop.style.setProperty("--kleur", st.kleur);
    knop.setAttribute("aria-pressed", "true");
    knop.innerHTML = `${SCHIP_SVG}<span class="getal">${aantal}</span><span class="naam">${esc(st.kort)}</span>`;
    knop.addEventListener("click", () => {
      if (actieveStatussen.has(sleutel)) actieveStatussen.delete(sleutel);
      else actieveStatussen.add(sleutel);
      knop.setAttribute("aria-pressed", String(actieveStatussen.has(sleutel)));
      teken();
    });
    filters.appendChild(knop);
  });

  function zichtbaar() {
    return SCHEPEN.filter(s => actieveStatussen.has(s.status) || (gekozen && gekozen.id === s.id));
  }

  // ---------- alles opnieuw tekenen ----------
  function teken() {
    const lijst = zichtbaar();
    SCHEPEN.forEach(s => {
      const m = markers[s.id];
      const tonen = lijst.includes(s);
      if (tonen && !m._map) m.addTo(kaart);
      if (!tonen && m._map) m.remove();
      const el = m.getElement();
      el.classList.toggle("gekozen", !!gekozen && gekozen.id === s.id);
      el.style.zIndex = gekozen && gekozen.id === s.id ? 3 : "";
    });
    zetBron("achter", { type: "FeatureCollection", features: lijst.map(s => lijn(splitsRoute(s).gevaren)) });
    document.getElementById("teller").textContent = lijst.length;
    tekenVloot(lijst);
  }

  // ---------- de vloot (lijst) ----------
  const vloot = document.getElementById("vloot");
  function tekenVloot(lijst) {
    document.getElementById("vloot-aantal").textContent = lijst.length;
    vloot.innerHTML = lijst.length ? lijst.map(s => `
      <li><button class="vloot-knop" type="button" data-id="${s.id}" aria-current="${!!gekozen && gekozen.id === s.id}" style="--kleur:${STATUSSEN[s.status].kleur}">
        ${SCHIP_SVG}<span>${esc(s.naam)}</span><span class="jaar">${s.jaar}</span>
      </button></li>`).join("")
      : `<li class="leeg">Geen schepen met deze status.</li>`;
    vloot.querySelectorAll(".vloot-knop").forEach(k => k.addEventListener("click", () => kies(k.dataset.id)));
  }

  // ---------- details ----------
  const details = document.getElementById("details");
  const blad = document.getElementById("blad");

  // Dieptemeter: van het wateroppervlak tot 3 km diep. De schaal is
  // logaritmisch (1, 10, 100, 1000 m staan even ver uit elkaar), anders
  // zouden alle ondiepe wrakken bovenaan op een hoopje liggen.
  const DIEPST = 3000;
  const hoogte = m => (100 * Math.log10(Math.max(m, 1)) / Math.log10(DIEPST)).toFixed(1);
  // De kleur van het water, van het oppervlak (0%) tot 3 km diep (100%).
  // De dieptemeter en de balk boven de diepte gebruiken allebei deze kleuren.
  const WATER = [[0, [95, 194, 179]], [25, [31, 100, 97]], [65, [14, 52, 53]], [100, [3, 16, 18]]];
  const rgb = c => `rgb(${c.map(Math.round).join(",")})`;
  function waterKleur(p) {
    for (let i = 1; i < WATER.length; i++) {
      const [p0, c0] = WATER[i - 1], [p1, c1] = WATER[i];
      if (p <= p1) return c0.map((v, k) => v + (c1[k] - v) * (p - p0) / (p1 - p0));
    }
    return WATER[WATER.length - 1][1];
  }
  const waterVerloop = richting => `linear-gradient(${richting}, ${WATER.map(([p, c]) => `${rgb(c)} ${p}%`).join(", ")})`;
  // De balk boven de diepte krijgt de kleur van het water bij het wrak:
  // licht bij ondiepe wrakken, bijna zwart bij de diepste.
  function diepteBalk(m) {
    if (m == null) return `<div class="balkje water onbekend" style="background:${waterVerloop("90deg")}"></div>`;
    const kleur = rgb(waterKleur(+hoogte(m)));
    return `<div class="balkje water" style="background:${kleur};--gloed:${kleur}"></div>`;
  }
  function dieptemeter(m) {
    const streepjes = [[1, "oppervlak"], [10, "10 m"], [100, "100 m"], [1000, "1 km"]];
    return `<div class="meter" aria-hidden="true">
      <span class="water" style="background:${waterVerloop("180deg")}"></span>
      ${streepjes.map(([d, t]) => `<span class="streep" style="top:${hoogte(d)}%">${t}</span>`).join("")}
      <span class="duikers" style="top:${hoogte(40)}%">duikers</span>
      ${m == null ? `<span class="wrak onbekend" style="top:50%">?</span>`
                  : `<span class="wrak" style="top:${hoogte(m)}%">${SCHIP_SVG}</span>`}
    </div>`;
  }
  function toonDetails(s) {
    const st = STATUSSEN[s.status];
    const feiten = [["Route", s.route], ["Locatie", s.locatie], ...s.feiten,
      ["Positie op de kaart (bij benadering)", `${graden(s.wrak[0], "NB", "ZB")}, ${graden(s.wrak[1], "OL", "WL")}`]];
    const a = s.afbeelding;
    const sch = s.schatting;
    const niveau = ["zeer laag", "laag", "middel", "hoog"].indexOf(sch.zekerheid) + 1;
    const procent = sch.deel >= 0.995 ? "vrijwel de hele buit"
      : sch.deel < 0.01 ? "minder dan 1% van de buit"
      : `ca. ${Math.max(5, Math.round(sch.deel * 20) * 5)}% van de buit`;
    const lijst = zichtbaar();
    const plek = lijst.indexOf(s) + 1;
    details.innerHTML = `
      <div class="details-kop vak">
        <button class="terug" type="button" data-actie="sluit">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>de vloot</span>
        </button>
        <span class="plek" aria-label="Schip ${plek} van ${lijst.length}">${plek} van ${lijst.length}</span>
        <div class="stappen">
          <button type="button" data-stap="-1" aria-label="Vorig schip" title="Vorig schip (↑)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>
          <button type="button" data-stap="1" aria-label="Volgend schip" title="Volgend schip (↓)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <button type="button" class="sluit-x" data-actie="sluit" aria-label="Details sluiten" title="Sluiten (Esc)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        </div>
      </div>
      ${a ? `<figure class="vak afbeelding">
        <img src="${esc(a.src)}" alt="${esc(a.onderschrift)}"${a.positie ? ` style="object-position:${esc(a.positie)}"` : ""}>
        <figcaption>${esc(a.onderschrift)}<br>${esc(a.maker)} · ${esc(a.licentie)} · <a href="${esc(a.bron)}" target="_blank" rel="noopener">bron</a></figcaption>
      </figure>` : ""}
      <div class="vak">
        <h2>${esc(s.naam)}</h2>
        <p class="meta">${s.jaar} · ${esc(s.land)}</p>
        <div class="status" style="--kleur:${st.kleur}">${SCHIP_SVG}<span>${esc(st.naam)}</span></div>
        <p class="verhaal">${esc(s.verhaal)}</p>
      </div>
      <div class="duo">
        <div class="vak"><span class="label">buit</span><div class="balkje"></div>
          <span class="bedrag">${esc(sch.totaal)}</span><span class="klein">hele lading, in geld van nu</span>
          <span class="groot">${esc(s.buit)}</span></div>
        <div class="vak"><span class="label">waarde nog op de bodem</span>
          <div class="balkje spoor" title="${procent}"><div class="balkje goud" style="width:${(100 * sch.deel).toFixed(1)}%"></div></div>
          <span class="bedrag">${esc(sch.bodem)}</span><span class="klein">beste schatting · ${procent}</span>
          <span class="zekerheid" title="Hoe zeker is deze schatting?">zekerheid: ${esc(sch.zekerheid)}
            <span class="stipjes" aria-hidden="true">${[1, 2, 3, 4].map(i => `<i${i <= niveau ? ' class="aan"' : ""}></i>`).join("")}</span></span></div>
      </div>
      <div class="vak geschat">
        <p class="label">hoe is dit geschat?</p>
        <p>${esc(sch.uitleg)}</p>
        <p class="klein">Gerekend met goud ${esc(PRIJZEN.goud)} en zilver ${esc(PRIJZEN.zilver)} (${esc(PRIJZEN.datum)}). Dat is de waarde van het metaal; munten en voorwerpen zijn voor verzamelaars vaak meer waard.</p>
        <p class="bronnen">${sch.bronnen.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")}</p>
      </div>
      <div class="vak diepte">
        <div class="diepte-tekst">
          <span class="label">diepte</span>${diepteBalk(s.diepte.meters)}
          <span class="bedrag">${esc(s.diepte.kort)}</span>
          <p>${esc(s.diepte.tekst)}</p>
          <p class="bronnen"><a href="${esc(s.diepte.bron[1])}" target="_blank" rel="noopener">${esc(s.diepte.bron[0])}</a></p>
        </div>
        ${dieptemeter(s.diepte.meters)}
      </div>
      <dl class="vak feiten">
        ${feiten.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
      </dl>
      <p class="vak noot">${esc(s.noot)}</p>
      <button class="sluit" type="button" data-actie="sluit"><span class="toets">Esc</span> verberg details</button>`;
    const img = details.querySelector("img");
    if (img) img.addEventListener("error", () => img.closest("figure").remove());
    details.querySelectorAll('[data-actie="sluit"]').forEach(k => k.addEventListener("click", () => kies(null)));
    details.querySelectorAll("[data-stap]").forEach(k => k.addEventListener("click", () => stap(+k.dataset.stap)));
    openDetails();
    details.scrollTop = 0;
  }

  // De details schuiven van rechts in beeld en ook weer naar rechts weg
  // (op een telefoon wisselen ze binnen het blad met de vloot).
  let sluitTimer = null;
  function openDetails() {
    clearTimeout(sluitTimer);
    details.hidden = false;
    blad.classList.add("toont-details");
    requestAnimationFrame(() => details.classList.add("open"));
  }
  function sluitDetails() {
    details.classList.remove("open");
    blad.classList.remove("toont-details");
    clearTimeout(sluitTimer);
    sluitTimer = setTimeout(() => { if (!gekozen) details.hidden = true; }, beweging() ? 420 : 0);
  }

  // ---------- een schip kiezen ----------
  function kies(id) {
    const vorige = gekozen;
    gekozen = SCHEPEN.find(s => s.id === id) || null;
    teken();
    havenMarkers.forEach(m => m.remove());
    havenMarkers = [];
    document.getElementById("hint-plek").textContent = gekozen ? gekozen.naam.toLowerCase() : plekNaam();
    if (!gekozen) {
      zetBron("gevaren", leeg);
      zetBron("gepland", leeg);
      sluitDetails();
      zetAdres("");
      if (vorige) vloot.querySelector(`[data-id="${vorige.id}"]`)?.focus({ preventScroll: true });
      return;
    }
    const s = gekozen;
    const { gevaren, gepland, havens } = splitsRoute(s);
    zetBron("gevaren", lijn(gevaren));
    zetBron("gepland", gepland.length > 1 ? lijn(gepland) : leeg);
    havens.forEach(p => {
      const el = document.createElement("div");
      el.className = "haven";
      el.innerHTML = `<i></i><span>${esc(p[2])}</span>`;
      havenMarkers.push(new maplibregl.Marker({ element: el, anchor: "left", offset: [-5, 0], opacityWhenCovered: 0 }).setLngLat([p[1], p[0]]).addTo(kaart));
    });

    toonDetails(s);
    if (smal.matches && bladStand === "dicht") naarStand("half");
    // De zoom blijft gelijk; de kaart draait of schuift alleen zodat het
    // wrak midden in het vrije stuk tussen de panelen staat.
    kaart.easeTo({ center: [s.wrak[1], s.wrak[0]], padding: vrijeRuimte(), duration: beweging() ? 900 : 0 });
    zetAdres(s.id);
  }

  // Het stuk kaart dat niet achter een paneel zit. De kaart (of de bol)
  // zet zijn middelpunt in het midden van dat vrije stuk.
  function vrijeRuimte(metDetails = !!gekozen) {
    const boven = balk.offsetHeight;
    if (smal.matches) {
      const hoog = kaart.getContainer().clientHeight;
      const st = standen();
      return { top: boven, left: 0, right: 0, bottom: Math.max(0, hoog - bladTop() - (metDetails ? st.half : st.dicht)) };
    }
    return { top: boven, left: 316, right: metDetails ? 470 : 0, bottom: 0 };
  }

  function stap(richting) {
    const lijst = zichtbaar();
    if (!lijst.length) return;
    const i = gekozen ? lijst.indexOf(gekozen) : -1;
    const volgende = richting > 0 ? (i + 1) % lijst.length : (i - 1 + lijst.length) % lijst.length;
    kies(lijst[volgende].id);
    return lijst[volgende];
  }

  // Toetsen: pijltjes bladeren door de vloot, Esc sluit de details.
  document.addEventListener("keydown", e => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    if (e.key === "Escape" && gekozen) { kies(null); return; }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (e.target.closest && e.target.closest(".maplibregl-canvas-container, .maplibregl-canvas")) return;
    e.preventDefault();
    const s = stap(e.key === "ArrowDown" ? 1 : -1);
    if (s && e.target.closest && e.target.closest(".vloot")) vloot.querySelector(`[data-id="${s.id}"]`)?.focus();
  });

  // ---------- bediening: weergave en zoom ----------
  const weergaveKnoppen = document.querySelectorAll(".weergave button");
  function plekNaam() { return weergave === "globe" ? "wereldbol" : "zeekaart"; }
  function zetWeergaveKnoppen() {
    weergaveKnoppen.forEach(k => k.setAttribute("aria-checked", String(k.dataset.weergave === weergave)));
    if (!gekozen) document.getElementById("hint-plek").textContent = plekNaam();
  }
  // Wisselen tussen bol en kaart is een grote sprong; daarom vervaagt de
  // kaart heel even en komt hij in de nieuwe vorm weer terug.
  function wisselWeergave(nieuw) {
    if (nieuw === weergave) return;
    weergave = nieuw;
    try { localStorage.setItem("schatschepen-weergave", nieuw); } catch (e) {}
    zetWeergaveKnoppen();
    const canvas = kaart.getCanvasContainer();
    const doe = () => {
      kaart.setProjection({ type: nieuw });
      kaart.setPaintProperty("zee", "background-opacity", nieuw === "globe" ? 1 : 0);
      document.body.dataset.weergave = nieuw;
      canvas.classList.remove("wissel");
    };
    if (!beweging()) return doe();
    canvas.classList.add("wissel");
    setTimeout(doe, 160);
  }
  weergaveKnoppen.forEach(k => {
    k.addEventListener("click", () => wisselWeergave(k.dataset.weergave));
    k.addEventListener("keydown", e => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      const ander = [...weergaveKnoppen].find(x => x !== k);
      ander.focus(); wisselWeergave(ander.dataset.weergave);
    });
  });
  zetWeergaveKnoppen();
  const zoomDuur = () => (beweging() ? 300 : 0);
  document.getElementById("zoom-in").addEventListener("click", () => kaart.zoomIn({ duration: zoomDuur() }));
  document.getElementById("zoom-uit").addEventListener("click", () => kaart.zoomOut({ duration: zoomDuur() }));
  document.getElementById("heel").addEventListener("click", () => {
    kaart.easeTo({ center: gekozen ? [gekozen.wrak[1], gekozen.wrak[0]] : [10, 18], zoom: beginZoom(), padding: vrijeRuimte(), duration: beweging() ? 900 : 0 });
  });

  // ===================================================================
  //  HET BLAD (alleen op een telefoon)
  //  De vloot en de details zitten in een blad onderin dat je met je
  //  vinger omhoog en omlaag trekt. Het volgt je vinger precies, neemt je
  //  snelheid mee als je loslaat en veert naar de dichtstbijzijnde stand.
  // ===================================================================
  let bladStand = "dicht";
  let bladPos = 0;           // hoe ver het blad naar beneden is geschoven (px)
  let animatie = null;
  const greep = document.getElementById("greep");

  function bladTop() { return blad.offsetTop; }
  function bladHoogte() { return blad.offsetHeight; }
  // Drie standen: dicht (alleen de kop is te zien), half en open.
  function standen() {
    const h = bladHoogte();
    return { open: 0, half: Math.round(h * 0.45), dicht: Math.max(0, h - 104) };
  }
  function zetBlad(y) {
    bladPos = y;
    blad.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  }
  // Het blad houdt een klein beetje tegen als je verder trekt dan kan.
  function rubberband(over, maat, c = 0.55) {
    return (over * maat * c) / (maat + c * Math.abs(over));
  }
  // Hoe ver een veeg nog doorschiet (zoals bij het scrollen op een iPhone).
  function projecteer(snelheid, rem = 0.998) {
    return (snelheid / 1000) * rem / (1 - rem);
  }
  // Een veer: 'response' is hoe snel hij er is (in seconden), 'demping'
  // 1 = zonder doorschieten, lager = een beetje na-veren.
  function veer(doel, snelheid, { response = 0.3, demping = 1 } = {}) {
    cancelAnimationFrame(animatie);
    if (!beweging()) { zetBlad(doel); klaar(); return; }
    const k = Math.pow(2 * Math.PI / response, 2);
    const c = 4 * Math.PI * demping / response;
    let x = bladPos, v = snelheid, vorige = performance.now();
    const tik = nu => {
      let dt = Math.min(0.064, (nu - vorige) / 1000);
      vorige = nu;
      while (dt > 0) {
        const h = Math.min(dt, 1 / 240);
        v += (-k * (x - doel) - c * v) * h;
        x += v * h;
        dt -= h;
      }
      if (Math.abs(x - doel) < 0.3 && Math.abs(v) < 8) { zetBlad(doel); klaar(); return; }
      zetBlad(x);
      animatie = requestAnimationFrame(tik);
    };
    animatie = requestAnimationFrame(tik);
  }
  // Als het blad stilstaat: de inhoud mag tot onderaan scrollen.
  function klaar() {
    animatie = null;
    blad.style.setProperty("--onder", bladPos + "px");
  }
  function naarStand(stand, snelheid = 0, demping = 1) {
    bladStand = stand;
    blad.dataset.stand = stand;
    greep.setAttribute("aria-valuenow", stand);
    veer(standen()[stand], snelheid, { response: 0.3, demping });
  }

  // Slepen aan de greep of de kop van het blad.
  let sleep = null;
  blad.addEventListener("pointerdown", e => {
    if (!smal.matches || e.button > 0) return;
    if (!e.target.closest(".greep, .kopje, .details-kop")) return;
    cancelAnimationFrame(animatie); animatie = null;   // pak het blad vast waar het nu is
    sleep = { id: e.pointerId, startY: e.clientY, startPos: bladPos, bezig: false, spoor: [[e.timeStamp, e.clientY]] };
  });
  blad.addEventListener("pointermove", e => {
    if (!sleep || e.pointerId !== sleep.id) return;
    const dy = e.clientY - sleep.startY;
    if (!sleep.bezig) {
      if (Math.abs(dy) < 8) return;
      sleep.bezig = true;
      sleep.startY += Math.sign(dy) * 8;
      blad.setPointerCapture(e.pointerId);
      blad.classList.add("sleept");
    }
    const { open, dicht } = standen();
    let y = sleep.startPos + (e.clientY - sleep.startY);
    if (y < open) y = open - rubberband(open - y, bladHoogte());
    if (y > dicht) y = dicht + rubberband(y - dicht, bladHoogte());
    zetBlad(y);
    sleep.spoor.push([e.timeStamp, e.clientY]);
    while (sleep.spoor.length > 2 && e.timeStamp - sleep.spoor[0][0] > 100) sleep.spoor.shift();
  });
  function laatLos(e) {
    if (!sleep || e.pointerId !== sleep.id) return;
    const s = sleep; sleep = null;
    blad.classList.remove("sleept");
    if (!s.bezig) {
      // Een tik op de greep: open of dicht.
      if (e.type === "pointerup" && e.target.closest(".greep, .kopje")) naarStand(bladStand === "dicht" ? "half" : "dicht");
      return;
    }
    // Na het slepen geen klik doorgeven aan een knop in de kop.
    blad.classList.add("net-gesleept");
    setTimeout(() => blad.classList.remove("net-gesleept"), 0);
    const [t0, y0] = s.spoor[0];
    const dt = (e.timeStamp - t0) / 1000;
    const snelheid = dt > 0 ? (e.clientY - y0) / dt : 0;
    const doelPunt = bladPos + projecteer(snelheid);
    const st = standen();
    const stand = Object.keys(st).reduce((a, b) => Math.abs(st[b] - doelPunt) < Math.abs(st[a] - doelPunt) ? b : a);
    naarStand(stand, snelheid, Math.abs(snelheid) > 300 ? 0.8 : 1);
  }
  blad.addEventListener("pointerup", laatLos);
  blad.addEventListener("pointercancel", laatLos);
  blad.addEventListener("click", e => { if (blad.classList.contains("net-gesleept")) e.stopPropagation(); }, true);

  greep.setAttribute("role", "button");
  greep.setAttribute("tabindex", "0");
  greep.setAttribute("aria-label", "Blad groter of kleiner maken");
  greep.removeAttribute("aria-hidden");
  greep.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    naarStand(bladStand === "dicht" ? "half" : bladStand === "half" ? "open" : "dicht");
  });

  function zetIndeling() {
    cancelAnimationFrame(animatie);
    if (smal.matches) {
      zetBlad(standen()[bladStand]);
      klaar();
      blad.dataset.stand = bladStand;
    } else {
      blad.style.transform = "";
      blad.style.removeProperty("--onder");
    }
  }
  smal.addEventListener("change", zetIndeling);
  window.addEventListener("resize", () => { if (smal.matches && !animatie) zetIndeling(); });

  // ---------- hulpjes ----------
  function maakId(naam) {
    return naam.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function esc(t) {
    return String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function graden(v, plus, min) {
    const a = Math.abs(v), g = Math.floor(a), m = Math.round((a - g) * 60);
    return `${g}°${String(m).padStart(2, "0")}′ ${v >= 0 ? plus : min}`;
  }
  function beweging() {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function zetAdres(id) {
    try { history.replaceState(null, "", id ? "#" + id : location.pathname + location.search); } catch (e) {}
  }

  // ---------- start ----------
  new ResizeObserver(() => { meetBalk(); zetIndeling(); }).observe(balk);
  zetIndeling();
  kaart.setPadding(vrijeRuimte(false));
  teken();
  kaart.on("load", () => {
    teken();
    const begin = location.hash.slice(1);
    if (begin && SCHEPEN.some(s => s.id === begin)) kies(begin);
  });
})();
