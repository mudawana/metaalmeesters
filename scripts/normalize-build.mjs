import fs from 'node:fs/promises';

const built='dist/site.source.html';
const target='dist/index.html';
await fs.rename(built,target);
const content=await fs.readFile(target,'utf8');
if(/\/src\/main\.jsx/.test(content) || !/\/assets\//.test(content)) {
  throw Error('De build bevat geen gecompileerde JS/CSS assets.');
}
console.log('Compiled index.html ready for GitHub Pages / Vite preview');
