import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_PLACEMENT,PLACEMENT_LIMITS,normalizePlacement,overlaySize,placementFromKey,adjustPlacement,pinchScale} from '../src/photo-placement.mjs';

test('uploaded photo begins with a centered, visible door',()=>{
 const p=normalizePlacement();
 assert.equal(p.x,50);
 assert.ok(overlaySize({width:390,height:320},{width:900,height:2200},p).width>45);
 assert.ok(overlaySize({width:390,height:320},{width:900,height:2200},p).height>100);
});
test('keyboard arrows move overlay while shift arrows resize dimensions',()=>{
 const a=placementFromKey(DEFAULT_PLACEMENT,'ArrowRight');
 assert.equal(a.handled,true);assert.equal(a.placement.x,51);
 assert.equal(placementFromKey(DEFAULT_PLACEMENT,'ArrowUp').placement.y,53);
 assert.equal(placementFromKey(DEFAULT_PLACEMENT,'ArrowLeft',true).placement.widthScale,97);
 assert.equal(placementFromKey(DEFAULT_PLACEMENT,'ArrowUp',true).placement.scale,69);
 assert.equal(placementFromKey(DEFAULT_PLACEMENT,'+',false).placement.scale,69);
 assert.equal(placementFromKey(DEFAULT_PLACEMENT,'-',false).placement.scale,63);
 assert.equal(placementFromKey(DEFAULT_PLACEMENT,'Escape').handled,false);
});
test('two-finger pinch scales smoothly and remains within limits',()=>{
 assert.equal(pinchScale(DEFAULT_PLACEMENT,200,100).scale,132);
 assert.equal(pinchScale(DEFAULT_PLACEMENT,10,100).scale,PLACEMENT_LIMITS.scale[0]);
 assert.equal(pinchScale(DEFAULT_PLACEMENT,100,0).scale,DEFAULT_PLACEMENT.scale);
});
test('sizes preserve chosen door proportions and independent width control',()=>{
 const stage={width:900,height:600},door={width:1500,height:2400};
 const a=overlaySize(stage,door,DEFAULT_PLACEMENT);
 const b=overlaySize(stage,door,{...DEFAULT_PLACEMENT,widthScale:150});
 assert.ok(b.width>a.width);
 assert.equal(b.height,a.height);
 const c=overlaySize(stage,door,{...DEFAULT_PLACEMENT,scale:100});
 assert.ok(c.height>a.height);
});
test('invalid values and all editing controls are clamped',()=>{
 for(const [key,[min,max]] of Object.entries(PLACEMENT_LIMITS)){
   assert.equal(adjustPlacement(DEFAULT_PLACEMENT,key,-10000)[key],min);
   assert.equal(adjustPlacement(DEFAULT_PLACEMENT,key,10000)[key],max);
 }
 assert.equal(normalizePlacement({scale:'abc'}).scale,DEFAULT_PLACEMENT.scale);
 assert.equal(overlaySize({width:250,height:300},{width:8000,height:1400},{scale:150,widthScale:220}).width<=250*.97,true);
});
