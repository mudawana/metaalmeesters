import React from 'react';
import * as THREE from 'three';
import {glassById} from './product-options.mjs';

export function GlassMaterial({kind,photoMode=false}) {
  const item=glassById(kind);
  const dark=item.visual==='dark',frost=item.visual==='frost';
  const patterned=['crepe','wire','ocean','hammer','canale','flute'].includes(item.visual);
  const roughness=frost?.82:patterned?.31:dark?.14:.085;
  const transmission=frost?.19:dark?.16:patterned?.58:item.visual==='tint'?.43:.87;
  const opacity=dark?.84:frost?.76:patterned?.45:item.visual==='tint'?.47:.18;
  return photoMode
    ?<meshPhysicalMaterial color={item.color} roughness={roughness} metalness={0} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} clearcoat={.6}/>
    :<meshPhysicalMaterial color={item.color} roughness={roughness} metalness={0} transmission={transmission} transparent opacity={1} thickness={.025} ior={1.52} side={THREE.DoubleSide} clearcoat={.74}/>;
}

function TextureStrip({x,y,w,h,color='#e8f0f0',opacity=.35,z=.064}) {
  if(w<=0||h<=0)return null;
  return <mesh position={[x,y,z]}>
    <boxGeometry args={[w,h,.0018]}/>
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide}/>
  </mesh>;
}
// A deliberately light-weight 3D depiction of the relief. Final glass texture,
// safety glass type and optical values are confirmed by the manufacturer.
export function GlassPattern({kind,width,height,topAt,bottom=0,frame=0}) {
  const visual=glassById(kind).visual;
  const top=(x)=>Math.max(bottom+.001,(topAt?topAt(x)-frame:height));
  const spring=Math.min(top(-width/2),top(width/2));
  const maxVert=Math.min(105,Math.max(1,Math.floor(width/(visual==='canale'?.125:.063))));
  if(!['wire','flute','canale','crepe','hammer','ocean'].includes(visual))return null;
  return <group>
    {(['flute','canale'].includes(visual))&&Array.from({length:maxVert},(_,i)=>{
      const x=-width/2+width*(i+.5)/maxVert,ymax=top(x),h=Math.max(.002,ymax-bottom);
      return <TextureStrip key={'rib'+i} x={x} y={bottom+h/2} w={visual==='canale'?.010:.004} h={h}
        color={i%2?'#f2fcff':'#779ca7'} opacity={i%2?.25:.24}/>;
    })}
    {visual==='wire'&&<>
      {Array.from({length:Math.min(60,Math.floor(width/.105))},(_,i)=>{
        const x=-width/2+width*(i+.5)/Math.min(60,Math.max(1,Math.floor(width/.105))),h=Math.max(.002,top(x)-bottom);
        return <TextureStrip key={'wv'+i} x={x} y={bottom+h/2} w={.0022} h={h} color="#6d7b7c" opacity={.53}/>;
      })}
      {Array.from({length:Math.min(35,Math.floor((spring-bottom)/.11))},(_,i)=>{
        const y=bottom+(spring-bottom)*(i+.5)/Math.min(35,Math.max(1,Math.floor((spring-bottom)/.11)));
        return <TextureStrip key={'wh'+i} x={0} y={y} w={width} h={.0022} color="#6d7b7c" opacity={.53}/>;
      })}
    </>}
    {(['crepe','hammer'].includes(visual))&&Array.from({length:Math.min(95,Math.max(26,Math.floor(width*height*16)))},(_,i)=>{
      const seed=((i*17+7)%97)/97,seedY=((i*43+11)%101)/101;
      const x=(seed-.5)*(width*.93),y=bottom+seedY*(Math.max(.01,top(x)-bottom)*.94);
      const size=visual==='hammer'?.012+(i%5)*.004:.004+(i%4)*.003;
      return <mesh key={'b'+i} position={[x,y,.062]} scale={[1+(i%3)*.3,.8+(i%4)*.22,1]}>
        <circleGeometry args={[size,8]}/>
        <meshBasicMaterial color={i%3===0?'#789a9d':'#f5ffff'} transparent opacity={visual==='hammer'?.22:.29} depthWrite={false}/>
      </mesh>;
    })}
    {visual==='ocean'&&Array.from({length:Math.min(24,Math.max(10,Math.floor((spring-bottom)/.12)))},(_,i)=>{
      const y=bottom+(spring-bottom)*(i+.5)/Math.min(24,Math.max(10,Math.floor((spring-bottom)/.12)));
      return <group key={'wave'+i}>{Array.from({length:14},(_,j)=>{
        const x=-width/2+width*(j+.5)/14;
        const yp=y+Math.sin(j*.75+i*.6)*.014;
        return <TextureStrip key={j} x={x} y={yp} w={width/14+.003} h={.004} color={i%3===0?'#8faeb6':'#e6fcff'} opacity={.18}/>;
      })}</group>;
    })}
  </group>;
}

export function GlassSurface({width,height,kind,photoMode=false}) {
  return <group>
    <mesh castShadow={!photoMode}>
      <boxGeometry args={[width,height,.009]}/>
      <GlassMaterial kind={kind} photoMode={photoMode}/>
    </mesh>
    <group position={[0,-height/2,0]}>
      <GlassPattern width={width} height={height} kind={kind}/>
    </group>
  </group>;
}
