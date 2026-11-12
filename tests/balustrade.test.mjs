import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {safeBalustradeDesign,initialBalustrade,BAL_TYPES,BAL_INFILL,BAL_MOUNT,BAL_COLORS} from '../src/balustrade-options.mjs';
import {validDesign} from '../netlify/functions/quotes.mjs';

test('balustrade catalogue has the requested models and options',()=>{
 assert.deepEqual(BAL_TYPES.map(x=>x.id),['trap','balkon','terras','vide','raam']);
 assert.ok(BAL_INFILL.some(x=>x.id==='glas'));
 assert.ok(BAL_INFILL.some(x=>x.id==='verticaal'));
 assert.ok(BAL_INFILL.some(x=>x.id==='horizontaal'));
 assert.ok(BAL_MOUNT.length>=3);
 assert.ok(BAL_COLORS.length>=5);
});
test('safe balustrade quote accepts unknown or arbitrarily entered measurements',()=>{
 assert.deepEqual(safeBalustradeDesign(initialBalustrade),initialBalustrade);
 assert.equal(safeBalustradeDesign({...initialBalustrade,length:0,height:0}).height,0);
 assert.equal(safeBalustradeDesign({...initialBalustrade,length:9375,height:1175}).length,9375);
});
test('invalid or poisoned balustrade designs are rejected',()=>{
 assert.equal(safeBalustradeDesign({...initialBalustrade,category:'deur'}),null);
 assert.equal(safeBalustradeDesign({...initialBalustrade,length:-10}),null);
 assert.equal(safeBalustradeDesign({...initialBalustrade,length:2.5}),null);
 assert.equal(safeBalustradeDesign({...initialBalustrade,infill:'onveilig'}),null);
 assert.equal(safeBalustradeDesign({...initialBalustrade,type:'onbekend'}),null);
 assert.equal(safeBalustradeDesign({...initialBalustrade,customColor:'a'.repeat(71)}),null);
 assert.ok(!Object.hasOwn(safeBalustradeDesign({...initialBalustrade,admin:true}),'admin'));
});
test('existing stalen-deur validator still accepts original design',()=>{
 assert.equal(validDesign({type:'enkel',frame:'zwart',glass:'helder',handle:'lang',opening:'rechts',width:900,height:2200,vertical:1,horizontal:2}),true);
});
test('quote form saves proper product and screenshot, admin can show both',async()=>{
 const form=await fs.readFile('src/QuoteForm.jsx','utf8');
 const api=await fs.readFile('netlify/functions/quotes.mjs','utf8');
 const admin=await fs.readFile('src/Admin.jsx','utf8');
 const capture=await fs.readFile('src/previewCapture.js','utf8');
 assert.match(form,/product='deur'/);
 assert.match(form,/stageId/);
 assert.match(api,/safeBalustradeDesign/);
 assert.match(api,/product:kind/);
 assert.match(api,/BALUSTRADE-offerteaanvraag/);
 assert.match(admin,/Balustradespecificaties/);
 assert.match(admin,/isBalustrade/);
 assert.match(capture,/balustrade-canvas/);
});
test('3D model preserves the WebGL buffer for an actual quote image',async()=>{
 const scene=await fs.readFile('src/BalustradeScene.jsx','utf8');
 const config=await fs.readFile('src/BalustradeConfigurator.jsx','utf8');
 assert.match(scene,/preserveDrawingBuffer:true/);
 assert.match(scene,/OrbitControls/);
 assert.match(scene,/Railing design/);
 assert.match(config,/id="balustrade-canvas"/);
 assert.match(config,/QuoteForm design=\{design\} product="balustrade"/);
});

test('temporary Netlify domain is noindex until the official .eu migration',async()=>{
 const generator=await fs.readFile('scripts/generate-seo-pages.mjs','utf8');
 assert.match(generator,/isNetlifyPreview/);
 assert.match(generator,/process\.env\.NETLIFY/);
 assert.match(generator,/isGitHubPreview\|\|isNetlifyPreview/);
});
