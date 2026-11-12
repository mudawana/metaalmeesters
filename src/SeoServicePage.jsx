import React from 'react';
import {ArrowRight,ArrowUpRight,CheckCircle2,FileText,Home,Info,Ruler} from 'lucide-react';
import {servicePagesByRoute} from './seo-services.mjs';
import {pageHref} from './seo-routes.js';
import {imageUrl} from './data.js';
import './seo-services.css';

function Breadcrumb({page}){
 return <nav aria-label="Broodkruimelpad" className="seo-breadcrumb">
  <a href={pageHref('home')}>Home</a><span aria-hidden="true">/</span>
  <a href={pageHref('diensten')}>Diensten</a><span aria-hidden="true">/</span>
  <span aria-current="page">{page.h1}</span>
 </nav>;
}
function Related({page}) {
 return <section className="seo-related" aria-label="Meer informatie over stalen deuren">
  <div className="seo-section-kicker">VERDER VERKENNEN</div>
  <h2>Ook interessant voor uw project</h2>
  <div className="seo-related-grid">{page.related.map(route=>{
   const item=servicePagesByRoute.get(route);
   return item?<a key={route} href={pageHref(route)}><span>{item.h1}</span><ArrowUpRight size={18}/></a>:null;
  })}</div>
 </section>;
}
export default function SeoServicePage({page}){
 return <main className="interior-page seo-service-page">
  <header className="seo-service-head">
   <div className="container">
    <Breadcrumb page={page}/>
    <div className="seo-service-head-grid">
      <div><span className="eyebrow">{page.eyebrow}</span>
      <h1>{page.h1}</h1>
      <p>{page.lead}</p>
      <div className="seo-hero-actions">
       <a className="btn btn-dark" href={pageHref('configurator')}>Ontwerp uw deur in 3D <ArrowUpRight size={18}/></a>
       <a className="seo-text-link" href={pageHref('contact')}>Persoonlijk advies <ArrowRight size={16}/></a>
      </div></div>
      <div className="seo-service-visual"><img src={imageUrl('door4')} alt="Voorbeeld van een stalen deur met glas uit het MetaalMeesters-beeldmateriaal" width="900" height="720" fetchPriority="high"/>
        <span>STAAL EN GLAS · OP MAAT</span>
      </div>
    </div>
   </div>
  </header>
  <div className="container seo-service-content">
   <div className="seo-service-main">
    {page.sections.map((section,i)=><section key={i} className="seo-text-section">
      <span className="seo-section-kicker">{String(i+1).padStart(2,'0')} / ADVIES</span>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((p,j)=><p key={j}>{p}</p>)}
      {section.links?.length>0&&<div className="seo-inline-links">{section.links.map(link=>
        <a key={link.route} href={pageHref(link.route)}>{link.text}<ArrowRight size={15}/></a>)}</div>}
    </section>)}
    <section className="seo-faq-section" aria-labelledby="seo-faq-title">
      <span className="seo-section-kicker">VEELGESTELDE VRAGEN</span>
      <h2 id="seo-faq-title">Veelgestelde vragen over {page.h1.charAt(0).toLowerCase()+page.h1.slice(1)}</h2>
      {page.faqs.map((item,i)=><details className="seo-faq-item" key={i}>
        <summary>{item.q}</summary><p>{item.a}</p>
      </details>)}
    </section>
   </div>
   <aside className="seo-service-aside" aria-label="Hulp bij uw deur op maat">
    <div className="seo-aside-content"><Ruler size={25}/><strong>Wij meten zelf definitief op</strong>
      <p>De afmetingen die u in de configurator ingeeft, zijn voorlopig. MetaalMeesters komt vóór productie zelf de juiste maten nemen.</p>
      <a href={pageHref('configurator')}>Begin met ontwerpen <ArrowRight size={17}/></a>
    </div>
    <div className="seo-aside-content secondary"><FileText size={25}/><strong>Geen automatische prijzen</strong>
      <p>Vraag een vrijblijvende offerte aan. Het atelier bekijkt uw combinatie van maten, glas, beslag en afwerking persoonlijk.</p>
      <a href={pageHref('offerte')}>Hoe vraag ik een offerte? <ArrowRight size={17}/></a>
    </div>
   </aside>
  </div>
  <div className="container"><Related page={page}/></div>
  <section className="seo-final-cta"><div className="container seo-final-cta-inner">
   <div><span className="eyebrow light">VRIJBLIJVEND OVERLEG</span>
      <h2>Van eerste idee naar <em>uw deur op maat.</em></h2>
      <p>U kiest wat u mooi vindt. MetaalMeesters bekijkt de mogelijkheden en meet zelf de definitieve opening op.</p></div>
   <a className="btn btn-cream" href={pageHref('configurator')}>Ontwerp uw deur <ArrowUpRight size={17}/></a>
  </div></section>
 </main>;
}
