import React,{useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {archSpec} from './arch-geometry.mjs';

// An arched panel is genuine cut-to-shape geometry. No rectangular glass
// remains behind the arch, so the opening and glass share the same silhouette.
const glassStyles={
  helder:{color:'#d9edf2',roughness:.07,transmission:.90,opacity:.16},
  mat:{color:'#d5d9d5',roughness:.82,transmission:.22,opacity:.77},
  rook:{color:'#777876',roughness:.15,transmission:.48,opacity:.39},
  ribbel:{color:'#c7dbe0',roughness:.26,transmission:.58,opacity:.31}
};
function MetalBar({x,y,w,h,z=.065,color}) {
  if(w<=0||h<=0)return null;
  return <RoundedBox args={[w,h,.042]} position={[x,y,z]} radius={Math.min(.006,w*.15,h*.15)} smoothness={2} castShadow>
    <meshStandardMaterial color={color} metalness={.74} roughness={.37}/>
  </RoundedBox>;
}

function panelGeometry(width,height,archHeight,totalWidth,centerX,lobes,frame) {
  const spec=archSpec(totalWidth,height,archHeight,lobes);
  const top=x=>spec.y(centerX+x);
  const half=width/2,innerHalf=Math.max(.008,half-frame);
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
  glass.moveTo(-innerHalf,frame);
  glass.lineTo(innerHalf,frame);
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
    minTop:Math.min(top(-innerHalf),top(innerHalf))-frame
  };
}

export function ArchedPanel({width,height,archHeight=300,totalWidth=width,centerX=0,lobes=1,config,frameColor='#272b2c',photoMode=false,fixed=false}) {
  const profile=useMemo(()=>panelGeometry(width,height,archHeight,totalWidth,centerX,lobes,Math.min(.049,width*.18)),[width,height,archHeight,totalWidth,centerX,lobes]);
  // Geometries are created once per dimension set and released when replaced.
  React.useEffect(()=>()=>{profile.outline.dispose();profile.glass.dispose();},[profile]);
  const style=glassStyles[config.glass]||glassStyles.helder;
  const horiz=Math.max(0,Math.min(5,Number(config.horizontal)||0));
  const vert=fixed?Math.max(0,Math.min(3,Math.floor(width/1.05))):Math.max(0,Math.min(4,Number(config.vertical)||0));
  const maxHorizontalY=profile.minTop-.025;
  return <group>
    <mesh geometry={profile.glass} position={[0,0,.052]} castShadow={!photoMode}>
      {photoMode
        ?<meshPhysicalMaterial color={style.color} roughness={style.roughness} transparent opacity={style.opacity} depthWrite={false} side={THREE.DoubleSide} clearcoat={.8}/>
        :<meshPhysicalMaterial color={style.color} roughness={style.roughness} transmission={style.transmission} thickness={.018} transparent opacity={1} side={THREE.DoubleSide} clearcoat={.9}/>}
    </mesh>
    <mesh geometry={profile.outline} position={[0,0,-.026]} castShadow receiveShadow>
      <meshStandardMaterial color={frameColor} metalness={.78} roughness={.36}/>
    </mesh>
    {Array.from({length:vert},(_,i)=>{
      const x=-profile.innerHalf+profile.innerHalf*2*(i+1)/(vert+1);
      const top=Math.max(profile.frame,profile.topAt(x)-profile.frame);
      const barH=Math.max(.001,top-profile.frame);
      return <MetalBar key={'v'+i} x={x} y={profile.frame+barH/2} w={.023} h={barH} color={frameColor}/>;
    })}
    {Array.from({length:horiz},(_,i)=>{
      const y=profile.frame+(maxHorizontalY-profile.frame)*(i+1)/(horiz+1);
      return <MetalBar key={'h'+i} x={0} y={y} w={profile.innerHalf*2} h={.024} color={frameColor}/>;
    })}
    {config.glass==='ribbel'&&Array.from({length:Math.min(70,Math.max(1,Math.floor(width/.095)))},(_,i)=>{
      const x=-profile.innerHalf+(i+1)*profile.innerHalf*2/(Math.min(70,Math.max(1,Math.floor(width/.095)))+1);
      const top=Math.max(profile.frame,profile.topAt(x)-profile.frame);
      return <mesh key={'rib'+i} position={[x,(top+profile.frame)/2,.057]}>
        <boxGeometry args={[.003,Math.max(.01,top-profile.frame),.003]}/>
        <meshStandardMaterial color="#dce8e9" transparent opacity={.2}/>
      </mesh>;
    })}
  </group>;
}

export function ArchedDoorLeaf({x,width,height,hinge,config,pivotOffset=0,photoMode=false,globalWidth=width,globalX=0,lobes=1,frameColor='#272b2c'}) {
  const right=hinge==='right';
  const center=(right?-1:1)*(width/2-pivotOffset);
  const angle=config.open?(right?1:-1)*(config.type==='pivot'?.72:.5):0;
  const handleX=right?-width/2+.115:width/2-.115;
  const metal=config.handle==='knop'?'#b6a28a':'#ad9d8b';
  return <group position={[x,0,0]} rotation={[0,angle,0]}>
    <group position={[center,0,0]}>
      <ArchedPanel width={width} height={height} archHeight={config.archHeight} totalWidth={globalWidth} centerX={globalX} lobes={lobes}
        config={config} frameColor={frameColor} photoMode={photoMode}/>
      <group position={[handleX,height*.5,.079]}>
        <MetalBar x={0} y={0} w={.04} h={.060} z={0} color={frameColor}/>
        {config.handle==='knop'
          ?<mesh castShadow position={[0,0,.042]}><sphereGeometry args={[.035,16,16]}/><meshStandardMaterial color={metal} metalness={.8} roughness={.26}/></mesh>
          :<MetalBar x={0} y={0} w={.018} h={config.handle==='lang'?.37:.18} z={.060} color={metal}/>}
      </group>
      {[.18,.83].map((f,i)=><MetalBar key={i} x={right?width/2-.006:-width/2+.006} y={height*f} w={.019} h={.095} z={-.03} color={frameColor}/>)}
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
