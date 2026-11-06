import test from 'node:test';
import assert from 'node:assert/strict';
import {getHouseGeometry} from '../src/house-geometry.mjs';

test('the actual 3D opening grows with the selected door width and height',()=>{
  const small=getHouseGeometry(900,2200);
  const large=getHouseGeometry(2800,3200);
  assert.equal(small.width,.9);
  assert.equal(small.height,2.2);
  assert.ok(large.openingWidth>small.openingWidth);
  assert.ok(large.openingHeight>small.openingHeight);
  assert.ok(large.wallWidth>=small.wallWidth);
  assert.ok(large.wallHeight>small.wallHeight);
  assert.ok(Math.abs(small.openingWidth-small.width-.04)<1e-9);
  assert.ok(Math.abs(large.openingHeight-large.height-.025)<1e-9);
});

test('all legal configured door dimensions leave positive wall and upper-window clearance',()=>{
  for(const width of [500,900,1600,2800,3600,6000,8000]){
    for(const height of [1400,2200,2800,3500,4500]){
      const g=getHouseGeometry(width,height);
      assert.ok(g.wingWidth>=2.4,`Side wall too narrow ${width}x${height}`);
      assert.ok(g.upperWindowCenter-g.upperWindowHeight/2>g.openingHeight,`Upper window clips lintel ${width}x${height}`);
      assert.ok(g.upperWindowCenter+g.upperWindowHeight/2<g.wallHeight,`Roof touches window ${width}x${height}`);
      assert.ok(g.wallWidth>g.openingWidth);
      assert.ok(g.wallHeight>g.openingHeight);
    }
  }
});

test('invalid or out-of-range dimensions cannot generate negative geometry',()=>{
  for(const [w,h] of [[null,null],[-10,0],[Infinity,NaN],[99999,99999]]){
    const g=getHouseGeometry(w,h);
    assert.ok(g.width>=.5&&g.width<=8);
    assert.ok(g.height>=1.4&&g.height<=4.5);
    assert.ok(g.wingWidth>0);
  }
});
