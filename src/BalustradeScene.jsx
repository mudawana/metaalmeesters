import React from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls,ContactShadows} from '@react-three/drei';
import {BAL_COLORS} from './balustrade-options.mjs';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function Beam({position,dimensions,color,angle=0,round=false}) {
  return <mesh position={position} rotation={[0,0,angle]} castShadow receiveShadow>
    {round?<cylinderGeometry args={[dimensions[1]/2,dimensions[1]/2,dimensions[0],12]}/>:<boxGeometry args={dimensions}/>}
    <meshStandardMaterial color={color} metalness={.68} roughness={.33}/>
  </mesh>;
}
function Railing({design}) {
  // Scale only the *visual example*. The submitted measurements remain unchanged.
  const width=clamp(design.length||3000,800,6500)/1000;
  const height=clamp(design.height||1000,700,1450)/1000;
  const sloped=design.type==='trap';
  const rise=sloped?Math.min(.60,width*.18):0;
  const angle=Math.atan2(rise,width);
  const railWidth=Math.hypot(width,rise);
  const steel=BAL_COLORS.find(x=>x.id===design.color)?.color||'#252826';
  const count=Math.max(2,Math.ceil(width/1.05)+1);
  const lift=x=>(x/width+.5)*rise;
  const postX=Array.from({length:count},(_,i)=>-width/2+i*width/(count-1));
  const depth=.043;
  const postY=x=>lift(x)+height/2;
  const topY=height+rise/2;
  const lowerY=.09+rise/2;
  const coloredGlass=design.glass==='mat'?'#c8d2d0':design.glass==='grijs'?'#687783':design.glass==='brons'?'#a18c70':'#b5dbe4';
  const handrail=design.handrail!=='geen';
  const mounting=design.mount;
  const glass=design.infill==='glas';
  return <group position={[0,-(height+rise)*.43,0]}>
    <mesh position={[0,-.11,0]} receiveShadow>
      <boxGeometry args={[width+.55,.14,.9]}/>
      <meshStandardMaterial color="#b7b6af" roughness={.92}/>
    </mesh>
    {postX.map((x,i)=><group key={'post'+i}>
      <Beam color={steel} position={[x,postY(x),0]} dimensions={[.055,height+.06,.055]}/>
      {mounting==='bovenop'&&<Beam color={steel} position={[x,.03+lift(x),0]} dimensions={[.13,.015,.13]}/>}
      {mounting==='zijkant'&&<Beam color={steel} position={[x,.05+lift(x),-.09]} dimensions={[.11,.11,.035]}/>}
    </group>)}
    {handrail&&<Beam color={steel} position={[0,topY+.03,0]} angle={angle} dimensions={[railWidth+.13,design.handrail==='rond'?.075:.067,.095]}/>}
    {design.infill==='verticaal'&&postX.slice(0,-1).flatMap((x,i)=>{
      const gap=width/(count-1);
      const n=Math.max(2,Math.ceil(gap/.115));
      return Array.from({length:n-1},(_,j)=>{
        const at=x+gap*(j+1)/n;
        return <Beam key={'bar'+i+'-'+j} color={steel} position={[at,postY(at),0]} dimensions={[.022,height-.14,.023]}/>;
      });
    })}
    {design.infill==='horizontaal'&&[.25,.50,.75].map((f,i)=><Beam key={'rail'+i} color={steel}
      position={[0,rise/2+height*f,0]} angle={angle}
      dimensions={[railWidth,.027,.033]}/>)}
    {glass&&postX.slice(0,-1).map((x,i)=>{
      const gap=width/(count-1);
      return <mesh key={'glass'+i} position={[x+gap/2,lift(x+gap/2)+height/2,0]} rotation={[0,0,angle]}>
        <boxGeometry args={[Math.hypot(gap,rise/(count-1))-.095,height-.18,.014]}/>
        <meshPhysicalMaterial color={coloredGlass} metalness={.03} roughness={design.glass==='mat'?.75:.12}
          transparent opacity={design.glass==='mat'?.68:.34} depthWrite={false} side={2}/>
      </mesh>;
    })}
    {glass&&<Beam color={steel} position={[0,lowerY,0]} angle={angle} dimensions={[railWidth,.043,.05]}/>}
    <mesh position={[0,-.18,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[12,9]}/>
      <meshStandardMaterial color="#e5e3dc" roughness={1}/>
    </mesh>
  </group>;
}
export default function BalustradeScene({design}) {
  return <Canvas shadows dpr={[1,1.65]} camera={{position:[3.9,2.15,6.3],fov:41,near:.1,far:70}}
    gl={{preserveDrawingBuffer:true,antialias:true,powerPreference:'high-performance'}}
    fallback={<p>3D kan niet geladen worden in deze browser.</p>}>
    <color attach="background" args={['#e7e5df']}/>
    <ambientLight intensity={1.65}/>
    <hemisphereLight intensity={1.15} color="#ffffff" groundColor="#c2c2b7"/>
    <directionalLight position={[2.5,5,4]} intensity={2.1} castShadow shadow-mapSize={[1024,1024]}/>
    <directionalLight position={[-3,2,-4]} intensity={1.0}/>
    <Railing design={design}/>
    <ContactShadows position={[0,-1.3,0]} opacity={.26} scale={11} blur={2.3} far={6}/>
    <OrbitControls makeDefault enablePan={false} minDistance={3.0} maxDistance={13}
      target={[0,.15,0]} minPolarAngle={.25} maxPolarAngle={Math.PI/2.0}/>
  </Canvas>;
}
