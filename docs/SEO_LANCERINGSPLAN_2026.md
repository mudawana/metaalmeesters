# METAALMEESTERS — SEO-onderzoeks- en lanceringsplan (12 november 2026)

## Doel en positionering
**Doel**: de bestaande domeinwaarde van `metaalmeesters.eu` behouden én de nieuwe website klaarzetten voor bezoekers die stalen deuren en glaswanden op maat zoeken, vooral in de regio Antwerpen. De GitHub-preview moet **niet** door Google worden geïndexeerd. Geen rankings worden gegarandeerd.

### Marktobservaties (kwalitatief, geen zoekvolumetool)
Regionale concurrentie/alternatieven die bij een Antwerpse zoekopdracht voorkomen:
- Staal Design (Antwerpen) — stalen binnendeuren en wanden met maatwerk en opmeting.
- STEEL-GROUP (Antwerpen) — stalen deuren met glas, meerdere deurtypen.
- Steelinteriors (Schilde) — stalen deuren en glaswanden.
- Porte V (Ranst) — pivot-, enkele en dubbele deuren.
- My Doors (Zwijndrecht) — binnendeuren en staal-look.
- Camba Ramen biedt prijsinformatie rond stalen binnendeuren op hun website, maar **die prijzen mogen niet worden toegeschreven aan MetaalMeesters**.

De zoektermen hieronder zijn geformuleerd vanuit klantintentie en regionale aanbieders. **Werkelijk zoekvolume, keyword difficulty en omzetpotentieel zijn niet gemeten.** Dat kan na livegang met Search Console en (optioneel) Keyword Planner / een zoekwoordenplatform.

## Zoekwoordclusters en landingspagina's
| URL | Primaire zoekintentie | Ondersteunende klantvragen |
|---|---|---|
| `/` | stalen deuren op maat Antwerpen | stalen binnendeuren, maatwerk Antwerpen |
| `/stalen-deuren-op-maat/` | stalen deuren op maat | stalen binnendeur, dubbele stalen deur, enkele stalen deur |
| `/pivotdeuren/` | pivotdeur staal, taatsdeur op maat | draait een pivotdeur in beide richtingen, vloer en pivotsysteem |
| `/boogdeuren/` | stalen boogdeur, deur met boog glas | afmeting, mat glas, bestaande boogopening |
| `/stalen-glaswanden/` | stalen glaswand met deur | roomdivider staal glas, vaste panelen met deur |
| `/glas-voor-stalen-deuren/` | glas stalen deur, mat glas | Flute, Canalé, Oceanic, gelaagd vs gehard |
| `/prijs-stalen-deuren/` | prijs stalen deur op maat | prijs pivotdeur, offerte, montage en beslag |
| `/configurator/` | stalen deur configurator, stalen deur ontwerpen | eigen foto, maatvoering, glas, kleur |

**Bewust niet gedaan:** tientallen bijna identieke gemeente-landingpages, schijnreviews, gefingeerde atelierervaring of ononderbouwde prijzen.

## Wat technisch is voorbereid
- Zes inhoudelijk verschillende themapagina's, elk met eigen titel, meta-description, H1, nuttige H2's, echte klantvragen en interne links.
- Prerendering in HTML zodat Google de teksten zonder JavaScript kan lezen. Dit is extra belangrijk omdat de 3D-configurator zwaar is.
- Links van Home, Diensten en Footer naar pagina's; breadcrumbnavigatie per thema.
- `LocalBusiness` en `WebSite` JSON-LD, plus per themapagina `Service` en `BreadcrumbList`. Geen fictieve Reviews of Product-prijzen. Structured data geeft geen gegarandeerde rich results.
- Canonical URLs wijzen naar `https://metaalmeesters.eu`. De GitHub-preview houdt `noindex` en blijft geblokkeerd via `robots.txt` (geen index-concurrentie).
- Eigen `sitemap.xml` wordt bij productie-build gegenereerd. Niet-goedgekeurde wettelijke pagina's blijven buiten de productiesitemap.
- Twitter/OpenGraph-metadata met foto uit eigen projectbestanden en unieke paginabeschrijvingen.
- Publicatieworkflow kopieert de nieuwe URL-mappen correct naar de GitHub Pages-boom.
- Automatische SSR/route-tests om te voorkomen dat een pagina alleen een lege React-schaal toont.

## Waarom deze strategie (Google + Reddit)
- Google: people-first content en informatie die werkelijk helpt, liever dan automatisch geproduceerde honderden dunne pagina's; zoekwoorden in titels, headings en beschrijvende links.
- Discussie op r/localseo over essentiële pagina's: homepage, dienstenpagina's, echte contactgegevens, een echte Over Ons-pagina en nuttige veelgestelde vragen. Stadspagina's alleen als ze unieke waarde hebben.
- Reddit-ervaringen bij kleine bedrijven: foto's van echt werk, actief Google Business Profile en oprechte reviews kunnen zichtbaar helpen (anekdotisch, geen garantie).
- Google Bedrijfsprofiel: de maatschappelijke zetel is **niet** per definitie een klantenadres. Als Ahmed uitsluitend op locatie werkt zonder bemande showroom, moet het GBP worden ingericht als servicegebiedbedrijf en kan het adres verborgen moeten worden.

Bronnen:
- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://www.reddit.com/r/localseo/comments/1pwo0mq/what_are_the_most_important_pages_for_a_local/
- https://www.reddit.com/r/smallbusiness/comments/1rld31j/small_change_to_our_seo_google_business_profile/
- https://support.google.com/business/answer/3038177
- https://www.netlify.com/pricing/
- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/

## Acties die Ahmed/moeder-website nog nodig hebben
1. Google Search Console-toegang tot de bestaande domeinproperty, exporteer prestaties, indexstatus en zoekopdrachten.
2. Maak een backup van WordPress, verzamel de bestaande URL-lijst en bouw een exacte **301-overdrachtskaart** voor elke pagina die van slug verandert. Geen blind redirecten naar de homepage; behoud oude URLs waar mogelijk.
3. Foto's en 2–4 echte gedocumenteerde gerealiseerde projecten toevoegen per belangrijkste producttype waar beschikbaar, met eigen originele foto's en toestemming.
4. Ahmed controleren welke producttypes, glazen, kleuren en technieken hij definitief aanbiedt. Controleer alle FAQ's.
5. GBP claimen/beheren; juiste primaire categorie, echte foto’s, servicegebied, contactinfo en legitieme klantbeoordelingen verzamelen, **zonder incentives of nepreviews**.
6. Uitleg en bedrijfsidentiteit op Over Ons verbeteren, als Ahmed atelierinformatie en foto's goedkeurt.
7. Na lancering: `https://metaalmeesters.eu/sitemap.xml` bij Search Console indienen, redirects/canonicals controleren, 404’s volgen.
8. Wekelijks prestatiemetingen volgen na migratie, kernpaginas uitbreiden met echte klantvragen; niet zomaar teksten herschrijven voor een verzonnen zoekvolume.
9. Privacy en offerteverwerking afronden en de DNS/MX-records bij de migratie exact behouden.
10. Mobiele pagespeed en LCP/INP/CLS meten in PageSpeed Insights en Search Console; beelden optimaliseren, Three.js uitsluitend op configurator laden.

## E-mail en hosting NA de SEO-fase
Netlify Free: $0, 300 credits per maand, hard plafond. Er is geen regel voor 100 bezoekers per dag. Publicaties, bandbreedte en serverfuncties gebruiken credits; bij overschrijden kan de site tijdelijk pauzeren. Voor zakelijk betrouwbaar verkeer mogelijk later Personal ($9/maand). Een **website hosten is niet hetzelfde als e-mail ontvangen**. Voor `info@metaalmeesters.eu` is een mailboxprovider nodig; voor de website-offertealerts kan Resend als transactionele e-maildienst worden ingesteld met correcte SPF/DKIM/DMARC en zonder de huidige MX-records te veranderen. Het domein blijft vooralsnog bij WordPress.

## Extra vertrouwenspagina
De pagina `/over-ons/` verduidelijkt de officiële bedrijfsidentiteit, de werkwijze met eigen opmeting, de stappen van het ontwerp en hoe klanten contact opnemen. Er worden geen niet-geverifieerde jaren ervaring, awards, teamfoto's of showroomclaims toegevoegd. Na Ahmeds goedkeuring kunnen er echte atelierfoto's en een kort verhaal over het bedrijf aan worden toegevoegd.

## Performance-maatregel
Homepage-afbeelding krijgt eager/high priority; de overige informatieve sitefoto's worden lazy geladen. Dit verlaagt onnodige concurrentie met de LCP-afbeelding. De belangrijkste JPEGs zijn momenteel circa 0,8–1,1 MB; conversie naar WebP/AVIF met correcte mobiele afmetingen kan na het verkrijgen/controleren van de originele foto-assets extra winst geven.

## Correcte HTTP 404-status op de uiteindelijke hosting
In de vroegere `netlify.toml` stuurde een globale `/* -> /index.html 200`-rewrite ook onbestaande URL's door naar de homepage. Omdat elk geldig pad nu via een echte `dist/<slug>/index.html` wordt opgebouwd, is deze rewrite verwijderd. `public/404.html` wordt een eigen foutpagina die Netlify bij niet-bestaande URL's met een **HTTP 404**-status serveert. Dit voorkomt generieke soft 404s. Exacte permanente 301-redirects voor de oude WordPress URLs moeten **pas na het ophalen van een echte URL-inventaris** worden toegevoegd, zodat bestaande ranking-signalen niet verloren gaan.

Referentie: https://docs.netlify.com/manage/routing/redirects/redirect-options/ en https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
