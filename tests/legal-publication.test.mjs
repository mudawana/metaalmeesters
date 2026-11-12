import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BUSINESS_DETAILS,LEGAL_APPROVED} from '../src/legal-profile.mjs';
test('the public registered company identity is complete',()=>{
  assert.equal(BUSINESS_DETAILS.officialName,'Metaalmeesters BV');
  assert.equal(BUSINESS_DETAILS.enterpriseNumber,'1035.390.965');
  assert.equal(BUSINESS_DETAILS.vatNumber,'BE 1035.390.965');
  assert.equal(BUSINESS_DETAILS.streetAndNumber,'Lange Lobroekstraat 58');
  assert.equal(BUSINESS_DETAILS.postalCode,'2060');
  assert.equal(BUSINESS_DETAILS.municipality,'Antwerpen');
  assert.equal(LEGAL_APPROVED,false);
});
test('Pages workflow publishes all three legal routes to the actual served tree',()=>{
  const y=fs.readFileSync('.github/workflows/deploy-pages.yml','utf8');
  for(const path of ['privacy','cookies','bedrijfsgegevens']){
    assert.match(y,new RegExp('for page in [^\\n]*\\b'+path+'\\b'));
    assert.match(y,new RegExp('git add [^\\n]*\\b'+path+'\\b'));
  }
});
