import React,{useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {makeMarbleTexturePixels} from './marble-texture.mjs';

// Full-size, reflective marble slabs. The texture represents 8m x 8m
// including individual 100cm tiles and fine, slightly rougher grout lines.
export function MarbleFloor({width=26,depth=24}){
  const maps=useMemo(()=>{
    function texture(channel,size){
      const img=new THREE.DataTexture(makeMarbleTexturePixels(size,channel),size,size,THREE.RGBAFormat);
      img.wrapS=THREE.RepeatWrapping;img.wrapT=THREE.RepeatWrapping;
      img.repeat.set(width/8,depth/8);
      img.minFilter=THREE.LinearMipmapLinearFilter;
      img.magFilter=THREE.LinearFilter;img.generateMipmaps=true;
      img.anisotropy=4;
      if(channel==='color')img.colorSpace=THREE.SRGBColorSpace;
      else img.colorSpace=THREE.NoColorSpace;
      img.needsUpdate=true;
      return img;
    }
    return {map:texture('color',512),roughnessMap:texture('roughness',256),normalMap:texture('normal',256)};
  },[width,depth]);
  useEffect(()=>()=>{Object.values(maps).forEach(t=>t.dispose());},[maps]);
  return <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.026,0]} receiveShadow>
    <planeGeometry args={[width,depth]}/>
    <meshPhysicalMaterial
      map={maps.map} roughnessMap={maps.roughnessMap} normalMap={maps.normalMap}
      normalScale={[.16,.16]} color="#ffffff"
      roughness={1} metalness={0} clearcoat={.27}
      clearcoatRoughness={.22} envMapIntensity={1.25}
      side={THREE.FrontSide}/>
  </mesh>;
}
