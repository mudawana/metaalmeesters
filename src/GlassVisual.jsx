import React,{useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {glassById} from './product-options.mjs';
import {makeNormalPixels,reliefSettings} from './texture-relief.mjs';

const profiles={
  clear:{roughness:.055,transmission:.94,opacity:.13},
  frost:{roughness:.72,transmission:.35,opacity:.77},
  tint:{roughness:.09,transmission:.66,opacity:.44},
  dark:{roughness:.11,transmission:.24,opacity:.82},
  crepe:{roughness:.23,transmission:.77,opacity:.25},
  wire:{roughness:.13,transmission:.83,opacity:.24},
  ocean:{roughness:.20,transmission:.78,opacity:.28},
  hammer:{roughness:.26,transmission:.73,opacity:.28},
  canale:{roughness:.12,transmission:.89,opacity:.22},
  flute:{roughness:.12,transmission:.89,opacity:.22}
};

function physicalGlassTexture(visual,width,height,uvMeters=false){
  const settings=reliefSettings[visual];
  if(!settings)return null;
  const size=128;
  const map=new THREE.DataTexture(makeNormalPixels(visual,size),size,size,THREE.RGBAFormat,THREE.UnsignedByteType);
  map.wrapS=THREE.RepeatWrapping;
  map.wrapT=THREE.RepeatWrapping;
  map.repeat.set(uvMeters?1/settings.pitchX:Math.max(.5,width/settings.pitchX),uvMeters?1/settings.pitchY:Math.max(.5,height/settings.pitchY));
  map.minFilter=THREE.LinearMipmapLinearFilter;
  map.magFilter=THREE.LinearFilter;
  map.generateMipmaps=true;
  map.colorSpace=THREE.NoColorSpace;
  map.needsUpdate=true;
  return map;
}

export function GlassMaterial({kind,photoMode=false,width=1,height=2,uvMeters=false}) {
  const glass=glassById(kind);
  const profile=profiles[glass.visual]||profiles.clear;
  const map=useMemo(()=>physicalGlassTexture(glass.visual,width,height,uvMeters),[glass.visual,width,height,uvMeters]);
  useEffect(()=>()=>map?.dispose(),[map]);
  const normalScale=reliefSettings[glass.visual]?.normalScale||0;
  // Untinted clear glass should remain optically near-neutral: colour belongs in
  // absorption through tinted glass, not an opaque surface coating.
  const isClear=glass.visual==='clear';
  const surfaceColor=isClear?'#f7fbfc':glass.color;
  return photoMode
    ?<meshPhysicalMaterial
      color={surfaceColor} metalness={0} roughness={profile.roughness}
      normalMap={map||null} normalScale={[normalScale,normalScale]}
      transparent opacity={profile.opacity} depthWrite={false}
      side={THREE.DoubleSide} clearcoat={.68} clearcoatRoughness={.13}
      envMapIntensity={.90}/>
    :<meshPhysicalMaterial
      color={glass.color} metalness={0} roughness={profile.roughness}
      transmission={profile.transmission} thickness={.014} ior={1.52}
      attenuationDistance={glass.visual==='dark'?.24:2.4}
      attenuationColor={isClear?'#f7fbfc':glass.color}
      normalMap={map||null} normalScale={[normalScale,normalScale]}
      clearcoat={.90} clearcoatRoughness={.06}
      envMapIntensity={1.35} side={THREE.DoubleSide}/>;
}

// Draadglas has actual embedded-looking narrow wires; the other reliefs use
// normal-mapped surface curvature so they refract real 3D lighting rather than
// being represented by opaque 2D stripes.
function Wire({x=0,y=0,width,height,z=.010}) {
  return <mesh position={[x,y,z]}>
    <boxGeometry args={[width,height,.0015]}/>
    <meshStandardMaterial color="#657677" metalness={.68} roughness={.33} transparent opacity={.57} depthWrite={false}/>
  </mesh>;
}
export function GlassPattern({kind,width,height,topAt,bottom=0,frame=0}) {
  if(glassById(kind).visual!=='wire'||width<=0||height<=0)return null;
  const top=x=>Math.max(bottom+.002,topAt?topAt(x)-frame:height);
  const spring=Math.max(bottom+.02,Math.min(top(-width/2),top(width/2)));
  const cols=Math.min(45,Math.max(1,Math.floor(width/.09)));
  const rows=Math.min(45,Math.max(1,Math.floor((spring-bottom)/.09)));
  return <group>
    {Array.from({length:cols},(_,i)=>{
      const x=-width/2+(i+1)*width/(cols+1);
      const h=Math.max(.001,top(x)-bottom);
      return <Wire key={'w-v-'+i} x={x} y={bottom+h/2} width={.0012} height={h}/>;
    })}
    {Array.from({length:rows},(_,i)=>{
      const y=bottom+(i+1)*(spring-bottom)/(rows+1);
      return <Wire key={'w-h-'+i} x={0} y={y} width={width} height={.0012}/>;
    })}
  </group>;
}

export function GlassSurface({width,height,kind,photoMode=false}) {
  return <group>
    <mesh castShadow={!photoMode}>
      <boxGeometry args={[width,height,.009]}/>
      <GlassMaterial kind={kind} photoMode={photoMode} width={width} height={height}/>
    </mesh>
    <group position={[0,-height/2,0]}>
      <GlassPattern kind={kind} width={width} height={height}/>
    </group>
    {/* Very fine, realistic glass-edge glint rather than a white rectangle. */}
    <mesh position={[width/2-.002,0,.006]}>
      <boxGeometry args={[.002,height,.002]}/>
      <meshBasicMaterial color="#f4ffff" transparent opacity={.23} depthWrite={false}/>
    </mesh>
  </group>;
}
