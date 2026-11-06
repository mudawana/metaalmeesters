import test from 'node:test';
import assert from 'node:assert/strict';
import {modelDimensions,VISUAL_RANGE} from '../src/door-dimensions.mjs';

test('integrated glass wall always fills the requested opening',()=>{
  for(const side of ['links','rechts','beide']){
    const g=modelDimensions({type:'wand',width:3200,height:2500,doorWidth:900,fixedPanelSide:side});
    assert.equal(g.doorWidth+g.left+g.right,g.width);
    assert.ok(g.left>=0&&g.right>=0);
    assert.equal(g.doorWidth,900);
  }
});
test('a wall can expand far beyond one door without making the moving leaf larger',()=>{
  const small=modelDimensions({type:'wand',width:2600,doorWidth:900});
  const wide=modelDimensions({type:'wand',width:6800,doorWidth:900});
  assert.equal(small.doorWidth,wide.doorWidth);
  assert.ok(wide.left>small.left);
  assert.ok(wide.right>small.right);
});
test('demo bounds are not manufacturing limits and leave valid render geometry',()=>{
  const g=modelDimensions({type:'wand',width:99999,height:99999,doorWidth:99999});
  assert.equal(g.width,VISUAL_RANGE.widthMax);
  assert.equal(g.height,VISUAL_RANGE.heightMax);
  assert.ok(g.doorWidth<g.width);
});
