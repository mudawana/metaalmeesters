import React from 'react';
import * as THREE from 'three';
import {FRAMES} from './product-options.mjs';
import {paintNormalPixels} from './paint-finish.mjs';

const map=new THREE.DataTexture(paintNormalPixels(),96,96,THREE.RGBAFormat,THREE.UnsignedByteType);
map.wrapS=THREE.RepeatWrapping;
map.wrapT=THREE.RepeatWrapping;
map.repeat.set(9,18);
map.minFilter=THREE.LinearMipmapLinearFilter;
map.magFilter=THREE.LinearFilter;
map.generateMipmaps=true;
map.colorSpace=THREE.NoColorSpace;
map.needsUpdate=true;
const anodicColours=new Set(FRAMES.filter(x=>x.group==='Anodic').map(x=>x.color.toLowerCase()));
// Most RAL colours used on doors are POWDER-COATED paint, not bare steel.
// Anodic effect coatings reflect a little more light; actual samples decide.
export function CoatedSteelMaterial({color='#262a27',panel=false}) {
 const anodic=anodicColours.has(String(color).toLowerCase());
 return <meshPhysicalMaterial color={color}
   metalness={anodic?.52:.19}
   roughness={anodic?.35:panel?.48:.405}
   normalMap={map} normalScale={[.16,.16]}
   clearcoat={anodic?.25:.16}
   clearcoatRoughness={anodic?.2:.29}
   envMapIntensity={anodic?1.75:1.55}
   side={THREE.FrontSide}
 />;
}
