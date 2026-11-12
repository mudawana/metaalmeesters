import React,{useEffect} from 'react';
import {Canvas,useThree} from '@react-three/fiber';
import {OrbitControls,ContactShadows} from '@react-three/drei';
import {BAL_COLORS} from './balustrade-options.mjs';

// A material study, not a structural drawing: dimensions and joint details
// are explicitly illustrative until the atelier verifies the installation.
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function Metal({position,dimensions,color,angle=0}) {
  return <mesh position={position} rotation={[0,0,angle]} castShadow receiveShadow>
    <boxGeometry args={dimensions}/>
    <meshStandardMaterial color={color} metalness={.74} roughness={.28}/>
  </mesh>;
}
function CylindricalHandrail({position,length,angle,color}) {
  // A cylinder is made along Y, so rotate by -90 degrees to run along X.
  return <mesh position={position} rotation={[0,0,angle-Math.PI/2]} castShadow>
    <cylinderGeometry args={[.036,.036,length,20]}/>
    <meshStandardMaterial color={color} metalness={.76} roughness={.26}/>
  </mesh>;
}
function Glass({position,width,height,angle,kind}) {
  const colors={helder:'#d8e7e2',mat:'#c9d1cb',grijs:'#82918e',brons:'#b8a08a'};
  return <mesh position={position} rotation={[0,0,angle]} castShadow>
    <boxGeometry args={[Math.max(.08,width),Math.max(.2,height),.018]}/>
    <meshPhysicalMaterial color={colors[kind]||colors.helder} metalness={.02}
      roughness={kind==='mat'?.63:.09} transmission={kind==='mat'?.08:.48}
      transparent opacity={kind==='mat'?.83:.64} thickness={.12}
      clearcoat={.42} clearcoatRoughness={.12} depthWrite={false} side={2}/>
  </mesh>;
}
function RailRun({length,height,design,slope=0}) {
  const steel=BAL_COLORS.find(x=>x.id===design.color)?.color||'#252826';
  const count=Math.max(2,Math.ceil(length/1.05)+1);
  const posts=Array.from({length:count},(_,i)=>-length/2+i*length/(count-1));
  const riseAt=x=>(x/length+.5)*slope;
  const angle=Math.atan2(slope,length);
  const railLength=Math.hypot(length,slope);
  const hasHandrail=design.handrail!=='geen';
  const hasGlass=design.infill==='glas';
  return <group>
    {posts.map((x,i)=><group key={'post-'+i}>
      <Metal color={steel} position={[x,riseAt(x)+height/2,0]} dimensions={[.052,height+.025,.052]}/>
      {design.mount==='bovenop'&&<Metal color={steel} position={[x,riseAt(x)+.015,0]} dimensions={[.13,.022,.13]}/>}
      {design.mount==='zijkant'&&<Metal color={steel} position={[x,riseAt(x)+.095,-.105]} dimensions={[.12,.18,.032]}/>}
    </group>)}
    {hasHandrail&&(design.handrail==='rond'
      ?<CylindricalHandrail position={[0,height+slope/2+.04,0]} length={railLength+.13} angle={angle} color={steel}/>
      :<Metal color={steel} position={[0,height+slope/2+.032,0]} angle={angle} dimensions={[railLength+.13,.063,.095]}/>)}
    {design.infill==='verticaal'&&posts.slice(0,-1).flatMap((x,i)=>{
      const span=length/(count-1),bars=Math.max(2,Math.ceil(span/.12));
      return Array.from({length:bars-1},(_,j)=>{
        const at=x+(j+1)*span/bars;
        return <Metal key={'vertical-'+i+'-'+j} color={steel}
          position={[at,riseAt(at)+height/2,0]} dimensions={[.022,height-.13,.028]}/>;
      });
    })}
    {design.infill==='horizontaal'&&[.25,.5,.75].map((fraction,i)=><Metal key={'horizontal-'+i}
      color={steel} position={[0,slope/2+height*fraction,0]} angle={angle}
      dimensions={[railLength,.029,.041]}/>)}
    {hasGlass&&posts.slice(0,-1).map((x,i)=>{
      const span=length/(count-1),mid=x+span/2;
      return <Glass key={'glass-'+i} kind={design.glass} angle={angle}
        position={[mid,riseAt(mid)+height/2,0]}
        width={Math.hypot(span,slope/(count-1))-.086} height={height-.16}/>;
    })}
    {hasGlass&&<Metal color={steel} position={[0,slope/2+.10,0]} angle={angle}
      dimensions={[railLength,.038,.05]}/>}
  </group>;
}
function Architecture({width,slope,corner}) {
  const floorWidth=Math.max(5,width+1.4);
  return <group>
    {/* Real-scale architectural context: plaster wall, warm stone floor and plinth. */}
    <mesh position={[0,2.0,-3.7]} receiveShadow>
      <planeGeometry args={[28,12]}/>
      <meshStandardMaterial color="#dedbd3" roughness={1}/>
    </mesh>
    <mesh position={[0,-.27,-.8]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[28,24]}/>
      <meshStandardMaterial color="#eae6dd" roughness={.95}/>
    </mesh>
    <mesh position={[-5.7,1.9,-3.64]} receiveShadow>
      <boxGeometry args={[.037,5,.05]}/>
      <meshStandardMaterial color="#d4d0c7" roughness={1}/>
    </mesh>
    {slope>0 ? <group>
      {Array.from({length:7},(_,i)=>{
        const w=width/7,h=slope*(i+1)/7;
        return <mesh key={i} position={[-width/2+w*(i+.5),h/2-.17,-.04]} castShadow receiveShadow>
          <boxGeometry args={[w+.012,h+.15,1.62]}/>
          <meshStandardMaterial color={i%2===0?'#cfc9bd':'#d5d0c6'} roughness={.91}/>
        </mesh>;
      })}
    </group> : <group>
      <mesh position={[0,-.17,0]} receiveShadow castShadow>
        <boxGeometry args={[floorWidth,.2,corner?4.6:2.8]}/>
        <meshStandardMaterial color="#d3cdc2" roughness={.89}/>
      </mesh>
      <mesh position={[0,-.055,0]} receiveShadow>
        <boxGeometry args={[floorWidth,.028,corner?4.6:2.8]}/>
        <meshStandardMaterial color="#eeeae0" roughness={.78}/>
      </mesh>
    </group>}
  </group>;
}
function Railing({design,width,height}) {
  const stairs=design.type==='trap';
  const slope=stairs?Math.min(.73,width*.22):0;
  const corner=!stairs&&design.layout&&design.layout!=='recht';
  const primary=corner?width*.63:width;
  const secondary=corner?width-primary:0;
  const joint=design.layout==='hoek-links'?-primary/2:primary/2;
  return <group position={[0,-height*.12,0]}>
    <Architecture width={primary} slope={slope} corner={corner}/>
    <RailRun length={primary} height={height} slope={slope} design={design}/>
    {corner&&<group position={[joint,0,-secondary/2]} rotation={[0,Math.PI/2,0]}>
      <RailRun length={secondary} height={height} design={design}/>
    </group>}
  </group>;
}
function CameraFrame({width,height}) {
  const {camera,controls,invalidate}=useThree();
  useEffect(()=>{
    const distance=Math.max(5.5,width*1.55);
    camera.position.set(Math.max(2.5,width*.38),Math.max(2.25,height+1.45),distance);
    if(controls){controls.target.set(0,height*.46,0);controls.update();}
    camera.updateProjectionMatrix();
    invalidate();
  },[camera,controls,invalidate,width,height]);
  return null;
}
export default function BalustradeScene({design}) {
  // Only the *preview* is capped to fit the scene; the submitted measurements
  // are not changed or validated as structurally safe.
  const width=clamp(design.length||3000,800,6500)/1000;
  const height=clamp(design.height||1000,700,1450)/1000;
  return <Canvas shadows dpr={[1,1.5]}
    camera={{position:[4,2.8,7],fov:39,near:.1,far:100}}
    gl={{preserveDrawingBuffer:true,antialias:true,powerPreference:'high-performance'}}
    fallback={<p>3D is niet beschikbaar in deze browser.</p>}>
    <color attach="background" args={['#e8e5de']}/>
    <ambientLight intensity={.9}/>
    <hemisphereLight intensity={1.05} color="#ffffff" groundColor="#9e968a"/>
    <directionalLight position={[2.8,6,4.5]} intensity={2} castShadow
      shadow-mapSize={[1024,1024]} shadow-bias={-.0004}/>
    <directionalLight position={[-4,3,-4]} intensity={.52} color="#f8eadc"/>
    <Railing design={design} width={width} height={height}/>
    <ContactShadows position={[0,-.32,0]} opacity={.22} scale={12}
      blur={2.8} far={7}/>
    <OrbitControls makeDefault enablePan={false} minDistance={2.6} maxDistance={20}
      target={[0,.5,0]} minPolarAngle={.25} maxPolarAngle={Math.PI/2.08}/>
    <CameraFrame width={width} height={height}/>
  </Canvas>;
}
