// ===================================================================
//  DE KAART
//  Dit bestand tekent de kaart, de markers, de routes en het paneel.
//  De gegevens zelf staan in js/schepen.js.
// ===================================================================

(function () {
  const STATUSSEN = window.STATUSSEN;
  const SCHEPEN = window.SCHEPEN.slice().sort((a, b) => a.jaar - b.jaar);
  SCHEPEN.forEach(s => { s.id = maakId(s.naam); });

  const actieveStatussen = new Set(Object.keys(STATUSSEN));
  let gekozen = null;

  // ---------- kaart en ondergrond ----------
  const kaart = L.map("kaart", {
    worldCopyJump: false,
    minZoom: 1,
    maxZoom: 10,
    zoomSnap: 0.5,
    attributionControl: true
  }).setView([18, 20], window.innerWidth < 820 ? 1 : 2);
  kaart.attributionControl.setPrefix(false);

  const zeekaart = L.layerGroup().addTo(kaart);

  // Rasterlijnen om de 30 graden, zoals op een zeekaart.
  for (let lon = -180; lon <= 540; lon += 30) {
    L.polyline([[-85, lon], [85, lon]], { className: "raster", interactive: false }).addTo(zeekaart);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    L.polyline([[lat, -180], [lat, 540]], { className: "raster" + (lat === 0 ? " evenaar" : ""), interactive: false }).addTo(zeekaart);
  }

  // Het land, drie keer naast elkaar (360 graden verschoven), zodat
  // routes over de datumgrens (General Grant) netjes over zee lopen.
  [-360, 0, 360].forEach(verschuiving => {
    L.geoJSON(window.LAND, {
      className: "land",
      interactive: false,
      coordsToLatLng: c => L.latLng(c[1], c[0] + verschuiving)
    }).addTo(zeekaart);
  });
  kaart.attributionControl.addAttribution("Kustlijnen: Natural Earth");

  // Op GitHub Pages kan ook de gewone OpenStreetMap-kaart geladen worden.
  // We proberen één kaarttegel; lukt dat, dan komt er een keuzeknop.
  const proef = new Image();
  proef.onload = () => {
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 10,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    });
    L.control.layers({ "Zeekaart": zeekaart, "OpenStreetMap": osm }, null, { position: "topright" }).addTo(kaart);
  };
  proef.src = "https://tile.openstreetmap.org/0/0/0.png";

  // ---------- markers ----------
  const routeLaag = L.layerGroup().addTo(kaart);
  const markers = {};
  SCHEPEN.forEach(schip => {
    const m = L.circleMarker(schip.wrak, {
      radius: 7,
      className: "schip-marker",
      fillColor: STATUSSEN[schip.status].kleur,
      fillOpacity: 1,
      color: "#ffffff"
    });
    m.bindTooltip(`${schip.naam} (${schip.jaar})`, { direction: "top", offset: [0, -6] });
    m.on("click", () => kies(schip.id));
    markers[schip.id] = m;
  });

  // ---------- legenda (filterknoppen) ----------
  const legenda = document.getElementById("legenda");
  Object.entries(STATUSSEN).forEach(([sleutel, st]) => {
    const aantal = SCHEPEN.filter(s => s.status === sleutel).length;
    if (!aantal) return;
    const knop = document.createElement("button");
    knop.className = "chip";
    knop.type = "button";
    knop.id = "filter-" + sleutel;
    knop.setAttribute("aria-pressed", "true");
    knop.innerHTML = `<span class="stip" style="--stip:${st.kleur}"></span>${esc(st.naam)} <span class="aantal">${aantal}</span>`;
    knop.addEventListener("click", () => {
      if (actieveStatussen.has(sleutel)) actieveStatussen.delete(sleutel);
      else actieveStatussen.add(sleutel);
      knop.setAttribute("aria-pressed", String(actieveStatussen.has(sleutel)));
      tekenMarkers();
      if (!gekozen) toonLijst();
    });
    legenda.appendChild(knop);
  });

  function zichtbaar() {
    return SCHEPEN.filter(s => actieveStatussen.has(s.status));
  }

  function tekenMarkers() {
    SCHEPEN.forEach(s => {
      const m = markers[s.id];
      const tonen = actieveStatussen.has(s.status) || (gekozen && gekozen.id === s.id);
      if (tonen && !kaart.hasLayer(m)) m.addTo(kaart);
      if (!tonen && kaart.hasLayer(m)) kaart.removeLayer(m);
    });
  }

  // ---------- paneel ----------
  const paneel = document.getElementById("paneel");

  function toonLijst() {
    const lijst = zichtbaar();
    paneel.innerHTML = `
      <div class="paneel-binnen">
        <p class="label">${lijst.length} van ${SCHEPEN.length} schepen · op jaartal</p>
        ${lijst.length ? `<ul class="lijst">${lijst.map(s => `
          <li><button class="schip-knop" type="button" data-id="${s.id}">
            <span class="jaar">${s.jaar}</span>
            <span class="stip" style="--stip:${STATUSSEN[s.status].kleur}"></span>
            <span class="naam">${esc(s.naam)}</span>
            <span class="sub">${esc(s.land)} · ${esc(s.locatie)}</span>
          </button></li>`).join("")}</ul>`
          : `<p class="leeg">Geen schepen met deze status. Zet een filter bovenaan weer aan.</p>`}
        <p class="voetnoot">Posities en routes zijn bij benadering getekend. Klik op een schip in de lijst of op de kaart voor het verhaal.</p>
      </div>`;
    paneel.querySelectorAll(".schip-knop").forEach(k => k.addEventListener("click", () => kies(k.dataset.id)));
  }

  function toonDetail(s) {
    const st = STATUSSEN[s.status];
    const feiten = [
      ["Route", s.route],
      ["Locatie", s.locatie],
      ...s.feiten,
      ["Buit", s.buit]
    ];
    paneel.innerHTML = `
      <div class="paneel-binnen detail">
        <button class="terug" type="button" id="terug">← Alle schepen</button>
        <h2>${esc(s.naam)}</h2>
        <p class="meta"><span class="jaar">${s.jaar}</span> · ${esc(s.land)}</p>
        <span class="status"><span class="stip" style="--stip:${st.kleur}"></span>${esc(st.naam)}</span>
        <p class="verhaal">${esc(s.verhaal)}</p>
        <dl class="feiten">
          ${feiten.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          <div><dt>Positie op de kaart (bij benadering)</dt><dd class="positie">${graden(s.wrak[0], "NB", "ZB")}, ${graden(s.wrak[1], "OL", "WL")}</dd></div>
        </dl>
        <p class="waarde"><strong>Waarde nog op de bodem</strong>${esc(s.waarde)}</p>
        <p class="noot">${esc(s.noot)}</p>
      </div>`;
    document.getElementById("terug").addEventListener("click", () => kies(null));
    paneel.scrollTop = 0;
  }

  // ---------- route tekenen ----------
  function tekenRoute(s) {
    routeLaag.clearLayers();
    const gevaren = [], gepland = [];
    let voorbijWrak = false;
    s.lijn.forEach(p => {
      if (p === "WRAK") {
        gevaren.push(s.wrak); gepland.push(s.wrak); voorbijWrak = true; return;
      }
      (voorbijWrak ? gepland : gevaren).push([p[0], p[1]]);
      if (p[2]) {
        L.circleMarker([p[0], p[1]], { radius: 4, className: "haven", interactive: false })
          .bindTooltip(p[2], { permanent: true, direction: "right", offset: [6, 0], className: "havennaam" })
          .addTo(routeLaag);
      }
    });
    L.polyline(gevaren, { className: "route-gevaren", interactive: false }).addTo(routeLaag);
    if (gepland.length > 1) L.polyline(gepland, { className: "route-gepland", interactive: false }).addTo(routeLaag);
    return L.latLngBounds(gevaren.concat(gepland));
  }

  // ---------- een schip kiezen ----------
  function kies(id) {
    if (gekozen) markers[gekozen.id].getElement()?.classList.remove("gekozen");
    gekozen = SCHEPEN.find(s => s.id === id) || null;
    kaart.closePopup();
    if (!gekozen) {
      routeLaag.clearLayers();
      tekenMarkers();
      toonLijst();
      zetAdres("");
      return;
    }
    const s = gekozen;
    tekenMarkers();
    const m = markers[s.id];
    m.bringToFront();
    m.getElement()?.classList.add("gekozen");
    const grenzen = tekenRoute(s);
    kaart.flyToBounds(grenzen, { padding: [40, 40], maxZoom: 6, duration: beweging() ? 0.8 : 0 });
    kaart.once("moveend", () => {
      if (gekozen !== s) return;
      L.popup({ offset: [0, -4], maxWidth: 280, autoPanPadding: [24, 24] })
        .setLatLng(s.wrak)
        .setContent(popupInhoud(s))
        .openOn(kaart);
    });
    toonDetail(s);
    zetAdres(s.id);
  }

  function popupInhoud(s) {
    const st = STATUSSEN[s.status];
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${esc(s.naam)}</h3>
      <p class="klein">${s.jaar} · ${esc(s.land)} · ${esc(st.naam)}</p>
      <p><strong>Buit:</strong> ${esc(s.buit)}</p>
      <p><strong>Nog op de bodem:</strong> ${esc(s.waarde)}</p>
      <button type="button">Lees het hele verhaal</button>`;
    div.querySelector("button").addEventListener("click", () => {
      paneel.scrollIntoView({ behavior: beweging() ? "smooth" : "auto" });
    });
    return div;
  }

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
  tekenMarkers();
  const begin = location.hash.slice(1);
  if (begin && SCHEPEN.some(s => s.id === begin)) kies(begin);
  else toonLijst();
})();
