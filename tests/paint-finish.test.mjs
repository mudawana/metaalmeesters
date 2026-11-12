import test from 'node:test';
import assert from 'node:assert/strict';
import {paintHeight,paintNormalPixels} from '../src/paint-finish.mjs';
test('coated steel normal texture is tileable and non-flat',()=>{
 const arr=paintNormalPixels(64);
 assert.equal(arr.length,64*64*4);
 assert.ok(new Set(Array.from(arr.filter((_,i)=>i%4===0))).size>8);
 assert.ok(arr.every(n=>Number.isInteger(n)&&n>=0&&n<=255));
 for(const [u,v] of [[.23,.57],[.8,.1]]){
  assert.ok(Math.abs(paintHeight(u,v)-paintHeight(u+1,v))<1e-8);
  assert.ok(Math.abs(paintHeight(u,v)-paintHeight(u,v+1))<1e-8);
 }
});
