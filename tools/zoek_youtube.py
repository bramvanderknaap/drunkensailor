import json, re, urllib.parse, urllib.request
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
def get(u):
    req = urllib.request.Request(u, headers={"User-Agent": UA, "Accept-Language": "en"})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
uit = []
for q in ["gordon lightfoot the wreck of the edmund fitzgerald", "gordon lightfoot wreck of the edmund fitzgerald official audio", "Gordon Lightfoot - Topic Wreck of the Edmund Fitzgerald"]:
    html = get("https://www.youtube.com/results?search_query=" + urllib.parse.quote(q))
    for vid in dict.fromkeys(re.findall(r'"videoId":"([\w-]{11})"', html)):
        if any(u["id"] == vid for u in uit): continue
        try:
            o = json.loads(get(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"))
            uit.append({"id": vid, "titel": o.get("title"), "kanaal": o.get("author_name"), "kanaal_url": o.get("author_url")})
        except Exception as e:
            uit.append({"id": vid, "fout": str(e)})
        if len(uit) > 25: break
json.dump(uit, open("youtube.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(uit, ensure_ascii=False, indent=1))
