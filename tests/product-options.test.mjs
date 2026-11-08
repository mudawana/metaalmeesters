import test from 'node:test';
import assert from 'node:assert/strict';
import {FRAMES,GLASSES,HANDLES,CLOSURES,PANEL_LAYOUTS,glassById,lowerSteelMeters} from '../src/product-options.mjs';
import {validDesign} from '../netlify/functions/quotes.mjs';

const base={
 type:'enkel',width:900,height:2200,frame:'zwart',glass:'helder',
 vertical:1,horizontal:2,handle:'lang',opening:'rechts',
 topShape:'recht',archHeight:300,archPattern:'doorlopend',
 panelLayout:'glas',lowerPanelHeight:650,closure:'magneet'
};

test('all requested glass types are distinct selectable catalogue entries',()=>{
 const ids=GLASSES.map(x=>x.id);
 for(const id of ['helder','gelaagd','mat','grijs','brons-glas','zwart-glas','crepe','draadglas','oceanic','martele','canale','flute'])
  assert.ok(ids.includes(id),'Missing glass '+id);
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(glassById('mat').safety,'Gelaagd');
 assert.equal(glassById('brons-glas').visual,'tint');
 assert.match(glassById('draadglas').safety,/bevestigen/);
});
test('anodic sample book offers eight individually identified colours',()=>{
 for(const name of ['Gold','Champagne','Bronze','Brown','Natura','Saphire','Malachite','Black']){
  assert.ok(FRAMES.some(x=>x.group==='Anodic'&&!x.legacy&&x.label==='Anodic '+name));
 }
 assert.equal(new Set(FRAMES.map(x=>x.id)).size,FRAMES.length);
});
test('many handles, magnetic closure, lockcase and steel panel are supported',()=>{
 assert.ok(HANDLES.length>=8);
 assert.deepEqual(CLOSURES.map(x=>x.id),['magneet','slotkast','geen']);
 assert.ok(PANEL_LAYOUTS.some(x=>x.id==='staal-onder'));
 assert.ok(lowerSteelMeters({panelLayout:'staal-onder',lowerPanelHeight:650},2.2)>.6);
 assert.equal(lowerSteelMeters({panelLayout:'glas'},2.2),0);
 assert.equal(lowerSteelMeters({panelLayout:'staal-onder'},2.2,true),0);
});
test('quote accepts client glass variants and anodic colour/handle/closure choices',()=>{
 for(const gl of GLASSES){
  for(const colour of ['anodic-gold','anodic-malachite']){
   assert.ok(validDesign({...base,glass:gl.id,frame:colour,handle:'greep-vierkant',closure:'slotkast'}),gl.id+'/'+colour);
  }
 }
 assert.ok(validDesign({...base,type:'pivot',glass:'flute',panelLayout:'staal-onder',lowerPanelHeight:700}));
 assert.ok(validDesign({...base,type:'dubbel',width:1700,topShape:'boog',archPattern:'apart',glass:'oceanic',panelLayout:'staal-onder',lowerPanelHeight:650}));
});
test('quote refuses invalid catalogue items and excessive solid panel dimensions',()=>{
 assert.equal(validDesign({...base,glass:'gele-vitrage'}),false);
 assert.equal(validDesign({...base,handle:'onbekend'}),false);
 assert.equal(validDesign({...base,closure:'onbekend'}),false);
 assert.equal(validDesign({...base,panelLayout:'staal-onder',lowerPanelHeight:5000}),false);
 assert.equal(validDesign({...base,panelLayout:'staal-onder',lowerPanelHeight:0}),false);
 assert.equal(validDesign({...base,panelLayout:'raar'}),false);
});
