import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createServer} from 'vite';
import {pages} from '../src/seo-routes.js';
import {LEGAL_APPROVED,BUSINESS_DETAILS,isLegalPage} from '../src/legal-profile.mjs';

test('legal pages are registered as direct, canonical website routes',()=>{
 const required=['/privacy/','/cookies/','/bedrijfsgegevens/'];
 for(const pathname of required){
  const matches=pages.filter(p=>p.path===pathname);
  assert.equal(matches.length,1,pathname);
  assert.ok(isLegalPage(matches[0].route));
  assert.ok(matches[0].title.includes('MetaalMeesters'));
 }
});
test('verified business identity does not imply legal policy approval',()=>{
 assert.equal(LEGAL_APPROVED,false);
 assert.equal(BUSINESS_DETAILS.officialName,'Metaalmeesters BV');
 assert.equal(BUSINESS_DETAILS.enterpriseNumber,'1035.390.965');
 assert.equal(BUSINESS_DETAILS.vatNumber,'BE 1035.390.965');
});
test('each legal page actually renders and links to the other legal pages',async()=>{
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'});
 try{
  const {default:App}=await vite.ssrLoadModule('/src/App.jsx');
  for(const [route,heading] of [['privacy','Privacyverklaring'],['cookies','Cookiebeleid'],['bedrijfsgegevens','Bedrijfsgegevens']]){
   const html=renderToString(React.createElement(App,{initialRoute:route}));
   assert.match(html,new RegExp('<h1[^>]*>'+heading+'</h1>'),route);
   assert.match(html,/officiële lancering|vóór livegang/i,route);
   for(const path of ['privacy/','cookies/','bedrijfsgegevens/'])assert.ok(html.includes(path),route+'/'+path);
  }
  const privacy=renderToString(React.createElement(App,{initialRoute:'privacy'}));
  assert.match(privacy,/woningfoto/i);
  assert.match(privacy,/gegevens worden niet langer bewaard/i);
  const cookies=renderToString(React.createElement(App,{initialRoute:'cookies'}));
  assert.match(cookies,/mm_beheer_session/);
  assert.match(cookies,/mm-door-design/);
 }finally{await vite.close();}
});
