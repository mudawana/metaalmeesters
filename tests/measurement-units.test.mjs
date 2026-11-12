import test from 'node:test';
import assert from 'node:assert/strict';
import {mmAsCm,cmAsMm,cmLabel,onsiteMeasureNote,suggestArchMm} from '../src/measurement-units.mjs';

test('centimetres can be typed naturally without clamping while editing',()=>{
  assert.equal(cmAsMm(''),null);
  assert.equal(cmAsMm('0'),0);
  assert.equal(cmAsMm('500'),5000);
  assert.equal(cmAsMm('5000'),50000);
  assert.equal(cmAsMm('225,5'),2255);
  assert.equal(cmAsMm('225.5'),2255);
  assert.equal(cmAsMm('5000,'),50000);
  assert.equal(cmAsMm('onbekend'),null);
  assert.equal(cmAsMm('-5'),null);
});
test('legacy millimetre design is displayed in centimetres',()=>{
  assert.equal(mmAsCm(2200),'220');
  assert.equal(mmAsCm(2255),'225,5');
  assert.equal(cmLabel(0),'Nog op te meten');
  assert.equal(cmLabel(50000),'5000 cm');
});
test('every design is measured by the atelier before production',()=>{
  assert.match(onsiteMeasureNote(),/altijd zelf ter plaatse/i);
  assert.match(onsiteMeasureNote(),/vóór productie/i);
});
test('arched doors get a safe estimated curvature without asking customer',()=>{
  assert.ok(suggestArchMm(900,2200)>100);
  assert.ok(suggestArchMm(50000,2200)<=550);
  assert.equal(suggestArchMm(0,0),220);
});
