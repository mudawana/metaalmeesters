import test from 'node:test';
import assert from 'node:assert/strict';
import {makeNormalPixels,reliefSettings,surfaceHeight} from '../src/texture-relief.mjs';

test('glass relief normal maps are consistent and not blank',()=>{
 for(const kind of ['flute','canale','ocean','crepe','hammer','frost','brushed']){
  const px=makeNormalPixels(kind,64);
  assert.equal(px.length,64*64*4);
  assert.ok(px.every(x=>Number.isInteger(x)&&x>=0&&x<=255));
  assert.ok(new Set(Array.from(px.filter((_,i)=>i%4===0))).size>6,kind);
  assert.equal(px[3],255);
  assert.ok(reliefSettings[kind].pitchX>0);
 }
});
test('procedural motifs remain seamless at tile boundaries',()=>{
 for(const kind of ['flute','canale','ocean','crepe','hammer','frost','brushed']){
  for(const [u,v] of [[.15,.72],[.5,.12],[.918,.311]]){
   assert.ok(Math.abs(surfaceHeight(kind,u,v)-surfaceHeight(kind,u+1,v))<1e-8,kind);
   assert.ok(Math.abs(surfaceHeight(kind,u,v)-surfaceHeight(kind,u,v+1))<1e-8,kind);
  }
 }
});
test('rejects unreasonable texture sizes',()=>{
 assert.throws(()=>makeNormalPixels('flute',1024),/resolution/);
 assert.throws(()=>makeNormalPixels('flute',0),/resolution/);
});
