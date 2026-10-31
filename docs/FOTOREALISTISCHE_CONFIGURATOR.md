# Fotorealistische woningweergave — eerste werkende versie

De configurator op `/#/configurator` opent standaard met **Bekijk in een woning**.

## Wat werkt
- 3D-deur wordt over een echte MetaalMeesters-projectfoto getoond.
- Echte (lokaal opgeslagen) projectfoto's, geen AI-gegeneerde woningen.
- Klant kan eigen JPG/PNG/WebP-foto van de deuropening toevoegen (max. 12 MB).
- Model blijft live aanpasbaar: maat, glas, profielverdeling, coating, greep, deurtype, openen/sluiten.
- Deur verslepen naar deuropening; grootte, horizontale en verticale locatie, perspectiefhoek aanpassen.
- Originele foto vergelijken door de knop ingedrukt te houden.
- Alternatief: 3D-atelierweergave met vrije camera.
- Export van één samengestelde foto (echte achtergrond + 3D-deur).
- De offertevoorvertoning gebruikt dezelfde samengestelde foto wanneer de privébackend later geactiveerd wordt.

## Hoe de klant een geloofwaardig resultaat krijgt
1. Klik **Bekijk in een woning**.
2. Kies een bestaande projectfoto of klik **Mijn eigen foto**.
3. Gebruik liefst een recht genomen foto met een duidelijke, lege deuropening in beeld.
4. Sleep de deur over de opening.
5. Pas Formaat, Horizontaal, Verticaal en Perspectief aan.
6. Configureer glastype, metaalafwerking en profielverdeling.
7. Klik **Bewaar afbeelding** voor een visuele preview.

## Beperkingen van deze eerste versie
Dit is een **handmatige foto-compositie**, geen fotogrammetrisch kalibratiesysteem en geen AR-meetsysteem.
Een foto zonder gekende cameraparameters geeft geen gegarandeerde 1:1 schaal.
Bestaande projectfoto's kunnen al deuren, ramen of andere objecten bevatten.
Het model komt visueel over de foto heen; objecten uit de foto kunnen niet automatisch correct vóór de deur geplaatst worden.
Belichting en reflecties worden benaderd, maar niet uit de foto gemeten.
Voor professionele, fotografisch perfecte composities zijn projectfoto's met vrij zicht op de deuropening, homografie/perspectiefpunten, maskering en automatische belichtingsschatting een volgende fase.
Deze voorvertoning is geen productietekening of definitieve technische maatcontrole.

## Aanbevolen fotomateriaal van MetaalMeesters
Bij voorkeur 3–6 foto's, genomen in echte woningen (geen render):
- voldoende licht, hoog resolutiebestand, recht voor de deuropening;
- ook de vloer en omliggende muren zichtbaar;
- zonder bestaande deur (of met verwijderbare deur);
- minimaal 2000 px breed;
- vrij van herkenbare personen of persoonlijke documenten;
- rechten op gebruik en privacy gecontroleerd.

De eigen foto die een bezoeker uploadt, blijft lokaal in diens browser, tenzij de bezoeker later uitdrukkelijk een offerte indient. Op de statische GitHub Pages-demo kunnen nog geen privé-offertes ingezonden worden.

De broncode staat in `src/HousePreview.jsx`, `src/DoorScene.jsx`, `src/previewCapture.js` en `src/house-preview.css`.
