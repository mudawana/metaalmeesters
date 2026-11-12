# Maatvoering in cm en nieuwe 3D-materiaalaanpak

## Klantinvulling
- Alle breedte- en hoogtevelden tonen **centimeter**, ook bij glaswanden en het stalen onderpaneel.
- Geen `min` / `max`-attribute of directe clamping tijdens typen. Een klant mag het veld leeg maken en bijvoorbeeld `5000` of `225,5` typen. Een leeg/tijdelijk ongeldig veld verandert de laatst bruikbare ontwerpmaat niet.
- **0 cm = nog niet opgemeten** en wordt als zodanig vermeld in de offerte. Er is geen beloofde productierange; zeer grote of kleine maten worden uitsluitend als aanvraag geregistreerd.
- De offerte en het beheerpaneel tonen centimeters. Bestaande designs en API-opslag blijven intern millimeters gebruiken voor achterwaartse compatibiliteit.
- De 3D-preview mag zeer grote of zeer kleine maten grafisch begrenzen om stabiel en leesbaar te blijven, maar de getypte klantmaat wordt nooit stilzwijgend gewijzigd.
- Bij álle typen — recht, dubbel, pivot, wand en boog — staat duidelijk dat **MetaalMeesters altijd zelf ter plaatse definitief opmeet vóór productie**.

## Boogdeuren
- Geen booghoogte-slider, radiusinstelling, dubbeleboogschakelaar of presets meer voor de klant.
- Bij een boogdeur volstaan de **breedte en de totale hoogte**.
- De 3D-voorbeeldboog krijgt intern een automatisch berekende kromming; het atelier bepaalt de exacte boog na opmeting.
- Ook oude opgeslagen ontwerpen met boogparameters tonen voortaan de vereenvoudigde klantinterface.

## Materiaaltechniek / realtime PBR
Geraadpleegde documentatie:
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial): transmission, thickness, IOR, absorptiekleur en afwerking.
- [Three.js color management](https://threejs.org/manual/en/color-management.html): sRGB kleurconversies en lineaire belichting.
- [Drei Lightformer](https://drei.docs.pmnd.rs/staging/lightformer): lichtpanelen als studio-reflecties in de environment map.
- [Drei Accumulative Shadows](https://drei.docs.pmnd.rs/staging/accumulative-shadows): zachtere schaduwen in 3D, mits aangepaste budgettering.

Uitgevoerd:
- Deurstalen worden niet meer allemaal als sterk spiegelend bare metal gesimuleerd. Poederlak gebruikt een dielektrische, licht reflecterende coating; anodic-look afwerkingen krijgen iets meer metaalreflectie.
- Een herhaalbare, kleine normalmap geeft de coating subtiele orange-peel structuur in strijklicht.
- AgX tonemapping en een hogere resolutie van de lokale studio-reflectieomgeving zorgen voor neutralere hooglichten.
- Heldere glasopties hebben een neutralere oppervlaktekleur; getint glas gebruikt fysieke absorptie en transmissie.
- Bestaande reflecties, gelokaliseerde glassoort-reliëf-texturen, afgeronde profielen en zachte contactscha­duwen blijven behouden.

**Belangrijk:** realtime rendering is niet identiek aan een productfoto. Voor nauwkeurige kleur-, optische glas- en profielweergave zijn echte materiaalstalen, technische tekeningen en kalibratiefoto's van MetaalMeesters nodig. Ook het plaatsen op een eigen foto blijft een indicatieve 3D-overlay; bestaande deuren worden niet automatisch verwijderd.
