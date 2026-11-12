// Customer sizes are entered in centimetres. Model/API sizes remain millimetres
// for compatibility with existing stored designs and actual 3D geometry.
export function mmAsCm(value) {
  const n=Number(value);
  if(!Number.isFinite(n))return '';
  return String(Math.round(n)/10).replace('.',',');
}
export function cmAsMm(raw) {
  const text=String(raw??'').trim();
  if(!/^[0-9]+(?:[,.][0-9]*)?$/.test(text))return null;
  const cm=Number(text.replace(',','.'));
  if(!Number.isFinite(cm)||cm<0||cm>100000000)return null;
  return Math.round(cm*10);
}
export function cmLabel(mm) {
  return mm===0?'Nog op te meten':mmAsCm(mm)+' cm';
}
export function onsiteMeasureNote(){
  return 'De ingevoerde maten zijn alleen een indicatie. MetaalMeesters komt altijd zelf ter plaatse om de juiste breedte, hoogte en aansluiting op te meten vóór productie.';
}
export function suggestArchMm(widthMm,heightMm){
  const w=Number(widthMm),h=Number(heightMm);
  if(!Number.isFinite(w)||w<=0||!Number.isFinite(h)||h<=0)return 220;
  // Visually modest, single circular segment; exact rise measured on site.
  return Math.round(Math.max(80,Math.min(550,w*.22,h*.26))/10)*10;
}
