import React from 'react';
import {handleById} from './product-options.mjs';

function Rod({x=0,y=0,z=.05,w=.017,h=.2,depth=.022,color='#bba88e'}) {
 return <mesh castShadow position={[x,y,z]}>
   <boxGeometry args={[w,h,depth]}/>
   <meshStandardMaterial color={color} metalness={.82} roughness={.26}/>
 </mesh>;
}
export function DoorHardware({x,y,color='#282c2a',handle='lang',closure='magneet',right=false}) {
 const kind=handleById(handle).id;
 const sign=right?1:-1;
 return <group position={[x,y,.09]}>
   <Rod z={-.013} w={.048} h={.064} depth={.025} color={color}/>
   {kind==='knop'?<mesh position={[0,0,.057]} castShadow>
     <sphereGeometry args={[.035,18,18]}/><meshStandardMaterial color="#b9a68e" metalness={.8} roughness={.24}/>
   </mesh>:null}
   {kind==='kruk'&&<><Rod z={.046} h={.025} w={.13} x={sign*.065}/><Rod z={.023} h={.048} w={.026}/></>}
   {kind==='lang'&&<Rod z={.058} h={.36}/>}
   {kind==='kort'&&<Rod z={.058} h={.17}/>}
   {kind==='greep-plat'&&<Rod z={.065} h={.245} w={.040} depth={.014}/>}
   {kind==='greep-dubbel'&&<><Rod x={-.022} z={.055} h={.34} w={.012}/><Rod x={.022} z={.055} h={.34} w={.012}/></>}
   {(kind==='greep-rond'||kind==='greep-vierkant')&&<>
     <Rod y={.105} z={.049} w={.012} h={.04}/>
     <Rod y={-.105} z={.049} w={.012} h={.04}/>
     <Rod z={.082} w={.014} h={.22}/>
     {kind==='greep-rond'&&<><mesh position={[0,.115,.076]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.025,.008,6,14,Math.PI]}/><meshStandardMaterial color="#bba88e" metalness={.8}/></mesh>
       <mesh position={[0,-.115,.076]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.025,.008,6,14,Math.PI]}/><meshStandardMaterial color="#bba88e" metalness={.8}/></mesh></>}
   </>}
   {closure==='slotkast'&&<>
     <Rod x={sign*.018} y={-.087} z={-.038} w={.065} h={.16} depth={.023} color={color}/>
     <mesh position={[0,-.107,.037]}><circleGeometry args={[.009,12]}/><meshBasicMaterial color="#bcac94"/></mesh>
     <Rod x={0} y={-.125} z={.039} w={.009} h={.028} color="#b4a48b"/>
   </>}
   {closure==='magneet'&&<Rod x={sign*.02} y={-.09} z={-.036} w={.018} h={.048} depth={.019} color="#c0bbb0"/>}
 </group>;
}
