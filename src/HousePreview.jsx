import React,{useEffect,useRef,useState} from 'react';
import {Check,Download,Eye,EyeOff,House,ImagePlus,Move,RotateCcw,SlidersHorizontal,Upload, X} from 'lucide-react';
import DoorScene from './DoorScene.jsx';
import {downloadDesign} from './data.js';
import {capturePreviewImage} from './previewCapture.js';
import './house-preview.css';

// Rights-checked Pexels sample houses. These are NEVER labelled as MetaalMeesters projects.
// Original source, photographer and license are in public/homes/README.md.
const SAMPLE_HOMES=[
  {id:'lichte-inkom',name:'Lichte inkom',file:'lichte-inkom.jpg',by:'Ksenia Chernaya',source:'https://www.pexels.com/photo/interior-of-new-cozy-apartment-5691591/',note:'Echte foto met open doorgang',placement:{x:53,y:54,scale:70,angle:0}},
  {id:'moderne-voordeur',name:'Moderne gevel',file:'moderne-voordeur.jpg',by:'Curtis Adams',source:'https://www.pexels.com/photo/modern-front-entrance-with-wooden-door-36777846/',note:'Voorbeeld met bestaande deur',placement:{x:49,y:53,scale:53,angle:0}},
  {id:'klassieke-inkom',name:'Klassieke woning',file:'klassieke-inkom.jpg',by:'Erik Mclean',source:'https://www.pexels.com/photo/entrance-to-a-house-9459176/',note:'Voorbeeld met bestaande deur',placement:{x:50,y:54,scale:52,angle:0}},
  {id:'woning-tuin',name:'Gezinswoning',file:'woning-tuin.jpg',by:'Curtis Adams',source:'https://www.pexels.com/photo/front-exterior-of-a-family-home-8031873/',note:'Breder zicht op echte woning',placement:{x:51,y:55,scale:42,angle:0}}
];
const HOME_BASE=(import.meta.env.BASE_URL||'/')+'homes/';
const defaults={x:50,y:56,scale:78,angle:0};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function Control({label,value,min,max,onChange,unit='%'}) {
  return <label className="house-adjustment"><span>{label}<strong>{value}{unit}</strong></span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
export default function HousePreview({config,resetToken,onNotice,onChange}) {
  const [mode,setMode]=useState('woning3d');
  const [finish,setFinish]=useState('warm'),[view,setView]=useState('overview');
  const [selected,setSelected]=useState(SAMPLE_HOMES[0].id);
  const [ownPhoto,setOwnPhoto]=useState(null);
  const [placement,setPlacement]=useState(SAMPLE_HOMES[0].placement);
  const [compare,setCompare]=useState(false);
  const [stageSize,setStageSize]=useState({width:680,height:540});
  const stageRef=useRef(null),uploadRef=useRef(null),dragRef=useRef(null),photoRef=useRef(null);
  useEffect(()=>{
    if(!stageRef.current||typeof ResizeObserver==='undefined')return;
    const observer=new ResizeObserver(([entry])=>setStageSize({width:entry.contentRect.width,height:entry.contentRect.height}));
    observer.observe(stageRef.current);
    return ()=>observer.disconnect();
  },[mode]);
  useEffect(()=>()=>{if(photoRef.current)URL.revokeObjectURL(photoRef.current);},[]);
  function update(patch){setPlacement(p=>({...p,...patch}));}
  function loadPhoto(e) {
    const f=e.target.files?.[0];
    e.target.value='';
    if(!f)return;
    if(!f.type.startsWith('image/')||f.size>12*1024*1024){
      onNotice('Kies een JPG, PNG of WebP-foto van maximaal 12 MB.');
      return;
    }
    if(photoRef.current)URL.revokeObjectURL(photoRef.current);
    photoRef.current=URL.createObjectURL(f);
    setOwnPhoto({src:photoRef.current,name:f.name});
    setSelected('eigen');
    setPlacement(defaults);
    setMode('foto');
    onNotice('Uw eigen foto wordt alleen in uw browser gebruikt. Versleep de 3D-deur naar de echte opening.');
  }
  function choosePhoto(id) {
    setSelected(id);setPlacement(SAMPLE_HOMES.find(p=>p.id===id)?.placement||defaults);setCompare(false);
  }
  function moveStart(e) {
    if(compare)return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current={startX:e.clientX,startY:e.clientY,x:placement.x,y:placement.y};
  }
  function moveDoor(e) {
    if(!dragRef.current||!stageSize.width||!stageSize.height)return;
    const {startX,startY,x,y}=dragRef.current;
    setPlacement(p=>({...p,x:clamp(Math.round(x+(e.clientX-startX)/stageSize.width*100),4,96),y:clamp(Math.round(y+(e.clientY-startY)/stageSize.height*100),5,97)}));
  }
  const sample=SAMPLE_HOMES.find(x=>x.id===selected);
  const scenePhoto=selected==='eigen'?ownPhoto?.src:HOME_BASE+(sample?.file||SAMPLE_HOMES[0].file);
  const doorHeightPx=stageSize.height*placement.scale/100;
  const widthMm=Math.max(500,Number(config.width)||900),heightMm=Math.max(1400,Number(config.height)||2200);
  const overlayWidth=clamp(doorHeightPx*(widthMm/heightMm)*1.48,Math.min(110,stageSize.width*.26),stageSize.width*.88);
  async function savePreview(){
    try {
      const url=await capturePreviewImage({max:1800,quality:.91});
      const a=document.createElement('a');a.href=url;a.download='metaalmeesters-deur-in-woning.jpg';a.click();
      onNotice('De voorbeeldafbeelding werd opgeslagen.');
    }catch(e){onNotice(e.message);}
  }
  return <section className="viewer-wrap house-viewer" aria-label="Interactieve 3D-deur met dynamische woning en echte woningfoto">
    <div className="viewer-toolbar house-toolbar"><div><span className="live-dot"/><strong>LIVE 3D VISUALISATIE</strong></div><span>{mode==='woning3d'?'3D WONING · MEESCHALENDE MUUR':mode==='foto'?'ECHTE FOTO · 3D DEUR':'3D ATELIER'}</span></div>
    <div className="view-mode-tabs" role="group" aria-label="Weergave kiezen">
      <button type="button" className={mode==='woning3d'?'current':''} onClick={()=>setMode('woning3d')} aria-pressed={mode==='woning3d'}><House size={16}/> 3D-woning</button>
      <button type="button" className={mode==='foto'?'current':''} onClick={()=>setMode('foto')} aria-pressed={mode==='foto'}><ImagePlus size={16}/> Echte woningfoto</button>
      <button type="button" className={mode==='studio'?'current':''} onClick={()=>setMode('studio')} aria-pressed={mode==='studio'}><SlidersHorizontal size={16}/> 3D-atelier</button>
    </div>
    {mode==='foto'?<>
      <div className="door-canvas house-stage" id="door-canvas" ref={stageRef}>
        <img className="house-real-photo" src={scenePhoto} alt={selected==='eigen'?'Eigen woningfoto van de klant':('Voorbeeldwoning: '+(sample?.name||'lichte inkom'))} draggable="false"/>
        <div className="house-photo-vignette"/>
        {!compare&&<div className="house-door-overlay"
           style={{
             left:placement.x+'%',top:placement.y+'%',
             height:doorHeightPx+'px',width:overlayWidth+'px',
             filter:'brightness('+((placement.light??100)/100).toFixed(2)+') drop-shadow('+
               Math.round(2+(placement.shadow??45)*.08)+'px '+
               Math.round(4+(placement.shadow??45)*.13)+'px '+
               Math.round(3+(placement.shadow??45)*.075)+'px rgba(15,24,21,'+
               (Math.min(.55,(placement.shadow??45)*.006)).toFixed(2)+'))'
           }}
           onPointerDown={moveStart} onPointerMove={moveDoor}
           onPointerUp={()=>{dragRef.current=null;}} onPointerCancel={()=>{dragRef.current=null;}}
           aria-label="Versleep de deur over de woningfoto" title="Versleep om de deur op de juiste plek te zetten">
          <DoorScene config={config} resetToken={resetToken} photoMode photoAngle={placement.angle}/>
        </div>}
        <div className="house-photo-label"><House size={12}/>{selected==='eigen'?'UW EIGEN WONINGFOTO':'ECHTE WONING · VOORBEELDFOTO'}</div>
        {!compare&&<div className="house-drag-hint"><Move size={15}/> Sleep de deur naar de opening</div>}
      </div>
      <div className="house-context-controls">
        <div className="house-context-top">
          <div><strong>Bekijk uw deur in een bestaande woning</strong><span>Vrij te gebruiken voorbeeldfoto's of uw eigen deuropening.</span></div>
          <button className="house-compare" onPointerDown={()=>setCompare(true)} onPointerUp={()=>setCompare(false)} onPointerLeave={()=>setCompare(false)} onKeyDown={e=>{if(e.key===' '||e.key==='Enter')setCompare(true);}} onKeyUp={()=>setCompare(false)} title="Houd ingedrukt om de oorspronkelijke foto te zien"><Eye size={15}/> Origineel bekijken</button>
        </div>
        <div className="house-photo-options">
          {SAMPLE_HOMES.map(p=><button type="button" key={p.id} className={'house-photo-option '+(selected===p.id?'active':'')} onClick={()=>choosePhoto(p.id)} title={p.note}>
            <img src={HOME_BASE+p.file} alt={'Fotovoorbeeld '+p.name}/><span>{p.name}</span>{selected===p.id&&<Check className="house-photo-check" size={14}/>}
          </button>)}
          <button type="button" className={'house-photo-option house-upload-tile '+(selected==='eigen'?'active':'')} onClick={()=>{if(ownPhoto)choosePhoto('eigen');else uploadRef.current?.click();}}>
            <ImagePlus size={21}/><span>{ownPhoto?'Mijn foto tonen':'Mijn eigen foto'}</span>
          </button>
          <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={loadPhoto} hidden aria-label="Eigen woningfoto uploaden"/>
        </div>
        <div className="house-photo-attribution">{sample?<><span>Voorbeeldfoto: {sample.by} via Pexels · niet van MetaalMeesters.</span><a href={sample.source} target="_blank" rel="noopener noreferrer">Fotobron bekijken</a></>:<><span>Uw eigen woningfoto wordt niet online opgeslagen.</span><button type="button" onClick={()=>uploadRef.current?.click()}>Andere eigen foto kiezen</button></>}</div>
        <div className="house-placement-head"><div><strong>Deur in de foto plaatsen</strong><span>Sleep de deur of pas de schuifbalken aan.</span></div><button className="house-reset" onClick={()=>setPlacement(sample?.placement||defaults)} title="Plaatsing herstellen"><RotateCcw size={15}/> Herstel</button></div>
        <div className="house-adjust-grid">
          <Control label="Formaat" value={placement.scale} min={25} max={110} onChange={v=>update({scale:v})}/>
          <Control label="Perspectief" value={placement.angle} min={-35} max={35} unit="°" onChange={v=>update({angle:v})}/>
          <Control label="Horizontaal" value={placement.x} min={4} max={96} onChange={v=>update({x:v})}/>
          <Control label="Verticaal" value={placement.y} min={5} max={97} onChange={v=>update({y:v})}/>
          <Control label="Belichting" value={placement.light??100} min={60} max={140} onChange={v=>update({light:v})}/>
          <Control label="Schaduw" value={placement.shadow??45} min={0} max={90} onChange={v=>update({shadow:v})}/>
        </div>
        <p className="house-reality-note"><strong>Zo ziet uw ontwerp er ongeveer uit.</strong> Dit zijn echte stockfoto's van woningen, geen realisaties van MetaalMeesters. Op foto's met een bestaande deur wordt die niet automatisch verwijderd: uw 3D-ontwerp komt er visueel overheen. Versleep de deur naar de bestaande opening. Grootte, perspectief, glas en belichting zijn indicatief, niet geschikt voor technische maatopname. Een eigen foto blijft in uw browser totdat u zelf een offerte verstuurt.</p>
      </div>
    </>:<div className={'door-canvas '+(mode==='woning3d'?'architect-scene':'')} id="door-canvas">
      <DoorScene config={config} resetToken={resetToken} environment={mode==='woning3d'?'house':'studio'} finish={finish} view={view}/>
      {mode==='woning3d'&&<div className="architect-status"><House size={14}/><div><strong>De woning past zich aan uw deur aan</strong><span>Muuropening: {config.width} × {config.height} mm</span></div></div>}
      <div className="canvas-bottom"><Move size={16}/> Sleep om te draaien · Scroll om te zoomen</div>
    </div>}
    {mode==='woning3d'&&<div className="architect-settings">
      <div className="architect-settings-top"><div><strong>Ontwerp uw deur, de woning groeit mee.</strong><p>De muur en ramen schuiven automatisch op wanneer uw deur breder of hoger wordt.</p></div></div>
      <div className="architect-settings-grid">
        <div className="architect-setting"><span>GEVELAFWERKING</span><div className="architect-choices">
          <button type="button" className={finish==='warm'?'active':''} onClick={()=>setFinish('warm')} aria-pressed={finish==='warm'}><i className="architect-sample warm"/> Warme steen</button>
          <button type="button" className={finish==='dark'?'active':''} onClick={()=>setFinish('dark')} aria-pressed={finish==='dark'}><i className="architect-sample dark"/> Donkere gevel</button>
        </div></div>
        <div className="architect-setting"><span>CAMERASTANDPUNT</span><div className="architect-choices">
          <button type="button" className={view==='overview'?'active':''} onClick={()=>setView('overview')} aria-pressed={view==='overview'}>Hele woning</button>
          <button type="button" className={view==='detail'?'active':''} onClick={()=>setView('detail')} aria-pressed={view==='detail'}>Deur in detail</button>
        </div></div>
      </div>
      <p className="house-reality-note"><strong>Dynamische architectuurvisualisatie.</strong> De 3D-gevel wordt echt opnieuw opgebouwd voor de gekozen maten, inclusief de muuropening. Dit is een indicatieve, digitaal ontworpen voorbeeldwoning en geen foto of bouwkundig uitvoeringsplan. De definitieve maten worden door MetaalMeesters gecontroleerd.</p>
    </div>}
    <div className="viewer-actions">
      <div><button className="viewer-btn" onClick={()=>onChange({open:!config.open}) }><Eye size={16}/> {config.open?'Deur sluiten':config.type==='schuif'?'Deur verschuiven':'Deur openen'}</button><button className="viewer-btn" onClick={()=>setMode(v=>v==='foto'?'woning3d':'foto')}><House size={16}/>{mode==='foto'?'3D-woning bekijken':'Op echte foto bekijken'}</button></div>
      <div><button className="icon-btn" title="Bewaar afbeelding" onClick={savePreview}><Download size={17}/></button><button className="viewer-btn muted" onClick={()=>downloadDesign(config)}><Download size={15}/> Ontwerpdata</button></div>
    </div>
    <div className="viewer-disclaimer"><Check size={15}/> De afmetingen en maakbaarheid worden bij een officiële offerte gecontroleerd door MetaalMeesters.</div>
  </section>;
}
