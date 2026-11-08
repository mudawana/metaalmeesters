import React from 'react';
import {RoundedBox} from '@react-three/drei';

// Pressed steel rather than glass: thickness, inset, bevels, hem and a
// restrained highlight on the perimeter provide a visible physical edge.
export function SteelInfill({width,height,color,centerY=0,photoMode=false}) {
 if(width<=.05||height<=.05)return null;
 const inset=Math.min(.020,width*.09,height*.1);
 return <group position={[0,centerY,0]}>
   <RoundedBox args={[width,height,.047]} radius={Math.min(.008,width*.08,height*.08)}
       smoothness={4} position={[0,0,0]} castShadow receiveShadow>
     <meshPhysicalMaterial color={color} roughness={.36} metalness={.86}
       clearcoat={.18} clearcoatRoughness={.22} envMapIntensity={1.25}/>
   </RoundedBox>
   <RoundedBox args={[Math.max(.03,width-inset*2),Math.max(.03,height-inset*2),.0035]}
       radius={Math.min(.0014,height*.03,width*.02)} smoothness={3}
       position={[0,0,.026]} receiveShadow>
     <meshPhysicalMaterial color={color} metalness={.80} roughness={.41}
       clearcoat={.12} clearcoatRoughness={.28} envMapIntensity={1.06}/>
   </RoundedBox>
   <mesh position={[0,height/2-inset/2,.029]}>
     <boxGeometry args={[Math.max(.03,width-inset*2),.0018,.0015]}/>
     <meshBasicMaterial color="#f7fcf7" transparent opacity={photoMode?.16:.13} depthWrite={false}/>
   </mesh>
   <mesh position={[-width/2+inset/2,0,.028]}>
     <boxGeometry args={[.0018,Math.max(.03,height-inset*2),.0015]}/>
     <meshBasicMaterial color="#f7fcf7" transparent opacity={.09} depthWrite={false}/>
   </mesh>
 </group>;
}
