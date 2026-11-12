// Seamless, deterministic Calacatta-inspired marble with pale grey veins,
// subtle warm mineral streaks and 5 mm grout lines on 100 cm square slabs.
// All output is local, no photo license/API/network required.
const TAU=Math.PI*2;
const fract=n=>n-Math.floor(n);
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const hash=(x,y)=>{
  let n=Math.imul(x,374761393)+Math.imul(y,668265263);
  n=Math.imul((n^(n>>>13)),1274126177);
  return ((n^(n>>>16))>>>0)/4294967295;
};
const smooth=t=>t*t*(3-2*t);
const lattice=(x,y,p)=>{
  const ax=Math.floor(x),ay=Math.floor(y),fx=smooth(fract(x)),fy=smooth(fract(y));
  const wrapped=(n)=>((n%p)+p)%p;
  const n00=hash(wrapped(ax),wrapped(ay)),n10=hash(wrapped(ax+1),wrapped(ay));
  const n01=hash(wrapped(ax),wrapped(ay+1)),n11=hash(wrapped(ax+1),wrapped(ay+1));
  return (n00+(n10-n00)*fx)*(1-fy)+(n01+(n11-n01)*fx)*fy;
};
function mineralNoise(u,v){
  return .50*lattice(u*4,v*4,4)+.28*lattice(u*8,v*8,8)+
    .15*lattice(u*16,v*16,16)+.07*lattice(u*32,v*32,32);
}
function groutDistance(u,tiles=8){
  const t=fract(u*tiles);
  return Math.min(t,1-t)/tiles;
}
export function marbleSample(u,v){
  u=fract(u);v=fract(v);
  const coarse=lattice(u*3,v*3,3),soft=mineralNoise(u,v);
  const warpU=lattice(u*5+1,v*5+2,5)-.5;
  const warpV=lattice(u*7+3,v*7+4,7)-.5;
  // Domain-warped continuous curves: sharp grey veins and delicate branches.
  const flow=v*7+.33*Math.sin(TAU*(u+warpU*.25))
      +.25*Math.sin(TAU*(u*2+warpV*.32))+.34*(soft-.5);
  const line=Math.abs(Math.sin(Math.PI*flow));
  const major=Math.exp(-Math.pow(line/(.055+.014*coarse),1.5));
  const sideFlow=flow*2.9+warpU*.65+Math.sin(TAU*v)*.2;
  const minor=Math.exp(-Math.pow(Math.abs(Math.sin(Math.PI*sideFlow))/.032,1.4));
  const goldLine=Math.exp(-Math.pow(Math.abs(Math.sin(Math.PI*(flow*.51+.17+warpV*.08)))/.026,1.4));
  const fleck=lattice(u*64,v*64,64);
  const base=clamp(233+(soft-.48)*19+(coarse-.5)*10+(fleck-.5)*3,0,255);
  const vein=clamp(major*(.5+.3*soft)+minor*.29,0,.9);
  const warmth=goldLine*.20*soft;
  // The grout runs every metre; slab body is otherwise nearly flush.
  const edge=Math.min(groutDistance(u),groutDistance(v));
  const core=1-smooth(clamp((edge-.00028)/.00063,0,1));
  const distantTrace=.16*Math.exp(-Math.pow(edge/.00165,2));
  const joint=Math.max(core,distantTrace);
  const r=base-vein*95+warmth*14;
  const g=base-.9-vein*94-warmth*4;
  const b=base-3-vein*92-warmth*15;
  const grain=(fleck-.5)*.8;
  return {
    r:Math.round(clamp(r*(1-joint)+139*joint+grain,0,255)),
    g:Math.round(clamp(g*(1-joint)+139*joint+grain,0,255)),
    b:Math.round(clamp(b*(1-joint)+135*joint+grain,0,255)),
    // Use green channel as PBR roughness map.
    roughness:clamp(.27+.09*(.5-soft)+joint*.48,.20,.83),
    height:clamp((soft-.5)*.009-major*.005-joint*.085,-.12,.02)
  };
}
export function makeMarbleTexturePixels(size=512,channel='color'){
  if(!Number.isInteger(size)||size<32||size>1024)throw Error('Ongeldige marmertextuurresolutie');
  if(!['color','roughness','normal'].includes(channel))throw Error('Ongeldig materiaalmaptype');
  const output=new Uint8Array(size*size*4);
  const epsilon=1/size;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=(x+.5)/size,v=(y+.5)/size,idx=(y*size+x)*4;
    const s=marbleSample(u,v);
    if(channel==='color'){
      output[idx]=s.r;output[idx+1]=s.g;output[idx+2]=s.b;
    }else if(channel==='roughness'){
      const amount=Math.round(s.roughness*255);
      output[idx]=amount;output[idx+1]=amount;output[idx+2]=amount;
    }else{
      const gx=(marbleSample(u+epsilon,v).height-marbleSample(u-epsilon,v).height)/(2*epsilon);
      const gy=(marbleSample(u,v+epsilon).height-marbleSample(u,v-epsilon).height)/(2*epsilon);
      const strength=.027,dx=-gx*strength,dy=-gy*strength,length=Math.hypot(dx,dy,1);
      output[idx]=Math.round(clamp((dx/length+1)*127.5,0,255));
      output[idx+1]=Math.round(clamp((dy/length+1)*127.5,0,255));
      output[idx+2]=Math.round(clamp((1/length+1)*127.5,0,255));
    }
    output[idx+3]=255;
  }
  return output;
}
