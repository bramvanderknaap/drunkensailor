# Gezonken Schatschepen

Een interactieve wereldbol van beroemde schepen die met hun buit zijn gezonken.
Klik op een schip (op de bol of in de lijst) en je ziet de route die het voer,
waar het verging, het verhaal, de buit en wat er nog op de bodem ligt.

Linksboven kies je tussen **wereldbol** (draaien zoals Google Earth) en **kaart**
(de platte zeekaart). De website onthoudt je keuze. Met de pijltjes omhoog en omlaag,
of de knoppen boven de details, blader je door de schepen; Esc sluit de details.
Op een telefoon zitten de vloot en de details in een blad onderin dat je met je
vinger omhoog en omlaag trekt.

## Hoe de website in elkaar zit

| Bestand | Wat het doet |
| --- | --- |
| `index.html` | De pagina zelf: de kopregel, de bol, de knoppen en de panelen. |
| `css/style.css` | De opmaak: kleuren, lettertypes, het doorschijnende glas van de panelen, de indeling op telefoon en computer. |
| `js/schepen.js` | **Alle schepen en hun verhalen.** Dit is het bestand dat je het vaakst aanpast. |
| `js/kaart.js` | Tekent de bol, de scheepjes, de routes en de panelen, en het blad op de telefoon. |
| `img/` | Een schilderij of foto per schip. |
| `js/land.js` | De vorm van alle continenten (Natural Earth, vrij te gebruiken). |
| `js/maplibre-gl.js`, `css/maplibre-gl.css` | MapLibre, de gratis bibliotheek die de wereldbol tekent en laat draaien en zoomen. Er is geen sleutel of account voor nodig. |

## Een schip toevoegen

1. Open `js/schepen.js`.
2. Kopieer een heel blok van `{` tot en met `},`.
3. Plak het onderaan in de lijst (vóór de `];`) en pas de teksten aan.
4. Zoek de coördinaten van het wrak op (bijvoorbeeld via Google Maps: rechtsklik op
   een plek) en zet ze bij `wrak`. Noord en oost zijn positief, zuid en west negatief.
5. Teken bij `lijn` de route met een paar punten en zet `WRAK` waar het schip verging.
6. Wil je een afbeelding? Zet een `.jpg` in de map `img/` en vul `afbeelding` in, met
   een link naar de bron. Gebruik alleen afbeeldingen die je mag gebruiken, bijvoorbeeld
   van [Wikimedia Commons](https://commons.wikimedia.org) (publiek domein of CC-licentie).

De lijst sorteert zichzelf op jaartal, en de filterknoppen tellen vanzelf mee.

## Bekijken op je eigen computer

Dubbelklik op `index.html`. De bol werkt meteen in je browser.

## Publiceren met GitHub Pages

1. Ga op GitHub naar deze repository → **Settings** → **Pages**.
2. Kies bij *Source* **Deploy from a branch**, kies de branch `main` en de map `/ (root)`.
3. Klik op **Save**. Na een minuutje staat de site op
   `https://<jouw-gebruikersnaam>.github.io/<naam-van-de-repository>/`.

Elke keer dat je iets aanpast en het op `main` zet, werkt GitHub de site vanzelf bij.

## Afbeeldingen

Alle afbeeldingen komen van Wikimedia Commons. Bij elk schip staan de maker, de licentie
en een link naar de bron. Van sommige schepen bestaat geen bekende afbeelding; daar staat
een vergelijkbaar schip uit dezelfde tijd, met "Ter illustratie" in het onderschrift.

## Hoeveel is de buit waard?

Bij elk schip staat bij `schatting` wat de hele lading nu waard is (`totaal`) en wat er
vermoedelijk nog op de bodem ligt (`bodem`), met een uitleg en links naar de bronnen.
Met `deel` (van 0 tot 1) staat erbij welk deel van de buit er nog ligt; zo lang is de
gouden balk bij "waarde nog op de bodem".
Dit is de waarde van het goud en zilver tegen de prijs van 14 oktober 2026
(goud €118 per gram, zilver €1,74 per gram, zie `PRIJZEN` bovenin `js/schepen.js`).
Oude munten en voorwerpen zijn voor verzamelaars vaak veel meer waard. Veel bedragen die
je online ziet tellen die verzamelwaarde mee, of rekenen een oud bedrag om met inflatie;
daarom kunnen ze flink verschillen.

## Namen van zeeën en oceanen

De namen op de kaart staan bovenin `js/kaart.js`, in de lijst `ZEEEN`. Elke regel is
`[naam, breedtegraad, lengtegraad, soort]`, met soort `oceaan` (altijd te zien), `zee`
(als je wat inzoomt) of `klein` (als je ver inzoomt). Een `\n` in de naam maakt er twee
regels van, en een getal aan het eind draait de naam een paar graden.

## Hoe diep liggen ze?

Bij `diepte` staat hoe diep elk wrak (waarschijnlijk) ligt, met een bron. De dieptemeter
in het paneel loopt van het wateroppervlak tot 3 km diep en is logaritmisch: 1, 10, 100
en 1000 meter staan even ver uit elkaar, zodat je ondiepe en diepe wrakken allebei goed
ziet. De stippellijn bij 40 meter is ongeveer hoe diep sportduikers kunnen komen.
De balk boven de diepte krijgt dezelfde kleur als het water in de meter op die diepte.

## Rekening houden met iedereen

De website volgt een paar instellingen van je telefoon of computer: bij *minder beweging*
schuift en veert er niets meer, bij *minder doorzichtigheid* worden de panelen stevig in
plaats van glas, en bij *meer contrast* krijgen ze een duidelijke rand.

## Let op

De posities en routes zijn bij benadering getekend. Van een aantal schepen is de
wrakplek niet bekend of omstreden; de marker staat dan in het gebied waar het schip
vermoedelijk verging.
