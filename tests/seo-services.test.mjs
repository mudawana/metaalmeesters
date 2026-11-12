import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {servicePages,servicePagesByRoute} from '../src/seo-services.mjs';

test('six unique, topic-specific SEO pages target real customer intent',()=>{
 assert.equal(servicePages.length,6);
 assert.equal(new Set(servicePages.map(p=>p.path)).size,6);
 assert.equal(new Set(servicePages.map(p=>p.title)).size,6);
 for(const p of servicePages){
  assert.ok(p.h1.length>22,p.route);
  assert.ok(p.description.length>65&&p.description.length<190,p.route);
  assert.ok(p.sections.length>=4,p.route);
  assert.ok(p.faqs.length>=3,p.route);
  assert.ok(p.sections.every(s=>s.paragraphs.length>=1&&s.paragraphs.every(x=>x.length>100)),p.route);
  assert.ok(p.related.length>=2,p.route);
  assert.ok(p.related.every(r=>servicePagesByRoute.has(r)&&r!==p.route),p.route);
 }
});
test('SEO generator marks GitHub previews noindex and writes real production canonicals',()=>{
 const g=fs.readFileSync('scripts/generate-seo-pages.mjs','utf8');
 assert.match(g,/GITHUB_PAGES==='true'/);
 assert.match(g,/const origin='https:\/\/metaalmeesters\.eu'/);
 assert.match(g,/noindex,follow/);
 assert.match(g,/rel="canonical"/);
 assert.match(g,/BreadcrumbList/);
 assert.match(g,/'@type':'Service'/);
 assert.match(g,/name="description"/);
});
test('published preview synchronizes every landing route',()=>{
 const y=fs.readFileSync('.github/workflows/deploy-pages.yml','utf8');
 for(const p of servicePages){
  const segment=p.path.replaceAll('/','');
  assert.ok(y.includes(' '+segment+' '),segment);
 }
 assert.match(y,/noindex,follow/);
});
test('SEO landing pages really SSR with unique headings and customer answers',async()=>{
 const React=await import('react');
 const {renderToString}=await import('react-dom/server');
 const {createServer}=await import('vite');
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'});
 try{
  const {default:App}=await vite.ssrLoadModule('/src/App.jsx');
  for(const p of servicePages){
    const html=renderToString(React.createElement(App,{initialRoute:p.route}));
    assert.ok(html.includes(p.h1),p.route);
    assert.ok(html.includes(p.faqs[0].q),p.route);
    assert.ok(html.includes('configurator/'),p.route);
    assert.ok(html.includes('privacy/'),p.route);
  }
 }finally{await vite.close();}
});
