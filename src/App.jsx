import React, { useEffect, useState, Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, Mail, MapPin, Menu, Minus, Move3D, Phone, Plus, RotateCcw, Ruler, Send, ShieldCheck, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import {projects as portfolioProjects,pages as seoPages,pageHref,indexableRoutes} from './seo-routes.js';
import QuoteForm from './QuoteForm.jsx';
import {PrivacyPage,CookiePage,CompanyPage} from './LegalPages.jsx';
import SeoServicePage from './SeoServicePage.jsx';
import OverOnsPage from './OverOnsPage.jsx';
import {servicePages,servicePagesByRoute} from './seo-services.mjs';
import './admin.css';
import './balustrade.css';
// The heavy Three.js preview and private admin app are loaded only when needed.
const HousePreview=React.lazy(()=>import('./HousePreview.jsx'));
const Admin=React.lazy(()=>import('./Admin.jsx'));
const BalustradeConfigurator=React.lazy(()=>import('./BalustradeConfigurator.jsx'));
import {assets,imageUrl,initialDesign,TYPES,FRAMES,GLASSES,HANDLES,CLOSURES,PANEL_LAYOUTS,formatDesign,downloadDesign} from './data.js';
import {mmAsCm,cmAsMm,cmLabel,onsiteMeasureNote} from './measurement-units.mjs';
import {STEPS,FAVOURITES,featuredOptions,extraOptions,countExtra,sizesForType} from './configurator-ux.mjs';

const routeFromLocation=()=>{
  if(typeof window==='undefined')return 'home';
  const legacy=window.location.hash.match(/^#\/(.+?)(?:\?|$)/)?.[1];
  if(legacy&&(indexableRoutes.has(legacy)||legacy==='beheer'))return legacy;
  const base=import.meta.env.BASE_URL||'/';
  const path=window.location.pathname;
  const segment=(path.startsWith(base)?path.slice(base.length):path).replace(/^\/|\/$/g,'');
  return indexableRoutes.has(segment)||segment==='beheer'?segment:'home';
};
const nav=[['home','Home'],['stalen-deuren-op-maat','Stalen deuren'],['diensten','Diensten'],['projecten','Realisaties'],['contact','Contact'],['offerte','Offerte']];
function Img({name,alt='',...props}) {
  return <img src={imageUrl(name)} alt={alt} loading="lazy" decoding="async" onError={e=>{const fallback=imageUrl('hero');if(!e.currentTarget.src.endsWith(fallback))e.currentTarget.src=fallback;}} {...props}/>;
}
function Logo({light=false}) {
  return <a className={'brand '+(light?'brand-light':'')} href={pageHref('home')} aria-label="MetaalMeesters - home">
    <span className="brand-symbol"><span></span><span></span><span></span></span>
    <span className="brand-name">METAAL<span>MEESTERS</span><small>MAATWERK IN METAAL</small></span>
  </a>;
}
function Header({route}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>setOpen(false),[route]);
  return <header className={'site-header '+(route==='home'?'header-home':'')}>
    <div className="header-inner container">
      <Logo light={route==='home'}/>
      <nav className={'site-nav '+(open?'nav-open':'')} aria-label="Hoofdnavigatie">
        {nav.map(([url,label])=><a key={url} href={pageHref(url)} className={route===url?'active':''}>{label}</a>)}
        <a className="mobile-config" href={pageHref('configurator')}>3D-configurator <ArrowUpRight size={16}/></a>
      </nav>
      <a className="header-cta" href={pageHref('configurator')}>Ontdek de 3D-ontwerpstudio <ArrowUpRight size={16}/></a>
      <button className="menu-toggle" onClick={()=>setOpen(v=>!v)} aria-label="Menu openen of sluiten">{open?<X/>:<Menu/>}</button>
    </div>
  </header>;
}
function Footer() {
  return <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div><div className="eyebrow light">UW PROJECT, ONS VAKMANSCHAP</div><h2>Een idee in gedachten?<br/><em>Wij maken het waar.</em></h2></div>
        <a href={pageHref('contact')} className="round-link" aria-label="Contact opnemen"><ArrowUpRight size={27}/></a>
      </div>
      <div className="footer-grid">
        <div><Logo light/><p>Hoogwaardig metaalwerk op maat.<br/>Ontworpen met oog voor detail, gemaakt om lang mee te gaan.</p></div>
        <div><strong>Ontdek</strong><a href={pageHref('stalen-deuren-op-maat')}>Stalen deuren op maat</a><a href={pageHref('pivotdeuren')}>Pivotdeuren</a><a href={pageHref('boogdeuren')}>Boogdeuren</a><a href={pageHref('stalen-glaswanden')}>Glaswanden</a><a href={pageHref('glas-voor-stalen-deuren')}>Glassoorten</a><a href={pageHref('diensten')}>Alle diensten</a><a href={pageHref('projecten')}>Realisaties</a><a href={pageHref('over-ons')}>Over ons</a><a href={pageHref('configurator')}>3D-configurator</a></div>
        <div><strong>Contact</strong><a href="mailto:info@metaalmeesters.eu">info@metaalmeesters.eu</a><a href="tel:+32472864888">+32 472 86 48 88</a><span>Maatschappelijke zetel: Lange Lobroekstraat 58, 2060 Antwerpen</span></div>
        <div className="footer-legal-links"><strong>Wettelijke informatie</strong><a href={pageHref('privacy')}>Privacyverklaring</a><a href={pageHref('cookies')}>Cookies en opslag</a><a href={pageHref('bedrijfsgegevens')}>Bedrijfsgegevens</a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} MetaalMeesters. Alle rechten voorbehouden.</span><span>Met passie vervaardigd in Antwerpen. <a href={pageHref('home')+'#/beheer'} className="footer-admin-link">Beheerportaal</a></span></div>
    </div>
  </footer>;
}
function SectionHeading({label,title,description,action}) {
  return <div className="section-heading"><div><span className="eyebrow">{label}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action&&<a className="text-link" href={action[1]}>{action[0]} <ArrowUpRight size={17}/></a>}</div>;
}
function Home() {
  return <main>
    <section className="hero">
      <Img name="hero" className="hero-img" alt="Stalen en glazen constructie door MetaalMeesters" loading="eager" fetchPriority="high"/>
      <div className="hero-shade"/>
      <div className="container hero-content">
        <div className="hero-eyebrow"><span className="line"/> METAALMEESTERS · ATELIER VOOR STAAL & GLAS</div>
        <h1>Stalen deuren.<br/><em>Balustrades.</em></h1>
        <p>Architecturaal metaalwerk op maat in Antwerpen. Van verfijnde stalen deuren en glaswanden tot karaktervolle balustrades. Ontworpen voor uw ruimte, afgewerkt met oog voor elk detail.</p>
        <div className="hero-actions"><a href={pageHref('configurator')} className="btn btn-cream">Ontwerp in 3D <ArrowUpRight size={18}/></a><a className="hero-link" href={pageHref('projecten')}>Ontdek onze realisaties <ArrowRight size={18}/></a></div>
      </div>
      <div className="hero-bottom container"><span>MAATWERK IN STAAL · DEUREN & BALUSTRADES</span><span>SCROLL OM TE ONTDEKKEN <span className="scroll-line"/></span></div>
    </section>
    <section className="intro section-space container">
      <div className="intro-visual"><Img name="details" alt="Detail van een metalen constructie door MetaalMeesters"/><span className="visual-index">01 — VAKMANSCHAP</span></div>
      <div className="intro-copy"><span className="eyebrow">OVER METAALMEESTERS</span><h2>Gemaakt om te blijven.<br/><em>Ontworpen om te raken.</em></h2><p>Een stalen deur die licht binnenlaat. Een balustrade die architectuur versterkt. Wij geloven dat echt maatwerk zich toont in de lijnen, de materialen en de zorgvuldige afwerking.</p><p>Van het eerste idee tot de laatste afwerking denken onze vakmensen met u mee.</p><a className="text-link" href={pageHref('over-ons')}>Ontdek ons vakmanschap <ArrowUpRight size={18}/></a></div>
    </section>
    <section className="services-section section-space">
      <div className="container">
        <SectionHeading label="WAT WE DOEN" title={<>Architectuur in staal.<br/><em>Tot in detail.</em></>} description="Een selectie uit onze mogelijkheden. Elke realisatie begint met uw verhaal." action={['Alle diensten',pageHref('diensten')]}/>
        <div className="service-grid">
          <a href={pageHref('stalen-deuren-op-maat')} className="service-card"><div className="service-photo"><Img name="door4" alt="Ontwerp voor stalen deuren"/><span className="service-count">01 / DEUREN</span></div><div className="service-card-bottom"><div><h3>Stalen deuren</h3><p>Op maat, tot in de kleinste details.</p></div><span className="small-round"><ArrowUpRight size={18}/></span></div></a>
          <a href={pageHref('diensten')} className="service-card"><div className="service-photo"><Img name="railing" alt="Metalen balustrades in maatwerk"/><span className="service-count">02 / BALUSTRADES</span></div><div className="service-card-bottom"><div><h3>Balustrades</h3><p>Een verfijnde lijn door uw interieur of buitenruimte.</p></div><span className="small-round"><ArrowUpRight size={18}/></span></div></a>
          <a href={pageHref('diensten')} className="service-card"><div className="service-photo"><Img name="hospitality" alt="Stalen glasconstructie voor horeca"/><span className="service-count">03 / METAALWERK</span></div><div className="service-card-bottom"><div><h3>Overig maatwerk</h3><p>Unieke constructies met dezelfde aandacht voor detail.</p></div><span className="small-round"><ArrowUpRight size={18}/></span></div></a>
        </div>
      </div>
    </section>
    <section className="seo-hub-links" aria-label="Stalen deuren ontdekken">
      <div className="container">
        <span className="eyebrow">UW DEUR. UW MOGELIJKHEDEN.</span>
        <h2>Ontdek stalen deuren <em>op maat.</em></h2>
        <div className="seo-hub-links-grid">
          {servicePages.map(page=><a key={page.route} href={pageHref(page.route)}><span>{page.h1}</span><ArrowUpRight size={19}/></a>)}
        </div>
      </div>
    </section>
    <section className="config-banner">
      <div className="config-banner-image"><Img name="balcony" alt="Metaalwerk voor residentieel project"/></div>
      <div className="config-banner-content"><span className="eyebrow light">UW PERSOONLIJKE 3D-ONTWERPSTUDIO</span><h2>Een idee.<br/><em>Uw ontwerp.</em></h2><p>Ontwerp uw eigen stalen deur of balustrade. Kies het model, de afmetingen, kleuren en details en ontdek het resultaat in een interactieve 3D-weergave.</p><a className="btn btn-cream" href={pageHref('configurator')}>Open de 3D-ontwerpstudio <ArrowUpRight size={18}/></a><small>STALEN DEUREN&nbsp; / &nbsp;BALUSTRADES&nbsp; · &nbsp;VRIJBLIJVENDE OFFERTE</small></div>
    </section>
    <section className="process-section section-space container">
      <SectionHeading label="ONZE AANPAK" title={<>Van eerste idee<br/><em>tot perfect resultaat.</em></>}/>
      <div className="process-grid">
        {[['01','Uw idee','Vertel ons over uw project of ontwerp uw stalen deur of balustrade in 3D.'],['02','Persoonlijke offerte','We bekijken uw wensen, controleren de maten en bezorgen een offerte op maat.'],['03','Met zorg gemaakt','Na uw akkoord realiseren we uw project met ambachtelijk vakmanschap.']].map(([num,title,description])=><div className="process-card" key={num}><span>{num}</span><h3>{title}</h3><p>{description}</p></div>)}
      </div>
    </section>
  </main>;
}
function Diensten() {
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">EXPERTISE</span><h1>Maatwerk dat<br/><em>het verschil maakt.</em></h1><p>Voor particulieren, industrie, recreatie en horeca. Elk project krijgt onze volledige aandacht.</p></div>
    <section className="container seo-diensten-links" aria-label="Stalen deuren per type">
      <span className="eyebrow">STALEN DEUREN EN GLAS OP MAAT</span>
      <h2>Alle mogelijkheden voor uw stalen deur</h2>
      <p>Van een klassieke binnendeur tot een pivotdeur of een stalen glaswand: lees wat er technisch en visueel bij komt kijken en stel uw voorkeuren samen.</p>
      <div className="seo-hub-links-grid">{servicePages.map(page=><a key={page.route} href={pageHref(page.route)}><span>{page.h1}</span><ArrowUpRight size={18}/></a>)}</div>
    </section>
    <div className="container service-detail-list">
      {[['Stalen deuren','Unieke deuren, volledig naar uw wensen samengesteld. Van enkele en dubbele deuren tot schuif- en pivotdeuren.','door4'],['Trappen & balustrades','Karaktervolle metalen trappen en veilige balustrades, op maat voor uw woning of project.','balcony'],['Industrie & constructies','Degelijke metaalconstructies, laswerken en technische oplossingen voor professionele toepassingen.','railing'],['Horeca & maatwerk','Stalen elementen, terrassen en interieurdetails die uw zaak een eigen identiteit geven.','hospitality']].map(([title,txt,img],i)=><article className="service-detail" key={title}><div><span className="eyebrow">0{i+1} / METAALMEESTERS</span><h2>{title}</h2><p>{txt}</p><a className="text-link" href={pageHref(i===0?'configurator':'contact')}>{i===0?'Configureer uw deur':'Bespreek uw project'} <ArrowUpRight size={16}/></a></div><Img name={img} alt={title}/></article>)}
    </div>
  </main>;
}
function Projecten() {
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">ONZE REALISATIES</span><h1>Werk dat voor<br/><em>zichzelf spreekt.</em></h1><p>Bekijk projecten rond stalen deuren, balustrades, veranda's en metaalconstructies in Antwerpen en omgeving.</p></div>
    <section className="container project-grid">{portfolioProjects.map(p=><a href={pageHref('portfolio/'+p.slug)} className="project-card project-card-seo" key={p.slug}>
      <div className="project-card-content"><span>{p.category}</span><h3>{p.title}</h3><p>{p.summary}</p><strong>Bekijk het project <ArrowUpRight size={16}/></strong></div>
    </a>)}</section>
    <div className="container page-outro"><p>Benieuwd naar de mogelijkheden voor uw eigen project?</p><a className="btn btn-dark" href={pageHref('contact')}>Vertel ons uw idee <ArrowUpRight size={17}/></a></div>
  </main>;
}
function ProjectDetail({project}) {
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">REALISATIE · {project.category}</span><h1>{project.title}</h1><p>{project.summary}</p></div>
    <section className="container project-detail-body"><p>Een maatwerkproject van MetaalMeesters. De afwerking en uitvoering worden afgestemd op de mogelijkheden en eisen van ieder project.</p>
      {project.year&&<p><strong>Realisatiejaar:</strong> {project.year}</p>}
      <p><strong>Sector:</strong> {project.category}</p>
      <a className="text-link" href={pageHref('projecten')}>Bekijk alle realisaties <ArrowUpRight size={17}/></a>
      <a className="btn btn-dark" href={pageHref('contact')}>Bespreek uw eigen project <ArrowUpRight size={16}/></a>
    </section>
  </main>;
}
function Offerte() {
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">VRIJBLIJVEND MAATWERK</span><h1>Een offerte<br/><em>voor uw project.</em></h1><p>Wilt u een stalen deur of een ander metaalproject laten uitvoeren? Vertel ons wat u zoekt, dan bespreken we samen de mogelijkheden.</p></div>
    <div className="container quote-landing"><div><h2>Ontwerp een deur of balustrade in 3D</h2><p>Kies stalen deur of balustrade en stel de afmetingen, kleur en afwerking samen. Vraag daarna vrijblijvend een offerte aan.</p><a className="btn btn-dark" href={pageHref('configurator')}>Open de 3D-configurator <ArrowUpRight size={17}/></a><small>Indicatieve afmetingen · Definitieve beoordeling en opmeting door MetaalMeesters.</small></div>
    <div><h2>Een ander metaalproject?</h2><p>Voor losse trappen, industriële constructies en horecawerken kunt u rechtstreeks contact opnemen.</p><a className="text-link" href={pageHref('contact')}>Contacteer MetaalMeesters <ArrowUpRight size={17}/></a></div></div>
  </main>;
}
function Contact() {
  const [name,setName]=useState(''),[email,setEmail]=useState(''),[message,setMessage]=useState('');
  const contact=e=>{e.preventDefault();location.href='mailto:info@metaalmeesters.eu?subject='+encodeURIComponent('Contactaanvraag MetaalMeesters - '+name)+'&body='+encodeURIComponent('Naam: '+name+'\nE-mail: '+email+'\n\n'+message);};
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">LATEN WE PRATEN</span><h1>Een goed project<br/><em>begint met een gesprek.</em></h1><p>Heeft u een vraag of een bijzonder idee? We helpen u graag verder.</p></div>
    <div className="container contact-layout"><div className="contact-details"><h3>Contactgegevens</h3><a href="mailto:info@metaalmeesters.eu"><Mail/> info@metaalmeesters.eu</a><a href="tel:+32472864888"><Phone/> +32 472 86 48 88</a><p><MapPin/> Maatschappelijke zetel: Lange Lobroekstraat 58, 2060 Antwerpen</p><div className="contact-aside"><span className="eyebrow">ZELF UW MAATWERK ONTWERPEN?</span><h3>Bekijk het eerst in 3D.</h3><a className="text-link" href={pageHref('configurator')}>Open de 3D-ontwerpstudio <ArrowUpRight size={16}/></a></div></div>
    <form className="contact-form" onSubmit={contact}><h3>Stuur ons een bericht</h3><label>Uw naam<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Voor- en achternaam"/></label><label>E-mailadres<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="uw@email.be"/></label><label>Uw bericht<textarea required rows="6" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Waarmee kunnen wij u helpen?"/></label><button className="btn btn-dark" type="submit">Open e-mailprogramma <ArrowUpRight size={17}/></button><small>Uw e-mailprogramma wordt geopend. Controleer en verstuur het bericht zelf. Lees onze <a href={pageHref('privacy')}>privacyverklaring</a>.</small></form></div>
  </main>;
}
const steps=STEPS.map((s,i)=>[String(i+1).padStart(2,'0'),s.title]);
function OptionCard({active,onClick,title,sub}){return <button type="button" className={'option-card '+(active?'selected':'')} onClick={onClick} aria-pressed={active}><span className="option-radio">{active&&<Check size={12}/>}</span><strong>{title}</strong>{sub&&<small>{sub}</small>}</button>;}
function RangeControl({title,value,min,max,onChange}){return <div className="range-control"><div className="range-head"><strong>{title}</strong><span>{value}</span></div><input type="range" min={min} max={max} step="1" value={value} onChange={e=>onChange(Number(e.target.value))}/><div className="range-labels"><span>Geen</span><span>{max} verdelingen</span></div></div>;}
function DimensionCmField({id,label,value,onChange,description}) {
  // Preserve the customer's unmodified text throughout the editing gesture.
  // In particular, deleting everything and typing 5000 must never snap to a min.
  const [text,setText]=useState(()=>mmAsCm(value));
  const [focused,setFocused]=useState(false);
  useEffect(()=>{if(!focused)setText(mmAsCm(value));},[value,focused]);
  const parsed=cmAsMm(text);
  return <div className="measure-field measure-field-cm">
    <label htmlFor={id}>{label}</label>
    <div className="input-unit">
      <input id={id} type="text" inputMode="decimal" autoComplete="off"
        value={text} aria-describedby={id+'-help'}
        onFocus={()=>setFocused(true)}
        onChange={e=>{
          const raw=e.target.value;
          setText(raw);
          const mm=cmAsMm(raw);
          if(mm!==null)onChange(mm);
        }}
        onBlur={()=>{
          setFocused(false);
          if(cmAsMm(text)===null)setText(mmAsCm(value));
        }}
        placeholder="Bijv. 250" />
      <span>cm</span>
    </div>
    <small id={id+'-help'}>{parsed===0?'0 cm = nog niet opgemeten. MetaalMeesters meet later zelf op.':description||'Typ zelf een maat, bijvoorbeeld 250 of 225,5 cm.'}</small>
  </div>;
}
function GlassChoice({glass,selected,onClick}) {
  return <button type="button" className={'glass-choice '+(selected?'selected':'')} aria-pressed={selected} onClick={onClick}>
    <span className={'glass-example glass-example-'+glass.visual} style={{'--glass-color':glass.color}} aria-hidden="true"><i/></span>
    <span className="glass-option-copy"><strong>{glass.label}</strong><small>{glass.description}</small><em>{glass.safety}</em></span>
    {selected&&<Check className="glass-check" size={17}/>}
  </button>;
}
function ConfigSummary({d}) {
  return <div className="summary">
    <div><span>Deurtype</span><strong>{TYPES.find(x=>x.id===d.type)?.label}</strong></div>
    <div><span>{d.type==='wand'?'Totale glaswand':'Afmetingen (geschat)'}</span><strong>{cmLabel(d.width)} × {cmLabel(d.height)}</strong></div>
    {d.type==='wand'&&<div><span>Geïntegreerde deur</span><strong>{cmLabel(d.doorWidth)} breed · vaste panelen {d.fixedPanelSide}</strong></div>}
    <div><span>Bovenvorm</span><strong>{d.topShape==='boog'?'Boogdeur · vorm door atelier te bepalen':'Rechte deur'}</strong></div>
    <div><span>Glassoort</span><strong>{GLASSES.find(x=>x.id===d.glass)?.label}</strong></div>
    <div><span>Glasopbouw</span><strong>{GLASSES.find(x=>x.id===d.glass)?.safety||'Te bevestigen'}</strong></div>
    <div><span>Kleur staal</span><strong>{FRAMES.find(x=>x.id===d.frame)?.label}{d.frame==='andere'&&d.customColor?' · '+d.customColor:''}</strong></div>
    <div><span>Deurvulling</span><strong>{PANEL_LAYOUTS.find(x=>x.id===(d.panelLayout||'glas'))?.label}{d.panelLayout==='staal-onder'?' · '+cmLabel(d.lowerPanelHeight)+' staal':''}</strong></div>
    <div><span>Indeling</span><strong>{d.vertical} verticaal · {d.panelLayout==='staal-onder'?'drie horizontale vakken':d.horizontal+' horizontaal'}</strong></div>
    <div><span>Handgreep</span><strong>{HANDLES.find(x=>x.id===d.handle)?.label||d.handle}</strong></div>
    <div><span>Sluiting</span><strong>{CLOSURES.find(x=>x.id===d.closure)?.label||'Nog te bepalen'}</strong></div>
  </div>;
}
function ConfigControls({d,change,step,setStep}) {
  const [showAllGlass,setShowAllGlass]=useState(false);
  const [showAllColors,setShowAllColors]=useState(false);
  const [showAllHandles,setShowAllHandles]=useState(false);
  const [showExtraTypes,setShowExtraTypes]=useState(false);
  const applyStyle=(style)=>{const presets={minimal:{vertical:0,horizontal:0},atelier:{vertical:1,horizontal:2},industrieel:{vertical:2,horizontal:3},klassiek:{vertical:0,horizontal:1}};change({style,...presets[style]});};
  return <div className="config-controls" id="mm-config-controls">
    <div className="config-controls-top"><span className="eyebrow">UW DEUR OP MAAT</span><h2>Zo eenvoudig <em>kan het.</em></h2><p>Kies wat u mooi vindt. De details regelen we samen.</p></div>
    <div className="wizard-progress-area">
      <div className="wizard-progress-label"><strong>Stap {step+1} van {STEPS.length}</strong><span>{STEPS[step].title}</span></div>
      <div className="wizard-progress-track" role="progressbar" aria-label="Voortgang van uw deurontwerp" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step+1}><span style={{width:((step+1)/STEPS.length*100)+'%'}}/></div>
    </div>
    <nav className="steps" aria-label="Navigatie tussen de stappen">{steps.map(([n,name],i)=><button type="button" key={n} className={'step '+(step===i?'active':'')+(step>i?' done':'')} aria-current={step===i?'step':undefined} aria-label={'Stap '+(i+1)+': '+name} onClick={()=>setStep(i)}><span>{step>i?<Check size={13}/>:n}</span><span>{name}</span></button>)}</nav>
    <p className="wizard-guidance">{STEPS[step].hint}</p>
    <button type="button" className="wizard-preview-shortcut" onClick={()=>document.getElementById('mm-live-preview')?.scrollIntoView({behavior:'smooth',block:'start'})}><Eye size={16}/> Bekijk uw 3D-voorbeeld <ArrowRight size={15}/></button>
    <div className="config-fields">
      {step===0&&<>
        <h3>Welk type deur wenst u?</h3><p className="field-hint">Kies het model dat bij uw ruimte past.</p><div className="options-two">{TYPES.filter(t=>t.id!=='schuif'||showExtraTypes||d.type==='schuif').map(t=><OptionCard key={t.id} title={t.label} sub={t.caption} active={d.type===t.id} onClick={()=>change({type:t.id,topShape:t.id==='schuif'?'recht':d.topShape,width:t.id==='wand'&&d.width<1400?2600:t.id==='dubbel'&&d.width<1200?1600:d.width,doorWidth:t.id==='wand'?Math.min(d.doorWidth||900,Math.max(500,(t.id==='wand'&&d.width<1400?2600:d.width)-300)):d.doorWidth})}/>)}</div>
        <button type="button" className="show-more-options" aria-expanded={showExtraTypes} onClick={()=>setShowExtraTypes(v=>!v)}>{showExtraTypes?'Minder deurtypes':'Ook een schuifdeur bekijken'} <ChevronDown size={16}/></button>
        <h3 className="subsection-title">Welke bovenvorm?</h3>
        <p className="field-hint">Een boogdeur? Dan hoeft u enkel de breedte en hoogte op te geven. De exacte boog wordt door ons opgemeten.</p>
        {d.type!=='schuif'?<div className="options-two">
          <OptionCard title="Rechte bovenkant" sub="Klassieke rechte deur" active={d.topShape!=='boog'} onClick={()=>change({topShape:'recht'})}/>
          <OptionCard title="Boogdeur" sub="Breedte en hoogte zijn voldoende" active={d.topShape==='boog'} onClick={()=>change({topShape:'boog'})}/>
        </div>:<p className="field-hint">Schuifdeuren worden voorlopig enkel met rechte bovenkant getoond.</p>}
        <details className="config-extra"><summary><span>Roedenstijl aanpassen (optioneel)</span><small>{d.style==='eigen'?'Eigen verdeling':d.style==='minimal'?'Zonder roeden':d.style==='atelier'?'Atelier':d.style==='industrieel'?'Industrieel':'Klassiek'}</small></summary>
          <div className="options-two">{[['minimal','Minimal','Zonder onderverdeling'],['atelier','Atelier','Een verfijnd raster'],['industrieel','Industrieel','Een strak lijnenspel'],['klassiek','Klassiek','Één horizontale lijn']].map(([id,title,sub])=><OptionCard key={id} title={title} sub={sub} active={d.style===id} onClick={()=>applyStyle(id)}/>)}</div>
        </details>
      </>}
      {step===1&&<>
        <h3>{d.topShape==='boog'?'Breedte en hoogte van uw boogdeur':'Welke afmetingen heeft u ongeveer nodig?'}</h3>
        <p className="field-hint">Vul zelf uw maten in <strong>centimeter</strong> in. U mag een getal helemaal wissen en opnieuw typen. We werken op maat en komen altijd zelf opmeten.</p>
        <DimensionCmField id="width" label={d.type==='wand'?'Totale breedte glaswand':'Breedte'} value={d.width} onChange={width=>change({width})}/>
        <DimensionCmField id="height" label="Hoogte (inclusief eventuele boog)" value={d.height} onChange={height=>change({height})}/>
        {d.topShape==='boog'&&<p className="wizard-small-help">De boog in 3D is een voorbeeld. U hoeft geen booghoogte, radius of verdeling op te geven; die leggen we bij de opmeting vast.</p>}
        {d.type==='wand'&&<details className="config-extra"><summary><span>Geïntegreerde deur in de glaswand (optioneel)</span><small>Breedte deur en vaste glasdelen</small></summary>
          <div className="wall-options">
            <DimensionCmField id="doorWidth" label="Breedte van de geïntegreerde deur" value={d.doorWidth} onChange={doorWidth=>change({doorWidth})}/>
            <label className="wall-fixed-label">Waar komen de vaste glasdelen?</label>
            <div className="option-row">{[['links','Links'],['beide','Beide kanten'],['rechts','Rechts']].map(([id,name])=><button type="button" key={id} className={d.fixedPanelSide===id?'picked':''} onClick={()=>change({fixedPanelSide:id})}>{name}</button>)}</div>
          </div>
        </details>}
        <details className="config-extra"><summary><span>Of kies een voorbeeldmaat</span><small>Compact, standaard of ruim</small></summary>
          <div className="size-presets"><div>{sizesForType(d.type).map(size=><button type="button" key={size.label} aria-pressed={d.width===size.width&&d.height===size.height} className={d.width===size.width&&d.height===size.height?'selected':''}
            onClick={()=>change({width:size.width,height:size.height})}>
            <strong>{size.label}</strong><small>{mmAsCm(size.width)} × {mmAsCm(size.height)} cm</small></button>)}</div>
          </div>
        </details>
        <div className="measure-tip measure-guarantee" role="note"><Ruler size={22}/><div>
          <strong>Wij komen altijd zelf opmeten</strong>
          <p>{onsiteMeasureNote()}</p>
          <p className="measure-guarantee-secondary">U mag voorlopig 0 cm invullen als u een maat nog niet kent. Bij heel kleine of grote maten is de 3D-weergave alleen een indicatie, niet de definitieve productieafmeting.</p>
        </div></div>
      </>}
      {step===2&&<>
        <h3>Glas & verdeling</h3><p className="field-hint">Creëer het perfecte samenspel van licht en lijnen.</p>
        <p className="glass-intro">Begin met een van de populaire glassoorten. Wilt u iets bijzonders? Bekijk dan de volledige collectie.</p>
        <div className="glass-grid glass-featured">{featuredOptions(GLASSES,FAVOURITES.glass,d.glass).map(glass=>
          <GlassChoice key={glass.id} glass={glass} selected={d.glass===glass.id} onClick={()=>change({glass:glass.id})}/>)}</div>
        <button type="button" className="show-more-options" aria-expanded={showAllGlass} onClick={()=>setShowAllGlass(v=>!v)}>
          {showAllGlass?'Minder glassoorten tonen':'Bekijk alle andere glassoorten ('+countExtra(GLASSES,FAVOURITES.glass,d.glass)+')'} <ChevronDown size={16}/>
        </button>
        {showAllGlass&&<div className="expanded-choices">{['Basis','Mat & getint','Structuurglas'].map(group=>{
          const options=extraOptions(GLASSES,FAVOURITES.glass,d.glass).filter(glass=>glass.group===group);
          return options.length?<section className="glass-group" key={group}>
            <h4>{group==='Basis'?'Extra helder glas':group==='Mat & getint'?'Gekleurd glas':'Bijzondere glasstructuren'}</h4>
            <div className="glass-grid">{options.map(glass=><GlassChoice key={glass.id} glass={glass} selected={false} onClick={()=>change({glass:glass.id})}/>)}</div>
          </section>:null;
        })}</div>}
        <details className="config-extra config-info"><summary><span>Wat is gehard of gelaagd glas?</span><small>Veiligheid en materiaal</small></summary>
          <p className="glass-tech-note"><ShieldCheck size={16}/> <span>Mat en getint glas is volgens MetaalMeesters gelaagd. Voor de andere soorten bevestigt het atelier of de toepassing gehard of gelaagd glas vereist. Draadglas is niet automatisch veiligheidsglas.</span></p>
        </details>
        <h3 className="subsection-title">Indeling en stalen onderpaneel</h3>
        <p className="field-hint">Kies volledig glas of een deur in drie delen: twee glasvakken bovenaan en een gesloten paneel van staal onderaan.</p>
        <div className="options-two">{PANEL_LAYOUTS.map(t=><OptionCard key={t.id} title={t.label} sub={t.description} active={(d.panelLayout||'glas')===t.id} onClick={()=>change({panelLayout:t.id})}/>)}</div>
        {d.panelLayout==='staal-onder'&&<div className="panel-height-option">
          <p className="field-hint">De hoogte van het onderste dichte paneel is ook een indicatie.</p>
          <DimensionCmField id="lowerPanelHeight" label="Hoogte van het stalen deel" value={d.lowerPanelHeight} onChange={lowerPanelHeight=>change({lowerPanelHeight})}/>
          <small>Het stalen paneel vervangt echt het onderste glasvak in de 3D-weergave. De drie horizontale vakken zijn automatisch verdeeld.</small>
        </div>}
        <details className="config-extra"><summary><span>Roeden precies instellen (optioneel)</span><small>{d.vertical} verticaal · {d.panelLayout==='staal-onder'?'vaste drie vakken':d.horizontal+' horizontaal'}</small></summary>
          <RangeControl title="Verticale verdelingen" value={d.vertical} min={0} max={4} onChange={v=>change({vertical:v,style:'eigen'})}/>
          {d.panelLayout!=='staal-onder'?<RangeControl title="Horizontale verdelingen" value={d.horizontal} min={0} max={5} onChange={v=>change({horizontal:v,style:'eigen'})}/>:<p className="field-hint">Bij een stalen onderpaneel zijn de drie horizontale vakken automatisch verdeeld.</p>}
        </details>
        <p className="wizard-small-help">Uw keuzes worden meteen zichtbaar in het 3D-voorbeeld.</p>
      </>}
      {step===3&&<>
        <h3>De finishing touch</h3><p className="field-hint">Een subtiel detail maakt het verschil.</p>
        <h4>Kies uw staalkleur</h4>
        <p className="field-hint">De populairste kleuren staan hier. Andere RAL- en anodic-afwerkingen vindt u onder 'Meer kleuren'.</p>
        <div className="swatches swatches-featured">{featuredOptions(FRAMES,FAVOURITES.frame,d.frame).map(t=>
          <button type="button" className={'swatch '+(d.frame===t.id?'selected':'')} key={t.id} onClick={()=>change({frame:t.id})} aria-pressed={d.frame===t.id}>
            <span style={{backgroundColor:t.color}}>{d.frame===t.id&&<Check size={16} color={['wit','ral7035','anodic-natura','anodic-champagne','anodic-naturel'].includes(t.id)?'#222':'#fff'}/>}</span><small>{t.label}</small>
          </button>)}</div>
        <button type="button" className="show-more-options" aria-expanded={showAllColors} onClick={()=>setShowAllColors(v=>!v)}>
          {showAllColors?'Minder kleuren tonen':'Meer RAL- en anodic-kleuren ('+countExtra(FRAMES,FAVOURITES.frame,d.frame)+')'} <ChevronDown size={16}/>
        </button>
        {showAllColors&&<div className="expanded-choices">{['RAL','Anodic','Overig'].map(group=>{
          const options=extraOptions(FRAMES,FAVOURITES.frame,d.frame).filter(t=>t.group===group);
          return options.length?<div className="frame-colour-group" key={group}>
            <h5>{group==='RAL'?'Andere RAL-kleuren':group==='Anodic'?'Anodic Collection':'Andere afwerking op aanvraag'}</h5>
            <div className="swatches">{options.map(t=>
              <button type="button" className={'swatch '+(d.frame===t.id?'selected':'')} key={t.id} onClick={()=>change({frame:t.id})} aria-pressed={d.frame===t.id}>
                <span style={{backgroundColor:t.color}}>{d.frame===t.id&&<Check size={16} color="#fff"/>}</span><small>{t.label}</small>
              </button>)}</div>
          </div>:null;
        })}</div>}
        <p className="wizard-small-help">Kleuren op een scherm zijn indicatief. Het atelier bevestigt de definitieve kleur met echte stalen.</p>
        {d.frame==='andere'&&<div className="measure-field"><label htmlFor="customColor">Uw RAL-code of anodic kleurnaam</label><input id="customColor" type="text" maxLength="70" placeholder="Bijv. RAL 9001 of anodic ..." value={d.customColor||''} onChange={e=>change({customColor:e.target.value})}/><small>De exacte kleur wordt door het atelier bevestigd.</small></div>}
        <h4>Kies een handgreep</h4>
        <p className="field-hint">U kunt later altijd nog een ander model bespreken.</p>
        <div className="hardware-grid">{featuredOptions(HANDLES,FAVOURITES.handle,d.handle).map(t=>
          <button type="button" key={t.id} className={'hardware-choice '+(d.handle===t.id?'selected':'')} onClick={()=>change({handle:t.id})} aria-pressed={d.handle===t.id}>
            <span className={'hardware-illustration hardware-'+t.id} aria-hidden="true"><i/><b/></span>
            <span><strong>{t.label}</strong><small>{t.description}</small></span>
          </button>)}</div>
        <button type="button" className="show-more-options" aria-expanded={showAllHandles} onClick={()=>setShowAllHandles(v=>!v)}>
          {showAllHandles?'Minder handgrepen':'Andere handgrepen ('+countExtra(HANDLES,FAVOURITES.handle,d.handle)+')'} <ChevronDown size={16}/>
        </button>
        {showAllHandles&&<div className="hardware-grid expanded-choices">{extraOptions(HANDLES,FAVOURITES.handle,d.handle).map(t=>
          <button type="button" key={t.id} className="hardware-choice" onClick={()=>change({handle:t.id})} aria-pressed={false}>
            <span className={'hardware-illustration hardware-'+t.id} aria-hidden="true"><i/><b/></span>
            <span><strong>{t.label}</strong><small>{t.description}</small></span>
          </button>)}</div>}
        <details className="config-extra"><summary><span>Sluiting en draairichting (optioneel)</span><small>{CLOSURES.find(t=>t.id===d.closure)?.label||'Magneetsluiting'} · {d.opening==='links'?'links':'rechts'}</small></summary>
          <h4>Sluiting</h4><div className="hardware-closure-grid">{CLOSURES.map(t=>
            <button type="button" key={t.id} className={'closure-choice '+((d.closure||'magneet')===t.id?'selected':'')} onClick={()=>change({closure:t.id})} aria-pressed={(d.closure||'magneet')===t.id}>
              <strong>{t.label}</strong><small>{t.description}</small>
            </button>)}</div>
          <h4>Draairichting</h4><div className="option-row">{[['links','Links'],['rechts','Rechts']].map(([id,name])=><button type="button" key={id} aria-pressed={d.opening===id} className={d.opening===id?'picked':''} onClick={()=>change({opening:id})}>{name}</button>)}</div>
        </details>
      </>}
      {step===4&&<><h3>Uw ontwerp is klaar.</h3><p className="field-hint">Dit zijn uw voorlopige keuzes. <strong>MetaalMeesters meet uw deur altijd zelf exact op vóór de productie.</strong> Vraag vrijblijvend een offerte.</p><ConfigSummary d={d}/><div className="measure-tip measure-guarantee" role="note"><Ruler size={22}/><div><strong>Exacte afmetingen? Die meten wij zelf.</strong><p>{onsiteMeasureNote()}</p></div></div><QuoteForm design={d}/></>}
    </div>
    <button type="button" className="mobile-preview-jump" onClick={()=>document.getElementById('mm-live-preview')?.scrollIntoView({behavior:'smooth',block:'start'})}><Eye size={16}/> Bekijk mijn deur in 3D <ArrowRight size={15}/></button>
    {step<4&&<div className="control-bottom">
      <button type="button" className="back-btn" onClick={()=>setStep(v=>Math.max(0,v-1))} disabled={step===0}><ChevronLeft size={16}/> Vorige</button>
      <button type="button" className="btn btn-dark next-btn" onClick={()=>setStep(v=>Math.min(4,v+1))}>{step===3?'Naar mijn offerte':'Volgende: '+STEPS[step+1].title} <ArrowRight size={17}/></button>
    </div>}
  </div>;
}
function Configurator({onBack}) {
  const [d,setD]=useState(()=>{try {const saved=JSON.parse(localStorage.getItem('mm-door-design'));return {...initialDesign,...saved};}catch{return initialDesign;}});
  const [step,setStep]=useState(0),[resetToken,setResetToken]=useState(0),[notice,setNotice]=useState('');
  const moveToStep=(next)=>{
    setStep(oldStep=>Math.max(0,Math.min(STEPS.length-1,typeof next==='function'?next(oldStep):next)));
    window.requestAnimationFrame(()=>document.getElementById('mm-config-controls')?.scrollIntoView({behavior:'smooth',block:'start'}));
  };
  const change=(patch)=>setD(old=>({...old,...patch}));
  useEffect(()=>{try{localStorage.setItem('mm-door-design',JSON.stringify(d));}catch{}},[d]);
  const reset=()=>{setD(initialDesign);setResetToken(v=>v+1);setStep(0);};
  return <main className="config-page">
    <div className="container config-page-heading"><div><button type="button" className="bal-text-back" onClick={onBack}><ChevronLeft size={16}/> Andere productsoort kiezen</button><span className="eyebrow">METAALMEESTERS · 3D DEURONTWERPER</span><h1>Uw deur in <em>5 stappen.</em></h1><p>Kies een model, geef de maten op en ontdek uw deur in 3D. U hoeft niet alles exact te weten: wij helpen met de details.</p></div><button className="reset-design" onClick={reset}><RotateCcw size={16}/> Begin opnieuw</button></div>
    <div className="container config-layout">
      <ConfigControls d={d} change={change} step={step} setStep={moveToStep}/>
      <div id="mm-live-preview"><Suspense fallback={<div className="viewer-loading">De 3D-voorvertoning wordt geladen...</div>}><HousePreview config={d} resetToken={resetToken} onNotice={setNotice} onChange={change}/></Suspense>{notice&&<p className="viewer-notice" role="status">{notice}</p>}</div>
    </div>
    <div className="container config-bottom-note"><span>HANDGEMAAKT. PRECIES ZOALS U HET WILT.</span><a href="mailto:info@metaalmeesters.eu">Hulp nodig? Contacteer ons <ArrowUpRight size={16}/></a></div>
  </main>;
}
function ProductConfigurator(){
  const [product,setProduct]=useState(null);
  const choose=(name)=>{setProduct(name);window.scrollTo({top:0,behavior:'instant'});};
  if(product==='deur')return <Configurator onBack={()=>choose(null)}/>;
  if(product==='balustrade')return <Suspense fallback={<main className="interior-page"><div className="container page-intro"><h1>Balustradeconfigurator laden...</h1></div></main>}><BalustradeConfigurator onBack={()=>choose(null)}/></Suspense>;
  return <main className="product-choice-page"><div className="container">
    <span className="eyebrow product-choice-eyebrow">DE METAALMEESTERS ONTWERPSTUDIO · 01 / 02</span>
    <h1>Wat wilt u<br/><em>ontwerpen?</em></h1>
    <p className="product-choice-intro">Kies waarmee uw ontwerp begint. Ontdek materialen, lijnen en afmetingen in 3D en ontvang daarna een vrijblijvende offerte op maat. Onze vakmensen verzorgen de definitieve opmeting en technische beoordeling.</p>
    <div className="product-choice-grid">
      <button type="button" className="product-choice-card" onClick={()=>choose('deur')}>
        <Img name="door4" alt="Stalen deur met glas" loading="eager"/>
        <div className="product-choice-card-content"><span>01 · STALEN DEUREN</span><h2>Stalen deuren</h2><p>Enkele deur, dubbele deur, pivotdeur, boogdeur of glaswand. Onze vertrouwde volledige deurconfigurator.</p>
          <div className="product-choice-card-footer">Ontdek de deurenstudio <ArrowUpRight size={19}/></div>
        </div>
      </button>
      <button type="button" className="product-choice-card" onClick={()=>choose('balustrade')}>
        <Img name="railing" alt="Balustrade uitgevoerd in staal" loading="eager"/>
        <div className="product-choice-card-content"><span>02 · BALUSTRADES</span><h2>Balustrades</h2><p>Trap, balkon, terras, vide of raam. Bepaal indicatieve maten, spijlen, glas, kleur en handregel.</p>
          <div className="product-choice-card-footer">Ontdek de balustradestudio <ArrowUpRight size={19}/></div>
        </div>
      </button>
    </div>
  </div></main>;
}
export default function App({initialRoute}) {
  const [route,setRoute]=useState(()=>initialRoute||routeFromLocation());
  useEffect(()=>{const change=()=>{setRoute(routeFromLocation());window.scrollTo({top:0,behavior:'instant'});};window.addEventListener('hashchange',change);window.addEventListener('popstate',change);return()=>{window.removeEventListener('hashchange',change);window.removeEventListener('popstate',change);};},[]);
  const current=indexableRoutes.has(route)||route==='beheer'?route:'home';
  const portfolio=portfolioProjects.find(p=>'portfolio/'+p.slug===current);
  const seoService=servicePagesByRoute.get(current);
  const activeNav=portfolio?'projecten':current;
  return <><Header route={activeNav}/>{portfolio?<ProjectDetail project={portfolio}/>:seoService?<SeoServicePage page={seoService}/>:current==='over-ons'?<OverOnsPage/>:current==='home'?<Home/>:current==='diensten'?<Diensten/>:current==='projecten'?<Projecten/>:current==='contact'?<Contact/>:current==='offerte'?<Offerte/>:current==='privacy'?<PrivacyPage/>:current==='cookies'?<CookiePage/>:current==='bedrijfsgegevens'?<CompanyPage/>:current==='beheer'?<Suspense fallback={<main className="interior-page"><div className="container page-intro"><h1>Beheerportaal laden...</h1></div></main>}><Admin/></Suspense>:<ProductConfigurator/>}<Footer/></>;
}
