// Seamless procedural relief for realistic glazing. Pure JS so every profile
// can be verified without a browser or external texture service.
const TAU=Math.PI*2;
const fract=n=>n-Math.floor(n);
const periodicDistance=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b));

export function surfaceHeight(visual,u,v) {
  const x=fract(u),y=fract(v);
  const sx=Math.sin(TAU*x),sy=Math.sin(TAU*y);
  switch(visual){
    case 'flute':
      return .65*Math.cos(TAU*x)+.06*Math.cos(3*TAU*x);
    case 'canale':
      return .85*Math.cos(TAU*x)+.09*Math.cos(2*TAU*x);
    case 'ocean':
      return .46*Math.sin(TAU*(2*x+.12*Math.sin(TAU*y)))+
        .32*Math.cos(TAU*(y+.16*Math.sin(2*TAU*x)))+
        .12*Math.sin(TAU*(3*y-2*x));
    case 'crepe':
      return .30*Math.sin(TAU*(4*x+3*y+.12*Math.sin(5*TAU*y)))+
        .23*Math.cos(TAU*(7*x-5*y))+.12*Math.sin(TAU*(11*x+9*y));
    case 'hammer':{
      // Rounded, gently irregular peen marks distributed on a repeating tile.
      let closest=10;
      for(let i=0;i<4;i++)for(let j=0;j<4;j++){
        const cx=(i+.5+.21*Math.sin(i*17+j*13))/4;
        const cy=(j+.5+.19*Math.cos(i*11+j*19))/4;
        const dx=periodicDistance(x,cx),dy=periodicDistance(y,cy);
        const d=Math.sqrt(dx*dx+dy*dy);
        closest=Math.min(closest,d);
      }
      return -.67*Math.exp(-closest*closest/(.060*.060))+.12*sx*sy;
    }
    case 'frost':
      return .20*Math.sin(TAU*(13*x+17*y))+
        .14*Math.cos(TAU*(19*x-11*y))+
        .10*Math.sin(TAU*(31*x+23*y));
    case 'brushed':
      return .08*Math.sin(TAU*26*x)+.04*Math.sin(TAU*41*x+2*TAU*y);
    default:return 0;
  }
}

export const reliefSettings={
  flute:{pitchX:.048,pitchY:.8,normalScale:.70},
  canale:{pitchX:.12,pitchY:.8,normalScale:.85},
  ocean:{pitchX:.36,pitchY:.36,normalScale:.45},
  crepe:{pitchX:.23,pitchY:.23,normalScale:.36},
  hammer:{pitchX:.24,pitchY:.24,normalScale:.65},
  frost:{pitchX:.085,pitchY:.085,normalScale:.12},
  brushed:{pitchX:.19,pitchY:.19,normalScale:.09}
};

export function makeNormalPixels(visual,size=128) {
  if(!Number.isInteger(size)||size<8||size>512)throw Error('Unsupported texture resolution');
  const result=new Uint8Array(size*size*4);
  const step=1/size;
  // Derivatives are normalized by the motif's period, not by texture size.
  for(let j=0;j<size;j++)for(let i=0;i<size;i++){
    const u=(i+.5)*step,v=(j+.5)*step;
    const gx=(surfaceHeight(visual,u+step,v)-surfaceHeight(visual,u-step,v))/(2*step);
    const gy=(surfaceHeight(visual,u,v+step)-surfaceHeight(visual,u,v-step))/(2*step);
    const nx=-gx*.035,ny=-gy*.035,nz=1;
    const length=Math.hypot(nx,ny,nz);
    const offset=(j*size+i)*4;
    result[offset]=Math.round(127.5*(nx/length+1));
    result[offset+1]=Math.round(127.5*(ny/length+1));
    result[offset+2]=Math.round(127.5*(nz/length+1));
    result[offset+3]=255;
  }
  return result;
}
