// Shared catalogue and validation: browser UI and Netlify quote API.
// Dimensions are customer estimates in millimetres, never structural approvals.
export const BAL_TYPES=[
  {id:'trap',label:'Trapbalustrade',hint:'Langs een binnentrap of buitentrap'},
  {id:'balkon',label:'Balkonbalustrade',hint:'Veiligheidsafscheiding voor een balkon'},
  {id:'terras',label:'Terrasbalustrade',hint:'Rond of langs een terras'},
  {id:'vide',label:'Vide of overloop',hint:'Open verdieping of overloop'},
  {id:'raam',label:'Raambalustrade',hint:'Afscherming voor een raamopening'}
];
export const BAL_LAYOUTS=[
  {id:'recht',label:'Rechte opstelling',hint:'Eén doorlopende lijn'},
  {id:'hoek-links',label:'Hoek links',hint:'Een L-vorm met de retour links'},
  {id:'hoek-rechts',label:'Hoek rechts',hint:'Een L-vorm met de retour rechts'},
  {id:'u',label:'U-vorm · drie zijden',hint:'Voorzijde met twee zijden, zoals een balkon of terras'}
];
export const BAL_INFILL=[
  {id:'verticaal',label:'Verticale spijlen',hint:'Tijdloos, verfijnd staalwerk'},
  {id:'horizontaal',label:'Horizontale liggers',hint:'Strak lijnenspel · veiligheid te beoordelen'},
  {id:'glas',label:'Glaspanelen in staal',hint:'Open uitzicht en stalen profielen'}
];
export const BAL_GLASS=[
  {id:'helder',label:'Helder'},
  {id:'mat',label:'Mat'},
  {id:'grijs',label:'Grijs getint'},
  {id:'brons',label:'Brons getint'}
];
export const BAL_MOUNT=[
  {id:'bovenop',label:'Bovenop de vloer'},
  {id:'zijkant',label:'Tegen de zijkant'},
  {id:'advies',label:'Nog te bepalen'}
];
export const BAL_HANDRAILS=[
  {id:'vlak',label:'Vlakke bovenregel'},
  {id:'rond',label:'Ronde handregel'},
  {id:'geen',label:'Geen zichtbare handregel · na advies'}
];
export const BAL_COLORS=[
  {id:'zwart',label:'RAL 9005 · Zwart',color:'#252826'},
  {id:'antraciet',label:'RAL 7016 · Antraciet',color:'#414549'},
  {id:'wit',label:'RAL 9010 · Wit',color:'#e6e3d8'},
  {id:'lichtgrijs',label:'RAL 7035 · Lichtgrijs',color:'#b8babe'},
  {id:'brons',label:'Bronskleur',color:'#95816d'},
  {id:'andere',label:'Andere kleur op aanvraag',color:'#a39d92'}
];
export const initialBalustrade={
  category:'balustrade',type:'trap',layout:'recht',length:3000,sideLeft:1800,sideRight:1800,height:1000,
  placement:'binnen',infill:'verticaal',color:'zwart',customColor:'',
  glass:'helder',mount:'advies',handrail:'vlak'
};
export const balustradeTypeLabel=id=>BAL_TYPES.find(x=>x.id===id)?.label||'Balustrade';
export const balustradeInfillLabel=id=>BAL_INFILL.find(x=>x.id===id)?.label||'Nader te bepalen';
export const balustradeColorLabel=id=>BAL_COLORS.find(x=>x.id===id)?.label||'Nader te bepalen';
export const safeBalustradeDesign=design=>{
  if(!design||typeof design!=='object'||Array.isArray(design))return null;
  if(design.category!=='balustrade')return null;
  const safe={...initialBalustrade,...design};
  const picks={type:BAL_TYPES,layout:BAL_LAYOUTS,placement:[{id:'binnen'},{id:'buiten'}],
    infill:BAL_INFILL,color:BAL_COLORS,glass:BAL_GLASS,
    mount:BAL_MOUNT,handrail:BAL_HANDRAILS};
  for(const [key,items] of Object.entries(picks))
    if(!items.some(item=>item.id===safe[key]))return null;
  // 0 means "still to be measured"; generous ceiling allows a real quote enquiry.
  if(!['length','height','sideLeft','sideRight'].every(k=>Number.isSafeInteger(safe[k])&&safe[k]>=0&&safe[k]<=1000000000))return null;
  if(typeof safe.customColor!=='string'||safe.customColor.length>70)return null;
  return Object.fromEntries(Object.keys(initialBalustrade).map(k=>[k,safe[k]]));
};
