import React from 'react';
import {ArrowRight,ArrowUpRight,CheckCircle2,Ruler,ShieldCheck} from 'lucide-react';
import {pageHref} from './seo-routes.js';
import {imageUrl} from './data.js';
import {BUSINESS_DETAILS} from './legal-profile.mjs';
import './seo-services.css';
export default function OverOnsPage(){
 return <main className="interior-page seo-service-page">
  <header className="seo-service-head"><div className="container">
    <nav aria-label="Broodkruimelpad" className="seo-breadcrumb"><a href={pageHref('home')}>Home</a><span>/</span><span aria-current="page">Over ons</span></nav>
    <div className="seo-service-head-grid">
      <div><span className="eyebrow">MAATWERK IN STAAL EN GLAS</span><h1>Over MetaalMeesters in Antwerpen</h1>
        <p>MetaalMeesters is een onderneming voor metaalwerk op maat. Op onze website ontdekt u stalen binnendeuren, glaswanden, pivot- en boogdeuren en andere metaalconstructies. Elk project begint met een gesprek over wat u nodig hebt.</p>
        <div className="seo-hero-actions"><a className="btn btn-dark" href={pageHref('contact')}>Stel uw vraag <ArrowUpRight size={17}/></a><a className="seo-text-link" href={pageHref('projecten')}>Bekijk realisaties <ArrowRight size={17}/></a></div>
      </div>
      <div className="seo-service-visual"><img src={imageUrl('details')} alt="Detail van een metalen maatwerkconstructie op de MetaalMeesters-website" width="450" height="338" fetchPriority="high"/><span>MEER OVER ONS WERK</span></div>
    </div>
  </div></header>
  <div className="container seo-service-content">
   <div className="seo-service-main">
    <section className="seo-text-section"><span className="seo-section-kicker">01 / PERSOONLIJK OVERLEG</span><h2>Van uw ideeën naar een haalbaar deurontwerp</h2>
      <p>U hoeft geen technisch plan klaar te hebben om ons te contacteren. Vaak begint het bij een foto van een deuropening, een voorbeeld dat u aanspreekt of een eerste schets met een geschatte breedte en hoogte.</p>
      <p>Via de 3D-configurator kunt u verschillende glastinten, roeden, handgrepen en staalafwerkingen combineren. De visualisatie helpt om uw smaak duidelijk te maken, maar is geen bouw- of productieplan. Een medewerker bespreekt met u de werkelijke mogelijkheden.</p></section>
    <section className="seo-text-section"><span className="seo-section-kicker">02 / EXACT OPMETEN</span><h2>Wij komen zelf de afmetingen controleren</h2>
      <p>Een fraaie stalen deur vraagt om een correcte aansluiting met de bestaande opening. Daarom meten wij de definitieve hoogte, breedte en aansluitingen altijd zelf op vóór productie. Dat geldt zowel voor rechte deuren als voor boogdeuren en glaswanden.</p>
      <p>De definitieve keuze van glasveiligheid, profielen, sluitingen en montagewijze hangt af van de concrete toepassing. Wat in de configurator getoond wordt, wordt daarom nog technisch gecontroleerd.</p></section>
    <section className="seo-text-section"><span className="seo-section-kicker">03 / MATERIAAL EN UITSTRALING</span><h2>Staal, glas en afwerking in samenhang</h2>
      <p>Hetzelfde deurmodel kan anders aanvoelen met helder of mat glas, met een fijn reliëf of een warme anodic-look kleur. We helpen u om de belangrijkste keuzes overzichtelijk te maken, zonder dat u de technische begrippen al hoeft te kennen.</p>
      <p>Bekijk <a className="seo-text-link" href={pageHref('stalen-deuren-op-maat')}>de mogelijkheden voor stalen deuren <ArrowRight size={15}/></a> en <a className="seo-text-link" href={pageHref('glas-voor-stalen-deuren')}>de verschillende glassoorten <ArrowRight size={15}/></a>.</p></section>
    <section className="seo-text-section"><span className="seo-section-kicker">04 / TRANSPARANT CONTACT</span><h2>Wie staat er achter de website?</h2>
      <p>De onderneming is officieel geregistreerd als <strong>{BUSINESS_DETAILS.officialName}</strong>, ondernemingsnummer <strong>{BUSINESS_DETAILS.enterpriseNumber}</strong>, met maatschappelijke zetel te {BUSINESS_DETAILS.streetAndNumber}, {BUSINESS_DETAILS.postalCode} {BUSINESS_DETAILS.municipality}. Dat is het wettelijk adres, niet noodzakelijk een vrij te bezoeken toonzaal.</p>
      <p>U bereikt MetaalMeesters via <a className="seo-text-link" href={'mailto:'+BUSINESS_DETAILS.email}>{BUSINESS_DETAILS.email} <ArrowRight size={15}/></a> of via het <a className="seo-text-link" href={pageHref('contact')}>contactformulier <ArrowRight size={15}/></a>. Bekijk ook onze <a className="seo-text-link" href={pageHref('bedrijfsgegevens')}>officiële bedrijfsgegevens <ArrowRight size={15}/></a>.</p></section>
   </div>
   <aside className="seo-service-aside"><div className="seo-aside-content"><Ruler size={26}/><strong>Opmeting vóór productie</strong><p>Online maten dienen als schatting. Het atelier meet zelf de exacte situatie op vóór een bestelling wordt uitgevoerd.</p>
    <a href={pageHref('configurator')}>Ontwerp uw deur <ArrowRight size={16}/></a></div>
   <div className="seo-aside-content secondary"><ShieldCheck size={26}/><strong>Open over uitvoering</strong><p>Geen automatische prijs of technische garantie op basis van alleen een 3D-afbeelding.</p><a href={pageHref('prijs-stalen-deuren')}>Hoe wordt een offerte bepaald? <ArrowRight size={16}/></a></div></aside>
  </div>
  <section className="seo-final-cta"><div className="container seo-final-cta-inner"><div><span className="eyebrow light">UW IDEE BESPREKEN?</span><h2>Stel uw vragen over <em>maatwerk in staal.</em></h2><p>Wij bekijken graag welke vorm en afwerking bij uw opening passen.</p></div><a className="btn btn-cream" href={pageHref('contact')}>Neem contact op <ArrowUpRight size={17}/></a></div></section>
 </main>;
}
