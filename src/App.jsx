import React, { useEffect, useState, Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Download, Mail, MapPin, Menu, Minus, Move3D, Phone, Plus, RotateCcw, Ruler, Send, ShieldCheck, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import {projects as portfolioProjects,pages as seoPages,pageHref,indexableRoutes} from './seo-routes.js';
import QuoteForm from './QuoteForm.jsx';
import './admin.css';
// The heavy Three.js preview and private admin app are loaded only when needed.
const HousePreview=React.lazy(()=>import('./HousePreview.jsx'));
const Admin=React.lazy(()=>import('./Admin.jsx'));
import {assets,imageUrl,initialDesign,TYPES,FRAMES,GLASSES,formatDesign,downloadDesign} from './data.js';

const routeFromLocation=()=>{
  if(typeof window==='undefined')return 'home';
  const legacy=window.location.hash.match(/^#\/(.+?)(?:\?|$)/)?.[1];
  if(legacy&&(indexableRoutes.has(legacy)||legacy==='beheer'))return legacy;
  const base=import.meta.env.BASE_URL||'/';
  const path=window.location.pathname;
  const segment=(path.startsWith(base)?path.slice(base.length):path).replace(/^\/|\/$/g,'');
  return indexableRoutes.has(segment)||segment==='beheer'?segment:'home';
};
const nav=[['home','Home'],['diensten','Diensten'],['projecten','Realisaties'],['contact','Contact'],['offerte','Offerte']];
function Img({name,alt='',...props}) {
  return <img src={imageUrl(name)} alt={alt} onError={e=>{const fallback=imageUrl('hero');if(!e.currentTarget.src.endsWith(fallback))e.currentTarget.src=fallback;}} {...props}/>;
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
      <a className="header-cta" href={pageHref('configurator')}>Ontwerp uw deur <ArrowUpRight size={16}/></a>
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
        <div><strong>Ontdek</strong><a href={pageHref('diensten')}>Onze diensten</a><a href={pageHref('projecten')}>Realisaties</a><a href={pageHref('configurator')}>3D-deurconfigurator</a></div>
        <div><strong>Contact</strong><a href="mailto:info@metaalmeesters.eu">info@metaalmeesters.eu</a><a href="tel:+32472864888">+32 472 86 48 88</a><span>Smoutpot, Zwijndrecht</span></div>
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
      <Img name="hero" className="hero-img" alt="Stalen en glazen constructie door MetaalMeesters"/>
      <div className="hero-shade"/>
      <div className="container hero-content">
        <div className="hero-eyebrow"><span className="line"/> METAALMEESTERS · ANTWERPEN</div>
        <h1>Metaal in zijn<br/><em>mooiste vorm.</em></h1>
        <p>Van verfijnde stalen deuren tot unieke constructies. Met passie ontworpen, met precisie vervaardigd.</p>
        <div className="hero-actions"><a href={pageHref('configurator')} className="btn btn-cream">Ontwerp uw eigen deur <ArrowUpRight size={18}/></a><a className="hero-link" href={pageHref('projecten')}>Ontdek onze realisaties <ArrowRight size={18}/></a></div>
      </div>
      <div className="hero-bottom container"><span>01 / UNIEK METAALWERK OP MAAT</span><span>SCROLL OM TE ONTDEKKEN <span className="scroll-line"/></span></div>
    </section>
    <section className="intro section-space container">
      <div className="intro-visual"><Img name="details" alt="Detail van een metalen constructie door MetaalMeesters"/><span className="visual-index">01 — VAKMANSCHAP</span></div>
      <div className="intro-copy"><span className="eyebrow">OVER METAALMEESTERS</span><h2>Geen standaard werk.<br/><em>Wel karakter.</em></h2><p>Bij MetaalMeesters staat maatwerk centraal. Met liefde voor het materiaal en aandacht voor elk detail creëren we duurzame metalen constructies die ruimtes sterker en mooier maken.</p><p>Van het eerste idee tot de laatste afwerking denken onze vakmensen met u mee.</p><a className="text-link" href={pageHref('diensten')}>Ontdek ons vakmanschap <ArrowUpRight size={18}/></a></div>
    </section>
    <section className="services-section section-space">
      <div className="container">
        <SectionHeading label="WAT WE DOEN" title={<>Sterk in metaal.<br/><em>Fijn in detail.</em></>} description="Een selectie uit onze mogelijkheden. Elke realisatie begint met uw verhaal." action={['Alle diensten',pageHref('diensten')]}/>
        <div className="service-grid">
          <a href={pageHref('configurator')} className="service-card"><div className="service-photo"><Img name="door4" alt="Ontwerp voor stalen deuren"/><span className="service-count">01 / DEUREN</span></div><div className="service-card-bottom"><div><h3>Stalen deuren</h3><p>Op maat, tot in de kleinste details.</p></div><span className="small-round"><ArrowUpRight size={18}/></span></div></a>
          <a href={pageHref('diensten')} className="service-card"><div className="service-photo"><Img name="railing" alt="Metalen balustrades in maatwerk"/><span className="service-count">02 / CONSTRUCTIES</span></div><div className="service-card-bottom"><div><h3>Constructies</h3><p>Van balustrades tot unieke projecten.</p></div><span className="small-round"><ArrowUpRight size={18}/></span></div></a>
          <a href={pageHref('diensten')} className="service-card"><div className="service-photo"><Img name="hospitality" alt="Stalen glasconstructie voor horeca"/><span className="service-count">03 / INTERIEUR & HORECA</span></div><div className="service-card-bottom"><div><h3>Interieur & horeca</h3><p>Functioneel, verfijnd en duurzaam.</p></div><span className="small-round"><ArrowUpRight size={18}/></span></div></a>
        </div>
      </div>
    </section>
    <section className="config-banner">
      <div className="config-banner-image"><Img name="balcony" alt="Metaalwerk voor residentieel project"/></div>
      <div className="config-banner-content"><span className="eyebrow light">NIEUW · INTERACTIEVE 3D-CONFIGURATOR</span><h2>Uw deur.<br/><em>Uw ontwerp.</em></h2><p>Kies het model, bepaal de afmetingen en combineer glas, indeling en afwerking. Bekijk uw eigen stalen deur van alle kanten in 3D.</p><a className="btn btn-cream" href={pageHref('configurator')}>Start met ontwerpen <ArrowUpRight size={18}/></a><small>Vrijblijvend ontwerpen · Offerte op maat</small></div>
    </section>
    <section className="process-section section-space container">
      <SectionHeading label="ONZE AANPAK" title={<>Van eerste idee<br/><em>tot perfect resultaat.</em></>}/>
      <div className="process-grid">
        {[['01','Uw idee','Vertel ons over uw project of ontwerp uw stalen deur zelf in 3D.'],['02','Persoonlijke offerte','We bekijken uw wensen, controleren de maten en bezorgen een offerte op maat.'],['03','Met zorg gemaakt','Na uw akkoord realiseren we uw project met ambachtelijk vakmanschap.']].map(([num,title,description])=><div className="process-card" key={num}><span>{num}</span><h3>{title}</h3><p>{description}</p></div>)}
      </div>
    </section>
  </main>;
}
function Diensten() {
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">EXPERTISE</span><h1>Maatwerk dat<br/><em>het verschil maakt.</em></h1><p>Voor particulieren, industrie, recreatie en horeca. Elk project krijgt onze volledige aandacht.</p></div>
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
    <div className="container quote-landing"><div><h2>Ontwerp uw stalen deur in 3D</h2><p>Stel het type, de afmetingen, glaskeuze en afwerking samen. Bekijk uw ontwerp op een echte woningfoto.</p><a className="btn btn-dark" href={pageHref('configurator')}>Open de 3D-configurator <ArrowUpRight size={17}/></a><small>Op de huidige demo is automatische offerteverzending nog niet beschikbaar.</small></div>
    <div><h2>Een ander metaalproject?</h2><p>Voor trappen, balustrades, industriële constructies en horecawerken kunt u rechtstreeks contact opnemen.</p><a className="text-link" href={pageHref('contact')}>Contacteer MetaalMeesters <ArrowUpRight size={17}/></a></div></div>
  </main>;
}
function Contact() {
  const [name,setName]=useState(''),[email,setEmail]=useState(''),[message,setMessage]=useState('');
  const contact=e=>{e.preventDefault();location.href='mailto:info@metaalmeesters.eu?subject='+encodeURIComponent('Contactaanvraag MetaalMeesters - '+name)+'&body='+encodeURIComponent('Naam: '+name+'\nE-mail: '+email+'\n\n'+message);};
  return <main className="interior-page"><div className="container page-intro"><span className="eyebrow">LATEN WE PRATEN</span><h1>Een goed project<br/><em>begint met een gesprek.</em></h1><p>Heeft u een vraag of een bijzonder idee? We helpen u graag verder.</p></div>
    <div className="container contact-layout"><div className="contact-details"><h3>Contactgegevens</h3><a href="mailto:info@metaalmeesters.eu"><Mail/> info@metaalmeesters.eu</a><a href="tel:+32472864888"><Phone/> +32 472 86 48 88</a><p><MapPin/> Smoutpot, Zwijndrecht</p><div className="contact-aside"><span className="eyebrow">LIEVER EEN DEUR ONTWERPEN?</span><h3>Bekijk het eerst in 3D.</h3><a className="text-link" href={pageHref('configurator')}>Open de deurconfigurator <ArrowUpRight size={16}/></a></div></div>
    <form className="contact-form" onSubmit={contact}><h3>Stuur ons een bericht</h3><label>Uw naam<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Voor- en achternaam"/></label><label>E-mailadres<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="uw@email.be"/></label><label>Uw bericht<textarea required rows="6" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Waarmee kunnen wij u helpen?"/></label><button className="btn btn-dark" type="submit">Open e-mailprogramma <ArrowUpRight size={17}/></button><small>Uw e-mailprogramma wordt geopend. Controleer en verstuur het bericht zelf.</small></form></div>
  </main>;
}
const steps=[['01','Model'],['02','Afmetingen'],['03','Glas & indeling'],['04','Afwerking'],['05','Offerte']];
function OptionCard({active,onClick,title,sub}){return <button type="button" className={'option-card '+(active?'selected':'')} onClick={onClick}><span className="option-radio">{active&&<Check size={12}/>}</span><strong>{title}</strong>{sub&&<small>{sub}</small>}</button>;}
function RangeControl({title,value,min,max,onChange}){return <div className="range-control"><div className="range-head"><strong>{title}</strong><span>{value}</span></div><input type="range" min={min} max={max} step="1" value={value} onChange={e=>onChange(Number(e.target.value))}/><div className="range-labels"><span>Geen</span><span>{max} verdelingen</span></div></div>;}
function ConfigSummary({d}) {
  return <div className="summary">
    <div><span>Deurtype</span><strong>{TYPES.find(x=>x.id===d.type)?.label}</strong></div>
    <div><span>Afmetingen</span><strong>{d.width} × {d.height} mm</strong></div>
    <div><span>Glas</span><strong>{GLASSES.find(x=>x.id===d.glass)?.label}</strong></div>
    <div><span>Kleur</span><strong>{FRAMES.find(x=>x.id===d.frame)?.label}</strong></div>
    <div><span>Indeling</span><strong>{d.vertical} verticaal · {d.horizontal} horizontaal</strong></div>
    <div><span>Handgreep</span><strong>{d.handle}</strong></div>
  </div>;
}
function ConfigControls({d,change,step,setStep}) {
  const applyStyle=(style)=>{const presets={minimal:{vertical:0,horizontal:0},atelier:{vertical:1,horizontal:2},industrieel:{vertical:2,horizontal:3},klassiek:{vertical:0,horizontal:1}};change({style,...presets[style]});};
  return <div className="config-controls">
    <div className="config-controls-top"><span className="eyebrow">UW ONTWERP</span><h2>Maak het <em>eigen.</em></h2><p>Elk detail, helemaal naar uw wens.</p></div>
    <div className="steps">{steps.map(([n,name],i)=><button key={n} className={'step '+(step===i?'active':'')+(step>i?' done':'')} onClick={()=>setStep(i)}><span>{step>i?<Check size={13}/>:n}</span><span>{name}</span></button>)}</div>
    <div className="config-fields">
      {step===0&&<>
        <h3>Welk type deur wenst u?</h3><p className="field-hint">Kies het model dat bij uw ruimte past.</p><div className="options-two">{TYPES.map(t=><OptionCard key={t.id} title={t.label} sub={t.caption} active={d.type===t.id} onClick={()=>change({type:t.id,width:t.id==='dubbel'&&d.width<1200?1600:d.width})}/>)}</div>
        <h3 className="subsection-title">Kies een startontwerp</h3><div className="options-two">{[['minimal','Minimal','Zonder onderverdeling'],['atelier','Atelier','Een verfijnd raster'],['industrieel','Industrieel','Een strak lijnenspel'],['klassiek','Klassiek','Één horizontale lijn']].map(([id,title,sub])=><OptionCard key={id} title={title} sub={sub} active={d.style===id} onClick={()=>applyStyle(id)}/>)}</div>
      </>}
      {step===1&&<>
        <h3>Uw deur op maat</h3><p className="field-hint">Vul de maten van de deuropening in, in millimeters.</p>
        <div className="measure-field"><label htmlFor="width">Breedte van de opening</label><div className="input-unit"><input id="width" type="number" min="500" max="3600" step="10" value={d.width} onChange={e=>change({width:Math.max(500,Math.min(3600,Number(e.target.value)||500))})}/><span>mm</span></div><small>Demo: 500 tot 3600 mm</small></div>
        <div className="measure-field"><label htmlFor="height">Hoogte van de opening</label><div className="input-unit"><input id="height" type="number" min="1400" max="3500" step="10" value={d.height} onChange={e=>change({height:Math.max(1400,Math.min(3500,Number(e.target.value)||1400))})}/><span>mm</span></div><small>Demo: 1400 tot 3500 mm</small></div>
        <div className="measure-tip"><Ruler size={19}/><div><strong>Hoe correct opmeten?</strong><p>Meet breedte en hoogte van de opening. Deze maten zijn indicatief. MetaalMeesters bevestigt de definitieve productiematen.</p></div></div>
      </>}
      {step===2&&<>
        <h3>Glas & verdeling</h3><p className="field-hint">Creëer het perfecte samenspel van licht en lijnen.</p>
        <div className="options-two">{GLASSES.map(t=><OptionCard key={t.id} title={t.label} sub={t.description} active={d.glass===t.id} onClick={()=>change({glass:t.id})}/>)}</div>
        <div className="divider-soft"/><RangeControl title="Verticale verdelingen" value={d.vertical} min={0} max={4} onChange={v=>change({vertical:v,style:'eigen'})}/>
        <RangeControl title="Horizontale verdelingen" value={d.horizontal} min={0} max={5} onChange={v=>change({horizontal:v,style:'eigen'})}/>
        <div className="measure-tip"><SlidersHorizontal size={19}/><div><strong>Volledig op maat</strong><p>De zichtbare lijnverdeling is een visuele indicatie. De technische haalbaarheid wordt later gecontroleerd.</p></div></div>
      </>}
      {step===3&&<>
        <h3>De finishing touch</h3><p className="field-hint">Een subtiel detail maakt het verschil.</p>
        <h4>Kaderkleur</h4><div className="swatches">{FRAMES.map(t=><button className={'swatch '+(d.frame===t.id?'selected':'')} key={t.id} onClick={()=>change({frame:t.id})}><span style={{backgroundColor:t.color}}>{d.frame===t.id&&<Check size={16} color={t.id==='wit'?'#222':'#fff'}/>}</span><small>{t.label}</small></button>)}</div>
        <h4>Handgreep</h4><div className="option-row">{[['lang','Lange greep'],['kort','Korte greep'],['knop','Knop']].map(([id,name])=><button key={id} className={d.handle===id?'picked':''} onClick={()=>change({handle:id})}>{name}</button>)}</div>
        <h4>Draairichting</h4><div className="option-row">{[['links','Links'],['rechts','Rechts']].map(([id,name])=><button key={id} className={d.opening===id?'picked':''} onClick={()=>change({opening:id})}>{name}</button>)}</div>
      </>}
      {step===4&&<><h3>Uw deur is ontworpen.</h3><p className="field-hint">Controleer uw keuzes en vraag een vrijblijvende offerte aan.</p><ConfigSummary d={d}/><QuoteForm design={d}/></>}
    </div>
    {step<4&&<div className="control-bottom"><button className="back-btn" onClick={()=>setStep(v=>Math.max(0,v-1))} disabled={step===0}><ChevronLeft size={16}/> Vorige</button><button className="btn btn-dark next-btn" onClick={()=>setStep(v=>Math.min(4,v+1))}>{step===3?'Naar offerte':'Volgende stap'} <ArrowRight size={17}/></button></div>}
  </div>;
}
function Configurator() {
  const [d,setD]=useState(()=>{try {const saved=JSON.parse(localStorage.getItem('mm-door-design'));return {...initialDesign,...saved};}catch{return initialDesign;}});
  const [step,setStep]=useState(0),[resetToken,setResetToken]=useState(0),[notice,setNotice]=useState('');
  const change=(patch)=>setD(old=>({...old,...patch}));
  useEffect(()=>{try{localStorage.setItem('mm-door-design',JSON.stringify(d));}catch{}},[d]);
  const reset=()=>{setD(initialDesign);setResetToken(v=>v+1);setStep(0);};
  return <main className="config-page">
    <div className="container config-page-heading"><div><span className="eyebrow">METAALMEESTERS · DESIGN STUDIO</span><h1>Ontwerp uw <em>eigen deur.</em></h1><p>Ontwerp uw stalen deur en bekijk hoe een complete 3D-woning automatisch meegroeit met de afmetingen. Of gebruik een foto van uw eigen huis.</p></div><button className="reset-design" onClick={reset}><RotateCcw size={16}/> Begin opnieuw</button></div>
    <div className="container config-layout">
      <ConfigControls d={d} change={change} step={step} setStep={setStep}/>
      <div><Suspense fallback={<div className="viewer-loading">De 3D-configurator wordt geladen...</div>}><HousePreview config={d} resetToken={resetToken} onNotice={setNotice} onChange={change}/></Suspense>{notice&&<p className="viewer-notice" role="status">{notice}</p>}</div>
    </div>
    <div className="container config-bottom-note"><span>HANDGEMAAKT. PRECIES ZOALS U HET WILT.</span><a href="mailto:info@metaalmeesters.eu">Hulp nodig? Contacteer ons <ArrowUpRight size={16}/></a></div>
  </main>;
}
export default function App({initialRoute}) {
  const [route,setRoute]=useState(()=>initialRoute||routeFromLocation());
  useEffect(()=>{const change=()=>{setRoute(routeFromLocation());window.scrollTo({top:0,behavior:'instant'});};window.addEventListener('hashchange',change);window.addEventListener('popstate',change);return()=>{window.removeEventListener('hashchange',change);window.removeEventListener('popstate',change);};},[]);
  const current=indexableRoutes.has(route)||route==='beheer'?route:'home';
  const portfolio=portfolioProjects.find(p=>'portfolio/'+p.slug===current);
  const activeNav=portfolio?'projecten':current;
  return <><Header route={activeNav}/>{portfolio?<ProjectDetail project={portfolio}/>:current==='home'?<Home/>:current==='diensten'?<Diensten/>:current==='projecten'?<Projecten/>:current==='contact'?<Contact/>:current==='offerte'?<Offerte/>:current==='beheer'?<Suspense fallback={<main className="interior-page"><div className="container page-intro"><h1>Beheerportaal laden...</h1></div></main>}><Admin/></Suspense>:<Configurator/>}<Footer/></>;
}
