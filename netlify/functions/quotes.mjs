import {randomUUID,createHash} from 'node:crypto';
import {authorized,safeOrigin,apiJSON} from '../lib/session.mjs';
import {putQuote,getQuote,listQuotes,deleteQuote,STAGES} from '../lib/quotes-data.mjs';
import {FRAMES,GLASSES,HANDLES,CLOSURES,PANEL_LAYOUTS} from '../../src/product-options.mjs';
import {cmLabel,onsiteMeasureNote} from '../../src/measurement-units.mjs';
import {safeBalustradeDesign,balustradeTypeLabel,balustradeInfillLabel,balustradeColorLabel,BAL_HANDRAILS,BAL_MOUNT,BAL_GLASS} from '../../src/balustrade-options.mjs';

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const permitted={
  type:['enkel','dubbel','schuif','pivot','wand'],
  frame:FRAMES.map(x=>x.id),
  glass:GLASSES.map(x=>x.id),
  handle:HANDLES.map(x=>x.id),
  opening:['links','rechts']
};
const clean=(value,max=300)=>String(value||'').trim().slice(0,max);
const error=(msg,code=400)=>apiJSON({error:msg},code);
export function validDesign(d) {
  if(!d || typeof d!=='object')return false;
  // 0 cm is allowed as 'nog op te meten'. The request is not a production plan.
  // Do not confuse 3D viewport limits with the sizes an atelier can discuss.
  if(!Number.isSafeInteger(d.width)||d.width<0||d.width>1e9 ||
     !Number.isSafeInteger(d.height)||d.height<0||d.height>1e9)return false;
  if(d.type==='wand' && (!Number.isSafeInteger(d.doorWidth) || d.doorWidth<0 || d.doorWidth>1e9 ||
     (d.width>0&&d.doorWidth>0&&d.doorWidth>d.width) ||
     !['links','rechts','beide'].includes(d.fixedPanelSide)))return false;
  if(d.frame==='andere' && (d.customColor!=null && typeof d.customColor!=='string'))return false;
  if(d.closure!=null&&!CLOSURES.some(x=>x.id===d.closure))return false;
  const layout=d.panelLayout||'glas';
  if(!PANEL_LAYOUTS.some(x=>x.id===layout))return false;
  if(layout==='staal-onder'&&(!Number.isSafeInteger(d.lowerPanelHeight)||d.lowerPanelHeight<0||d.lowerPanelHeight>1e9||
    (d.height>0&&d.lowerPanelHeight>d.height*.60)))return false;
  const topShape=d.topShape||'recht';
  if(!['recht','boog'].includes(topShape))return false;
  if(topShape==='boog'&&d.type==='schuif')return false;
  return Object.entries(permitted).every(([key,values])=>values.includes(d[key])) &&
    Number.isInteger(d.vertical)&&d.vertical>=0&&d.vertical<=4 &&
    Number.isInteger(d.horizontal)&&d.horizontal>=0&&d.horizontal<=5;
}
function sameClientOrigin(req) {
  const origin=req.headers.get('origin');
  return !!origin && safeOrigin(req);
}
function safeImage(value) {
  if(typeof value!=='string' || value.length>1400000 ||
     !/^data:image\/jpeg;base64,[a-zA-Z0-9+/=]+$/.test(value))return null;
  return value;
}
async function mailNotification(quote,req) {
  const {RESEND_API_KEY,QUOTE_FROM_EMAIL,QUOTE_TO_EMAIL}=process.env;
  if(!RESEND_API_KEY||!QUOTE_FROM_EMAIL||!QUOTE_TO_EMAIL)return 'niet ingesteld';
  const d=quote.design;
  const text=(quote.product==='balustrade' ? [
    'Nieuwe BALUSTRADE-offerteaanvraag bij MetaalMeesters',
    '',
    'Klant: '+quote.name,
    'E-mail: '+quote.email,
    'Telefoon: '+(quote.phone||'-'),
    'Locatie: '+(quote.city||'-'),
    'Type: '+balustradeTypeLabel(d.type),
    'Toepassing: '+(d.placement==='buiten'?'Buiten':'Binnen'),
    'Lengte (schatting): '+cmLabel(d.length),
    'Hoogte (schatting): '+cmLabel(d.height),
    'Invulling: '+balustradeInfillLabel(d.infill),
    ...(d.infill==='glas'?['Glasuitstraling: '+(BAL_GLASS.find(x=>x.id===d.glass)?.label||d.glass)]:[]),
    'Kleur: '+balustradeColorLabel(d.color)+(d.color==='andere'?' · '+(d.customColor||'Nog te bepalen'):''),
    'Handregel: '+(BAL_HANDRAILS.find(x=>x.id===d.handrail)?.label||d.handrail),
    'Bevestiging: '+(BAL_MOUNT.find(x=>x.id===d.mount)?.label||d.mount),
    '',
    'Opmeting, veiligheidsvereisten, draagkracht en definitieve prijs worden door MetaalMeesters beoordeeld.',
    '',
    'Bekijk het 3D-voorbeeld in het privébeheerportaal:',
    new URL('/#/beheer',req.url).href,
    'Referentie: '+quote.id
  ] : [
    'Er is een nieuwe offerteaanvraag binnengekomen op MetaalMeesters.',
    '',
    'Klant: '+quote.name,
    'E-mail: '+quote.email,
    'Telefoon: '+(quote.phone||'-'),
    'Locatie: '+(quote.city||'-'),
    'Deurtype: '+d.type,
    ...(d.type==='wand'?['Geïntegreerde deur: '+cmLabel(d.doorWidth),'Vaste panelen: '+d.fixedPanelSide]:[]),
    'Breedte (voorlopig): '+cmLabel(d.width),
    'Hoogte (voorlopig): '+cmLabel(d.height),
    'Bovenvorm: '+(d.topShape==='boog'?'Boog, exacte radius volgt na inmeten':'Recht'),
    onsiteMeasureNote(),
    'Glassoort: '+(GLASSES.find(x=>x.id===d.glass)?.label||d.glass),
    'Glasopbouw: '+(GLASSES.find(x=>x.id===d.glass)?.safety||'Nog te bevestigen'),
    'Kader: '+(FRAMES.find(x=>x.id===d.frame)?.label||d.frame)+(d.customColor?' · '+d.customColor:''),
    'Deurvulling: '+(PANEL_LAYOUTS.find(x=>x.id===d.panelLayout)?.label||'Volledig glas'),
    ...(d.panelLayout==='staal-onder'?['Stalen onderpaneel: '+cmLabel(d.lowerPanelHeight)]:[]),
    'Handgreep: '+(HANDLES.find(x=>x.id===d.handle)?.label||d.handle),
    'Sluiting: '+(CLOSURES.find(x=>x.id===d.closure)?.label||'Nog te bepalen'),
    '',
    'Bekijk de volledige configuratie en de privé-afbeelding in uw beheerportaal:',
    new URL('/#/beheer',req.url).href,
    '',
    'Referentie: '+quote.id
  ]).join('\n');
  try {
    const res=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':'Bearer '+RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:QUOTE_FROM_EMAIL,to:[QUOTE_TO_EMAIL],reply_to:quote.email,subject:'Nieuwe '+(quote.product==='balustrade'?'balustrade-':'deur-')+'offerte · '+quote.name+' · '+quote.id.slice(-8),text})
    });
    if(!res.ok)throw new Error('E-mailprovider status '+res.status);
    return 'verstuurd';
  } catch(e) {console.error('E-mailmelding mislukt',e.message);return 'mislukt';}
}
async function processSubmission(req) {
  if(!sameClientOrigin(req))return error('Aanvragen moeten vanaf de website verstuurd worden.',403);
  const size=Number(req.headers.get('content-length')||0);
  if(size>1650000)return error('De afbeelding is te groot.',413);
  let input;
  try{input=await req.json();}catch{return error('Ongeldige gegevens.');}
  if(!input || typeof input!=='object')return error('Ongeldige aanvraag.');
  if(input.website) return error('Aanvraag kon niet worden verwerkt.',400);
  const {name,email,phone,city,notes,product,design,image,consent}=input;
  if(product!=null&&!['deur','balustrade'].includes(product))return error('Onbekende productsoort.');
  const kind=product==='balustrade'?'balustrade':'deur';
  const balustrade=kind==='balustrade'?safeBalustradeDesign(design):null;
  if(!consent || !clean(name,151) || clean(name,151).length>150 || !emailPattern.test(clean(email,260)) ||
    (kind==='balustrade'?!balustrade:!validDesign(design)))return error('Controleer uw contactgegevens en ontwerp.');
  const photo=safeImage(image);
  if(!photo)return error('De foto van uw 3D-deur ontbreekt. Probeer opnieuw, bij voorkeur in een moderne browser.');
  // Rudimentary abuse limit. Use managed CAPTCHA or a transactional store for production at scale.
  const fingerprint=clean(req.headers.get('x-nf-client-connection-ip')||req.headers.get('x-forwarded-for')||'unknown',150);
  const fingerprintKey=createHash('sha256').update(fingerprint).digest('hex');
  const { getStore }=await import('@netlify/blobs');
  const limitStore=getStore({name:'metaalmeesters-submission-limits',region:process.env.BLOBS_REGION||'eu-central-1',consistency:'strong'});
  const limiter=await limitStore.get(fingerprintKey,{type:'json'});
  if(limiter && Date.now()-limiter.time<45000)return error('Er werd zojuist al een aanvraag verstuurd. Probeer het later opnieuw.',429);
  const id=new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID();
  const quote={
    id,createdAt:new Date().toISOString(),status:'nieuw',product:kind,
    name:clean(name,150),email:clean(email,260),phone:clean(phone,100),
    city:clean(city,150),notes:clean(notes,1800),
    design:kind==='balustrade'?balustrade:{
      ...Object.fromEntries(Object.keys(design).filter(k=>['type','width','height','style','frame','glass','vertical','horizontal','handle','opening','topShape','panelLayout','lowerPanelHeight','closure'].includes(k)).map(k=>[k,design[k]])),
      ...(design.type==='wand'?{doorWidth:design.doorWidth,fixedPanelSide:design.fixedPanelSide}:{}),
      ...(design.frame==='andere'?{customColor:clean(design.customColor,70)}:{})
    },
    image:photo,notification:'in behandeling'
  };
  await putQuote(quote);
  await limitStore.setJSON(fingerprintKey,{time:Date.now()});
  quote.notification=await mailNotification(quote,req);
  await putQuote(quote);
  return apiJSON({ok:true,reference:id,notification:quote.notification},201);
}
export default async function quotes(req) {
  try {
    const url=new URL(req.url);
    if(req.method==='POST')return await processSubmission(req);
    if(!authorized(req))return error('U moet eerst inloggen op het beheerportaal.',401);
    const id=url.searchParams.get('id');
    if(req.method==='GET') {
      if(id) {
        if(!/^[0-9A-Za-z-]{30,100}$/.test(id))return error('Ongeldige referentie.');
        const doc=await getQuote(id);
        return doc?apiJSON({quote:doc}):error('Aanvraag niet gevonden.',404);
      }
      return apiJSON({quotes:await listQuotes()});
    }
    if(!safeOrigin(req))return error('Ongeldige herkomst.',403);
    if(req.method==='PATCH') {
      if(!id || !/^[0-9A-Za-z-]{30,100}$/.test(id))return error('Ongeldige referentie.');
      const doc=await getQuote(id);
      if(!doc)return error('Aanvraag niet gevonden.',404);
      const body=await req.json();
      if(!STAGES.includes(body?.status))return error('Ongeldige status.');
      doc.status=body.status;
      doc.updatedAt=new Date().toISOString();
      await putQuote(doc);
      return apiJSON({ok:true,status:doc.status});
    }
    if(req.method==='DELETE') {
      if(!id || !/^[0-9A-Za-z-]{30,100}$/.test(id))return error('Ongeldige referentie.');
      await deleteQuote(id);
      return apiJSON({ok:true});
    }
    return error('Methode niet toegestaan.',405);
  } catch(e) {
    console.error('Offerte API:',e);
    return error('Serverfout. Probeer opnieuw.',500);
  }
}
