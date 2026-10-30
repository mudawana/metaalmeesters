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
  width: 900,
  height: 2200,
  style: 'atelier',
  frame: 'zwart',
  glass: 'helder',
  vertical: 1,
  horizontal: 2,
  handle: 'lang',
  opening: 'rechts',
  open: false,
  room: 'studio',
  notes: ''
};

export const TYPES = [
  {id:'enkel',label:'Enkele deur',caption:'Tijdloos & strak'},
  {id:'dubbel',label:'Dubbele deur',caption:'Ruimtelijk & elegant'},
  {id:'schuif',label:'Schuifdeur',caption:'Praktisch & verfijnd'},
  {id:'pivot',label:'Pivotdeur',caption:'Architecturaal statement'}
];

export const FRAMES = [
  {id:'zwart',label:'Mat zwart',color:'#232625'},
  {id:'antraciet',label:'Antraciet',color:'#4d5354'},
  {id:'brons',label:'Geborsteld brons',color:'#8a715b'},
  {id:'wit',label:'Gebroken wit',color:'#dedbd3'}
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
    'Breedte opening: ' + d.width + ' mm',
    'Hoogte opening: ' + d.height + ' mm',
    'Afwerking: ' + frame,
    'Glas: ' + glass,
    'Verticale verdelingen: ' + d.vertical,
    'Horizontale verdelingen: ' + d.horizontal,
    'Handgreep: ' + d.handle,
    'Draairichting: ' + d.opening,
    'Stijl: ' + d.style,
    'Opmerkingen: ' + (d.notes || 'Geen'),
    '',
    'Indicatieve afmetingen; technisch te valideren door MetaalMeesters.',
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
