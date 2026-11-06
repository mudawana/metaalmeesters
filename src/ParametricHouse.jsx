import React,{useMemo,useEffect} from 'react';
import * as THREE from 'three';
import {archPoints} from './arch-geometry.mjs';
import {getHouseGeometry} from './house-geometry.mjs';

function Block({position,size,color,roughness=.9,metalness=0,castShadow=true}) {
  return <mesh position={position} castShadow={castShadow} receiveShadow>
    <boxGeometry args={size}/>
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness}/>
  </mesh>;
}

function WallAroundWindow({x=0,width,bottom=0,top,windowWidth,windowBottom,windowTop,z=-.14,thickness=.32,paint}) {
  const fullH=top-bottom;
  const sides=(width-windowWidth)/2;
  const below=windowBottom-bottom;
  const above=top-windowTop;
  return <group>
    {sides>0&&<>
      <Block position={[x-(width+windowWidth)/4,bottom+fullH/2,z]} size={[sides,fullH,thickness]} color={paint}/>
      <Block position={[x+(width+windowWidth)/4,bottom+fullH/2,z]} size={[sides,fullH,thickness]} color={paint}/>
    </>}
    {below>0&&<Block position={[x,bottom+below/2,z]} size={[windowWidth,below,thickness]} color={paint}/>}
    {above>0&&<Block position={[x,windowTop+above/2,z]} size={[windowWidth,above,thickness]} color={paint}/>}
  </group>;
}

function HouseWindow({x,y,width=1.1,height=1.38}) {
  const frame='#373f40';
  return <group position={[x,y,0]}>
    {/* The opening is real geometry in the wall, rather than a painted fake window. */}
    <Block position={[0,0,-.15]} size={[width-.06,height-.06,.045]} color="#7d9499" roughness={.11} metalness={.2} castShadow={false}/>
    <mesh position={[0,0,-.113]}>
      <planeGeometry args={[width-.10,height-.10]}/>
      <meshPhysicalMaterial color="#b8d2d5" roughness={.09} metalness={.03} transparent opacity={.32} depthWrite={false} clearcoat={.75}/>
    </mesh>
    <Block position={[-width/2+.031,0,.048]} size={[.062,height,.09]} color={frame} roughness={.35} metalness={.75}/>
    <Block position={[width/2-.031,0,.048]} size={[.062,height,.09]} color={frame} roughness={.35} metalness={.75}/>
    <Block position={[0,height/2-.033,.048]} size={[width,.066,.09]} color={frame} roughness={.35} metalness={.75}/>
    <Block position={[0,-height/2+.033,.048]} size={[width,.066,.09]} color={frame} roughness={.35} metalness={.75}/>
    <Block position={[0,0,.057]} size={[.035,height-.09,.045]} color={frame} roughness={.33} metalness={.7}/>
    <Block position={[0,-height/2-.058,.11]} size={[width+.19,.075,.25]} color="#aca79d"/>
    <Block position={[-width*.22,height*.23,.07]} size={[.012,height*.37,.008]} color="#dce4e3" castShadow={false}/>
  </group>;
}

function WallLamp({x,y}) {
  return <group position={[x,y,.10]}>
    <Block position={[0,0,0]} size={[.12,.25,.12]} color="#282c2b" metalness={.65} roughness={.3}/>
    <Block position={[0,.03,.064]} size={[.065,.12,.035]} color="#ebdbb9" castShadow={false}/>
    <pointLight position={[0,.02,.20]} intensity={.24} distance={1.8} color="#ffd9a4" decay={2}/>
  </group>;
}

function Planter({x,z=.92}) {
  return <group position={[x,0,z]}>
    <mesh position={[0,.32,0]} castShadow receiveShadow><cylinderGeometry args={[.22,.17,.64,16]}/><meshStandardMaterial color="#61594c" roughness={.86}/></mesh>
    <mesh position={[0,.68,0]} castShadow><sphereGeometry args={[.29,12,10]}/><meshStandardMaterial color="#50654d" roughness={1}/></mesh>
    <mesh position={[.12,.93,.02]} castShadow><sphereGeometry args={[.20,12,10]}/><meshStandardMaterial color="#647956" roughness={1}/></mesh>
    <mesh position={[-.09,.85,-.10]} castShadow><sphereGeometry args={[.22,12,10]}/><meshStandardMaterial color="#43583f" roughness={1}/></mesh>
  </group>;
}

function HouseInterior({wallWidth,wallHeight}) {
  return <group>
    <Block position={[0,wallHeight/2,-5.17]} size={[wallWidth-.22,wallHeight,.20]} color="#dad3c8"/>
    <Block position={[0,-.045,-2.68]} size={[wallWidth-.28,.09,5.15]} color="#b69b78" roughness={.77}/>
    <Block position={[-wallWidth/2+.12,wallHeight/2,-2.7]} size={[.24,wallHeight,5.25]} color="#d4cec5"/>
    <Block position={[wallWidth/2-.12,wallHeight/2,-2.7]} size={[.24,wallHeight,5.25]} color="#d4cec5"/>
    <Block position={[0,wallHeight-.1,-2.7]} size={[wallWidth-.1,.15,5.3]} color="#e5dfd4"/>
    {/* Hall furniture and warm interior light visible through clear glass. */}
    <Block position={[0,.55,-4.5]} size={[.78,1.1,.3]} color="#97836c"/>
    <Block position={[0,1.15,-4.29]} size={[.63,.09,.06]} color="#313333"/>
    <pointLight position={[0,3,-3.7]} color="#ffe1b4" intensity={1.6} distance={7} decay={2}/>
    <mesh position={[0,3.72,-3.35]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.28,.022,8,28]}/><meshStandardMaterial color="#b3a28d" roughness={.3} metalness={.8}/></mesh>
  </group>;
}

// Actual architectural wall infill between the curved opening and lintel.
// This extruded stone mesh fills the corners above the arch without closing the doorway.
function ArchedOpeningRecess({width,height,archHeight,lobes,paint,trim}) {
  const {mesh,curve}=useMemo(()=>{
    const pts=archPoints(width,height,archHeight,lobes,96);
    const shape=new THREE.Shape();
    shape.moveTo(-width/2,height);
    shape.lineTo(width/2,height);
    for(let i=pts.length-1;i>=0;i--)shape.lineTo(pts[i].x,pts[i].y);
    shape.closePath();
    return {
      mesh:new THREE.ExtrudeGeometry(shape,{steps:1,depth:.32,bevelEnabled:false,curveSegments:48}),
      curve:new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p.x,p.y,.10)),false,'centripetal')
    };
  },[width,height,archHeight,lobes]);
  useEffect(()=>()=>mesh.dispose(),[mesh]);
  return <group>
    <mesh geometry={mesh} position={[0,0,-.30]} castShadow receiveShadow>
      <meshStandardMaterial color={paint} roughness={.95}/>
    </mesh>
    <mesh castShadow>
      <tubeGeometry args={[curve,96,.034,8,false]}/>
      <meshStandardMaterial color={trim} metalness={.22} roughness={.66}/>
    </mesh>
  </group>;
}

function ArchitecturalDetails({g,stone,dark,topShape='recht',archHeight=300,lobes=1}) {
  const {wallWidth,wallHeight,openingWidth,openingHeight}=g;
  const wingCenter=openingWidth/2+g.wingWidth/2;
  const windowWidth=Math.min(1.20,g.wingWidth-.82);
  const windowLow=1.24;
  const windowHigh=2.69;
  const topLow=g.upperWindowCenter-g.upperWindowHeight/2;
  const topHigh=g.upperWindowCenter+g.upperWindowHeight/2;
  return <group>
    {/* Five wall segments per window leave actual gaps. Door opening grows with the selected design. */}
    {[-1,1].map(side=><React.Fragment key={side}>
      <WallAroundWindow x={side*wingCenter} width={g.wingWidth} bottom={0} top={wallHeight}
        windowWidth={windowWidth} windowBottom={windowLow} windowTop={windowHigh} paint={stone}/>
      <HouseWindow x={side*wingCenter} y={(windowLow+windowHigh)/2} width={windowWidth} height={windowHigh-windowLow}/>
      <WallLamp x={side*(openingWidth/2+.37)} y={Math.min(3.25,openingHeight-.18)}/>
    </React.Fragment>)}
    {/* Above the door, the stone wall and the upstairs window move up as the door grows. */}
    <WallAroundWindow width={openingWidth} bottom={openingHeight} top={wallHeight}
      windowWidth={Math.min(1.32,openingWidth-.18)} windowBottom={topLow} windowTop={topHigh} paint={stone}/>
    <HouseWindow x={0} y={g.upperWindowCenter} width={Math.min(1.32,openingWidth-.18)} height={g.upperWindowHeight}/>
    {/* The jambs meet the actual opening, not a printed rectangle on a wall. */}
    {[-1,1].map(side=><React.Fragment key={side}>
      <Block position={[side*(openingWidth/2+.065),openingHeight/2,-.07]}
        size={[.13,openingHeight,.29]} color={dark}/>
      <Block position={[side*(openingWidth/2+.008),openingHeight/2,.075]}
        size={[.012,openingHeight,.035]} color="#b7aa93" castShadow={false}/>
    </React.Fragment>)}
    {topShape==='boog'&&<ArchedOpeningRecess width={openingWidth} height={openingHeight} archHeight={archHeight} lobes={lobes} paint={stone} trim={dark}/>}
    <Block position={[0,openingHeight+.064,-.07]} size={[openingWidth+.26,.128,.29]} color={dark}/>
    <Block position={[0,.008,.14]} size={[openingWidth+.16,.035,.42]} color="#aba99e"/>
    {/* Contemporary roof fascia and timber soffit stay aligned with the growing house. */}
    <Block position={[0,wallHeight+.11,-2.57]} size={[wallWidth+.42,.22,6.15]} color={dark} metalness={.18} roughness={.65}/>
    <Block position={[0,wallHeight-.055,.20]} size={[wallWidth+.34,.095,.57]} color="#a29581"/>
    <Block position={[0,wallHeight-.16,.24]} size={[wallWidth+.28,.026,.035]} color="#67625b"/>
    <Block position={[-wallWidth/2-.12,wallHeight/2,-2.62]} size={[.24,wallHeight,5.35]} color={dark}/>
    <Block position={[wallWidth/2+.12,wallHeight/2,-2.62]} size={[.24,wallHeight,5.35]} color={dark}/>
    <Block position={[0,wallHeight/2,-5.28]} size={[wallWidth+.18,wallHeight,.20]} color={stone}/>
    {/* Understated vertical cladding on the wing, not crossing any openings. */}
    {[-1,1].map(side=>{
      const x=side*(wallWidth/2-.19);
      return <Block key={side} position={[x,wallHeight/2,.04]} size={[.07,wallHeight,.075]} color={dark} roughness={.63} />;
    })}
  </group>;
}

export default function ParametricHouse({widthMm,heightMm,finish='warm',topShape='recht',archHeight=300,archPattern='doorlopend',doorType='enkel'}) {
  const g=getHouseGeometry(widthMm,heightMm);
  const stone=finish==='dark'?'#777974':'#ded4c5';
  const dark=finish==='dark'?'#292f30':'#464846';
  const frontStepWidth=g.openingWidth+.74;
  const pathWidth=Math.max(1.3,Math.min(2.5,g.openingWidth+.35));
  return <group>
    {/* Proper exterior site + depth, not a flat photo plane. */}
    <Block position={[0,-.23,0]} size={[35,.34,34]} color="#9daca0" castShadow={false}/>
    <Block position={[0,-.055,.2]} size={[g.wallWidth+1.75,.11,13.4]} color="#c7c6c0"/>
    <Block position={[0,-.012,3.12]} size={[pathWidth,.05,6.0]} color="#b5b4ad"/>
    {[1.32,2.48,3.64,4.80].map(z=><Block key={z} position={[0,.018,z]} size={[pathWidth,.005,.014]} color="#888981" castShadow={false}/>)}
    {[-1,1].map(side=><Block key={side} position={[side*(g.wallWidth/2+.4),-.005,3]} size={[.62,.07,6.8]} color="#b0b0a8"/>)}
    <Block position={[0,.085,.63]} size={[frontStepWidth,.20,.83]} color="#a9a69f"/>
    <Block position={[0,.008,.98]} size={[frontStepWidth+.25,.08,.65]} color="#c9c4bb"/>
    <HouseInterior wallWidth={g.wallWidth} wallHeight={g.wallHeight}/>
    <ArchitecturalDetails g={g} stone={stone} dark={dark} topShape={topShape} archHeight={archHeight} lobes={doorType==='dubbel'&&archPattern==='apart'?2:1}/>
    <Planter x={-(g.openingWidth/2+.95)} z={.96}/>
    <Planter x={(g.openingWidth/2+.95)} z={.96}/>
  </group>;
}
