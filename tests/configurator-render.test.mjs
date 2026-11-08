import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createServer} from 'vite';

// The SEO build deliberately skips server rendering the interactive route.
// This test renders it so missing JSX imports (which cause blank screens)
// fail in CI before the site is published.
test('interactive configurator renders the first step without runtime errors',async()=>{
 const vite=await createServer({
   server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'
 });
 try {
   const {default:App}=await vite.ssrLoadModule('/src/App.jsx');
   const html=renderToString(React.createElement(App,{initialRoute:'configurator'}));
   assert.match(html,/aria-valuenow="1"/); // React SSR inserts comment nodes between numeric text
   assert.match(html,/Uw deur in/);
   assert.match(html,/Volgende: Afmetingen/);
   assert.match(html,/Bekijk uw 3D-voorbeeld/);
   assert.match(html,/Enkele deur/);
 }finally{await vite.close();}
});
