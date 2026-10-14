# Zoekt per schip kandidaat-afbeeldingen op Wikipedia/Wikimedia Commons,
# downloadt een kleine versie en schrijft de licentie-informatie weg.
import json, os, re, time, urllib.parse, urllib.request

UA = "drunkensailor-kaart/1.0 (https://github.com/bramvanderknaap/drunkensailor)"
BRONNEN = {
  "voc": ["zoek:Ludolf Bakhuysen Dutch East Indiamen filetype:bitmap", "zoek:East Indiaman Dutch East India Company painting 17th century filetype:bitmap", "zoek:Hendrick Cornelisz Vroom ships filetype:bitmap", "zoek:Abraham Storck VOC ship filetype:bitmap", "zoek:retourschip VOC schilderij filetype:bitmap"],
  "galjoen": ["zoek:Spanish galleon painting filetype:bitmap", "zoek:Andries van Eertvelt galleons storm filetype:bitmap", "zoek:Spanish treasure fleet painting filetype:bitmap", "zoek:galeón español pintura siglo XVII filetype:bitmap", "zoek:Aert Anthonisz Spanish ships filetype:bitmap"],
  "engels": ["zoek:Willem van de Velde English ship 1640s filetype:bitmap", "zoek:English merchant ship 17th century painting filetype:bitmap", "zoek:English East Indiaman 1640 painting filetype:bitmap"],
  "extra": ["file:SSCentralAmerica.jpg", "file:Lutine1.jpg", "file:Laurentic (I).jpg", "file:Gilt Dragon 2.jpg", "file:HMS Sussex (80) model starboard broadside.jpg"],
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
    if soort == "zoek":
        d = api("commons.wikimedia.org", action="query", list="search", srsearch=naam, srnamespace="6", srlimit="6")
        return [m["title"] for m in d["query"]["search"]]
    if soort == "cat":
        d = api("commons.wikimedia.org", action="query", list="categorymembers", cmtitle="Category:" + naam, cmtype="file", cmlimit="40")
        return [m["title"] for m in d["query"]["categorymembers"]]
    d = api(f"{soort}.wikipedia.org", action="query", prop="images", titles=naam, imlimit="40", redirects="1")
    uit = []
    for pg in d["query"]["pages"]:
        uit += [i["title"] for i in pg.get("images", [])]
    return uit

UIT = os.environ.get("UIT", "kandidaten")
os.makedirs(UIT, exist_ok=True)
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
    os.makedirs(f"{UIT}/{schip}", exist_ok=True)
    for n, (bron, titel) in enumerate(lijst[:30]):
        try:
            d = api("commons.wikimedia.org", action="query", prop="imageinfo", titles=titel, iiprop="url|extmetadata|size", iiurlwidth="900")
            pg = d["query"]["pages"][0]
            if "imageinfo" not in pg:
                continue
            ii = pg["imageinfo"][0]
            md = ii.get("extmetadata", {})
            g = lambda k: re.sub("<[^>]+>", "", md.get(k, {}).get("value", "")).strip()
            ext = os.path.splitext(urllib.parse.urlparse(ii.get("thumburl", ii["url"])).path)[1].lower() or ".jpg"
            pad = f"{UIT}/{schip}/{n:02d}{ext}"
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
json.dump(index, open(f"{UIT}/index.json", "w"), ensure_ascii=False, indent=1)
