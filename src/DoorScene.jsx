import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';

function Metal({ color, roughness=0.38 }) {
  return <meshStandardMaterial color={color} metalness={0.78} roughness={roughness} envMapIntensity={1.4} />;
}
const FRAME_COLORS = {zwart:'#242728',antraciet:'#51565a',brons:'#94745c',wit:'#d9d7cf'};

function Bar({pos,size,color,radius=0.004}) {
  return <RoundedBox args={size} position={pos} radius={radius} smoothness={3} castShadow receiveShadow><Metal color={color}/></RoundedBox>;
}

function Glass({width,height,kind,photoMode=false}) {
  const style = {
    helder:{color:'#d9edf2',roughness:0.045,transmission:0.92,opacity:1},
    mat:{color:'#d5d9d5',roughness:0.82,transmission:0.26,opacity:1},
    rook:{color:'#777876',roughness:0.13,transmission:0.52,opacity:1},
    ribbel:{color:'#c7dbe0',roughness:0.24,transmission:0.65,opacity:1}
  }[kind] || {color:'#d9edf2',roughness:0.045,transmission:0.9,opacity:1};
  return <group>
    <mesh position={[0,0,0]} castShadow>
      <boxGeometry args={[width,height,0.009]}/>
      {photoMode ?
        <meshPhysicalMaterial color={style.color} roughness={style.roughness} metalness={0.05} transparent opacity={kind==='mat'?0.76:kind==='rook'?0.36:kind==='ribbel'?0.30:0.17} depthWrite={false} side={2} clearcoat={0.75} clearcoatRoughness={0.09}/> :
        <meshPhysicalMaterial color={style.color} roughness={style.roughness} transmission={style.transmission} thickness={0.025} ior={1.52} metalness={0} transparent opacity={style.opacity} clearcoat={0.9} clearcoatRoughness={0.08} side={2}/>
      }
    </mesh>
    {kind==='ribbel' && Array.from({length:Math.floor(width/0.032)},(_,i)=>(
      <mesh key={i} position={[-width/2 + (i+1)*0.032,0,0.007]}>
        <boxGeometry args={[0.003,height,0.003]}/>
        <meshStandardMaterial color="#dbe6e7" transparent opacity={0.2} roughness={0.4}/>
      </mesh>
    ))}
  </group>;
}

function Handle({x,y,color,kind}) {
  const metal = kind==='knop' ? '#aa9682' : '#b5a38d';
  return <group position={[x,y,0.064]}>
    <Bar pos={[0,0,-0.012]} size={[0.04,0.054,0.05]} color={color}/>
    {kind==='knop' ? <mesh castShadow><sphereGeometry args={[0.035,16,16]}/><meshStandardMaterial color={metal} metalness={0.8} roughness={0.25}/></mesh>
    : <Bar pos={[0,0,0.035]} size={[0.017,kind==='lang'?0.37:0.18,0.023]} color={metal} radius={0.006}/>}
  </group>;
}

function DoorLeaf({x,width,height,hinge,config,pivotOffset=0,photoMode=false}) {
  const color = FRAME_COLORS[config.frame] || FRAME_COLORS.zwart;
  const flip=hinge==='right';
  const sign=flip?-1:1;
  const center=sign*(width/2-pivotOffset);
  const frame=0.049;
  const innerWidth=Math.max(0.1,width-frame*2);
  const innerHeight=height-frame*2;
  const horizontal=Math.max(0,Math.min(5,config.horizontal));
  const vertical=Math.max(0,Math.min(4,config.vertical));
  const angle=config.open && config.type!=='schuif' ? (flip?1:-1)*(config.type==='pivot'?0.72:0.5) : 0;
  return <group position={[x,0,0]} rotation={[0,angle,0]}>
    <group position={[center,height/2,0]}>
      <Glass width={innerWidth} height={innerHeight} kind={config.glass} photoMode={photoMode}/>
      <Bar pos={[-width/2+frame/2,0,0.016]} size={[frame,height,0.065]} color={color}/>
      <Bar pos={[ width/2-frame/2,0,0.016]} size={[frame,height,0.065]} color={color}/>
      <Bar pos={[0,height/2-frame/2,0.016]} size={[width,frame,0.065]} color={color}/>
      <Bar pos={[0,-height/2+frame/2,0.016]} size={[width,frame,0.065]} color={color}/>
      {Array.from({length:vertical},(_,i)=><Bar key={'v'+i} pos={[-innerWidth/2+innerWidth*(i+1)/(vertical+1),0,0.031]} size={[0.023,innerHeight,0.04]} color={color}/>)}
      {Array.from({length:horizontal},(_,i)=><Bar key={'h'+i} pos={[0,-innerHeight/2+innerHeight*(i+1)/(horizontal+1),0.031]} size={[innerWidth,0.024,0.04]} color={color}/>)}
      <Handle x={flip?-width/2+0.115:width/2-0.115} y={0} color={color} kind={config.handle}/>
      {[0.16,0.82].map((f,i)=><Bar key={i} pos={[flip?width/2+0.009:-width/2-0.009,-height/2+height*f,0.008]} size={[0.019,0.087,0.09]} color={color}/>)}
    </group>
  </group>;
}

function Showroom({room}) {
  if(room==='neutraal') return <>
    <color attach="background" args={['#e8e7e3']}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.022,0]} receiveShadow><planeGeometry args={[20,20]}/><meshStandardMaterial color="#d7d4ce" roughness={0.93}/></mesh>
  </>;
  return <>
    <color attach="background" args={['#e6e4df']}/>
    <mesh position={[0,2.5,-3.3]} receiveShadow><boxGeometry args={[15,6.5,0.2]}/><meshStandardMaterial color="#d7d3ca" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.035,0]} receiveShadow><planeGeometry args={[25,25]}/><meshStandardMaterial color="#b9ab97" roughness={0.92}/></mesh>
    {Array.from({length:18},(_,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[-9+i*1.1,-0.031,0]}><planeGeometry args={[0.006,25]}/><meshBasicMaterial color="#a99a86" transparent opacity={0.45}/></mesh>)}
    <mesh position={[2.9,1.5,-3.05]}><boxGeometry args={[1.3,1.6,0.04]}/><meshStandardMaterial color="#c5bbaa"/></mesh>
    <mesh position={[2.9,1.5,-3.015]}><boxGeometry args={[0.9,1.22,0.008]}/><meshStandardMaterial color="#b0a493"/></mesh>
    <mesh position={[-2.9,0.65,-2.9]} castShadow><cylinderGeometry args={[0.31,0.3,0.8,24]}/><meshStandardMaterial color="#b4aaa0" roughness={0.85}/></mesh>
    {Array.from({length:7},(_,i)=><mesh key={i} position={[-2.9+(i%3-1)*0.19,1.15+i%2*0.2,-2.9]} rotation={[0,0,(i-3)*0.18]} castShadow><sphereGeometry args={[0.22,12,12]}/><meshStandardMaterial color={i%2?'#697967':'#82907b'} roughness={0.92}/></mesh>)}
    <mesh position={[0,3.25,-2]}><boxGeometry args={[14,0.05,1.2]}/><meshStandardMaterial color="#ece9e2"/></mesh>
  </>;
}

function PhotoCamera({height}) {
  const {camera}=useThree();
  useEffect(()=>{camera.position.set(0,height/2,5.1);camera.lookAt(0,height/2,0);camera.updateProjectionMatrix();},[camera,height]);
  return null;
}

function Scene({config,photoMode=false,photoAngle=0}) {
  const w=Math.max(.5,Math.min(3.6,Number(config.width)/1000));
  const h=Math.max(1.3,Math.min(3.5,Number(config.height)/1000));
  const double=config.type==='dubbel';
  const slide=config.type==='schuif';
  const right=config.opening==='rechts';
  const offset=config.type==='pivot'?0.12:0;
  const singleX=right ? w/2-offset+(slide&&config.open?w*0.56:0) : -w/2+offset-(slide&&config.open?w*0.56:0);
  return <>
    {photoMode&&<PhotoCamera height={h}/>}
    <ambientLight intensity={photoMode?1.7:1.45}/>
    <hemisphereLight args={['#fff9e9','#a7a29d',1.15]}/>
    <directionalLight position={[4,7,6]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003}/>
    <directionalLight position={[-3,4,-1]} intensity={1.3} color="#e9f2fa"/>
    {!photoMode&&<Showroom room={config.room}/>}
    <group position={[0,0,photoMode?0:0.3]} rotation={[0,photoMode?photoAngle*Math.PI/180:0,0]}>
      {double ? <>
        <DoorLeaf x={-w/2} width={w/2} height={h} hinge="left" config={config} photoMode={photoMode}/>
        <DoorLeaf x={w/2} width={w/2} height={h} hinge="right" config={config} photoMode={photoMode}/>
      </> : <>
        <DoorLeaf x={singleX} width={w} height={h} hinge={right?'right':'left'} pivotOffset={offset} config={slide?{...config,open:false}:config} photoMode={photoMode}/>
      </>}
      {slide && <Bar pos={[0,h+0.1,-0.02]} size={[w*1.8,0.06,0.08]} color={FRAME_COLORS[config.frame]}/>}
      {config.type==='pivot' && <>
        <mesh position={[right?w/2-0.12:-w/2+0.12,0.035,0.01]}><cylinderGeometry args={[0.05,0.05,0.07,24]}/><meshStandardMaterial color="#9b9a93" metalness={0.8} roughness={0.3}/></mesh>
      </>}
    </group>
    {!photoMode&&<ContactShadows position={[0,-0.025,0.25]} opacity={0.44} scale={9} blur={2.5} far={4}/>}
    {!photoMode&&<OrbitControls makeDefault enablePan={false} minDistance={3.2} maxDistance={11} target={[0,1.17,0]} minPolarAngle={0.45} maxPolarAngle={Math.PI/2.04}/>}
  </>;
}

export default function DoorScene({config,resetToken,photoMode=false,photoAngle=0}) {
  return <Canvas key={resetToken} shadows={!photoMode} dpr={[1,1.75]} camera={{position:photoMode?[0,1.1,5.1]:[3.7,2.8,6.4],fov:photoMode?32:41,near:0.1,far:100}} gl={{alpha:photoMode,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'}} onCreated={({gl})=>{if(photoMode)gl.setClearColor('#ffffff',0);}} fallback={<div className="webgl-fallback">Uw browser ondersteunt geen WebGL. Probeer een recentere browser.</div>}>
    <Scene config={config} photoMode={photoMode} photoAngle={photoAngle}/>
  </Canvas>;
}
