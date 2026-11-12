import React,{useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {Environment,Lightformer} from '@react-three/drei';
import {archPoints} from './arch-geometry.mjs';

const stone='#d7d2c8';
function SurfaceBlock({x=0,y=0,z=0,size,color=stone,roughness=.94}) {
 return <mesh position={[x,y,z]} castShadow receiveShadow>
   <boxGeometry args={size}/>
   <meshStandardMaterial color={color} roughness={roughness}/>
 </mesh>;
}

function ArchWallInfill({width,height,rise=300,lobes=1,color}) {
 const geo=useMemo(()=>{
   const pts=archPoints(width,height,rise,lobes,96);
   const shape=new THREE.Shape();
   shape.moveTo(-width/2,height);
   shape.lineTo(width/2,height);
   for(let i=pts.length-1;i>=0;i--)shape.lineTo(pts[i].x,pts[i].y);
   shape.closePath();
   return new THREE.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:false,curveSegments:32});
 },[width,height,rise,lobes]);
 useEffect(()=>()=>geo.dispose(),[geo]);
 return <mesh geometry={geo} position={[0,0,-.075]} castShadow receiveShadow>
   <meshStandardMaterial color={color} roughness={.93}/>
 </mesh>;
}

// Entirely local, high-key showroom environment map. Lightformers are visible
// in steel and glass reflections without a downloaded HDR image or API key.
export function StudioReflections() {
 return <Environment resolution={256} frames={1}>
   <Lightformer form="rect" position={[0,6,8]} rotation={[Math.PI/2,0,0]} scale={[9,4,1]} intensity={2.8} color="#fff3e3"/>
   <Lightformer form="rect" position={[-6,2,4]} rotation={[0,Math.PI/3,0]} scale={[3,7,1]} intensity={3.1} color="#f8ffff"/>
   <Lightformer form="rect" position={[6,2,2]} rotation={[0,-Math.PI/3,0]} scale={[2.8,6,1]} intensity={2.0} color="#d7e5ee"/>
   <Lightformer form="rect" position={[0,2,-6]} scale={[8,5,1]} intensity={1.6} color="#f0dbc4"/>
   <Lightformer form="ring" position={[0,6,-1]} rotation={[Math.PI/2,0,0]} scale={[5,5,1]} intensity={.7} color="#ffffff"/>
   <Lightformer form="rect" position={[-.5,3,7]} scale={[.28,5,1]} intensity={.9} color="#f5fff7"/>
   <Lightformer form="rect" position={[2,5,0]} rotation={[Math.PI/2,0,0]} scale={[5,.7,1]} intensity={.85} color="#ffffff"/>
 </Environment>;
}

export function InstalledStudio({room,width,height,topShape='recht',archHeight=300,lobes=1}) {
 const neutral=room==='neutraal';
 const clearance=.055;
 const opening=width+clearance,wallWidth=Math.max(8,opening+2.6);
 const wing=(wallWidth-opening)/2,wallHeight=Math.max(3.7,height+1.1);
 const wallColor=neutral?'#e6e5e2':'#d3cec5';
 const floorColor=neutral?'#d0d0cb':'#b7a48c';
 const ceiling=wallHeight+.05;
 return <>
   <color attach="background" args={[neutral?'#e5e6e3':'#e9e6e0']}/>
   <group>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.026,0]} receiveShadow>
     <planeGeometry args={[Math.max(26,wallWidth+4),24]}/>
     <meshStandardMaterial color={floorColor} roughness={neutral?.87:.74} metalness={0}/>
   </mesh>
   {!neutral&&Array.from({length:23},(_,i)=>(
      <SurfaceBlock key={'wood'+i} x={0} y={-.012} z={-7.0+i*.61}
        size={[wallWidth+3,.0025,.008]} color={i%3===0?'#8b806e':'#a19585'}/>
   ))}
   {/* Side walls and lintel leave a real opening, not a door pasted onto a wall. */}
   <SurfaceBlock x={-(opening/2+wing/2)} y={wallHeight/2} z={.095}
      size={[wing,wallHeight,.35]} color={wallColor}/>
   <SurfaceBlock x={opening/2+wing/2} y={wallHeight/2} z={.095}
      size={[wing,wallHeight,.35]} color={wallColor}/>
   <SurfaceBlock x={0} y={height+(wallHeight-height)/2} z={.095}
      size={[opening,wallHeight-height,.35]} color={wallColor}/>
   {topShape==='boog'&&<ArchWallInfill width={opening} height={height} rise={archHeight} lobes={lobes} color={wallColor}/>}
   {/* Realistic reveal depth, threshold and edge shadow. */}
   <SurfaceBlock x={-(opening/2+.035)} y={height/2} z={.252}
      size={[.045,height,.035]} color="#beb7a9"/>
   <SurfaceBlock x={opening/2+.035} y={height/2} z={.252}
      size={[.045,height,.035]} color="#beb7a9"/>
   {topShape!=='boog'&&<SurfaceBlock x={0} y={height+.018} z={.252}
      size={[opening+.08,.045,.035]} color="#bcb5a9"/>}
   <SurfaceBlock x={0} y={-.008} z={.26} size={[opening+.14,.025,.47]} color="#a99d8d"/>
   {/* The room behind the glass supplies natural parallax, shade and context. */}
   <SurfaceBlock x={0} y={ceiling/2} z={-4.2} size={[wallWidth+3,ceiling,.24]}
      color={neutral?'#dedfdc':'#e6e0d6'}/>
   <SurfaceBlock x={0} y={ceiling} z={-2} size={[wallWidth+3,.20,6]}
      color="#e8e4dc"/>
   {!neutral&&<>
     <SurfaceBlock x={-(wallWidth/2-.17)} y={wallHeight/2} z={-.35}
         size={[.13,wallHeight,.07]} color="#c2b9ac"/>
     <SurfaceBlock x={wallWidth/2-.17} y={wallHeight/2} z={-.35}
         size={[.13,wallHeight,.07]} color="#c2b9ac"/>
     <SurfaceBlock x={-1.6} y={.48} z={-2.9}
        size={[1.05,.72,.52]} color="#b19d81" roughness={.76}/>
     <SurfaceBlock x={-1.6} y={.86} z={-2.9}
        size={[.85,.07,.60]} color="#877460" roughness={.56}/>
     <SurfaceBlock x={1.8} y={1.6} z={-4.04}
        size={[1.25,1.65,.075]} color="#b4ad9f" roughness={.7}/>
     <SurfaceBlock x={1.8} y={1.6} z={-3.99}
        size={[.95,1.32,.013]} color="#d4c4a8" roughness={.89}/>
     <SurfaceBlock x={1.8} y={1.6} z={-3.975}
        size={[.61,.75,.009]} color="#68756c" roughness={.8}/>
     <mesh position={[3,1.08,-2.75]} castShadow>
       <cylinderGeometry args={[.19,.16,.62,20]}/>
       <meshStandardMaterial color="#b7b4ac" roughness={.86}/>
     </mesh>
     <mesh position={[3,1.55,-2.74]} castShadow>
       <sphereGeometry args={[.29,18,12]}/>
       <meshStandardMaterial color="#687969" roughness={.96}/>
     </mesh>
     <pointLight position={[-2.2,2.8,-2.3]} intensity={30} distance={6} decay={2} color="#ffe4bd"/>
   </>}
 </group></>;
}
