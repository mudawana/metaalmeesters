// Curved door tops use an exact circular segment through both spring points and the apex.
// All measurements are in metres here; archHeight is entered in millimetres in the UI.
export function archRise(width,height,archHeightMm=300) {
  const requested=Number(archHeightMm);
  const rise=Number.isFinite(requested)?requested/1000:.3;
  return Math.max(.055,Math.min(rise,width/2,height*.48));
}

export function archTopAt(x,width,height,rise,lobes=1) {
  if(!Number.isFinite(x)||!Number.isFinite(width)||width<=0)return 0;
  const count=lobes===2?2:1;
  const segmentWidth=width/count;
  const half=segmentWidth/2;
  const local=count===1?x:(((x+width/2)%segmentWidth)+segmentWidth)%segmentWidth-half;
  // At the rightmost endpoint of a two-lobed arch, modulo wraps to left spring: same y.
  const actualRise=Math.max(.001,Math.min(rise,half));
  const radius=(half*half+actualRise*actualRise)/(2*actualRise);
  const dx=Math.max(-half,Math.min(half,local));
  return height-radius+Math.sqrt(Math.max(0,radius*radius-dx*dx));
}

export function archSpec(width,height,archHeightMm=300,lobes=1) {
  const n=lobes===2?2:1;
  const rise=archRise(width/n,height,archHeightMm);
  return {width,height,rise,lobes:n,spring:height-rise,apex:height,
    y:(x)=>archTopAt(x,width,height,rise,n)};
}

// Points along the true top edge, including spring points and the crown.
export function archPoints(width,height,archHeightMm=300,lobes=1,segments=72) {
  const spec=archSpec(width,height,archHeightMm,lobes);
  const n=spec.lobes;
  const steps=Math.max(16,Math.floor(segments/n)*n);
  return Array.from({length:steps+1},(_,i)=>{
    const x=-width/2+width*i/steps;
    return {x,y:spec.y(x)};
  });
}
