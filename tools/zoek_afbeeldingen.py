# Zoekt per schip kandidaat-afbeeldingen op Wikipedia/Wikimedia Commons,
# downloadt een kleine versie en schrijft de licentie-informatie weg.
import json, os, re, time, urllib.parse, urllib.request

UA = "drunkensailor-kaart/1.0 (https://github.com/bramvanderknaap/drunkensailor)"
BRONNEN = {
  "flor-do-mar": ["en:Flor de la Mar", "pt:Flor de la Mar", "cat:Flor de la mar (ship, 1502)"],
  "merchant-royal": ["en:Merchant Royal"],
  "juncal": ["en:Nuestra Señora del Juncal", "es:Nuestra Señora del Juncal"],
  "hms-sussex": ["en:HMS Sussex (1693)"],
  "san-jose": ["en:Spanish galleon San José", "file:Wager's Action off Cartagena 28 May 1708.jpg"],
  "atocha": ["en:Nuestra Señora de Atocha", "es:Nuestra Señora de Atocha (galeón)"],
  "santa-margarita": ["en:Santa Margarita (1622 ship)", "en:1622 Spanish treasure fleet"],
  "batavia": ["en:Batavia (1628 ship)", "nl:Batavia (schip, 1628)"],
  "vergulde-draeck": ["en:Vergulde Draeck", "nl:Vergulde Draeck"],
  "zuytdorp": ["en:Zuytdorp", "nl:Zuytdorp (schip, 1701)"],
  "rooswijk": ["en:Rooswijk", "nl:Rooswijk (schip, 1737)"],
  "hms-lutine": ["en:HMS Lutine (1779)", "cat:HMS Lutine (ship, 1779)"],
  "general-grant": ["en:General Grant (sailing ship)", "cat:General Grant (ship, 1864)"],
  "ss-central-america": ["en:SS Central America", "cat:Central America (ship, 1852)"],
  "ss-laurentic": ["en:SS Laurentic (1908)", "cat:Laurentic (ship, 1909)"],
  "algemeen": ["cat:Paintings of galleons", "cat:Paintings of East Indiamen of the Dutch East India Company", "en:Spanish treasure fleet", "en:Galleon", "en:East Indiaman"],
}
SKIP = re.compile(r"(\.svg$|\.ogg$|\.webm$|flag|commons-logo|icon|symbol|wiki|edit-clear|question_book|map|locator|disambig)", re.I)

def api(host, **p):
    p.update(format="json", formatversion="2")
    url = f"https://{host}/w/api.php?" + urllib.parse.urlencode(p)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def bestanden(bron):
    soort, naam = bron.split(":", 1)
    if soort == "file":
        return ["File:" + naam]
    if soort == "cat":
        d = api("commons.wikimedia.org", action="query", list="categorymembers", cmtitle="Category:" + naam, cmtype="file", cmlimit="40")
        return [m["title"] for m in d["query"]["categorymembers"]]
    d = api(f"{soort}.wikipedia.org", action="query", prop="images", titles=naam, imlimit="40", redirects="1")
    uit = []
    for pg in d["query"]["pages"]:
        uit += [i["title"] for i in pg.get("images", [])]
    return uit

os.makedirs("kandidaten", exist_ok=True)
index = {}
for schip, bronnen in BRONNEN.items():
    gezien, lijst = set(), []
    for bron in bronnen:
        try:
            titels = bestanden(bron)
        except Exception as e:
            print("FOUT", schip, bron, e); continue
        for t in titels:
            if t in gezien or SKIP.search(t): continue
            gezien.add(t)
            lijst.append((bron, t))
    index[schip] = []
    os.makedirs(f"kandidaten/{schip}", exist_ok=True)
    for n, (bron, titel) in enumerate(lijst[:25]):
        try:
            d = api("commons.wikimedia.org", action="query", prop="imageinfo", titles=titel, iiprop="url|extmetadata|size", iiurlwidth="900")
            pg = d["query"]["pages"][0]
            if "imageinfo" not in pg:
                continue
            ii = pg["imageinfo"][0]
            md = ii.get("extmetadata", {})
            g = lambda k: re.sub("<[^>]+>", "", md.get(k, {}).get("value", "")).strip()
            ext = os.path.splitext(ii.get("thumburl", ii["url"]))[1].lower() or ".jpg"
            pad = f"kandidaten/{schip}/{n:02d}{ext}"
            req = urllib.request.Request(ii.get("thumburl", ii["url"]), headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(pad, "wb") as f:
                f.write(r.read())
            index[schip].append({"bestand": pad, "titel": titel, "bron": bron, "pagina": ii.get("descriptionurl"),
                                 "origineel": ii["url"], "breed": ii.get("width"), "hoog": ii.get("height"),
                                 "licentie": g("LicenseShortName"), "maker": g("Artist")[:200],
                                 "beschrijving": g("ImageDescription")[:400], "datum": g("DateTimeOriginal")[:80],
                                 "credit": g("Credit")[:200]})
            print("OK", pad, titel)
            time.sleep(0.3)
        except Exception as e:
            print("FOUT", schip, titel, e)
json.dump(index, open("kandidaten/index.json", "w"), ensure_ascii=False, indent=1)
