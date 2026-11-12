# MetaalMeesters – wettelijke pagina's: controlelijst vóór livegang

**Status: ontwerp, NIET goedgekeurd.** Toegevoegd op 12 november 2026. De onderneming is op 12 november 2026 geïdentificeerd via Companyweb en aanvullende openbare registerdata. De formele juridische en privacygoedkeuring blijft nodig.

## Wat is in code toegevoegd?
- `/privacy/`: privacyverklaring over contact, offertes, 3D-ontwerpen, eventuele woningfoto's, hosting, rechten en verwerking.
- `/cookies/`: functionele localStorage `mm-door-design`, beheersessiecookie `mm_beheer_session` (max. 8 uur), uitleg over cookies en externe lettertypes.
- `/bedrijfsgegevens/`: handelsnaam, e-mail, telefoon en **duidelijk gemarkeerde ontbrekende wettelijke identificatiegegevens**.
- Voettekst met links naar alle drie pagina's; formulier vermeldt de privacyverklaring.
- SEO-pre-rendering en aparte URLs met canonicals. Zolang `LEGAL_APPROVED=false` zijn deze drie pagina's `noindex` en niet opgenomen in de sitemap van de productiebuild.

## Wat Ahmed nog MOET bezorgen/bevestigen
1. **Volledige officiële bedrijfsnaam** zoals bij de KBO geregistreerd.
2. **Juridisch vestigingsadres**, huisnummer, postcode en gemeente. Alleen 'Smoutpot, Zwijndrecht' in de oude site is onvoldoende.
3. **Ondernemingsnummer (KBO)** en, waar van toepassing, **btw-identificatienummer**. Niet gokken!
4. Bevestiging dat het gebruikte e-mailadres `info@metaalmeesters.eu` en telefoonnummer `+32 472 86 48 88` correct zijn.
5. De identiteit van de verwerkingsverantwoordelijke en het gepaste **bewaarbeleid** voor offertes, afbeeldingen, e-mails en serverlogs. De code ondersteunt handmatige verwijdering; **geen automatische verwijdering na x maanden**.
6. Verwerkersovereenkomsten, de uiteindelijke hostingprovider en eventuele doorgifte buiten de EER. De voorgestelde implementatie gebruikt Netlify Blobs en optioneel Resend; pas waarheidsgetrouwe omschrijving aan zodra actief.
7. Of externe **Google Fonts** doorgeladen blijven of lokaal gehost worden. Momenteel verwijst `site.source.html` naar fonts.googleapis.com en fonts.gstatic.com.
8. Of Analytics, Meta Pixel, Google Ads, video's van derden of andere trackers worden gebruikt. Als niet-noodzakelijke cookies/tracking worden toegevoegd, implementeer dan **voorafgaande expliciete toestemming, met een even makkelijke weiger- en intrekoptie**. De gecontroleerde code bevat nu geen marketing-/analysetrackers, dus er is nog geen banner toegevoegd.
9. Controle van alle contact-/offerteformulieren en uitleg over de woningfoto. De optionele foto wordt lokaal verwerkt; een **samengestelde afbeelding** kan bij verzenden van een offerte opgeslagen worden.
10. Juridische eindcontrole door Ahmed en zo nodig een GDPR-jurist. De teksten zijn een technische eerste versie, geen definitief juridisch advies.

## Afrondprocedure
- Vul `src/legal-profile.mjs` in met **geverifieerde bedrijfsgegevens**.
- Controleer de inhoud in `src/LegalPages.jsx` tegen de effectief gebruikte diensten, bewaartermijnen en serverinstellingen.
- Werk GDPR-processen voor inzage/verwijdering en de echte bewaartermijn operationeel uit (niet enkel op papier).
- Na expliciete goedkeuring en het verifiëren van alle velden mag `LEGAL_APPROVED` in `src/legal-profile.mjs` naar `true` zodat de waarschuwing verdwijnt en de pagina's indexeerbaar worden.
- Test `/privacy/`, `/cookies/` en `/bedrijfsgegevens/` op laptop en gsm. Controleer directe URLs, de footer en de links in het formulier.
- Publiceer niet op `metaalmeesters.eu` vóór de ontbrekende wettelijke details zijn ingevuld.

## Bronnen
- Belgische FOD Economie, verplichte ondernemingsgegevens: https://news.economie.fgov.be/203683-deze-info-moet-u-zeker-vermelden-op-uw-bedrijfswebsite/
- Belgische GBA, cookies en strikt noodzakelijke uitzonderingen: https://www.gegevensbeschermingsautoriteit.be/professioneel/thema-s/cookies
- AVG, art. 13 (te verschaffen informatie): https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=celex:32016R0679

## Officiële bedrijfsidentiteit (gecontroleerde openbare bronnen)
- Officiële onderneming: **Metaalmeesters BV**
- Ondernemingsnummer: **1035.390.965**
- Btw-nummer: **BE 1035.390.965**
- Maatschappelijke zetel: **Lange Lobroekstraat 58, 2060 Antwerpen, België**
- Rechtsvorm: besloten vennootschap
- Bron: https://www.companyweb.be/nl/1035390965/metaalmeesters en https://www.goudengids.be/bedrijf/Antwerpen/L623868931/Metaalmeesters/
- Dit is het *statutair adres*; geen bevestiging van showroom of bezoekadres.
- Het telefoonnummer en e-mailadres op de website zijn bestaande codegegevens en zijn **niet** bevestigd door de openbare registerbron.

## Technische correctie publicatie
De GitHub Pages-workflow synchroniseerde eerder alleen de root en bepaalde bestaande pagina's naar de legacy Pages-bronmap. Daardoor kwamen de nieuwe wettelijke pagina's wel in `dist` maar **niet** in de gepubliceerde repositorymap. De lijst is uitgebreid met `privacy`, `cookies` en `bedrijfsgegevens`, inclusief een buildcontrole op de drie bestanden.
