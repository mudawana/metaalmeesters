# MetaalMeesters — nieuwe website + 3D-deurenconfigurator

Werkende React/Vite-demowebsite, geïnspireerd op de bestaande website van [MetaalMeesters](https://metaalmeesters.eu/).

## Wat de demo bevat
- Responsieve website (Home, Diensten, Realisaties, Contact) in een premium stijl.
- Interactieve **3D-deurenconfigurator** met realtime Three.js (React Three Fiber).
- Enkele, dubbele, schuif- en pivotdeuren; dynamische breedte en hoogte.
- Varianten van kader, glas (helder, mat, rook en ribbel), profielverdeling, handgrepen en draairichting.
- Draaien, zoomen, openen, andere scèneachtergrond, PNG-screenshot en JSON-export.
- Ontwerp blijft bewaard in de lokale browser.
- Offerteformulier met de volledige configuratie en optionele e-mailverzending.
- Alle 108 briefingvragen in [docs/VRAGEN_AAN_METAALMEESTERS.txt](docs/VRAGEN_AAN_METAALMEESTERS.txt).
- Foto-importer voor originele MetaalMeesters-foto's in [public/images](public/images).

## Lokaal starten
Node.js 20+ aanbevolen.

    npm install
    npm run download:images
    npm run dev

Open de URL die Vite toont (normaal http://localhost:5173).

Productiebouw:

    npm run build
    npm run preview

## Originele foto's
De site gebruikt **uitsluitend bestaande MetaalMeesters-foto's** uit hun website, naast de live gerenderde 3D-modellen. De bronbestanden staan op:

    https://metaalmeesters.eu/wp-content/uploads/2024/09/

Met `npm run download:images` worden de in `scripts/download-images.mjs` opgelijste bestanden naar `public/images/` gedownload.
GitHub Actions `import-images.yml` doet dit ook automatisch bij de eerste commit (of handmatig met **Run workflow**) en commit de foto's. Als een import niet lukt, gebruikt de site voorlopig de originele externe foto-URL's. Controleer toestemming van de rechthebbende voor hergebruik van de foto's.

## Hoe offerteverzending werkt
**Op gewone statische hosting / GitHub Pages:** het offerteformulier opent het e-mailprogramma van de klant met ontwerp + gegevens; de klant moet zelf de e-mail versturen. Er is dus nog geen gegarandeerde automatische verzending.

**Echte verzending:** deploy naar Netlify en vul omgevingsvariabelen in:

    RESEND_API_KEY=<uw API-key>
    QUOTE_FROM_EMAIL=offertes@<geverifieerd-domein>
    QUOTE_TO_EMAIL=info@metaalmeesters.eu

De Netlify Function in `netlify/functions/send-quote.mjs` verzendt dan automatisch de aanvraag naar het opgegeven e-mailadres. Voor echte productie moeten rate limiting, CAPTCHA/spambeveiliging, privacybeleid, afleverbaarheid en logging nog worden ingesteld. `.env.example` bevat een voorbeeld.

## Belangrijk vóór productie
Dit is een **demo**, geen gevalideerd productie- of bestelplatform:
- Maten (500–3600 mm breed, 1400–3500 mm hoog) zijn **voorlopige demo-grenzen**, niet geverifieerd bij MetaalMeesters.
- 3D-materialen, stijlen, beslag en glasvarianten zijn visueel, zonder formele technische validatie.
- Geen automatische prijsberekening of betaling, conform opdracht.
- Schuif-/pivotdeur-beweging is een visueel concept, geen gedetailleerde CAD-constructie.
- De precieze maakbaarheid, profielen, glasdiktes en veiligheidsnormen moeten met het atelier worden vastgelegd.
- Bij een latere trappenconfigurator is een afzonderlijke parametische module nodig.

## Techniek
React 18 · Vite 5 · Three.js · React Three Fiber · Drei · Lucide Icons · Netlify Function (optionele e-mailbackend).

## GitHub Pages (optioneel)
De Vite-build gebruikt het subpad `/metaalmeesters/` bij `GITHUB_PAGES=true`. Een Pages-deploy moet afzonderlijk in GitHub ingesteld worden.

    GITHUB_PAGES=true npm run build

De bestanden in deze repository zijn een eerste functionele demo en dienen technisch getest te worden vóór publieke livegang.

### De demo online tonen via GitHub Pages
Open de GitHub-repository > **Settings** > **Pages** en kies bij **Source** voor **GitHub Actions**. Daarna onder **Actions** > **Prepare GitHub Pages demo** > **Run workflow**. Bij een geslaagde deployment is de demo toegankelijk via `https://mudawana.github.io/metaalmeesters/`. Deze URL is pas live nadat Pages is geactiveerd en de workflow geslaagd is.

## Nieuwe privé-offerteadministratie

De demo bevat een beveiligde beheerpagina op `/#/beheer` en een offerteformulier dat automatisch een afbeelding van het 3D-ontwerp vastlegt. Een Netlify-function slaat de volledige aanvraag **privé** op in Netlify Blobs. De eigenaar kan na aanmelden alle aanvragen bekijken, zoeken, status wijzigen en beantwoorden. Optionele e-mailmeldingen worden gestuurd via Resend; er zijn geen publieke offerteprijzen.

**Let op:** GitHub Pages ondersteunt geen server-side opslag of authenticatie. De GitHub Pages-link blijft dus alleen een demo; het offerteformulier toont een duidelijke fout in plaats van persoonlijke data te lekken of een valse bevestiging te geven. Voor echte aanvragen is een deployment op Netlify nodig.

Alle configuratiestappen, omgevingsvariabelen, privacy-/beveiligingsaandachtspunten en testinstructies staan in [docs/OFFERTEPORTAAL_INSTALLATIE.txt](docs/OFFERTEPORTAAL_INSTALLATIE.txt).

## Woningweergave — live 3D-deur op echte foto's

De nieuwe configurator toont standaard een 3D-deur **in een echte projectfoto** in plaats van een fictief 3D-huis. Klanten kunnen hun **eigen woningfoto uploaden**, de deur verplaatsen, schalen en in perspectief draaien, het origineel vergelijken en een samengestelde afbeelding downloaden. De kleuren, glasopties en deurmaten blijven live aanpasbaar. De foto is een visuele simulatie zonder gegarandeerde exacte geometrie. Zie [docs/FOTOREALISTISCHE_CONFIGURATOR.md](docs/FOTOREALISTISCHE_CONFIGURATOR.md) voor gebruik en beperkingen.

## Oplossing voor blanco GitHub Pages-website
Er liepen twee publicaties door elkaar: GitHub Pages (legacy Jekyll, broncode) en de custom Vite Actions-workflow. De laatste Jekyll-push kon het gecompileerde React-project overschrijven, wat een witte pagina veroorzaakte.

Daarom staat de Vite-ingang in `site.source.html`, wordt de geproduceerde HTML door `scripts/normalize-build.mjs` altijd `dist/index.html`, en publiceert de workflow ook de gebouwde HTML/CSS/JS en foto's naar de root van `main`. Daardoor bevat zelfs de legacy branch-publicatie uitsluitend uitvoerbare JS-bestanden.

**Aanbevolen definitieve GitHub-instelling:** Settings > Pages > Build and deployment > Source: **GitHub Actions**. Daarmee verdwijnt de dubbele publicatie. De back-up van de gecompileerde bestanden in `main` houdt de site ook werkend zolang legacy branch publishing nog aanstaat.

### Fotovoorbeelden van andere woningen (31 oktober 2026)
De oude MetaalMeesters-projectbeelden zijn **volledig verwijderd uit de keuzelijst van woningachtergronden**. De configurator gebruikt vier zorgvuldig geselecteerde **Pexels-foto's** met toegestane commerciële toepassing: lichte echte deuropening, moderne gevel, klassieke woning en gezinswoning. Een bron- en fotografenvermelding staat in `public/homes/README.md` en in de configurator. Foto's met bestaande deuren worden niet automatisch leeg gemaakt; het 3D-model wordt over de bestaande opening geprojecteerd. De knop **Mijn eigen foto** blijft behouden en is de nauwkeurigste manier om de deur in de persoonlijke situatie te bekijken.

### Nieuwe dynamische 3D-woning

De configurator toont standaard een volledig procedurele 3D-woning met een **echte, meegroeibare muuropening** voor de gekozen stalen deur. De muren, ramen, dorpel en bovenbouw reageren op bredere en hogere afmetingen. Er zijn twee gevelafwerkingen en twee camerastandpunten. De bestaande optie **echte woningfoto / eigen foto** en het 3D-atelier blijven bestaan. Dit is een indicatieve architectuurvisualisatie en geen technische bouwtekening. Zie [docs/DYNAMISCHE_3D_WONING.md](docs/DYNAMISCHE_3D_WONING.md).

### Klantfeedback 4 november 2026 — deursoorten en kleuren

De klant bevestigde dat MetaalMeesters enkele deuren, dubbele deuren, pivotdeuren en wanden met geïntegreerde deuren aanbiedt. Ook afwijkende maten en alle RAL/anodic kleuren zijn bespreekbaar. Daarom toont de configurator een **glaswand met beweegbare deur en vaste zijpanelen**, een uitbreidbare **selectie populaire RAL/anodic voorbeelden** en een **andere kleur op aanvraag**-veld. De weergegeven kleuren zijn indicatief tot de officiële kleurenkaarten beschikbaar zijn. Voor de 3D-rendering geldt een visualisatiebereik 500–8000 mm breed, 1400–4500 mm hoog; dit is geen productiegrens.

**Balustrades** staan op de wensenlijst, maar de ontwikkeling van een balustradeconfigurator gebeurt in een **latere fase**, niet als onderdeel van deze eerste deurronde. De status van die afzonderlijke fase moet expliciet met de klant worden afgestemd, zeker als die in de afgesproken offerte was inbegrepen.

De acht klantfoto's zijn afzonderlijk ontvangen. Ze tonen werkelijk maatwerk maar zijn niet geschikt als foto-achtergrond om een nieuwe deur te plaatsen. Ze kunnen na goedkeuring dienen als realisaties/portfolio, bij voorkeur zonder personen of gevoelige informatie in beeld.
