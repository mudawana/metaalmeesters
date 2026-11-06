import test from 'node:test';
import assert from 'node:assert/strict';
import {archRise,archTopAt,archPoints,archSpec} from '../src/arch-geometry.mjs';

test('single segment hits the spring points and the exact apex',()=>{
 for(const [width,height,requested] of [[.9,2.2,300],[1.8,2.5,420],[3.2,3.3,650],[.5,1.4,1000]]) {
  const s=archSpec(width,height,requested);
  assert.ok(Math.abs(s.y(-width/2)-(height-s.rise))<1e-7);
  assert.ok(Math.abs(s.y(width/2)-(height-s.rise))<1e-7);
  assert.ok(Math.abs(s.y(0)-height)<1e-7);
  assert.ok(s.rise<=width/2);
 }
});
test('two arches over a double door meet at center spring with two apexes',()=>{
 const s=archSpec(2.4,2.7,360,2);
 assert.ok(Math.abs(s.y(-1.2)-s.spring)<1e-8);
 assert.ok(Math.abs(s.y(0)-s.spring)<1e-8);
 assert.ok(Math.abs(s.y(1.2)-s.spring)<1e-8);
 assert.ok(Math.abs(s.y(-.6)-s.apex)<1e-8);
 assert.ok(Math.abs(s.y(.6)-s.apex)<1e-8);
});
test('curved path stays below apex and above spring for all legal widths and heights',()=>{
 for(const w of [.5,.9,1.6,3.6,8]){
  for(const h of [1.4,2.2,3.5,4.5]){
   for(const lobes of [1,2]){
    const s=archSpec(w,h,800,lobes);
    const points=archPoints(w,h,800,lobes);
    assert.ok(points.every(p=>p.y>=s.spring-1e-7&&p.y<=h+1e-7));
    assert.ok(s.spring>.5);
   }
  }
 }
});
test('invalid arch heights are clamped safely',()=>{
 assert.equal(archRise(.9,2.2,99999),.45);
 assert.equal(archRise(1.2,2.2,-10),.055);
 assert.ok(Number.isFinite(archTopAt(0,.9,2.2,.3)));
});
