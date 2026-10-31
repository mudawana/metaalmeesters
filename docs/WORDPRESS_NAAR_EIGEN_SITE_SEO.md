# Migratie van WordPress naar eigen React-site zonder SEO-verlies

Status: voorbereiding. Live domein en WordPress zijn niet aangepast.

## Gebouwde URL's
Bij het bouwen worden echte HTML-pagina's op deze paden gepubliceerd:
- `/`
- `/diensten/`
- `/projecten/`
- `/contact/`
- `/offerte/`
- `/configurator/`
- `/portfolio/<bestaande-projectslug>/` (9 projectpagina's)

De HTML van gewone pagina's is vooraf op de server/build gerenderd; de browser hydrateert daarna React.
De interactieve 3D-configurator krijgt een indexeerbare introductie en laadt de 3D-view uitsluitend in de browser.
Elke pagina heeft een eigen title, meta description, canonical, Open Graph en één H1.
De build maakt daarnaast `sitemap.xml` en `robots.txt` aan.
De GitHub Pages-demo krijgt `noindex,follow` om een dubbele vindbare site op `github.io` te voorkomen.

## Nog verplicht vóór omzetten van het domein
1. Download de huidige WordPress-site en database; bewaar ook oude uploads.
2. Controleer álle geïndexeerde URLs, redirects, zoektermen en klikken via Google Search Console.
3. Inventariseer 9 oorspronkelijke `/portfolio/`-pagina's. Vergelijk hun content en beeldmateriaal en vervang tekst en projectfoto's in de nieuwe website waar nodig. Deze bouw bevat voorlopig samenvattingen, nog geen volledige migratie van alle uploads.
4. Controleer belangrijke backlinks, actieve formulieren, oude PDF's en SEO-instellingen.
5. Host de publieke site op een eigen account van MetaalMeesters (bijv. Netlify) met gekoppelde GitHub.
6. Configureer de **aparte beveiligde offertebackend**, admin-authenticatie, spambeveiliging, privacystatement, bewaartermijn en e-mailmelding. De GitHub Pages-demo kan geen echte offertes aannemen.
7. Test de klantflows en mobile performance; audit pagina's met Lighthouse, Rich Results Test en Search Console.
8. Koppel het bestaande `metaalmeesters.eu` domein en verander DNS pas ná expliciete toestemming en succesvolle tests.
9. Houd oude URLs gelijk. Voor iedere gewijzigde URL een server-side 301/308 naar de overeenkomstige nieuwe pagina, **niet massaal naar de homepage**.
10. Meld de sitemap `https://metaalmeesters.eu/sitemap.xml` aan via Search Console en controleer het eerste kwartaal op 404's en zoekverkeer.

Google richtlijnen: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

## Hosting
De build is statisch, dus de publieke site kan op gratis static hosting binnen gratis limieten draaien.
Voor privé-offertes, foto's en e-mailmeldingen is een backend nodig; die kan ook in een gratis pakket vallen maar is niet gegarandeerd kosteloos bij intensief gebruik. Domeinnaam en zakelijke e-mail zijn aparte contracten.

## Websitecode
React/Vite, geen WordPress of WordPress-database. Bij levering horen repository, DNS en hosting onder eigen zakelijke accounts van MetaalMeesters of onder schriftelijk afgesproken beheer.
