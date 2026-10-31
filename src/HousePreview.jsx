import React,{useEffect,useRef,useState} from 'react';
import {Check,Download,Eye,EyeOff,House,ImagePlus,Move,RotateCcw,SlidersHorizontal,Upload, X} from 'lucide-react';
import DoorScene from './DoorScene.jsx';
import {imageUrl,TYPES,downloadDesign} from './data.js';
import {capturePreviewImage} from './previewCapture.js';
import './house-preview.css';

// Only real project photographs belonging to the existing MetaalMeesters website.
// No synthetic or AI-created house imagery is presented as a real residence.
const REAL_PHOTOS=[
  {id:'project-woning',name:'Projectfoto · Woning',image:'balcony'},
  {id:'project-exterieur',name:'Projectfoto · Exterieur',image:'hero'},
  {id:'project-interieur',name:'Projectfoto · Interieur',image:'hospitality'}
];
const defaults={x:50,y:56,scale:78,angle:0};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function Control({label,value,min,max,onChange,unit='%'}) {
  return <label className="house-adjustment"><span>{label}<strong>{value}{unit}</strong></span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
export default function HousePreview({config,resetToken,onNotice,onChange}) {
  const [mode,setMode]=useState('huis');
  const [selected,setSelected]=useState(REAL_PHOTOS[0].id);
  const [ownPhoto,setOwnPhoto]=useState(null);
  const [placement,setPlacement]=useState(defaults);
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
    setMode('huis');
    onNotice('Uw eigen foto staat alleen in deze browser. Verschuif de 3D-deur naar de opening.');
  }
  function choosePhoto(id) {
    setSelected(id);setPlacement(defaults);setCompare(false);
    if(id!=='eigen'&&photoRef.current){URL.revokeObjectURL(photoRef.current);photoRef.current=null;setOwnPhoto(null);}
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
  const scenePhoto=selected==='eigen'?ownPhoto?.src:imageUrl(REAL_PHOTOS.find(x=>x.id===selected)?.image||'balcony');
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
  return <section className="viewer-wrap house-viewer" aria-label="Interactieve 3D-deur in een echte woningfoto">
    <div className="viewer-toolbar house-toolbar"><div><span className="live-dot"/><strong>LIVE 3D VISUALISATIE</strong></div><span>ECHTE FOTO · 3D DEUR</span></div>
    <div className="view-mode-tabs" role="group" aria-label="Weergave kiezen">
      <button type="button" className={mode==='huis'?'current':''} onClick={()=>setMode('huis')}><House size={16}/> Bekijk in een woning</button>
      <button type="button" className={mode==='studio'?'current':''} onClick={()=>setMode('studio')}><SlidersHorizontal size={16}/> Bekijk in 3D</button>
    </div>
    {mode==='huis'?<>
      <div className="door-canvas house-stage" id="door-canvas" ref={stageRef}>
        <img className="house-real-photo" src={scenePhoto} alt={selected==='eigen'?'Eigen foto van de klant':'Echte MetaalMeesters projectfoto'} draggable="false"/>
        <div className="house-photo-vignette"/>
        {!compare&&<div className="house-door-overlay"
           style={{left:placement.x+'%',top:placement.y+'%',height:doorHeightPx+'px',width:overlayWidth+'px'}}
           onPointerDown={moveStart} onPointerMove={moveDoor}
           onPointerUp={()=>{dragRef.current=null;}} onPointerCancel={()=>{dragRef.current=null;}}
           aria-label="Versleep de deur over de woningfoto" title="Versleep om de deur op de juiste plek te zetten">
          <DoorScene config={config} resetToken={resetToken} photoMode photoAngle={placement.angle}/>
        </div>}
        <div className="house-photo-label"><House size={12}/>{selected==='eigen'?'UW EIGEN WONINGFOTO':'ORIGINELE PROJECTFOTO'}</div>
        {!compare&&<div className="house-drag-hint"><Move size={15}/> Sleep de deur naar de opening</div>}
      </div>
      <div className="house-context-controls">
        <div className="house-context-top">
          <div><strong>Kies een echte omgeving</strong><span>Of gebruik een foto van uw eigen deuropening.</span></div>
          <button className="house-compare" onPointerDown={()=>setCompare(true)} onPointerUp={()=>setCompare(false)} onPointerLeave={()=>setCompare(false)} onKeyDown={e=>{if(e.key===' '||e.key==='Enter')setCompare(true);}} onKeyUp={()=>setCompare(false)} title="Houd ingedrukt om de oorspronkelijke foto te zien"><Eye size={15}/> Origineel bekijken</button>
        </div>
        <div className="house-photo-options">
          {REAL_PHOTOS.map(p=><button key={p.id} className={'house-photo-option '+(selected===p.id?'active':'')} onClick={()=>choosePhoto(p.id)}>
            <img src={imageUrl(p.image)} alt={p.name}/><span>{p.name.replace('Projectfoto · ','')}</span>{selected===p.id&&<Check className="house-photo-check" size={14}/>}
          </button>)}
          <button className={'house-photo-option house-upload-tile '+(selected==='eigen'?'active':'')} onClick={()=>uploadRef.current?.click()}>
            <ImagePlus size={21}/><span>{ownPhoto?'Andere foto':'Mijn eigen foto'}</span>
          </button>
          <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={loadPhoto} hidden aria-label="Eigen woningfoto uploaden"/>
        </div>
        <div className="house-placement-head"><div><strong>Deur in de foto plaatsen</strong><span>Sleep de deur of pas de schuifbalken aan.</span></div><button className="house-reset" onClick={()=>setPlacement(defaults)} title="Plaatsing herstellen"><RotateCcw size={15}/> Herstel</button></div>
        <div className="house-adjust-grid">
          <Control label="Formaat" value={placement.scale} min={25} max={110} onChange={v=>update({scale:v})}/>
          <Control label="Perspectief" value={placement.angle} min={-35} max={35} unit="°" onChange={v=>update({angle:v})}/>
          <Control label="Horizontaal" value={placement.x} min={4} max={96} onChange={v=>update({x:v})}/>
          <Control label="Verticaal" value={placement.y} min={5} max={97} onChange={v=>update({y:v})}/>
        </div>
        <p className="house-reality-note"><strong>Realistische fotovoorvertoning.</strong> De achtergrond is een echte foto, geen gegenereerd 3D-huis. De plaatsing, schaal en lichtinval zijn indicatief; dit is geen exacte architecturale fotomontage of maatopname. Foto's die u zelf toevoegt worden alleen lokaal getoond zolang u de pagina geopend houdt.</p>
      </div>
    </>:<div className="door-canvas" id="door-canvas"><DoorScene config={config} resetToken={resetToken}/><div className="canvas-bottom"><Move size={16}/> Sleep om te draaien · Scroll om te zoomen</div></div>}
    <div className="viewer-actions">
      <div><button className="viewer-btn" onClick={()=>onChange({open:!config.open}) }><Eye size={16}/> {config.open?'Deur sluiten':config.type==='schuif'?'Deur verschuiven':'Deur openen'}</button><button className="viewer-btn" onClick={()=>setMode(v=>v==='huis'?'studio':'huis')}><House size={16}/>{mode==='huis'?'3D atelier':'In huis bekijken'}</button></div>
      <div><button className="icon-btn" title="Bewaar afbeelding" onClick={savePreview}><Download size={17}/></button><button className="viewer-btn muted" onClick={()=>downloadDesign(config)}><Download size={15}/> Ontwerpdata</button></div>
    </div>
    <div className="viewer-disclaimer"><Check size={15}/> De afmetingen en maakbaarheid worden bij een officiële offerte gecontroleerd door MetaalMeesters.</div>
  </section>;
}
