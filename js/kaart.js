// ===================================================================
//  DE KAART
//  Dit bestand tekent de kaart, de scheepjes, de routes en de panelen.
//  De gegevens zelf staan in js/schepen.js.
// ===================================================================

(function () {
  const STATUSSEN = window.STATUSSEN;
  const SCHEPEN = window.SCHEPEN.slice().sort((a, b) => a.jaar - b.jaar);
  SCHEPEN.forEach(s => { s.id = maakId(s.naam); });

  const actieveStatussen = new Set(Object.keys(STATUSSEN));
  let gekozen = null;

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

  // ---------- kaart en ondergrond ----------
  const kaart = L.map("kaart", {
    minZoom: 1,
    maxZoom: 9,
    zoomSnap: 0.5,
    zoomControl: false,
    attributionControl: true
  }).setView([18, 10], window.innerWidth < 900 ? 1 : 2.5);
  L.control.zoom({ position: "topleft" }).addTo(kaart);
  kaart.attributionControl.setPrefix(false);
  kaart.attributionControl.addAttribution("Kustlijnen: Natural Earth");

  kaart.createPane("land").style.zIndex = 350;
  kaart.createPane("route").style.zIndex = 420;
  const landTekenaar = L.svg({ pane: "land", padding: 0.5 });
  const routeTekenaar = L.svg({ pane: "route", padding: 0.5 });

  // Rasterlijnen om de 30 graden.
  for (let lon = -180; lon <= 540; lon += 30) {
    L.polyline([[-85, lon], [85, lon]], { className: "raster", interactive: false, renderer: landTekenaar }).addTo(kaart);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    L.polyline([[lat, -180], [lat, 540]], { className: "raster" + (lat === 0 ? " evenaar" : ""), interactive: false, renderer: landTekenaar }).addTo(kaart);
  }

  // Het land, drie keer naast elkaar (360 graden verschoven), zodat
  // routes over de datumgrens (General Grant) netjes over zee lopen.
  [-360, 0, 360].forEach(verschuiving => {
    L.geoJSON(window.LAND, {
      className: "land",
      interactive: false,
      renderer: landTekenaar,
      coordsToLatLng: c => L.latLng(c[1], c[0] + verschuiving)
    }).addTo(kaart);
  });

  // ---------- routes ----------
  // Elke route splitsen we in het stuk dat gevaren is (tot het wrak)
  // en het stuk dat het schip nooit heeft gevaren.
  function splitsRoute(s) {
    const gevaren = [], gepland = [], havens = [];
    let voorbijWrak = false;
    s.lijn.forEach(p => {
      if (p === "WRAK") { gevaren.push(s.wrak); gepland.push(s.wrak); voorbijWrak = true; return; }
      (voorbijWrak ? gepland : gevaren).push([p[0], p[1]]);
      if (p[2]) havens.push(p);
    });
    return { gevaren, gepland, havens };
  }

  const achtergrondRoutes = {};
  SCHEPEN.forEach(s => {
    achtergrondRoutes[s.id] = L.polyline(splitsRoute(s).gevaren, { className: "route-achter", interactive: false, renderer: routeTekenaar });
  });
  const routeLaag = L.layerGroup().addTo(kaart);

  // ---------- scheepjes ----------
  const markers = {};
  SCHEPEN.forEach(s => {
    const st = STATUSSEN[s.status];
    const m = L.marker(s.wrak, {
      icon: L.divIcon({
        className: "schip-icoon",
        html: SCHIP_SVG,
        iconSize: [28, 28],
        iconAnchor: [14, 22]
      }),
      keyboard: true,
      title: `${s.naam} (${s.jaar})`,
      riseOnHover: true
    });
    m.on("add", () => {
      const el = m.getElement();
      el.style.setProperty("--kleur", st.kleur);
      el.style.setProperty("--gloed", st.gloed);
      el.classList.toggle("gekozen", !!gekozen && gekozen.id === s.id);
    });
    m.bindTooltip(`${esc(s.naam)} · ${s.jaar}`, { direction: "top", offset: [0, -20], className: "schip-tip" });
    m.on("click", () => kies(s.id));
    markers[s.id] = m;
  });

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
      const tonen = lijst.includes(s);
      [markers[s.id], achtergrondRoutes[s.id]].forEach(laag => {
        if (tonen && !kaart.hasLayer(laag)) laag.addTo(kaart);
        if (!tonen && kaart.hasLayer(laag)) kaart.removeLayer(laag);
      });
      const el = markers[s.id].getElement();
      if (el) el.classList.toggle("gekozen", !!gekozen && gekozen.id === s.id);
    });
    document.getElementById("teller").textContent = lijst.length;
    tekenVloot(lijst);
  }

  // ---------- de vloot (lijst) ----------
  const vloot = document.getElementById("vloot");
  function tekenVloot(lijst) {
    vloot.innerHTML = lijst.length ? lijst.map(s => `
      <li><button class="vloot-knop" type="button" data-id="${s.id}" aria-current="${!!gekozen && gekozen.id === s.id}" style="--kleur:${STATUSSEN[s.status].kleur}">
        ${SCHIP_SVG}<span>${esc(s.naam)}</span><span class="jaar">${s.jaar}</span>
      </button></li>`).join("")
      : `<li class="leeg">Geen schepen met deze status.</li>`;
    vloot.querySelectorAll(".vloot-knop").forEach(k => k.addEventListener("click", () => kies(k.dataset.id)));
  }

  // ---------- details ----------
  const details = document.getElementById("details");

  // Dieptemeter: van het wateroppervlak tot 3 km diep. De schaal is
  // logaritmisch (1, 10, 100, 1000 m staan even ver uit elkaar), anders
  // zouden alle ondiepe wrakken bovenaan op een hoopje liggen.
  const DIEPST = 3000;
  const hoogte = m => (100 * Math.log10(Math.max(m, 1)) / Math.log10(DIEPST)).toFixed(1);
  function dieptemeter(m) {
    const streepjes = [[1, "oppervlak"], [10, "10 m"], [100, "100 m"], [1000, "1 km"]];
    return `<div class="meter" aria-hidden="true">
      <span class="water"></span>
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
    details.innerHTML = `
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
        <div class="vak"><span class="label">waarde nog op de bodem</span><div class="balkje goud"></div>
          <span class="bedrag">${esc(sch.bodem)}</span><span class="klein">beste schatting</span>
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
          <span class="label">diepte</span><div class="balkje blauw"></div>
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
      <button class="sluit" type="button" id="sluit"><span class="toets">Esc</span> verberg details</button>`;
    const img = details.querySelector("img");
    if (img) img.addEventListener("error", () => img.closest("figure").remove());
    document.getElementById("sluit").addEventListener("click", () => kies(null));
    details.hidden = false;
    details.scrollTop = 0;
  }

  // ---------- een schip kiezen ----------
  function kies(id) {
    gekozen = SCHEPEN.find(s => s.id === id) || null;
    routeLaag.clearLayers();
    teken();
    document.getElementById("hint-plek").textContent = gekozen ? gekozen.naam.toLowerCase() : "zeekaart";
    if (!gekozen) {
      details.hidden = true;
      zetAdres("");
      return;
    }
    const s = gekozen;
    const { gevaren, gepland, havens } = splitsRoute(s);
    L.polyline(gevaren, { className: "route-gevaren", interactive: false, renderer: routeTekenaar }).addTo(routeLaag);
    if (gepland.length > 1) L.polyline(gepland, { className: "route-gepland", interactive: false, renderer: routeTekenaar }).addTo(routeLaag);
    havens.forEach(p => {
      L.circleMarker([p[0], p[1]], { radius: 4, className: "haven", interactive: false, renderer: routeTekenaar })
        .bindTooltip(p[2], { permanent: true, direction: "right", offset: [8, 0], className: "havennaam" })
        .addTo(routeLaag);
    });
    markers[s.id].setZIndexOffset(1000);
    SCHEPEN.forEach(o => { if (o !== s) markers[o.id].setZIndexOffset(0); });

    toonDetails(s);
    const breed = window.innerWidth >= 900;
    kaart.flyToBounds(L.latLngBounds(gevaren.concat(gepland)), {
      paddingTopLeft: breed ? [320, 40] : [30, 30],
      paddingBottomRight: breed ? [470, 40] : [30, 30],
      maxZoom: 6,
      duration: beweging() ? 0.9 : 0
    });
    zetAdres(s.id);
  }

  // Toetsen: pijltjes bladeren door de vloot, Esc sluit de details.
  document.addEventListener("keydown", e => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    if (e.key === "Escape" && gekozen) { kies(null); return; }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (e.target.closest && e.target.closest(".leaflet-container")) return;
    const lijst = zichtbaar();
    if (!lijst.length) return;
    e.preventDefault();
    const i = gekozen ? lijst.indexOf(gekozen) : -1;
    const volgende = e.key === "ArrowDown" ? (i + 1) % lijst.length : (i - 1 + lijst.length) % lijst.length;
    kies(lijst[volgende].id);
    vloot.querySelector(`[data-id="${lijst[volgende].id}"]`)?.focus({ preventScroll: false });
  });

  // ---------- hulpjes ----------
  function maakId(naam) {
    return naam.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
  const begin = location.hash.slice(1);
  if (begin && SCHEPEN.some(s => s.id === begin)) kies(begin);
  else teken();
})();
