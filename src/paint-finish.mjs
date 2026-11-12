// Tileable fine-scale normal variation approximating powder-coated steel.
// Procedural, deterministic, and more accurate to coated (dielectric)
// surfaces than treating black-painted steel as pure chrome.
const TAU=2*Math.PI;
export function paintHeight(u,v) {
 return .36*Math.sin(TAU*(11*u+7*v))+
 .21*Math.cos(TAU*(19*u-13*v))+
 .13*Math.sin(TAU*(31*u+25*v))+
 .09*Math.cos(TAU*(47*u+41*v));
}
export function paintNormalPixels(size=96) {
 if(!Number.isInteger(size)||size<16||size>256)throw Error('Ongeldige textuurresolutie');
 const data=new Uint8Array(size*size*4),step=1/size;
 for(let j=0;j<size;j++)for(let i=0;i<size;i++){
  const u=(i+.5)*step,v=(j+.5)*step;
  const dx=(paintHeight(u+step,v)-paintHeight(u-step,v))/(2*step)*.007;
  const dy=(paintHeight(u,v+step)-paintHeight(u,v-step))/(2*step)*.007;
  const scale=Math.hypot(dx,dy,1),idx=(j*size+i)*4;
  data[idx]=Math.round(127.5*(1-dx/scale));
  data[idx+1]=Math.round(127.5*(1-dy/scale));
  data[idx+2]=Math.round(127.5*(1+1/scale));
  data[idx+3]=255;
 }
 return data;
}
