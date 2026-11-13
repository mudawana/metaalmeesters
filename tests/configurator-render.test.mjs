import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createServer} from 'vite';

// The interactive configurator is mounted by the browser.
// Render the chooser in CI so a broken import does not result in a blank screen.
test('configurator starts with two real product choices',async()=>{
 const vite=await createServer({
   server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'
 });
 try {
   const {default:App}=await vite.ssrLoadModule('/src/App.jsx');
   const html=renderToString(React.createElement(App,{initialRoute:'configurator'}));
   assert.match(html,/Wat wilt u/);
   assert.match(html,/Stalen deur/);
   assert.match(html,/Balustrade/);
   assert.match(html,/Ontwerp uw balustrade/);
   assert.match(html,/product-choice-card/);
   assert.match(html,/metaalmeesters-deuren-eigen-foto\.avif/);
   assert.match(html,/atelier-choice-page/);
   assert.match(html,/atelier-choice-cta/);
   assert.match(html,/Digitaal sfeerbeeld/);

 }finally{await vite.close();}
});
