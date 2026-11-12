# MetaalMeesters — premium ontwerpstudio (conceptfase)

Datum: 12 november 2026  
Werkbranch: `design/luxe-metaalmeesters-configurator`  
Status: **code ter beoordeling, NIET gepubliceerd op Netlify.**

## Ontwerprichting en marktonderzoek

De redesign is geen kopie van concurrenten. Bij het onderzoek zijn onder andere de volgende publieke voorbeelden bekeken:

- **Venuti** — https://venuti.be/ — premium positionering met nadruk op ambacht, materialen en echt projectwerk.
- **OTIF** — https://otif-profil.be/ — ingetogen architecturale taal en materiaalkeuze.
- **Anyway Doors** — https://www.anywaydoors.be/ — productconfiguratie als onderdeel van de commerciële klantreis.
- **Balustradedesign** — https://www.balustradedesign.be/relingen/stijlvol-glazen-reling/ — voorbeeld van configureerbare railingopties, niet van onze technische specificaties.
- **Heritage Architectural** — https://callout.studio/work/heritage-architectural — voorbeeld van een fotografische, luxueuze presentatie van metaalwerk.

De toegepaste principes: grote eigen projectfoto's, rustige donkere en warme tinten, ruime typografie, materiaalstalen, weinig decoratieve drukte en duidelijke offerteknoppen. Gebruik uitsluitend afbeeldingen waarvoor MetaalMeesters rechten heeft, niet de foto's van bovenstaande websites.

## Wat veranderd is op deze branch

- De **homepage** richt zich nu op zowel stalen deuren als balustrades; de oude deur-specifieke hero en CTA zijn vervangen.
- Een afzonderlijk stylesheet `src/premium-atelier.css` verfijnt homepage, navigatie, productkeuze en balustradestudio zonder de bestaande deurenconfigurator te vervangen.
- De centrale productkeuze presenteert beide categorieën met projectfoto's en duidelijke acties.
- De balustradeconfigurator heeft visuele invullingskaarten, verbeterde typografie, mobiel springen tussen opties en 3D-voorbeeld en een nieuw `layout`-veld voor rechte of twee mogelijke hoekopstellingen (behalve voor trap).
- De 3D-studio heeft vloeren/architectuurcontext, belichting, glas/materialen, een correcte ronde handregel en een geïllustreerde L-opstelling.
- Het beveiligde beheerportaal kan nu ook op **productsoort** filteren en toont het gekozen balustradeverloop.
- De bestaande offerte-API bewaart het extra `layout`-veld en voegt het toe aan de optionele e-mailmelding.
- De SEO-homepagetitel en -omschrijving spreken beide productsoorten aan.
- Extra tests zijn toegevoegd voor achterwaartse compatibiliteit en de nieuwe ontwerpopties.

## Belangrijke technische en veiligheidsgrenzen

- Het 3D-model is een **indicatief sfeerbeeld**, geen CAD-/constructietekening of veiligheidsgoedkeuring.
- Balustradelengtes en -hoogtes worden bij klanten **in cm** ingevoerd, intern **in mm** opgeslagen om met bestaande offertegegevens compatibel te blijven.
- Bij hoekopstellingen wordt de totale opgegeven lengte voor het model visueel opgesplitst (ongeveer 63% en 37%). Echte hoekmaten worden ter plaatse bepaald.
- Beschikbare bevestigingen, profielen, glasopbouw, leuninghoogte, spijlafstanden en toepasbaarheid moeten altijd door Ahmed/atelier worden bevestigd.
- Er is geen automatische prijsbepaling. De klant vraagt een offerte aan, waarna Ahmed opmeet en controleert.
- Deurconfigurator, beheerlogin, Blob-opslag en de bestaande Netlify Functions zijn behouden.
- Het officiële domein `metaalmeesters.eu` en DNS/e-mail zijn **niet** gewijzigd.

## Wat nog getest moet worden vóór publicatie

1. `npm install`
2. `npm run test:api`
3. `npm run build`
4. Deur- én balustradestudio bedienen op desktop en smartphone.
5. 3D-beeld controleren in Safari en Chrome, inclusief lengtevariatie, glas, trap en hoeken.
6. Offerte van beide soorten aanmaken op de afgeschermde Netlify-testomgeving en controleren in het beheerportaal. Gebruik hiervoor een testcontact, geen echte klantdata.
7. Credits en publicatie instemmen met de opdrachtgever. **Geen automatische publicatie naar `main` zonder overleg.**

## Netlify-creditdiscipline

Deze ontwerpbranch is geïsoleerd van `main`. De bestaande GitHub Pages-workflow triggert op `main`; er is geen PR geopend en geen handmatige Netlify-deployment uitgevoerd. Als Netlify **branch deployments** voor alle branches geactiveerd heeft, kan een GitHub-push alsnog verbruik veroorzaken: controleer die instelling voor verdere pushes. Bundel definitieve aanpassingen en maak daarna één bewust geplande publicatie.
