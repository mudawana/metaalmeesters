export const basePath = import.meta.env.BASE_URL || '/';

export const assets = {
  hero: 'Metaalmeesters_Home_04.jpg',
  balcony: 'Metaalmeesters_Home_02.jpg',
  railing: 'Metaalmeesters_Home_03.jpg',
  hospitality: 'Metaalmeesters_Home_01.jpg',
  details: 'Metaalmeesters_Home_2_450x338.jpg',
  door1: 'deuren.jpg',
  door2: 'deuren2.jpg',
  door3: 'deuren3.jpg',
  door4: 'deuren4.jpg'
};

export const imageUrl = (key) => basePath + 'images/' + assets[key];
export const originalImageUrl = (key) => 'https://metaalmeesters.eu/wp-content/uploads/2024/09/' + assets[key];

export const initialDesign = {
  type: 'enkel',
  doorWidth: 900,
  fixedPanelSide: 'beide',
  width: 900,
  height: 2200,
  style: 'atelier',
  topShape: 'recht',
  archHeight: 300,
  archPattern: 'doorlopend',
  frame: 'zwart',
  glass: 'helder',
  vertical: 1,
  horizontal: 2,
  handle: 'lang',
  opening: 'rechts',
  open: false,
  room: 'studio',
  customColor: '',
  notes: ''
};

export const TYPES = [
  {id:'enkel',label:'Enkele deur',caption:'Tijdloos & strak'},
  {id:'dubbel',label:'Dubbele deur',caption:'Ruimtelijk & elegant'},
  {id:'pivot',label:'Pivotdeur',caption:'Architecturaal statement'},
  {id:'wand',label:'Glaswand met deur',caption:'Vaste glasdelen en een geïntegreerde deur'},
  {id:'schuif',label:'Schuifdeur',caption:'Optie, technische uitvoering te bevestigen'}
];

export const FRAMES = [
  {id:'zwart',label:'RAL 9005 · Zwart',color:'#232625'},
  {id:'antraciet',label:'RAL 7016 · Antraciet',color:'#414549'},
  {id:'wit',label:'RAL 9010 · Wit',color:'#e6e3d8'},
  {id:'ral7035',label:'RAL 7035 · Lichtgrijs',color:'#b8babe'},
  {id:'ral6005',label:'RAL 6005 · Groen',color:'#244e36'},
  {id:'ral5008',label:'RAL 5008 · Blauw',color:'#303e4b'},
  {id:'brons',label:'Anodic · Brons (indicatief)',color:'#937457'},
  {id:'anodic-naturel',label:'Anodic · Naturel (indicatief)',color:'#a9aaa3'},
  {id:'andere',label:'Andere RAL/anodic kleur op aanvraag',color:'#a2a19d'}
];

export const GLASSES = [
  {id:'helder',label:'Helder glas',description:'Open & licht'},
  {id:'mat',label:'Mat glas',description:'Meer privacy'},
  {id:'rook',label:'Rookglas',description:'Warm & subtiel'},
  {id:'ribbel',label:'Ribbelglas',description:'Sfeervol reliëf'}
];

export function formatDesign(d) {
  const type = TYPES.find(t=>t.id===d.type)?.label || d.type;
  const frame = FRAMES.find(t=>t.id===d.frame)?.label || d.frame;
  const glass = GLASSES.find(t=>t.id===d.glass)?.label || d.glass;
  return [
    'METAALMEESTERS — DEURCONFIGURATIE',
    '',
    'Deurtype: ' + type,
    'Breedte totale opening: ' + d.width + ' mm',
    ...(d.type==='wand' ? ['Breedte geïntegreerde deur: '+d.doorWidth+' mm','Vaste glasdelen: '+d.fixedPanelSide] : []),
    'Hoogte opening: ' + d.height + ' mm',
    'Bovenvorm: ' + (d.topShape==='boog'?'Boog':'Recht'),
    ...(d.topShape==='boog' ? ['Booghoogte: '+d.archHeight+' mm',...(d.type==='dubbel'?['Boogverdeling: '+(d.archPattern==='apart'?'Twee aparte bogen':'Eén doorlopende boog')]:[])] : []),
    'Afwerking: ' + frame+(d.frame==='andere' ? (' ('+(d.customColor||'te bepalen')+')') : ''),
    'Glas: ' + glass,
    'Verticale verdelingen: ' + d.vertical,
    'Horizontale verdelingen: ' + d.horizontal,
    'Handgreep: ' + d.handle,
    'Draairichting: ' + d.opening,
    'Stijl: ' + d.style,
    'Opmerkingen: ' + (d.notes || 'Geen'),
    '',
    'Alle productiematen, kleurcodes en technische haalbaarheid worden gevalideerd door MetaalMeesters.',
    'Dit document is geen productieplan en bevat geen prijs.'
  ].join('\n');
}

export function downloadDesign(d) {
  const blob = new Blob([JSON.stringify({version:1,createdAt:new Date().toISOString(),design:d},null,2)], {type:'application/json'});
  const u = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=u;
  a.download='metaalmeesters-deurontwerp.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(u);
}
