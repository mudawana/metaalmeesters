import React,{useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {archSpec} from './arch-geometry.mjs';
import {GlassMaterial,GlassPattern} from './GlassVisual.jsx';
import {DoorHardware,DoorHinge} from './DoorHardware.jsx';
import {SteelInfill} from './SteelInfill.jsx';
import {CoatedSteelMaterial} from './CoatedSteel.jsx';
import {lowerSteelMeters} from './product-options.mjs';

// An arched panel is genuine cut-to-shape geometry. No rectangular glass
// remains behind the arch, so the opening and glass share the same silhouette.
function MetalBar({x,y,w,h,z=.065,color}) {
  if(w<=0||h<=0)return null;
  return <RoundedBox args={[w,h,.042]} position={[x,y,z]} radius={Math.min(.006,w*.15,h*.15)} smoothness={2} castShadow>
    <CoatedSteelMaterial color={color}/>
  </RoundedBox>;
}

function panelGeometry(width,height,archHeight,totalWidth,centerX,lobes,frame,steel=0) {
  const spec=archSpec(totalWidth,height,archHeight,lobes);
  const top=x=>spec.y(centerX+x);
  const half=width/2,innerHalf=Math.max(.008,half-frame);
  const glassBottom=frame+steel;
  const segments=Math.max(16,Math.ceil(width*28));
  const frameOuter=new THREE.Shape();
  frameOuter.moveTo(-half,0);
  frameOuter.lineTo(half,0);
  frameOuter.lineTo(half,top(half));
  for(let i=segments-1;i>=0;i--) {
    const x=-half+width*i/segments;
    frameOuter.lineTo(x,top(x));
  }
  frameOuter.closePath();

  const inner=new THREE.Path();
  inner.moveTo(-innerHalf,frame);
  inner.lineTo(-innerHalf,top(-innerHalf)-frame);
  for(let i=1;i<=segments;i++){
    const x=-innerHalf+innerHalf*2*i/segments;
    inner.lineTo(x,top(x)-frame);
  }
  inner.lineTo(innerHalf,frame);
  inner.closePath();
  frameOuter.holes.push(inner);
  const glass=new THREE.Shape();
  const iw=innerHalf*2;
  glass.moveTo(-innerHalf,glassBottom);
  glass.lineTo(innerHalf,glassBottom);
  glass.lineTo(innerHalf,top(innerHalf)-frame);
  for(let i=segments-1;i>=0;i--){
    const x=-innerHalf+iw*i/segments;
    glass.lineTo(x,top(x)-frame);
  }
  glass.closePath();
  return {
    outline:new THREE.ExtrudeGeometry(frameOuter,{depth:.064,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:1,steps:1,curveSegments:32}),
    glass:new THREE.ShapeGeometry(glass,Math.max(16,segments)),
    topAt:top,innerHalf,frame,
    glassBottom, minTop:Math.min(top(-innerHalf),top(innerHalf))-frame
  };
}

export function ArchedPanel({width,height,archHeight=300,totalWidth=width,centerX=0,lobes=1,config,frameColor='#272b2c',photoMode=false,fixed=false}) {
  const steel=lowerSteelMeters(config,height,fixed);
  const profile=useMemo(()=>panelGeometry(width,height,archHeight,totalWidth,centerX,lobes,Math.min(.049,width*.18),steel),[width,height,archHeight,totalWidth,centerX,lobes,steel]);
  // Geometries are created once per dimension set and released when replaced.
  React.useEffect(()=>()=>{profile.outline.dispose();profile.glass.dispose();},[profile]);
  const horiz=Math.max(0,Math.min(5,Number(config.horizontal)||0));
  const vert=fixed?Math.max(0,Math.min(3,Math.floor(width/1.05))):Math.max(0,Math.min(4,Number(config.vertical)||0));
  const maxHorizontalY=profile.minTop-.025;
  const rowCount=steel>0?1:horiz;
  return <group>
    <mesh geometry={profile.glass} position={[0,0,.052]} castShadow={!photoMode}>
      <GlassMaterial kind={config.glass} photoMode={photoMode} width={profile.innerHalf*2} height={height} uvMeters/>
    </mesh>
    <GlassPattern kind={config.glass} width={profile.innerHalf*2} height={height} bottom={profile.glassBottom}
      topAt={profile.topAt} frame={profile.frame}/>
    <mesh geometry={profile.outline} position={[0,0,-.026]} castShadow receiveShadow>
      <CoatedSteelMaterial color={frameColor}/>
    </mesh>
    {steel>0&&<SteelInfill width={profile.innerHalf*2} height={steel} centerY={profile.frame+steel/2} color={frameColor} photoMode={photoMode}/>}
    {Array.from({length:vert},(_,i)=>{
      const x=-profile.innerHalf+profile.innerHalf*2*(i+1)/(vert+1);
      const top=Math.max(profile.frame,profile.topAt(x)-profile.frame);
      const barH=Math.max(.001,top-profile.glassBottom);
      return <MetalBar key={'v'+i} x={x} y={profile.glassBottom+barH/2} w={.023} h={barH} color={frameColor}/>;
    })}
    {steel>0&&<MetalBar x={0} y={profile.glassBottom} w={width} h={.034} color={frameColor}/>}
    {Array.from({length:rowCount},(_,i)=>{
      const y=profile.glassBottom+(maxHorizontalY-profile.glassBottom)*(i+1)/(rowCount+1);
      return <MetalBar key={'h'+i} x={0} y={y} w={profile.innerHalf*2} h={.024} color={frameColor}/>;
    })}
  </group>;
}

export function ArchedDoorLeaf({x,width,height,hinge,config,pivotOffset=0,photoMode=false,globalWidth=width,globalX=0,lobes=1,frameColor='#272b2c'}) {
  const right=hinge==='right';
  const center=(right?-1:1)*(width/2-pivotOffset);
  const angle=config.open?(right?1:-1)*(config.type==='pivot'?.72:.5):0;
  const handleX=right?-width/2+.115:width/2-.115;
  return <group position={[x,0,0]} rotation={[0,angle,0]}>
    <group position={[center,0,0]}>
      <ArchedPanel width={width} height={height} archHeight={config.archHeight} totalWidth={globalWidth} centerX={globalX} lobes={lobes}
        config={config} frameColor={frameColor} photoMode={photoMode}/>
      <DoorHardware x={handleX} y={height*.5} handle={config.handle} closure={config.closure} color={frameColor} right={right}/>
      {[.18,.83].map((f,i)=><DoorHinge key={i} x={right?width/2-.006:-width/2+.006} y={height*f} color={frameColor}/>)}
    </group>
  </group>;
}

export function ArchedFixedPanel({x,width,height,config,photoMode=false,globalWidth=width,globalX=0,lobes=1,frameColor='#272b2c'}) {
  if(width<=.075)return null;
  return <group position={[x,0,0]}>
    <ArchedPanel width={width} height={height} archHeight={config.archHeight} totalWidth={globalWidth} centerX={globalX}
      lobes={lobes} config={config} frameColor={frameColor} photoMode={photoMode} fixed/>
  </group>;
}
