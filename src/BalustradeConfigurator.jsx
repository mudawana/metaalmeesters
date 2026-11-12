import React,{useEffect,useState,Suspense} from 'react';
import {ArrowLeft,ArrowRight,Check,Eye,RotateCcw,Ruler,ShieldCheck} from 'lucide-react';
import QuoteForm from './QuoteForm.jsx';
import {cmAsMm,mmAsCm,cmLabel} from './measurement-units.mjs';
import {initialBalustrade,BAL_TYPES,BAL_LAYOUTS,BAL_INFILL,BAL_COLORS,BAL_GLASS,BAL_MOUNT,BAL_HANDRAILS,
  balustradeTypeLabel,balustradeInfillLabel,balustradeColorLabel,safeBalustradeDesign} from './balustrade-options.mjs';
import './balustrade.css';
const BalustradeScene=React.lazy(()=>import('./BalustradeScene.jsx'));
const titles=['Toepassing','Afmetingen','Afwerking','Offerte'];
const groups=[['binnen','Binnen'],['buiten','Buiten']];
function Choice({active,onClick,title,desc,visual}) {
  return <button type="button" className={'bal-choice'+(active?' is-selected':'')} aria-pressed={active} onClick={onClick}>
    <span className="bal-choice-check">{active?<Check size={15}/>:null}</span>
    {visual||null}
    <span><strong>{title}</strong>{desc&&<small>{desc}</small>}</span>
  </button>;
}
function InfillPreview({kind}) {
  const count=kind==='verticaal'?6:kind==='horizontaal'?3:1;
  return <span className={'bal-model-preview '+(kind==='verticaal'?'vertical':kind==='horizontaal'?'horizontal':'glass')} aria-hidden="true">
    {Array.from({length:count},(_,i)=><span key={i}/>)}
  </span>;
}
function Measure({name,label,value,onChange}) {
  const [raw,setRaw]=useState(()=>mmAsCm(value));
  const [focus,setFocus]=useState(false);
  useEffect(()=>{if(!focus)setRaw(mmAsCm(value));},[value,focus]);
  return <label className="bal-measure" htmlFor={'bal-'+name}><span>{label}</span><span className="bal-measure-field">
    <input id={'bal-'+name} type="text" inputMode="decimal" autoComplete="off" value={raw} onFocus={()=>setFocus(true)}
      onChange={e=>{setRaw(e.target.value);const parsed=cmAsMm(e.target.value);if(parsed!==null)onChange(parsed);}}
      onBlur={()=>{setFocus(false);if(cmAsMm(raw)===null)setRaw(mmAsCm(value));}}
      placeholder="Bijvoorbeeld 300"/><b>cm</b>
  </span></label>;
}
export default function BalustradeConfigurator({onBack}) {
  const [design,setDesign]=useState(()=>{
    try {const stored=JSON.parse(localStorage.getItem('mm-balustrade-design'));return safeBalustradeDesign({...initialBalustrade,...stored})||initialBalustrade;}
    catch{return initialBalustrade;}
  });
  const [step,setStep]=useState(0);
  useEffect(()=>{try{localStorage.setItem('mm-balustrade-design',JSON.stringify(design));}catch{}},[design]);
  const change=patch=>setDesign(d=>({...d,...patch}));
  const reset=()=>{setDesign({...initialBalustrade});setStep(0);};
  const next=()=>{setStep(s=>Math.min(s+1,3));document.querySelector('.bal-config-card')?.scrollIntoView({behavior:'smooth',block:'start'});};
  const prev=()=>{setStep(s=>Math.max(s-1,0));document.querySelector('.bal-config-card')?.scrollIntoView({behavior:'smooth',block:'start'});};
  return <main className="bal-config-page">
    <div className="container bal-heading">
      <div><button type="button" className="bal-text-back" onClick={onBack}><ArrowLeft size={16}/> Andere productsoort kiezen</button>
        <span className="eyebrow">METAALMEESTERS · 3D BALUSTRADE ONTWERPER</span>
        <h1>Balustrades met <em>karakter.</em></h1>
        <p>Van de eerste lijn tot het kleinste detail: stel uw balustrade visueel samen. Ontdek de mogelijkheden in 3D en ontvang een offerte op maat na onze technische beoordeling.</p></div>
      <button type="button" className="reset-design" onClick={reset}><RotateCcw size={16}/> Begin opnieuw</button>
    </div>
    <div className="container bal-layout">
      <section className="bal-config-card" aria-label="Balustrade samenstellen">
        <div className="bal-top"><span className="eyebrow">BALUSTRADE OP MAAT</span><h2>Uw <em>ontwerpstudio.</em></h2>
          <p>Kies uw stijl. Wij zorgen voor het maatwerk.</p></div>
        <div className="bal-progress" aria-label="Ontwerpstappen">{titles.map((title,i)=>
          <button type="button" key={title} className={step===i?'is-active':step>i?'is-done':''} onClick={()=>setStep(i)}
            aria-current={step===i?'step':undefined}><span>{step>i?<Check size={13}/>:i+1}</span><small>{title}</small></button>)}</div>
        <div className="bal-form-content">
          {step===0&&<>
            <h3>Waar komt uw balustrade?</h3><p className="bal-hint">Kies de toepassing. Ook een bijzondere vorm kan later besproken worden.</p>
            <div className="bal-choices">{BAL_TYPES.map(t=><Choice key={t.id} title={t.label} desc={t.hint} active={design.type===t.id} onClick={()=>change({type:t.id,...(t.id==='trap'?{layout:'recht'}:{})})}/>)}</div>
            <h3>Binnen of buiten?</h3>
            <div className="bal-choices bal-choices-compact">{groups.map(([id,label])=><Choice key={id} title={label} active={design.placement===id} onClick={()=>change({placement:id})}/>)}</div>
          </>}
          {step===1&&<>
            <h3>Welke afmetingen heeft u in gedachten?</h3><p className="bal-hint">Vul een schatting in. U mag ook 0 cm invullen wanneer u een maat nog niet kent.</p>
            {design.type==='trap'?<p className="bal-hint">Voor een trap tonen we een recht, hellend voorbeeld. Bochten en bordessen worden bij de opmeting uitgewerkt.</p>:<>
              <h3>Hoe loopt de balustrade?</h3>
              <div className="bal-choices bal-choices-compact">{BAL_LAYOUTS.map(l=><Choice key={l.id} title={l.label} desc={l.hint} active={design.layout===l.id} onClick={()=>change({layout:l.id})}/>)}</div>
              <p className="bal-hint">Bij een hoekopstelling is dit de totale indicatieve lengte van beide zijden samen. Het 3D-model toont een voorbeeldverdeling.</p>
            </>}
            <Measure name="length" label="Totale lengte" value={design.length} onChange={length=>change({length})}/>
            <Measure name="height" label="Gewenste hoogte" value={design.height} onChange={height=>change({height})}/>
            <div className="bal-callout"><Ruler size={22}/><p><strong>Geen exacte maten nodig.</strong> Ahmed controleert ter plaatse de opening, de hoogte, de ondergrond en de bevestigingsmogelijkheden. De 3D-weergave is een indicatie.</p></div>
            <p className="bal-hint">Voor een trap of een hoekopstelling bespreken we het exacte verloop tijdens de opmeting. De 3D-preview toont één voorbeelddeel.</p>
          </>}
          {step===2&&<>
            <h3>Wat vindt u mooi?</h3><p className="bal-hint">Pas de invulling en kleur aan. De definitieve technische uitvoering wordt later beoordeeld.</p>
            <div className="bal-choices">{BAL_INFILL.map(t=><Choice key={t.id} title={t.label} desc={t.hint} visual={<InfillPreview kind={t.id}/>} active={design.infill===t.id} onClick={()=>change({infill:t.id})}/>)}</div>
            {design.infill==='glas'&&<>
              <h3>Uitstraling van het glas</h3>
              <div className="bal-choices bal-choices-compact">{BAL_GLASS.map(t=><Choice key={t.id} title={t.label} active={design.glass===t.id} onClick={()=>change({glass:t.id})}/>)}</div>
              <p className="bal-hint">Het vereiste veiligheidsglas en de bevestiging worden per project bepaald.</p>
            </>}
            <h3>Welke staalkleur?</h3>
            <div className="bal-swatches">{BAL_COLORS.map(t=><button type="button" key={t.id} aria-pressed={design.color===t.id} className={design.color===t.id?'selected':''} onClick={()=>change({color:t.id})}>
              <span style={{background:t.color}}></span><small>{t.label}</small></button>)}</div>
            {design.color==='andere'&&<label className="bal-custom">Gewenste kleur<input maxLength={70} value={design.customColor} onChange={e=>change({customColor:e.target.value})} placeholder="Bijv. RAL 9001"/></label>}
            <h3>Handregel</h3><div className="bal-choices">{BAL_HANDRAILS.map(t=><Choice key={t.id} title={t.label} active={design.handrail===t.id} onClick={()=>change({handrail:t.id})}/>)}</div>
            <h3>Bevestiging</h3><div className="bal-choices">{BAL_MOUNT.map(t=><Choice key={t.id} title={t.label} active={design.mount===t.id} onClick={()=>change({mount:t.id})}/>)}</div>
            <p className="bal-hint">Spijlafstanden, horizontale liggers, glasopbouw, handregels, bevestigingen en alle veiligheidsmaten moeten door MetaalMeesters gecontroleerd worden.</p>
          </>}
          {step===3&&<>
            <h3>Uw balustradeontwerp is klaar.</h3><p className="bal-hint">Vraag vrijblijvend een offerte aan. Ahmed kan op basis van uw wensen een inschatting maken; de definitieve prijs volgt na opmeting en technische beoordeling.</p>
            <div className="summary">
              <div><span>Toepassing</span><strong>{balustradeTypeLabel(design.type)} · {design.placement==='buiten'?'buiten':'binnen'}</strong></div>
              <div><span>Afmetingen (schatting)</span><strong>{cmLabel(design.length)} lang × {cmLabel(design.height)} hoog</strong></div>
              <div><span>Verloop</span><strong>{design.type==='trap'?'Helling · technisch na te meten':BAL_LAYOUTS.find(l=>l.id===design.layout)?.label}</strong></div>
              <div><span>Invulling</span><strong>{balustradeInfillLabel(design.infill)}{design.infill==='glas'?' · '+BAL_GLASS.find(x=>x.id===design.glass)?.label:''}</strong></div>
              <div><span>Staalkleur</span><strong>{balustradeColorLabel(design.color)}{design.color==='andere'&&design.customColor?' · '+design.customColor:''}</strong></div>
              <div><span>Handregel</span><strong>{BAL_HANDRAILS.find(x=>x.id===design.handrail)?.label}</strong></div>
              <div><span>Bevestiging</span><strong>{BAL_MOUNT.find(x=>x.id===design.mount)?.label}</strong></div>
            </div>
            <div className="bal-callout"><ShieldCheck size={22}/><p><strong>Geen definitief technisch plan.</strong> Uw ontwerp helpt bij het opstellen van een prijsinschatting. Hoogte, normconformiteit, belastingen, glas en verankering worden door het atelier beoordeeld.</p></div>
            <QuoteForm design={design} product="balustrade" stageId="balustrade-canvas"/>
          </>}
        </div>
        <div className="bal-actions">
          {step>0&&<button type="button" className="bal-prev" onClick={prev}><ArrowLeft size={16}/> Vorige stap</button>}
          {step<3&&<button type="button" className="btn btn-dark bal-next" onClick={next}>{step===2?'Naar mijn offerte':'Volgende stap'} <ArrowRight size={16}/></button>}
        </div>
      </section>
      <aside className="bal-preview-wrap">
        <div className="bal-preview-header"><div><span className="live-dot"></span><strong>UW BALUSTRADE · 3D VOORBEELD</strong></div><span><Eye size={15}/> DRAAI HET MODEL</span></div>
        <div id="balustrade-canvas" className="bal-preview">
          <Suspense fallback={<p className="bal-loading">3D-weergave laden...</p>}><BalustradeScene design={design}/></Suspense>
          <span className="bal-preview-caption">3D-visualisatie · indicatief</span>
        </div>
        <div className="bal-view-help"><Eye size={16}/><span>Sleep om te draaien. Scroll of knijp om in te zoomen. Elke wijziging verschijnt meteen in het model.</span></div>
        <div className="bal-preview-meta"><strong>{balustradeTypeLabel(design.type)}</strong><span>{cmLabel(design.length)} lang · {cmLabel(design.height)} hoog</span></div>
        <p className="bal-preview-disclaimer">3D-inspiratie, niet op schaal voor productie of een goedgekeurde veiligheidsconstructie. Werkelijke profielen en bevestiging na advies.</p>
      </aside>
    </div>
    <nav className="bal-mobile-jump" aria-label="Snel tussen ontwerp en 3D-weergave wisselen">
      <button type="button" onClick={()=>document.querySelector('.bal-config-card')?.scrollIntoView({behavior:'smooth',block:'start'})}><Ruler size={17}/> Instellingen</button>
      <button type="button" onClick={()=>document.getElementById('balustrade-canvas')?.scrollIntoView({behavior:'smooth',block:'center'})}><Eye size={17}/> Bekijk 3D</button>
    </nav>
  </main>;
}
