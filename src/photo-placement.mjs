// Responsive photo overlay calculations. Pure functions shared by the UI and tests.
export const DEFAULT_PLACEMENT=Object.freeze({x:50,y:54,scale:66,widthScale:100,angle:0,light:100,shadow:45});
export const PLACEMENT_LIMITS=Object.freeze({
  x:[3,97],y:[4,96],scale:[18,150],widthScale:[35,220],angle:[-45,45],light:[60,140],shadow:[0,90]
});
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));

export function normalizePlacement(state={}) {
  return Object.fromEntries(Object.entries(PLACEMENT_LIMITS).map(([key,[min,max]])=>{
    const value=Number(state[key]??DEFAULT_PLACEMENT[key]);
    const safe=Number.isFinite(value)?value:DEFAULT_PLACEMENT[key];
    return [key,clamp(Math.round(safe),min,max)];
  }));
}

export function overlaySize(stage,design,placement) {
  const width=Math.max(1,Number(stage?.width)||680);
  const height=Math.max(1,Number(stage?.height)||460);
  const w=Math.max(500,Number(design?.width)||900);
  const h=Math.max(1400,Number(design?.height)||2200);
  const p=normalizePlacement(placement);
  const doorHeight=height*p.scale/100;
  // The 3D transparent canvas has extra lateral camera padding.
  const doorWidth=clamp(doorHeight*(w/h)*1.48*p.widthScale/100,Math.min(40,width*.1),width*.97);
  return {width:doorWidth,height:doorHeight};
}

export function adjustPlacement(state,kind,amount) {
  const p=normalizePlacement(state);
  if(!(kind in PLACEMENT_LIMITS)||!Number.isFinite(amount))return p;
  return normalizePlacement({...p,[kind]:p[kind]+amount});
}

export function placementFromKey(state,key,shift=false) {
  // Arrow keys move. Shift+arrows resize width/height independently.
  // Plus/minus resize the whole door. All keys work when the overlay has focus.
  const change={
    ArrowLeft:[shift?'widthScale':'x',shift?-3:-1],
    ArrowRight:[shift?'widthScale':'x',shift?3:1],
    ArrowUp:[shift?'scale':'y',shift?3:-1],
    ArrowDown:[shift?'scale':'y',shift?-3:1],
    '+':['scale',3],'=':['scale',3],'Add':['scale',3],
    '-':['scale',-3],'_':['scale',-3],'Subtract':['scale',-3]
  }[key];
  return change?{handled:true,placement:adjustPlacement(state,change[0],change[1])}:{handled:false,placement:normalizePlacement(state)};
}

export function pinchScale(state,distance,startingDistance) {
  const p=normalizePlacement(state);
  if(!Number.isFinite(distance)||!Number.isFinite(startingDistance)||startingDistance<=0)return p;
  const factor=distance/startingDistance;
  return normalizePlacement({...p,scale:p.scale*factor});
}
