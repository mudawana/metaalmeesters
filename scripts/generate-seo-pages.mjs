import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {pages} from '../src/seo-routes.js';
import {LEGAL_APPROVED,isLegalPage} from '../src/legal-profile.mjs';

const target='dist';
const template=await fs.readFile(path.join(target,'index.html'),'utf8');
const isPreview=process.env.GITHUB_PAGES==='true';
const origin='https://metaalmeesters.eu';
const htmlEscape=(s)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

const localBusiness={
  '@context':'https://schema.org',
  '@type':'LocalBusiness',
  name:'MetaalMeesters',
  legalName:'Metaalmeesters BV',
  vatID:'BE1035390965',
  url:origin+'/',
  telephone:'+32472864888',
  email:'info@metaalmeesters.eu',
  address:{'@type':'PostalAddress',streetAddress:'Lange Lobroekstraat 58',postalCode:'2060',addressLocality:'Antwerpen',addressRegion:'Antwerpen',addressCountry:'BE'},
  areaServed:{'@type':'AdministrativeArea',name:'Antwerpen'}
};
const vite=await createServer({
  server:{middlewareMode:true,hmr:false},
  appType:'custom',
  logLevel:'error'
});
try{
  const {default:App}=await vite.ssrLoadModule('/src/App.jsx');
  for(const page of pages) {
    const isInteractive=page.route==='configurator';
    const markup=isInteractive
      ? '<main class="interior-page"><section class="container page-intro"><h1>Ontwerp uw stalen deur in 3D</h1><p>Kies deurtype, afmetingen, glas, kleur en profielindeling. Bekijk uw ingestelde deur in 3D en plaats ze desgewenst op uw eigen foto.</p></section></main>'
      :renderToString(React.createElement(App,{initialRoute:page.route}));
    if(!markup.includes('<h1'))throw Error('No SEO heading on '+page.path);
    const canonical=origin+page.path;
    const jsonLd=page.route==='home'||page.route==='contact'
      ? '<script type="application/ld+json">'+JSON.stringify(localBusiness).replaceAll('<','\\u003c')+'</script>'
      :'';
    const head=[
      '<meta name="description" content="'+htmlEscape(page.description)+'">',
      '<meta name="robots" content="'+(isPreview||(!LEGAL_APPROVED&&isLegalPage(page.route))?'noindex,follow':'index,follow')+'">',
      '<link rel="canonical" href="'+htmlEscape(canonical)+'">',
      '<meta property="og:type" content="website">',
      '<meta property="og:locale" content="nl_BE">',
      '<meta property="og:site_name" content="MetaalMeesters">',
      '<meta property="og:title" content="'+htmlEscape(page.title)+'">',
      '<meta property="og:description" content="'+htmlEscape(page.description)+'">',
      '<meta property="og:url" content="'+htmlEscape(canonical)+'">',
      jsonLd
    ].filter(Boolean).join('\n    ');
    let html=template.replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(page.title)+'</title>');
    html=html.replace('</head>','    '+head+'\n  </head>');
    html=html.replace('<div id="root"></div>','<div id="root" data-ssr="'+(!isInteractive)+'">'+markup+'</div>');
    if(!html.includes('data-ssr=')||!html.includes('rel="canonical"'))throw Error('SEO HTML generation incomplete: '+page.path);
    const dir=path.join(target,page.path.replace(/^\/|\/$/g,''));
    if(page.path!=='/')await fs.mkdir(dir,{recursive:true});
    await fs.writeFile(path.join(dir,'index.html'),html,'utf8');
    console.log('SEO page: '+page.path+' '+page.title);
  }
}finally{await vite.close();}
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n'+
'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
pages.filter(p=>LEGAL_APPROVED||!isLegalPage(p.route)).map(p=>'  <url><loc>'+origin+p.path+'</loc></url>').join('\n')+
'\n</urlset>\n';
await fs.writeFile(path.join(target,'sitemap.xml'),sitemap);
await fs.writeFile(path.join(target,'robots.txt'),isPreview
  ?'User-agent: *\nDisallow: /metaalmeesters/\n'
  :'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
const expected=['/','/diensten/','/projecten/','/contact/','/offerte/','/configurator/','/portfolio/project-kontich/'];
for(const slug of expected){
  const p=path.join(target,slug.replace(/^\/|\/$/g,''),'index.html');
  const html=await fs.readFile(p,'utf8');
  if(!/<h1[ >]/.test(html)||!html.includes('canonical')||!html.includes('name="description"'))
    throw Error('Missing prerendered SEO content: '+slug);
}
console.log('SEO validation complete: '+pages.length+' pages');
