import React,{useEffect,useRef,useState} from 'react';
import {
  ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Check,Download,Eye,
  ImagePlus,Minus,Move,Plus,RotateCcw,Upload,X
} from 'lucide-react';
import DoorScene from './DoorScene.jsx';
import {downloadDesign} from './data.js';
import {capturePreviewImage} from './previewCapture.js';
import {
  DEFAULT_PLACEMENT,normalizePlacement,overlaySize,
  placementFromKey,adjustPlacement,pinchScale,clamp
} from './photo-placement.mjs';
import './house-preview.css';

const MAX_FILE_SIZE=12*1024*1024;
const MIME_TYPES=['image/jpeg','image/png','image/webp'];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

function Adjustment({name,value,min,max,step=1,onChange,unit='%'}) {
  return <div className="photo-adjustment">
    <div className="photo-adjustment-head"><label htmlFor={'photo-'+name}>{name}</label><output>{value}{unit}</output></div>
    <div className="photo-adjustment-controls">
      <button type="button" aria-label={name+' verkleinen'} onClick={()=>onChange(clamp(value-step,min,max))}><Minus size={16}/></button>
      <input id={'photo-'+name} type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))}/>
      <button type="button" aria-label={name+' vergroten'} onClick={()=>onChange(clamp(value+step,min,max))}><Plus size={16}/></button>
    </div>
  </div>;
}

export default function HousePreview({config,resetToken,onNotice,onChange}) {
  const [mode,setMode]=useState('studio');
  const [ownPhoto,setOwnPhoto]=useState(null);
  const [placement,setPlacement]=useState(DEFAULT_PLACEMENT);
  const [compare,setCompare]=useState(false);
  const [stageSize,setStageSize]=useState({width:680,height:460});
  const stageRef=useRef(null),uploadRef=useRef(null),photoUrlRef=useRef(null);
  const pointersRef=useRef(new Map()),gestureRef=useRef(null),resizeRef=useRef(null);
  const placementRef=useRef(DEFAULT_PLACEMENT);

  useEffect(()=>{
    if(!stageRef.current||typeof ResizeObserver==='undefined')return;
    const node=stageRef.current;
    const observer=new ResizeObserver(([entry])=>{
      const {width,height}=entry.contentRect;
      if(width>0&&height>0)setStageSize({width,height});
    });
    observer.observe(node);
    return ()=>observer.disconnect();
  },[mode,ownPhoto]);
  useEffect(()=>()=>{if(photoUrlRef.current)URL.revokeObjectURL(photoUrlRef.current);},[]);

  function changePlacement(patch) {
    setPlacement(previous=>{
      const next=normalizePlacement(typeof patch==='function'?patch(previous):{...previous,...patch});
      placementRef.current=next;
      return next;
    });
  }
  function loadPhoto(e) {
    const file=e.target.files?.[0];
    e.target.value='';
    if(!file)return;
    if(!MIME_TYPES.includes(file.type)||file.size>MAX_FILE_SIZE){
      onNotice('Kies een JPG-, PNG- of WebP-foto van maximaal 12 MB.');
      return;
    }
    if(photoUrlRef.current)URL.revokeObjectURL(photoUrlRef.current);
    const src=URL.createObjectURL(file);
    photoUrlRef.current=src;
    setOwnPhoto({src,name:file.name});
    changePlacement({...DEFAULT_PLACEMENT});
    setCompare(false);
    setMode('foto');
    onNotice('Uw eigen foto blijft lokaal in deze browser. Versleep de ingestelde deur naar de opening.');
  }
  function onPhotoError() {
    onNotice('Deze foto kon niet worden geopend. Probeer een andere JPG-, PNG- of WebP-foto.');
    setOwnPhoto(null);
    setMode('studio');
  }
  function startDrag(e) {
    if(compare)return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.focus({preventScroll:true});
    pointersRef.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointersRef.current.size===1){
      gestureRef.current={kind:'drag',startX:e.clientX,startY:e.clientY,p:placementRef.current};
    }else if(pointersRef.current.size>=2){
      const [a,b]=Array.from(pointersRef.current.values());
      gestureRef.current={kind:'pinch',distance:distance(a,b),p:placementRef.current};
    }
  }
  function dragDoor(e) {
    const pointers=pointersRef.current;
    if(!pointers.has(e.pointerId))return;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const g=gestureRef.current;
    if(!g)return;
    if(pointers.size>=2&&g.kind==='pinch'){
      const [a,b]=Array.from(pointers.values());
      const next=pinchScale(g.p,distance(a,b),g.distance);
      changePlacement({scale:next.scale});
    }else if(pointers.size===1&&g.kind==='drag'&&stageSize.width>0&&stageSize.height>0){
      const dx=(e.clientX-g.startX)/stageSize.width*100;
      const dy=(e.clientY-g.startY)/stageSize.height*100;
      changePlacement({x:g.p.x+dx,y:g.p.y+dy});
    }
  }
  function endDrag(e) {
    pointersRef.current.delete(e.pointerId);
    try{e.currentTarget.releasePointerCapture?.(e.pointerId);}catch{}
    if(pointersRef.current.size===1){
      const p=Array.from(pointersRef.current.values())[0];
      gestureRef.current={kind:'drag',startX:p.x,startY:p.y,p:placementRef.current};
    }else if(pointersRef.current.size===0)gestureRef.current=null;
  }
  function startResize(e) {
    e.preventDefault();e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    resizeRef.current={pointerId:e.pointerId,x:e.clientX,y:e.clientY,p:placementRef.current,
      size:overlaySize(stageSize,config,placementRef.current)};
  }
  function resizeDoor(e) {
    const r=resizeRef.current;
    if(!r||r.pointerId!==e.pointerId)return;
    e.preventDefault();e.stopPropagation();
    const widthFactor=clamp(1+(e.clientX-r.x)/Math.max(40,r.size.width),.25,3);
    const heightFactor=clamp(1+(e.clientY-r.y)/Math.max(40,r.size.height),.25,3);
    changePlacement({widthScale:r.p.widthScale*widthFactor,scale:r.p.scale*heightFactor});
  }
  function endResize(e){
    e.stopPropagation();
    if(resizeRef.current?.pointerId===e.pointerId)resizeRef.current=null;
    try{e.currentTarget.releasePointerCapture?.(e.pointerId);}catch{}
  }
  function keyOnDoor(e) {
    if(e.target!==e.currentTarget)return;
    const result=placementFromKey(placementRef.current,e.key,e.shiftKey);
    if(result.handled){e.preventDefault();changePlacement(result.placement);}
  }
  function moveByKey(direction,amount){
    changePlacement(prev=>adjustPlacement(prev,direction,amount));
  }

  const dims=overlaySize(stageSize,config,placement);
  const percentBrightness=(placement.light/100).toFixed(2);
  const shadowX=Math.round(2+placement.shadow*.08);
  const shadowY=Math.round(4+placement.shadow*.13);
  const shadowBlur=Math.round(3+placement.shadow*.075);
  const shadowOpacity=Math.min(.55,placement.shadow*.006).toFixed(2);
  const overlayStyle={
    left:placement.x+'%',top:placement.y+'%',height:dims.height+'px',width:dims.width+'px',
    filter:`brightness(${percentBrightness}) drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(15,24,21,${shadowOpacity}))`
  };

  async function savePreview(){
    try{
      const url=await capturePreviewImage({max:1800,quality:.91});
      const link=document.createElement('a');
      link.href=url;link.download=ownPhoto&&mode==='foto'?'metaalmeesters-deur-op-eigen-foto.jpg':'metaalmeesters-3d-deur.jpg';
      link.click();
      onNotice('Uw afbeelding werd opgeslagen.');
    }catch(e){onNotice(e.message||'Opslaan is niet gelukt.');}
  }

  return <section className="viewer-wrap house-viewer mm-simple-viewer" aria-label="Interactieve deurvisualisatie en eigen woningfoto">
    <div className="viewer-toolbar house-toolbar"><div><span className="live-dot"/><strong>UW DEUR · LIVE VOORBEELD</strong></div><span>{mode==='foto'?'EIGEN FOTO':'3D MODEL'}</span></div>
    <div className="view-mode-tabs" role="group" aria-label="Weergave kiezen">
      <button type="button" className={mode==='studio'?'current':''} onClick={()=>setMode('studio')} aria-pressed={mode==='studio'}>
        <Eye size={16}/> Bekijk mijn deur
      </button>
      <button type="button" className={mode==='foto'?'current':''} onClick={()=>setMode('foto')} aria-pressed={mode==='foto'}>
        <ImagePlus size={16}/> Op mijn eigen foto
      </button>
    </div>
    {mode==='foto'&&!ownPhoto?<>
      <div className="my-photo-empty" id="door-canvas">
        <div className="my-photo-icon"><ImagePlus size={37}/></div>
        <h3>Bekijk uw deur op uw eigen foto</h3>
        <p>Upload een foto van uw deuropening. Uw gekozen deurtype, glas, kleur en afmetingen worden er meteen in 3D op geplaatst.</p>
        <button className="btn btn-dark my-photo-upload-primary" type="button" onClick={()=>uploadRef.current?.click()}><Upload size={17}/> Mijn foto kiezen</button>
        <small>JPG, PNG of WebP · maximaal 12 MB · blijft op uw toestel</small>
      </div>
    </>:mode==='foto'&&ownPhoto?<div className="door-canvas house-stage my-photo-stage" id="door-canvas" ref={stageRef}>
      <img className="house-real-photo" src={ownPhoto.src} alt="De eigen woningfoto met daarop de gekozen deur" draggable="false" onError={onPhotoError}/>
      <div className="house-photo-vignette"/>
      {!compare&&<div className="house-door-overlay my-photo-door" style={overlayStyle}
        role="group" tabIndex={0} aria-label="Geselecteerde deur op de foto. Gebruik pijltjestoetsen om te verplaatsen, Shift en pijltjes om te schalen, plus en min om de hele deur te vergroten of te verkleinen."
        onKeyDown={keyOnDoor}
        onPointerDown={startDrag} onPointerMove={dragDoor}
        onPointerUp={endDrag} onPointerCancel={endDrag}
        title="Sleep de deur. Met twee vingers knijpen verandert de grootte.">
        <DoorScene config={config} resetToken={resetToken} photoMode photoAngle={placement.angle}/>
        <button type="button" className="my-photo-resize" aria-label="Sleep om de deur breder of hoger te maken"
          onPointerDown={startResize} onPointerMove={resizeDoor} onPointerUp={endResize} onPointerCancel={endResize}>
          <Move size={16}/>
        </button>
      </div>}
      <div className="house-photo-label"><Check size={13}/> UW EIGEN FOTO</div>
      {!compare&&<div className="house-drag-hint"><Move size={14}/> Sleep de deur · knijp met twee vingers om te vergroten</div>}
    </div>:<div className="door-canvas my-studio-stage" id="door-canvas">
      <DoorScene config={config} resetToken={resetToken} environment="studio"/>
      <div className="canvas-bottom"><Move size={15}/> Sleep om te draaien · zoom met uw vingers</div>
    </div>}

    <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp"
      onChange={loadPhoto} hidden aria-label="Een eigen foto van de deuropening uploaden"/>

    {mode==='foto'&&ownPhoto&&<div className="my-photo-editor">
      <div className="my-photo-editor-top">
        <div><strong>Zet uw deur precies op de foto</strong><span>Versleep de deur. Met de knoppen maakt u ze hoger of breder.</span></div>
        <div className="my-photo-editor-actions">
          <button type="button" onClick={()=>uploadRef.current?.click()}><Upload size={14}/> Andere foto</button>
          <button type="button" onClick={()=>changePlacement(DEFAULT_PLACEMENT)}><RotateCcw size={14}/> Reset</button>
        </div>
      </div>
      <div className="my-photo-size-controls">
        <Adjustment name="Hoogte" value={placement.scale} min={18} max={150} step={3} onChange={scale=>changePlacement({scale})}/>
        <Adjustment name="Breedte" value={placement.widthScale} min={35} max={220} step={5} onChange={widthScale=>changePlacement({widthScale})}/>
      </div>
      <div className="my-photo-quick-controls">
        <div className="my-photo-nudge">
          <span>Verplaats de deur</span>
          <div className="my-photo-nudge-buttons">
            <button type="button" aria-label="Deur naar links" onClick={()=>moveByKey('x',-2)}><ArrowLeft size={18}/></button>
            <button type="button" aria-label="Deur omhoog" onClick={()=>moveByKey('y',-2)}><ArrowUp size={18}/></button>
            <button type="button" aria-label="Deur omlaag" onClick={()=>moveByKey('y',2)}><ArrowDown size={18}/></button>
            <button type="button" aria-label="Deur naar rechts" onClick={()=>moveByKey('x',2)}><ArrowRight size={18}/></button>
          </div>
        </div>
        <button type="button" className="my-photo-compare" onPointerDown={()=>setCompare(true)}
          onPointerUp={()=>setCompare(false)} onPointerCancel={()=>setCompare(false)} onPointerLeave={()=>setCompare(false)}
          onKeyDown={e=>{if(e.key===' '||e.key==='Enter')setCompare(true);}}
          onKeyUp={()=>setCompare(false)}><Eye size={16}/> Houd vast: originele foto</button>
      </div>
      <details className="viewer-advanced-controls my-photo-advanced">
        <summary>Perspectief en licht aanpassen (optioneel)</summary>
        <div className="house-adjust-grid">
          <Adjustment name="Draaiing" value={placement.angle} min={-45} max={45} step={2} unit="°" onChange={angle=>changePlacement({angle})}/>
          <Adjustment name="Belichting" value={placement.light} min={60} max={140} step={5} onChange={light=>changePlacement({light})}/>
          <Adjustment name="Schaduw" value={placement.shadow} min={0} max={90} step={5} onChange={shadow=>changePlacement({shadow})}/>
        </div>
      </details>
      <p className="my-photo-keyboard-hint">Op laptop: klik op de deur en gebruik <kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> om ze te verplaatsen, <kbd>+</kbd>/<kbd>−</kbd> om te vergroten of te verkleinen, en <kbd>Shift</kbd> + pijltjestoetsen voor breedte of hoogte.</p>
      <p className="house-reality-note">Dit is een indicatieve plaatsing. Een bestaande deur op de foto wordt niet automatisch verwijderd. Uw foto blijft lokaal op uw toestel; alleen een afbeelding die u bewust downloadt of met een echte offerte verzendt, wordt gedeeld.</p>
    </div>}
    <div className="viewer-actions">
      <div><button type="button" className="viewer-btn" onClick={()=>onChange({open:!config.open})}><Eye size={16}/>{config.open?'Deur sluiten':config.type==='schuif'?'Deur verschuiven':'Deur openen'}</button>
      {mode==='studio'&&<button type="button" className="viewer-btn" onClick={()=>setMode('foto')}><ImagePlus size={16}/> Eigen foto toevoegen</button>}</div>
      <div><button type="button" className="viewer-btn" onClick={savePreview} disabled={mode==='foto'&&!ownPhoto}><Download size={16}/> Afbeelding bewaren</button>
        <button type="button" className="viewer-btn muted my-download-data" onClick={()=>downloadDesign(config)}><Download size={14}/> Ontwerpdata</button>
      </div>
    </div>
    <div className="viewer-disclaimer"><Check size={15}/> De definitieve maten en technische uitvoering worden gecontroleerd door MetaalMeesters.</div>
  </section>;
}
