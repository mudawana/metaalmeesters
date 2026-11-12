import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('unknown Netlify routes produce an actual 404, not a homepage rewrite',()=>{
 const config=fs.readFileSync('netlify.toml','utf8');
 assert.ok(!/from\s*=\s*"\/\*"/.test(config));
 assert.ok(!/to\s*=\s*"\/index\.html"/.test(config));
 const missing=fs.readFileSync('public/404.html','utf8');
 assert.match(missing,/name="robots" content="noindex,follow"/);
 assert.match(missing,/<h1>/);
 assert.match(missing,/data-url="\/"/);
 const workflow=fs.readFileSync('.github/workflows/deploy-pages.yml','utf8');
 assert.match(workflow,/cp dist\/404\.html 404\.html/);
});
