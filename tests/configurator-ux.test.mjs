import test from 'node:test';
import assert from 'node:assert/strict';
import {STEPS,FAVOURITES,featuredOptions,extraOptions,countExtra,sizesForType} from '../src/configurator-ux.mjs';
import {GLASSES,FRAMES,HANDLES} from '../src/product-options.mjs';

test('customer receives five short guided steps',()=>{
 assert.equal(STEPS.length,5);
 assert.ok(STEPS.every(s=>s.title&&s.hint));
});
test('the simple glass list retains unusual and legacy selections',()=>{
 const shortlist=featuredOptions(GLASSES,FAVOURITES.glass,'martele');
 assert.ok(shortlist.some(o=>o.id==='martele'));
 assert.ok(shortlist.some(o=>o.id==='mat'));
 const legacy=featuredOptions(GLASSES,FAVOURITES.glass,'ribbel');
 assert.ok(legacy.some(o=>o.id==='ribbel'));
 assert.equal(new Set(shortlist.map(o=>o.id)).size,shortlist.length);
});
test('expanded list never duplicates popular or selected options',()=>{
 for(const [list,ids,chosen] of [[GLASSES,FAVOURITES.glass,'flute'],[GLASSES,FAVOURITES.glass,'oceanic'],[FRAMES,FAVOURITES.frame,'anodic-malachite'],[HANDLES,FAVOURITES.handle,'greep-rond']]){
  const first=featuredOptions(list,ids,chosen);
  const rest=extraOptions(list,ids,chosen);
  assert.ok(first.length>=ids.length);
  assert.ok(rest.every(x=>!x.legacy));
  assert.equal(new Set([...first,...rest].map(x=>x.id)).size,first.length+rest.length);
  assert.equal(countExtra(list,ids,chosen),rest.length);
 }
});
test('size presets always correspond to a usable door type',()=>{
 for(const type of ['enkel','dubbel','pivot','wand','schuif']){
  const choices=sizesForType(type);
  assert.equal(choices.length,3);
  assert.ok(choices.every(x=>x.width>=500&&x.height>=1400&&x.height<=4500));
  assert.ok(choices.every(x=>typeof x.label==='string'&&x.label.length>0));
 }
});
