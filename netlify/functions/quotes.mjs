import {randomUUID,createHash} from 'node:crypto';
import {authorized,safeOrigin,apiJSON} from '../lib/session.mjs';
import {putQuote,getQuote,listQuotes,deleteQuote,STAGES} from '../lib/quotes-data.mjs';

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const permitted={type:['enkel','dubbel','schuif','pivot','wand'],frame:['zwart','antraciet','brons','wit','ral7035','ral6005','ral5008','anodic-naturel','andere'],glass:['helder','mat','rook','ribbel'],handle:['lang','kort','knop'],opening:['links','rechts']};
const clean=(value,max=300)=>String(value||'').trim().slice(0,max);
const error=(msg,code=400)=>apiJSON({error:msg},code);
function validDesign(d) {
  if(!d || typeof d!=='object')return false;
  if(!Number.isInteger(d.width)||d.width<500||d.width>8000 ||
     !Number.isInteger(d.height)||d.height<1400||d.height>4500)return false;
  if(d.type==='wand' && (!Number.isInteger(d.doorWidth) || d.doorWidth<500 || d.doorWidth>d.width-300 || !['links','rechts','beide'].includes(d.fixedPanelSide))) return false;
  if(d.frame==='andere' && (d.customColor!=null && typeof d.customColor!=='string'))return false;
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
  const text=[
    'Er is een nieuwe offerteaanvraag binnengekomen op MetaalMeesters.',
    '',
    'Klant: '+quote.name,
    'E-mail: '+quote.email,
    'Telefoon: '+(quote.phone||'-'),
    'Locatie: '+(quote.city||'-'),
    'Deurtype: '+d.type,
    ...(d.type==='wand'?['Geïntegreerde deur: '+d.doorWidth+' mm','Vaste panelen: '+d.fixedPanelSide]:[]),
    'Breedte: '+d.width+' mm',
    'Hoogte: '+d.height+' mm',
    'Glas: '+d.glass,
    'Kader: '+d.frame+(d.customColor?' · '+d.customColor:''),
    '',
    'Bekijk de volledige configuratie en de privé-afbeelding in uw beheerportaal:',
    new URL('/#/beheer',req.url).href,
    '',
    'Referentie: '+quote.id
  ].join('\n');
  try {
    const res=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':'Bearer '+RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:QUOTE_FROM_EMAIL,to:[QUOTE_TO_EMAIL],reply_to:quote.email,subject:'Nieuwe offerteaanvraag · '+quote.name+' · '+quote.id.slice(-8),text})
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
  const {name,email,phone,city,notes,design,image,consent}=input;
  if(!consent || !clean(name,151) || clean(name,151).length>150 || !emailPattern.test(clean(email,260)) ||
     !validDesign(design))return error('Controleer uw contactgegevens en ontwerp.');
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
    id,createdAt:new Date().toISOString(),status:'nieuw',
    name:clean(name,150),email:clean(email,260),phone:clean(phone,100),
    city:clean(city,150),notes:clean(notes,1800),
    design:{
      ...Object.fromEntries(Object.keys(design).filter(k=>['type','width','height','style','frame','glass','vertical','horizontal','handle','opening'].includes(k)).map(k=>[k,design[k]])),
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
