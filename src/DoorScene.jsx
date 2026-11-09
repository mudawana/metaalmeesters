import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import {modelDimensions} from './door-dimensions.mjs';
import {FRAMES} from './data.js';
import {ArchedDoorLeaf,ArchedFixedPanel} from './ArchedElements.jsx';
import {GlassSurface} from './GlassVisual.jsx';
import {DoorHardware,DoorHinge} from './DoorHardware.jsx';
import {SteelInfill} from './SteelInfill.jsx';
import {StudioReflections,InstalledStudio} from './StudioWorld.jsx';
import {lowerSteelMeters} from './product-options.mjs';

function Metal({ color, roughness=0.38 }) {
  return <meshPhysicalMaterial color={color} metalness={.87} roughness={roughness} envMapIntensity={1.65} clearcoat={.19} clearcoatRoughness={.15}/>;
}
const FRAME_COLORS = Object.fromEntries(FRAMES.map(c=>[c.id,c.color]));

function Bar({pos,size,color,radius=0.004}) {
  return <RoundedBox args={size} position={pos} radius={radius} smoothness={3} castShadow receiveShadow><Metal color={color}/></RoundedBox>;
}

function Glass({width,height,kind,photoMode=false}) {
  return <GlassSurface width={width} height={height} kind={kind} photoMode={photoMode}/>;
}

function DoorLeaf({x,width,height,hinge,config,pivotOffset=0,photoMode=false}) {
  const color=FRAME_COLORS[config.frame]||FRAME_COLORS.zwart;
  const flip=hinge==='right';
  const sign=flip?-1:1;
  const center=sign*(width/2-pivotOffset);
  const frame=.049;
  const innerWidth=Math.max(.1,width-2*frame),innerHeight=height-2*frame;
  const steel=lowerSteelMeters(config,height);
  const glassHeight=Math.max(.08,innerHeight-steel);
  const glassCenter=steel/2;
  const horizontal=Math.max(0,Math.min(5,Number(config.horizontal)||0));
  const vertical=Math.max(0,Math.min(4,Number(config.vertical)||0));
  const angle=config.open&&config.type!=='schuif'?(flip?1:-1)*(config.type==='pivot'?.72:.5):0;
  const steelTop=-height/2+frame+steel;
  return <group position={[x,0,0]} rotation={[0,angle,0]}>
    <group position={[center,height/2,0]}>
      <group position={[0,glassCenter,0]}><Glass width={innerWidth} height={glassHeight} kind={config.glass} photoMode={photoMode}/></group>
      {steel>0&&<>
        <SteelInfill width={innerWidth} height={steel} centerY={-height/2+frame+steel/2} color={color} photoMode={photoMode}/>
        <Bar pos={[0,steelTop,.052]} size={[width,.035,.068]} color={color}/>
        {/* Three vertical zones: solid steel below, two separate glass panes above. */}
        <Bar pos={[0,(steelTop+height/2-frame)/2,.052]} size={[width,.027,.055]} color={color}/>
      </>}
      <Bar pos={[-width/2+frame/2,0,.016]} size={[frame,height,.065]} color={color}/>
      <Bar pos={[width/2-frame/2,0,.016]} size={[frame,height,.065]} color={color}/>
      <Bar pos={[0,height/2-frame/2,.016]} size={[width,frame,.065]} color={color}/>
      <Bar pos={[0,-height/2+frame/2,.016]} size={[width,frame,.065]} color={color}/>
      <Bar pos={[-width/2+frame+.003,glassCenter,.051]} size={[.006,glassHeight,.007]} color="#222a27" radius={.001}/>
      <Bar pos={[width/2-frame-.003,glassCenter,.051]} size={[.006,glassHeight,.007]} color="#222a27" radius={.001}/>
      {Array.from({length:vertical},(_,i)=><Bar key={'v'+i}
        pos={[-innerWidth/2+innerWidth*(i+1)/(vertical+1),glassCenter,.043]}
        size={[.023,glassHeight,.044]} color={color}/>)}
      {steel===0&&Array.from({length:horizontal},(_,i)=><Bar key={'h'+i}
        pos={[0,-innerHeight/2+innerHeight*(i+1)/(horizontal+1),.045]}
        size={[innerWidth,.024,.046]} color={color}/>)}
      <DoorHardware x={flip?-width/2+.115:width/2-.115} y={0} color={color} handle={config.handle} closure={config.closure} right={flip}/>
      {[.16,.82].map((f,i)=><DoorHinge key={i} x={flip?width/2+.009:-width/2-.009} y={-height/2+height*f} color={color}/>)}
    </group>
  </group>;
}

function FixedGlassPanel({x,width,height,config,photoMode=false}) {
  if(width<=.075)return null;
  const color=FRAME_COLORS[config.frame]||FRAME_COLORS.zwart;
  const frame=Math.min(.049,width*.18);
  const innerWidth=Math.max(.025,width-frame*2);
  const innerHeight=height-frame*2;
  return <group position={[x,height/2,0]}>
    <Glass width={innerWidth} height={innerHeight} kind={config.glass} photoMode={photoMode}/>
    <Bar pos={[-width/2+frame/2,0,.016]} size={[frame,height,.065]} color={color}/>
    <Bar pos={[width/2-frame/2,0,.016]} size={[frame,height,.065]} color={color}/>
    <Bar pos={[0,height/2-frame/2,.016]} size={[width,frame,.065]} color={color}/>
    <Bar pos={[0,-height/2+frame/2,.016]} size={[width,frame,.065]} color={color}/>
    {Array.from({length:Math.min(3,Math.max(0,Math.floor(width/1.05)))},(_,i)=>
      <Bar key={i} pos={[-innerWidth/2+innerWidth*(i+1)/(Math.min(3,Math.floor(width/1.05))+1),0,.035]} size={[.025,innerHeight,.046]} color={color}/>)}
    {Array.from({length:Math.max(0,Math.min(4,Number(config.horizontal)||0))},(_,i)=>
      <Bar key={i} pos={[0,-innerHeight/2+innerHeight*(i+1)/(Math.max(0,Math.min(4,Number(config.horizontal)||0))+1),.032]} size={[innerWidth,.025,.046]} color={color}/>)}
  </group>;
}

function Showroom({room,width,height,topShape,archHeight,lobes}) {
  return <InstalledStudio room={room} width={width} height={height}
    topShape={topShape} archHeight={archHeight} lobes={lobes}/>;
}

function AdaptiveCamera({photoMode,width,height}) {
  const {camera,size}=useThree();
  useEffect(()=>{
    if(photoMode){
      // Fit the entire selected door even for very tall arches or broad glass walls.
      const fov=Math.tan(camera.fov*Math.PI/360);
      const distance=Math.max(3.5,(height+.24)/(2*fov),(width+.24)/(2*fov*Math.max(.1,camera.aspect)))*1.1;
      camera.position.set(0,height/2,distance);
      camera.lookAt(0,height/2,0);
    }else{
      const distance=Math.max(5.6,width*1.28,height*2.25);
      camera.position.set(distance*.29,height*.55+1.0,distance);
      camera.lookAt(0,height*.52,-.2);
    }
    camera.updateProjectionMatrix();
  },[camera,photoMode,width,height,size.width,size.height]);
  return null;
}

function Scene({config,photoMode=false,photoAngle=0}) {
  const dims=modelDimensions(config);
  const w=dims.width/1000;
  const h=dims.height/1000;
  const double=config.type==='dubbel';
  const isWall=config.type==='wand';
  const curved=config.topShape==='boog'&&config.type!=='schuif';
  const archLobes=double&&config.archPattern==='apart'?2:1;
  const slide=config.type==='schuif';
  const right=config.opening==='rechts';
  const offset=config.type==='pivot'?0.12:0;
  const singleX=right ? w/2-offset+(slide&&config.open?w*0.56:0) : -w/2+offset-(slide&&config.open?w*0.56:0);
  return <>
    <AdaptiveCamera photoMode={photoMode} width={w} height={h}/>
    <StudioReflections/>
    <ambientLight intensity={photoMode ? 1.12 : .63}/>
    <hemisphereLight args={['#fff8e9','#a7a29d',.90]}/>
    <directionalLight position={[4,7,6]} intensity={photoMode?2.4:3.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0002} shadow-normalBias={.013} shadow-radius={3}/>
    <directionalLight position={[-3,4,-1]} intensity={1.0} color="#e9f2fa"/>
    {!photoMode&&<Showroom room={config.room} width={w} height={h} topShape={curved?'boog':'recht'} archHeight={config.archHeight} lobes={archLobes}/>}
    <group position={[0,0,photoMode ? 0 : 0.3]} rotation={[0,photoMode?photoAngle*Math.PI/180:0,0]}>
      {isWall ? <>
        {dims.left>1&&(curved
          ?<ArchedFixedPanel x={-w/2+dims.left/2000} width={dims.left/1000} height={h} globalWidth={w} globalX={-w/2+dims.left/2000} config={config} frameColor={FRAME_COLORS[config.frame]} photoMode={photoMode}/>
          :<FixedGlassPanel x={-w/2+dims.left/2000} width={dims.left/1000} height={h} config={config} photoMode={photoMode}/>)}
        {dims.right>1&&(curved
          ?<ArchedFixedPanel x={w/2-dims.right/2000} width={dims.right/1000} height={h} globalWidth={w} globalX={w/2-dims.right/2000} config={config} frameColor={FRAME_COLORS[config.frame]} photoMode={photoMode}/>
          :<FixedGlassPanel x={w/2-dims.right/2000} width={dims.right/1000} height={h} config={config} photoMode={photoMode}/>)}
        {curved
          ?<ArchedDoorLeaf x={right?(-w/2+(dims.left+dims.doorWidth)/1000):(-w/2+dims.left/1000)} width={dims.doorWidth/1000} height={h} globalWidth={w} globalX={-w/2+(dims.left+dims.doorWidth/2)/1000} hinge={right?'right':'left'} config={config} frameColor={FRAME_COLORS[config.frame]} photoMode={photoMode}/>
          :<DoorLeaf x={right?(-w/2+(dims.left+dims.doorWidth)/1000):(-w/2+dims.left/1000)} width={dims.doorWidth/1000} height={h} hinge={right?'right':'left'} config={config} photoMode={photoMode}/>}
      </> : double ? <>
        {curved?<>
          <ArchedDoorLeaf x={-w/2} width={w/2} height={h} globalWidth={w} globalX={-w/4} lobes={archLobes} hinge="left" config={config} frameColor={FRAME_COLORS[config.frame]} photoMode={photoMode}/>
          <ArchedDoorLeaf x={w/2} width={w/2} height={h} globalWidth={w} globalX={w/4} lobes={archLobes} hinge="right" config={config} frameColor={FRAME_COLORS[config.frame]} photoMode={photoMode}/>
        </>:<>
          <DoorLeaf x={-w/2} width={w/2} height={h} hinge="left" config={config} photoMode={photoMode}/>
          <DoorLeaf x={w/2} width={w/2} height={h} hinge="right" config={config} photoMode={photoMode}/>
        </>}
      </> : <>
        {curved
          ?<ArchedDoorLeaf x={singleX} width={w} height={h} hinge={right?'right':'left'} globalWidth={w} globalX={0} pivotOffset={offset} config={config} frameColor={FRAME_COLORS[config.frame]} photoMode={photoMode}/>
          :<DoorLeaf x={singleX} width={w} height={h} hinge={right?'right':'left'} pivotOffset={offset} config={slide?{...config,open:false}:config} photoMode={photoMode}/>}
      </>}
      {slide && <Bar pos={[0,h+0.1,-0.02]} size={[w*1.8,0.06,0.08]} color={FRAME_COLORS[config.frame]}/>}
      {config.type==='pivot' && <>
        <mesh position={[right?w/2-0.12:-w/2+0.12,0.035,0.01]}><cylinderGeometry args={[0.05,0.05,0.07,24]}/><meshStandardMaterial color="#9b9a93" metalness={0.8} roughness={0.3}/></mesh>
      </>}
    </group>
    {!photoMode&&<ContactShadows position={[0,-0.018,0.25]} opacity={.48} scale={Math.max(8,w+2.5)} blur={2.4} far={4.5}/>}
    {!photoMode&&<OrbitControls makeDefault enablePan={false} minDistance={3.2} maxDistance={Math.max(11,w*2.2)} target={[0,h*.52,0]} minPolarAngle={.45} maxPolarAngle={Math.PI/2.04}/>}
  </>;
}

export default function DoorScene({config,resetToken,photoMode=false,photoAngle=0}) {
  return <Canvas key={resetToken} shadows={!photoMode?{type:THREE.PCFSoftShadowMap}:false}
    dpr={[1,Math.min(1.6,typeof window==='undefined'?1.6:window.devicePixelRatio||1.6)]}
    camera={{position:photoMode?[0,1.1,5.1]:[3.7,2.8,6.4],fov:photoMode?32:41,near:.1,far:120}}
    gl={{alpha:photoMode,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'}}
    onCreated={({gl})=>{
      gl.outputColorSpace=THREE.SRGBColorSpace;
      gl.toneMapping=THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure=photoMode?1.10:1.18;
      if(photoMode)gl.setClearColor('#ffffff',0);
    }}
    fallback={<div className="webgl-fallback">Uw browser ondersteunt geen WebGL. Probeer een recentere browser.</div>}>
    <Scene config={config} photoMode={photoMode} photoAngle={photoAngle}/>
  </Canvas>;
}
