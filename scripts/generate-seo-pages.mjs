import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {pages} from '../src/seo-routes.js';
import {servicePagesByRoute} from '../src/seo-services.mjs';
import {LEGAL_APPROVED,isLegalPage} from '../src/legal-profile.mjs';

const target='dist';
const template=await fs.readFile(path.join(target,'index.html'),'utf8');
const isGitHubPreview=process.env.GITHUB_PAGES==='true';
// Until the business explicitly launches metaalmeesters.eu, Netlify is a test
// environment. Do not index .netlify.app or the temporary .be domain.
const netlifyUrl=(process.env.URL||'').replace(/\/$/,'');
const isNetlifyPreview=process.env.NETLIFY==='true' &&
  !/^https:\/\/(?:www\.)?metaalmeesters\.eu$/i.test(netlifyUrl);
const isPreview=isGitHubPreview||isNetlifyPreview;
const origin='https://metaalmeesters.eu';
const htmlEscape=(s)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

const localBusiness={
  '@context':'https://schema.org',
  '@type':'LocalBusiness',
  '@id':origin+'/#company',
  name:'MetaalMeesters',
  legalName:'Metaalmeesters BV',
  vatID:'BE1035390965',
  identifier:'1035390965',
  url:origin+'/',
  telephone:'+32472864888',
  email:'info@metaalmeesters.eu',
  address:{'@type':'PostalAddress',streetAddress:'Lange Lobroekstraat 58',postalCode:'2060',addressLocality:'Antwerpen',addressRegion:'Antwerpen',addressCountry:'BE'},
  areaServed:{'@type':'AdministrativeArea',name:'Antwerpen'},
  image:origin+'/images/Metaalmeesters_Home_04.jpg'
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
      ? '<main class="interior-page"><section class="container page-intro"><h1>Ontwerp een stalen deur of balustrade in 3D</h1><p>Kies eerst een stalen deur of balustrade. Stel daarna het ontwerp samen en vraag een vrijblijvende offerte op maat aan.</p></section></main>'
      :renderToString(React.createElement(App,{initialRoute:page.route}));
    if(!markup.includes('<h1'))throw Error('No SEO heading on '+page.path);
    const canonical=origin+page.path;
    const service=servicePagesByRoute.get(page.route);
    const schema=[];
    if(page.route==='home'||page.route==='contact'||page.route==='over-ons'){
      schema.push(localBusiness);
      if(page.route==='home')schema.push({
        '@context':'https://schema.org','@type':'WebSite',
        '@id':origin+'/#website',url:origin+'/',name:'MetaalMeesters',
        inLanguage:'nl-BE',publisher:{'@id':origin+'/#company'}
      });
    }
    if(page.route==='over-ons')schema.push({
      '@context':'https://schema.org','@type':'BreadcrumbList',
      itemListElement:[
        {'@type':'ListItem',position:1,name:'Home',item:origin+'/'},
        {'@type':'ListItem',position:2,name:'Over ons',item:canonical}
      ]
    });
    if(service){
      schema.push({
        '@context':'https://schema.org','@type':'Service',
        '@id':canonical+'#service',name:service.h1,serviceType:service.h1,
        description:service.description,url:canonical,
        provider:{'@id':origin+'/#company'},
        areaServed:{'@type':'AdministrativeArea',name:'Antwerpen'}
      });
      schema.push({
        '@context':'https://schema.org','@type':'BreadcrumbList',
        itemListElement:[
          {'@type':'ListItem',position:1,name:'Home',item:origin+'/'},
          {'@type':'ListItem',position:2,name:'Diensten',item:origin+'/diensten/'},
          {'@type':'ListItem',position:3,name:service.h1,item:canonical}
        ]
      });
    }
    const jsonLd=schema.map(node=>'<script type="application/ld+json">'+
       JSON.stringify(node).replaceAll('<','\\u003c')+'</script>').join('\n    ');
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
      '<meta property="og:image" content="'+origin+'/images/Metaalmeesters_Home_04.jpg">',
      '<meta property="og:image:alt" content="Maatwerk in staal en glas van MetaalMeesters">',
      '<meta name="twitter:card" content="summary_large_image">',
      jsonLd
    ].filter(Boolean).join('\n    ');
    let html=template.replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(page.title)+'</title>');
    html=html.replace(/<meta name="description" content="[^"]*"\s*\/>/,'');
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
await fs.writeFile(path.join(target,'robots.txt'),isGitHubPreview
  ?'User-agent: *\nDisallow: /metaalmeesters/\n'
  :isNetlifyPreview
    ?'User-agent: *\nAllow: /\n'
    :'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
const expected=['/','/diensten/','/projecten/','/contact/','/offerte/','/configurator/','/portfolio/project-kontich/','/over-ons/',...Array.from(servicePagesByRoute.values(),p=>p.path)];
for(const slug of expected){
  const p=path.join(target,slug.replace(/^\/|\/$/g,''),'index.html');
  const html=await fs.readFile(p,'utf8');
  if(!/<h1[ >]/.test(html)||!html.includes('canonical')||!html.includes('name="description"'))
    throw Error('Missing prerendered SEO content: '+slug);
}
console.log('SEO validation complete: '+pages.length+' pages');
