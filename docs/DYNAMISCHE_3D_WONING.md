# Dynamische 3D-woning in de MetaalMeesters-configurator

## Wat werkt

Bij openen van `/configurator/` staat standaard de **3D-woning** in beeld.
De bezoeker kan direct de deurbreedte en -hoogte in millimeters wijzigen.
De 3D-gevel wordt bij iedere wijziging op basis van de nieuwe maten berekend:
- een echte opening in een geometrische muur (dus geen foto-overlay of deur voor een dichte muur);
- de linker- en rechtermuurbanken worden aangepast;
- de ramen links en rechts schuiven mee met de nieuwe deurbreedte;
- boven de opening schuift het bovenraam omhoog met de nieuwe deurhoogte;
- bij een grotere deur groeit zo nodig de volledige woningbreedte of gevelhoogte;
- de dorpel, latei, kozijnomlijsting en entreepad schalen mee met de opening.

De geometrische berekeningen staan centraal in `src/house-geometry.mjs` en worden
bij iedere productconfiguratie opnieuw gebruikt. Tests voor grensmaten en toleranties
in `tests/house-geometry.test.mjs`.

De modellen bevatten een echte 3D-facade, glasramen, een inkomhal achter de deur,
dakrand, gevelverlichting, vloer, voortuin, pad en plantbakken. Alles is procedureel
met Three.js-objecten gemaakt; geen gefingeerde foto van een echte woning.
De bezoeker kan de camera draaien en zoomen, de voorgevel in lichte of donkere
afwerking zetten en kiezen tussen een overzicht en een close-up van de deur.

## Drie weergaven

1. **3D-woning** — standaard, schaalbare gebouwgeometrie.
2. **Echte woningfoto** — vier gelicentieerde stockfoto's en de upload van een eigen foto,
   met handmatig verplaatsen en schalen van de deur.
3. **3D-atelier** — de oorspronkelijke vrije deurweergave.

Een afbeeldingsdownload exporteert de op dat moment zichtbare compositie.

## Bouwkundige disclaimers

Het is een architecturale productvisualisatie, geen gevalideerde bouwtekening.
De 40 mm breedte- en 25 mm hoogtetolerantie zijn *visualisatieaannames*,
niet de productie-/montagetoleranties van MetaalMeesters.
Technische haalbaarheid, deurtype, profielsystemen, montage, dorpels, glasdiktes
en structurele stabiliteit moeten door een bevoegd vakman worden gecontroleerd.
Niet elke voorgestelde combinatie kan daadwerkelijk gebouwd worden.

## Mogelijke latere verbetering

Echte CAD-profielen en goedgekeurde hoogtes/breedtes vanuit het atelier,
gedetailleerde PBR-materialen en gecontroleerde armaturen.
