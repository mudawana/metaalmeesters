import test from 'node:test';
import assert from 'node:assert/strict';
import {marbleSample,makeMarbleTexturePixels} from '../src/marble-texture.mjs';

test('marble maps include visible stone variation and distinct grout joints',()=>{
 const stone=makeMarbleTexturePixels(96);
 const rough=makeMarbleTexturePixels(96,'roughness');
 const bump=makeMarbleTexturePixels(96,'normal');
 assert.equal(stone.length,96*96*4);
 assert.ok(new Set(Array.from(stone.filter((_,i)=>i%4===0))).size>20);
 assert.ok(new Set(Array.from(rough.filter((_,i)=>i%4===1))).size>7);
 assert.ok(new Set(Array.from(bump.filter((_,i)=>i%4===0))).size>2);
 const inTile=marbleSample(.0625,.0625),joint=marbleSample(.125,.125);
 assert.ok(inTile.r>joint.r);
 assert.ok(inTile.roughness<joint.roughness);
});
test('procedural marble repeats seamlessly over a tile field',()=>{
 for(const [u,v] of [[.12,.37],[.79,.91],[.125,.251]]){
  const a=marbleSample(u,v),b=marbleSample(u+1,v+1);
  assert.ok(Math.abs(a.r-b.r)<=1&&Math.abs(a.g-b.g)<=1);
  assert.ok(Math.abs(a.roughness-b.roughness)<1e-8);
 }
});
test('textures are bounded and validate inputs',()=>{
 for(const kind of ['color','roughness','normal']){
  const pixels=makeMarbleTexturePixels(64,kind);
  assert.ok(pixels.every(n=>Number.isInteger(n)&&n>=0&&n<=255));
 }
 assert.throws(()=>makeMarbleTexturePixels(0),/resolutie/);
 assert.throws(()=>makeMarbleTexturePixels(64,'unknown'),/maptype/);
});
