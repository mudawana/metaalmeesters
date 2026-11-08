import React from 'react';
import {RoundedBox} from '@react-three/drei';

function SatinMetal({color='#b8aea0',roughness=.25}) {
  return <meshPhysicalMaterial color={color} metalness={.88} roughness={roughness}
    clearcoat={.3} clearcoatRoughness={.14} envMapIntensity={1.9}/>;
}
function Block({x=0,y=0,z=.05,w=.017,h=.20,depth=.023,color='#b9aa92',radius=.003}) {
 return <RoundedBox args={[w,h,depth]} position={[x,y,z]} radius={Math.min(radius,w*.16,h*.16,depth*.16)} smoothness={3} castShadow receiveShadow>
   <SatinMetal color={color}/>
 </RoundedBox>;
}
function Cylinder({x=0,y=0,z=.06,radius=.012,length=.15,color='#b9aa92'}) {
 return <mesh position={[x,y,z]} castShadow>
   <cylinderGeometry args={[radius,radius,length,20]}/>
   <SatinMetal color={color}/>
 </mesh>;
}
function Screw({x=0,y=0,z=0,color='#a79d8c'}) {
 return <group position={[x,y,z]}>
   <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.006,.006,.002,12]}/><SatinMetal color={color}/></mesh>
   <mesh position={[0,0,.002]} rotation={[0,0,Math.PI/2]}>
     <boxGeometry args={[.001,.007,.001]}/>
     <meshBasicMaterial color="#62605b"/>
   </mesh>
 </group>;
}

export function DoorHinge({x,y,color='#343636'}) {
 return <group position={[x,y,.015]}>
   <Block x={-.016} z={-.015} w={.034} h={.115} depth={.025} color={color}/>
   <Block x={.019} z={-.015} w={.033} h={.115} depth={.025} color={color}/>
   <Cylinder x={0} y={0} z={.011} radius={.012} length={.12} color="#878987"/>
   <Cylinder x={0} y={.064} z={.011} radius={.015} length={.012} color={color}/>
   <Cylinder x={0} y={-.064} z={.011} radius={.015} length={.012} color={color}/>
   <Screw x={-.021} y={.035} z={.003}/>
   <Screw x={.021} y={-.035} z={.003}/>
 </group>;
}

export function DoorHardware({x,y,color='#282c2a',handle='lang',closure='magneet',right=false}) {
 const sign=right?1:-1;
 const metal='#b6ada0';
 const mount=<><Block z={-.018} w={.052} h={.072} depth={.031} color={color}/>
   <Block z={.002} w={.041} h={.060} depth={.008} color="#77716a"/></>;
 const shaft=(h,w=.017,z=.076)=><>
    <Cylinder y={h*.4} z={z-.022} radius={.008} length={.038} color={metal}/>
    <Cylinder y={-h*.4} z={z-.022} radius={.008} length={.038} color={metal}/>
    <Cylinder z={z} radius={w/2} length={h} color={metal}/>
    <mesh position={[0,h/2,z]} castShadow><sphereGeometry args={[w/2,12,8]}/><SatinMetal color={metal}/></mesh>
    <mesh position={[0,-h/2,z]} castShadow><sphereGeometry args={[w/2,12,8]}/><SatinMetal color={metal}/></mesh>
  </>;
 return <group position={[x,y,.076]}>
   {mount}
   {handle==='knop'&&<><Cylinder z={.048} length={.030} radius={.015} color={metal}/><mesh castShadow position={[0,0,.085]}><sphereGeometry args={[.037,24,16]}/><SatinMetal color={metal}/></mesh></>}
   {handle==='lang'&&shaft(.38)}
   {handle==='kort'&&shaft(.17)}
   {handle==='greep-plat'&&<><Block z={.077} w={.034} h={.27} depth={.013} color={metal}/><Block z={.033} w={.03} h={.024} depth={.065} color={metal}/></>}
   {handle==='greep-dubbel'&&<>
     <group position={[-.025,0,0]}>{shaft(.34,.012)}</group>
     <group position={[.025,0,0]}>{shaft(.34,.012)}</group>
   </>}
   {handle==='kruk'&&<>
      <Cylinder z={.032} length={.016} radius={.025} color={metal}/>
      <group position={[sign*.059,0,.065]} rotation={[0,0,Math.PI/2]}>
        <Cylinder radius={.010} length={.14} color={metal}/>
      </group>
      <mesh castShadow position={[sign*.122,0,.065]}><sphereGeometry args={[.01,12,10]}/><SatinMetal color={metal}/></mesh>
   </>}
   {(handle==='greep-rond'||handle==='greep-vierkant')&&<>
     <Block y={.112} z={.036} w={.024} h={.020} depth={.077} color={metal}/>
     <Block y={-.112} z={.036} w={.024} h={.020} depth={.077} color={metal}/>
     {handle==='greep-rond'?<mesh position={[0,0,.09]} castShadow>
       <torusGeometry args={[.115,.009,10,32,Math.PI]}/>
       <SatinMetal color={metal}/>
     </mesh>:<><Block z={.090} w={.016} h={.225} depth={.018} color={metal}/></>}
   </>}
   {closure==='slotkast'&&<group position={[0,-.105,.005]}>
      <Block x={sign*.014} z={-.037} w={.064} h={.17} depth={.022} color={color}/>
      <mesh position={[0,-.006,.053]} castShadow><circleGeometry args={[.012,20]}/><SatinMetal color={metal}/></mesh>
      <Block y={-.028} z={.058} w={.010} h={.032} depth={.008} color="#5b5d5b"/>
      <Screw x={0} y={.067} z={.057}/><Screw x={0} y={-.071} z={.057}/>
    </group>}
   {closure==='magneet'&&<group position={[sign*.017,-.11,-.035]}>
     <Block z={-.002} w={.030} h={.047} depth={.015} color="#8e9594"/>
     <Block z={.007} w={.014} h={.015} depth={.005} color="#d0d5cc"/>
   </group>}
 </group>;
}
