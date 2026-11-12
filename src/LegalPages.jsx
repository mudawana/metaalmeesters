import React from 'react';
import {ArrowUpRight,CheckCircle2,ExternalLink,Info,Mail,ShieldCheck} from 'lucide-react';
import {BUSINESS_DETAILS as biz,LEGAL_APPROVED,LEGAL_LAST_UPDATED} from './legal-profile.mjs';
import {pageHref} from './seo-routes.js';
import './legal.css';

const Email=()=> <a href={'mailto:'+biz.email}>{biz.email}</a>;
const Missing=({children})=><span className="legal-unverified">{children||'Nog aan te vullen na verificatie'}</span>;
function LegalIntro({tag,title,subtitle}){
  return <div className="container legal-intro">
    <span className="eyebrow">{tag}</span>
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <small>Laatst bijgewerkt: {LEGAL_LAST_UPDATED}</small>
  </div>;
}
function DraftWarning(){
  if(LEGAL_APPROVED)return null;
  return <div className="legal-draft" role="note"><Info size={21} aria-hidden="true"/>
    <div><strong>Deze informatie wordt voorbereid voor de officiële lancering.</strong>
      <p>De officiële onderneming en haar maatschappelijke zetel zijn ingevuld op basis van openbare Belgische bedrijfsgegevens. De afspraken over gegevensbewaring, gebruikte dienstverleners en de definitieve privacytekst moeten nog door MetaalMeesters worden goedgekeurd. Deze pagina is dus nog een ontwerp.</p>
    </div>
  </div>;
}
function LegalLayout({tag,title,subtitle,children}){
  return <main className="interior-page legal-page">
    <LegalIntro tag={tag} title={title} subtitle={subtitle}/>
    <div className="container legal-layout">
      <div className="legal-article"><DraftWarning/>{children}</div>
      <aside className="legal-side" aria-label="Juridische informatie">
        <span className="eyebrow">OVER METAALMEESTERS</span>
        <strong>Vragen over uw gegevens?</strong>
        <p>Neem gerust rechtstreeks contact op met MetaalMeesters.</p>
        <Email/>
        <div className="legal-sidebar-links">
          <a href={pageHref('privacy')}>Privacyverklaring <ArrowUpRight size={15}/></a>
          <a href={pageHref('cookies')}>Cookiebeleid <ArrowUpRight size={15}/></a>
          <a href={pageHref('bedrijfsgegevens')}>Bedrijfsgegevens <ArrowUpRight size={15}/></a>
        </div>
      </aside>
    </div>
  </main>;
}
export function PrivacyPage(){
  return <LegalLayout tag="UW GEGEVENS" title="Privacyverklaring"
    subtitle="Hoe wij omgaan met contactgegevens, vrijblijvende offerteaanvragen en foto's van uw eigen woning.">
    <section><h2>1. Wie verwerkt uw gegevens?</h2>
      <p>MetaalMeesters is het aanspreekpunt voor de persoonsgegevens die via deze website worden verwerkt. Volgens de openbare Belgische bedrijfsregisters is dit Metaalmeesters BV, ondernemingsnummer 1035.390.965, met maatschappelijke zetel te Lange Lobroekstraat 58, 2060 Antwerpen.</p>
      <p><strong>Handelsnaam:</strong> {biz.tradingName}. <strong>Officiële ondernemingsnaam:</strong> {biz.officialName||<Missing/>}. <strong>Contact:</strong> <Email/>.</p>
      <p>De officiële maatschappelijke zetel en de overige wettelijke identificatiegegevens vindt u op de <a href={pageHref('bedrijfsgegevens')}>pagina met bedrijfsgegevens</a>. Het adres van de maatschappelijke zetel is niet noodzakelijk een bezoekadres.</p>
    </section>
    <section><h2>2. Welke gegevens verwerken wij?</h2>
      <ul>
        <li>Wanneer u contact opneemt: de naam, het e-mailadres en de inhoud van het bericht die u zelf in uw e-mailprogramma verstuurt.</li>
        <li>Wanneer u een offerte vraagt: uw naam, e-mailadres, eventueel telefoonnummer en gemeente, aanvullende opmerkingen en de gekozen deurspecificaties, waaronder de opgegeven maten.</li>
        <li>Bij de offerte: een samengestelde afbeelding van uw deurontwerp. Als u daarvoor een eigen woningfoto hebt gebruikt, kan die foto deel uitmaken van de afbeelding die met uw offerteaanvraag wordt verstuurd.</li>
        <li>Technische gegevens zoals beperkte verbinding- of beveiligingsinformatie die nodig kunnen zijn om misbruik te voorkomen en de website te laten werken.</li>
      </ul>
      <p><strong>Een foto alleen uploaden verzendt niets.</strong> Uw eigen foto wordt in de browser geopend en blijft daar totdat u bewust een afbeelding opslaat of het offerteformulier verzendt. Het ontwerp zelf kan lokaal op uw apparaat worden onthouden zodat u later verder kunt werken.</p>
    </section>
    <section><h2>3. Waarom verwerken wij uw gegevens?</h2>
      <ul>
        <li><strong>Vragen beantwoorden en offertes voorbereiden:</strong> om op uw verzoek te reageren en, waar van toepassing, stappen te zetten vóór een mogelijke overeenkomst (artikel 6, lid 1, b AVG).</li>
        <li><strong>Beveiliging en voorkoming van misbruik:</strong> om formulieren, beheertoegang en de website te beschermen, op basis van ons gerechtvaardigde belang (artikel 6, lid 1, f AVG).</li>
        <li><strong>Contractuele en wettelijke verplichtingen:</strong> wanneer na een offerte een opdracht ontstaat en gegevens volgens de toepasselijke wet bewaard moeten worden (artikel 6, lid 1, b of c AVG, afhankelijk van de situatie).</li>
      </ul>
      <p>Wij gebruiken uw offerteaanvraag niet automatisch voor nieuwsbrieven of gerichte advertenties. Hiervoor is, indien later ingevoerd, een afzonderlijke geldige rechtsgrond nodig.</p>
    </section>
    <section><h2>4. Met wie worden gegevens gedeeld?</h2>
      <p>Uw aanvraag wordt behandeld door MetaalMeesters en door eventuele dienstverleners die nodig zijn voor hosting, beveiligde opslag en zakelijke e-mail. De huidige technische opzet voorziet Netlify voor de website en privéopslag en, indien geactiveerd, Resend voor e-mailmeldingen. De definitief gebruikte leveranciers, verwerkersafspraken en eventuele doorgiften buiten de EER moeten vóór livegang worden gecontroleerd.</p>
      <p>Onze website gebruikt momenteel een externe Google Fonts-stylesheet om de lettertypes te laden. Bij het laden kunnen verbindingsgegevens met de aanbieder van die bron worden uitgewisseld. Of deze lettertypes nog extern worden geladen bij de definitieve website wordt bij oplevering gecontroleerd.</p>
    </section>
    <section><h2>5. Hoelang worden gegevens bewaard?</h2>
      <p>Offertegegevens worden niet langer bewaard dan noodzakelijk om een aanvraag te behandelen, hierover te communiceren en eventuele wettelijke verplichtingen na te komen. <strong>De concrete bewaartermijn en de verwijderprocedure moeten vóór de officiële lancering nog worden goedgekeurd en ingesteld.</strong> De huidige beheertoepassing ondersteunt het handmatig verwijderen van aanvragen, maar voert nog geen automatische verwijdering op basis van ouderdom uit.</p>
      <p>Het lokaal bewaarde deurontwerp blijft in uw browser totdat het wordt overschreven of de opslag van de browser wordt gewist. De beheersessiecookies verlopen na ongeveer acht uur.</p>
    </section>
    <section><h2>6. Uw rechten</h2>
      <p>Afhankelijk van de situatie kunt u uw gegevens inkijken, laten verbeteren, laten wissen of de verwerking laten beperken. U kunt bezwaar maken tegen verwerkingen op basis van gerechtvaardigd belang en, waar van toepassing, vragen om gegevensoverdraagbaarheid. Bij verwerkingen op basis van toestemming kunt u uw toestemming intrekken.</p>
      <p>Stuur hiervoor een bericht naar <Email/>. Wij kunnen vragen uw identiteit op een passende manier te bevestigen. U kunt ook een klacht indienen bij de <a href="https://www.gegevensbeschermingsautoriteit.be/" target="_blank" rel="noopener noreferrer">Gegevensbeschermingsautoriteit <ExternalLink size={13}/></a>.</p>
    </section>
    <section><h2>7. Automatische beslissingen en prijzen</h2>
      <p>De 3D-configurator toont een indicatief ontwerp en berekent geen bindende prijs. Een medewerker van MetaalMeesters beoordeelt een aanvraag en komt vóór productie zelf de definitieve maten opnemen. Er gebeurt geen geautomatiseerde beslissing met rechtsgevolgen op basis van uw ontwerp.</p>
    </section>
    <section><h2>8. Wijzigingen</h2>
      <p>Als onze werkwijze, hosting of gebruikte diensten veranderen, werken we deze informatie bij. De datum bovenaan vermeldt de laatste wijziging. Lees ook ons <a href={pageHref('cookies')}>cookiebeleid</a>.</p>
    </section>
  </LegalLayout>;
}
export function CookiePage(){
  return <LegalLayout tag="COOKIES EN OPSLAG" title="Cookiebeleid"
    subtitle="Welke technische opslag deze website gebruikt en wanneer toestemming nodig is.">
    <section><h2>1. Gebruiken wij cookies?</h2>
      <p>De huidige MetaalMeesters-website gebruikt een noodzakelijke beheersessiecookie voor de afgeschermde offerteadministratie en slaat de gekozen deurinstellingen lokaal op in uw browser. Deze browseropslag is geen traditionele cookie, maar valt onder vergelijkbare transparantieregels.</p>
      <p>In de gecontroleerde websitecode zijn op dit moment geen advertentiepixels of statistische trackingcookies geïntegreerd. Vóór livegang moet nog worden nagegaan of de uiteindelijke hosting of nieuwe integraties dit veranderen.</p>
    </section>
    <section><h2>2. Overzicht</h2>
      <div className="legal-table-scroll"><table className="legal-table">
        <thead><tr><th>Naam</th><th>Doel</th><th>Bewaring</th><th>Categorie</th></tr></thead>
        <tbody>
          <tr><td><code>mm-door-design</code></td><td>Door u gekozen deurspecificaties onthouden op dit apparaat (localStorage)</td><td>Tot uw ontwerp wordt overschreven of de browseropslag wordt gewist</td><td>Functionele browseropslag</td></tr>
          <tr><td><code>mm_beheer_session</code></td><td>De bevoegde beheerder na inloggen aangemeld houden</td><td>Maximaal 8 uur</td><td>Strikt noodzakelijke beveiligde sessiecookie</td></tr>
        </tbody>
      </table></div>
    </section>
    <section><h2>3. Moet u een cookiebanner accepteren?</h2>
      <p>Voor uitsluitend strikt noodzakelijke cookies is geen voorafgaande toestemming vereist. Daarom toont deze versie geen kunstmatige knop om alles te accepteren. Als we later Google Analytics, advertentiepixels of andere niet-noodzakelijke tracering activeren, vragen we daarvoor vooraf een geldige en intrekbare toestemming en passen we dit beleid aan.</p>
    </section>
    <section><h2>4. Externe diensten</h2>
      <p>De website laadt momenteel lettertypes via Google Fonts. Dit is een externe verbinding, ook al wordt daarbij niet noodzakelijk een cookie geplaatst. We beoordelen dit vóór de officiële lancering opnieuw en kunnen de lettertypes ook lokaal aanbieden om verbindingen met derden te beperken.</p>
    </section>
    <section><h2>5. Gegevens wissen</h2>
      <p>In de configurator kunt u opnieuw beginnen; daarmee wordt de vorige configuratie overschreven. U kunt de plaatselijke websitegegevens ook wissen via de privacy- of website-instellingen van uw browser. Bent u beheerder? Dan eindigt uw beheersessie na afmelden of uiterlijk wanneer de sessie verloopt.</p>
    </section>
    <section><h2>6. Meer weten?</h2>
      <p>Lees de <a href={pageHref('privacy')}>privacyverklaring</a> of stuur een vraag naar <Email/>.</p>
    </section>
  </LegalLayout>;
}
export function CompanyPage(){
  return <LegalLayout tag="TRANSPARANT ONDERNEMEN" title="Bedrijfsgegevens"
    subtitle="Contacteer MetaalMeesters en vind de gegevens van de onderneming achter deze website.">
    <section><h2>Identiteit van de onderneming</h2>
      <dl className="legal-company-details">
        <div><dt>Handelsnaam</dt><dd>{biz.tradingName}</dd></div>
        <div><dt>Officiële naam</dt><dd>{biz.officialName||<Missing>Wordt nog gecontroleerd</Missing>}</dd></div>
        <div><dt>Maatschappelijke zetel</dt><dd>{biz.streetAndNumber&&biz.postalCode?biz.streetAndNumber+', '+biz.postalCode+' '+biz.municipality:<Missing>Volledig zeteladres wordt nog gecontroleerd</Missing>}</dd></div>
        <div><dt>Ondernemingsnummer (KBO)</dt><dd>{biz.enterpriseNumber||<Missing>Wordt vóór livegang aangevuld</Missing>}</dd></div>
        <div><dt>Btw-identificatienummer</dt><dd>{biz.vatNumber||<Missing>Wordt vóór livegang gecontroleerd en, indien van toepassing, aangevuld</Missing>}</dd></div>
        <div><dt>E-mailadres</dt><dd><Email/></dd></div>
        <div><dt>Telefoon</dt><dd><a href={'tel:'+biz.telephoneHref}>{biz.phone}</a></dd></div>
        <div><dt>Website</dt><dd><a href="https://metaalmeesters.eu/">metaalmeesters.eu</a></dd></div>
      </dl>
    </section>
    <section><h2>Activiteiten en aanvragen</h2>
      <p>MetaalMeesters toont maatwerkproducten en -projecten. Met de 3D-configurator kunnen bezoekers een voorlopig deurontwerp samenstellen en vrijblijvend een offerte aanvragen. Dit is geen online bestel- of betaalsysteem. Afmetingen, uitvoering, beschikbaarheid en eventuele prijzen worden door MetaalMeesters afzonderlijk bevestigd.</p>
      <p>Vragen over het bedrijf of een offerte? Mail naar <Email/> of bel <a href={'tel:'+biz.telephoneHref}>{biz.phone}</a>.</p>
    </section>
    <section><h2>Bescherming van persoonsgegevens</h2>
      <p>Meer informatie over de verwerking van gegevens staat in onze <a href={pageHref('privacy')}>privacyverklaring</a> en ons <a href={pageHref('cookies')}>cookiebeleid</a>.</p>
    </section>
  </LegalLayout>;
}
