# Realistischere 3D-weergave – MetaalMeesters

## Uitgevoerd
- De stalen frames gebruiken fysisch gebaseerde, licht reagerende materialen en soft-shadow belichting.
- Een lokale (offline) studio-reflectieomgeving met meerdere lichtvlakken geeft natuurlijke highlights op staal, handgrepen en glas; geen externe HDRI-download vereist.
- De glasfamilies hebben specifieke eigenschappen voor transmissie, tint, matte ruwheid en kleuring.
- Flute, Canalé, Crêpe, Oceanic en Martelé gebruiken herhaalbare *normal maps* met reliëf. Hierdoor beweegt het licht over de structuur wanneer de camera draait, in plaats van vaste, ondoorzichtige streepjes.
- Draadglas houdt een echte zichtbare fijne draadstructuur.
- Handgrepen zijn met ronde/beveled 3D-geometrie, voetplaat, bevestigingen en metalen reflecties opnieuw opgebouwd. Scharnieren hebben een cilinder en platen.
- Onderaan een stalen paneel: een echte verdiepte stalen plaat met dikte, rand en lichtreflectie.
- In de 3D-atelierweergave wordt een echte opening in de muur geconstrueerd met een achterliggende ruimte voor diepte en parallax, inclusief hoekvullingen bij bogen.
- De belichting en slagschaduw in de fotoweergave zijn instelbaar, en dezelfde filtering gaat mee in geëxporteerde JPG's.
- Camera en kader zijn aangepast aan grote en kleine configuraties.

## Kwaliteitscontroles
- Met eenheden van meters/kleurtheorie worden texturen op de juiste fysieke schaal weergegeven, ook bij het gebogen glaspaneel met UV-coördinaten in meters.
- Seams/reliëfpatronen worden automatisch getest.
- Geen HDRI-, panorama- of klantfoto's van onbekende licentie als extern vereiste toegevoegd; de showroom reflecties zijn procedureel.

## Grenzen van de visualisatie
Deze preview is **geen productfoto en geen CAD-opmeting**. Het is niet verantwoord om zonder atelierdata te beweren dat exacte glassoort, lichtbreking, oppervlaktebehandeling, beslag, sluiting, radius of kleur 1:1 gelijk zijn aan een gerealiseerde deur.

Voor een werkelijk productgetrouw model van elke door MetaalMeesters verkochte variant zijn nauwkeurige profiel-doorsnedes, beslagreferenties, materiaalmonsters en productfotografie noodzakelijk. Een klantfoto met een bestaande deur wordt niet automatisch objectvrij gemaakt; de 3D-deur wordt er als overlay op geplaatst. De klanteninterface blijft daarom deze beperkingen expliciet vermelden.

## Werkomgeving
Alle wijzigingen staan in de originele GitHub-repository `mudawana/metaalmeesters`. De aparte `mudawana/metaal-demo` wordt niet gewijzigd.
