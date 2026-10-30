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
