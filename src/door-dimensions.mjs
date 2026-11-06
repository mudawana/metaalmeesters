// Display range for this demo, not a statement about production limitations.
// The client confirms they can discuss all dimensions; larger custom work needs assessment.
export const VISUAL_RANGE={widthMin:500,widthMax:8000,heightMin:1400,heightMax:4500};
export function modelDimensions(input={}) {
  const finite=(v,fallback)=>Number.isFinite(Number(v))?Number(v):fallback;
  const width=Math.max(VISUAL_RANGE.widthMin,Math.min(VISUAL_RANGE.widthMax,finite(input.width,900)));
  const height=Math.max(VISUAL_RANGE.heightMin,Math.min(VISUAL_RANGE.heightMax,finite(input.height,2200)));
  const isWall=input.type==='wand';
  const maxDoor=Math.max(500,width-300);
  const doorWidth=isWall?Math.min(maxDoor,Math.max(500,finite(input.doorWidth,900))):width;
  const side=(['links','rechts','beide'].includes(input.fixedPanelSide)?input.fixedPanelSide:'beide');
  const rest=isWall?width-doorWidth:0;
  const left=isWall?(side==='rechts'?0:side==='beide'?rest/2:rest):0;
  const right=isWall?rest-left:0;
  return {width,height,doorWidth,left,right,side};
}
