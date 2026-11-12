// One source of truth for the visible railing layout and quote dimensions.
// These are indicative customer measures, NOT engineered spans or safety checks.
export const hasLeftReturn=layout=>layout==='hoek-links'||layout==='u';
export const hasRightReturn=layout=>layout==='hoek-rechts'||layout==='u';

export function railingRuns(design) {
  const layout=design.type==='trap'?'recht':design.layout||'recht';
  // Stored lengths are all millimetres. 0 means "still to be measured".
  const front=Math.max(0,Number(design.length)||0);
  const left=hasLeftReturn(layout)?Math.max(0,Number(design.sideLeft)||0):0;
  const right=hasRightReturn(layout)?Math.max(0,Number(design.sideRight)||0):0;
  const runs=[{id:'voorzijde',label:layout==='recht'?'Rechte zijde':'Voorzijde',lengthMm:front,xMm:0,zMm:0,rotationY:0}];
  // The return at either end must continue *away* from the viewer (negative z).
  // Both runs start at their actual corner and finish towards the back.
  if(hasLeftReturn(layout))runs.push({
    id:'links',label:'Linkerzijde',lengthMm:left,xMm:-front/2,zMm:-left/2,rotationY:Math.PI/2
  });
  if(hasRightReturn(layout))runs.push({
    id:'rechts',label:'Rechterzijde',lengthMm:right,xMm:front/2,zMm:-right/2,rotationY:Math.PI/2
  });
  return runs;
}

export function totalRailingLengthMm(design) {
  return railingRuns(design).reduce((sum,run)=>sum+run.lengthMm,0);
}

// Preview-only bounds. Never replace the entered values in an actual quote.
export function previewRailingRuns(design) {
  return railingRuns(design).map(run=>({
    ...run,
    lengthM:Math.max(run.id==='voorzijde'?.8:.5,Math.min(run.id==='voorzijde'?6.5:4.5,(run.lengthMm||1800)/1000))
  })).map((run,_,all)=>{
    const front=all[0].lengthM;
    if(run.id==='links')return {...run,xM:-front/2,zM:-run.lengthM/2,rotationY:Math.PI/2};
    if(run.id==='rechts')return {...run,xM:front/2,zM:-run.lengthM/2,rotationY:Math.PI/2};
    return {...run,xM:0,zM:0,rotationY:0};
  });
}
