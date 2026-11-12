import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {initialBalustrade,safeBalustradeDesign} from '../src/balustrade-options.mjs';
import {railingRuns,totalRailingLengthMm,previewRailingRuns} from '../src/balustrade-geometry.mjs';

test('I, left-L, right-L and U are real distinct layouts',()=>{
 assert.deepEqual(railingRuns(initialBalustrade).map(x=>x.id),['voorzijde']);
 assert.deepEqual(railingRuns({...initialBalustrade,layout:'hoek-links',type:'balkon'}).map(x=>x.id),['voorzijde','links']);
 assert.deepEqual(railingRuns({...initialBalustrade,layout:'hoek-rechts',type:'balkon'}).map(x=>x.id),['voorzijde','rechts']);
 assert.deepEqual(railingRuns({...initialBalustrade,layout:'u',type:'balkon'}).map(x=>x.id),['voorzijde','links','rechts']);
});

test('U contains both correctly positioned return corners',()=>{
 const d=safeBalustradeDesign({...initialBalustrade,type:'terras',layout:'u',length:4500,sideLeft:1200,sideRight:1900});
 assert.ok(d);
 const [front,left,right]=railingRuns(d);
 assert.equal(front.lengthMm,4500);
 assert.equal(left.lengthMm,1200);
 assert.equal(right.lengthMm,1900);
 assert.equal(left.xMm,-2250);
 assert.equal(right.xMm,2250);
 assert.equal(left.zMm,-600);
 assert.equal(right.zMm,-950);
 assert.equal(left.rotationY,Math.PI/2);
 assert.equal(right.rotationY,Math.PI/2);
 assert.equal(totalRailingLengthMm(d),7600);
 const [a,b,c]=previewRailingRuns(d);
 assert.equal(a.lengthM,4.5);
 assert.equal(b.xM,-2.25);
 assert.equal(c.xM,2.25);
 assert.equal(b.zM,-.6);
 assert.equal(c.zM,-.95);
});

test('unknown sizes and old saved layouts preserve quote lengths',()=>{
 const legacy={...initialBalustrade,type:'balkon',layout:'u',length:0};
 delete legacy.sideLeft;delete legacy.sideRight;
 const safe=safeBalustradeDesign(legacy);
 assert.equal(safe.length,0);
 assert.equal(safe.sideLeft,1800);
 assert.equal(safe.sideRight,1800);
 assert.equal(totalRailingLengthMm(safe),3600);
 assert.equal(previewRailingRuns(safe)[0].lengthM,1.8);
});

test('premium selection contains optimized new asset and saves side measurements',async()=>{
 const [app,data,asset,config,admin,api,scene]=await Promise.all([
  fs.readFile('src/App.jsx','utf8'),fs.readFile('src/data.js','utf8'),
  fs.stat('public/images/balustrade-studio.avif'),fs.readFile('src/BalustradeConfigurator.jsx','utf8'),
  fs.readFile('src/Admin.jsx','utf8'),fs.readFile('netlify/functions/quotes.mjs','utf8'),
  fs.readFile('src/BalustradeScene.jsx','utf8')
 ]);
 assert.ok(asset.size>3000&&asset.size<200000);
 assert.match(data,/balustrade-studio\.avif/);
 assert.match(app,/Digitaal sfeerbeeld/);
 assert.match(config,/sideLeft/);
 assert.match(config,/sideRight/);
 assert.match(config,/bal-choices-layout/);
 assert.match(admin,/totalRailingLengthMm/);
 assert.match(api,/hasLeftReturn/);
 assert.match(scene,/previewRailingRuns/);
});
