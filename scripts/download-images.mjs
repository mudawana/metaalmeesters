import fs from 'node:fs/promises';
import path from 'node:path';

const files = [
  'Metaalmeesters_Home_04.jpg',
  'Metaalmeesters_Home_02.jpg',
  'Metaalmeesters_Home_03.jpg',
  'Metaalmeesters_Home_01.jpg',
  'Metaalmeesters_Home_2_450x338.jpg',
  'deuren.jpg','deuren2.jpg','deuren3.jpg','deuren4.jpg'
];
const outputDir = 'public/images';
await fs.mkdir(outputDir, {recursive:true});
let downloads=0;
for(const file of files) {
  const original='https://metaalmeesters.eu/wp-content/uploads/2024/09/' + file;
  const cdn='https://i0.wp.com/metaalmeesters.eu/wp-content/uploads/2024/09/' + file;
  const candidates=[original,cdn];
  let valid=false;
  for(const url of candidates) {
    try {
      const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; MetaalMeesters-Site/1.0)','Accept':'image/avif,image/webp,image/jpeg,image/*;q=0.8'},signal:AbortSignal.timeout(12000)});
      if(!response.ok)throw Error('HTTP '+response.status);
      const contentType=response.headers.get('content-type')||'';
      if(!contentType.startsWith('image/'))throw Error('Geen afbeelding ('+contentType+')');
      const bytes=Buffer.from(await response.arrayBuffer());
      const jpeg=bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
      const png=bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47;
      if(!jpeg&&!png)throw Error('Ongeldig afbeeldingsformaat');
      if(bytes.length<1500)throw Error('Bestand te klein');
      await fs.writeFile(path.join(outputDir,file),bytes);
      console.log('Echte foto opgeslagen:',file,bytes.length,'bytes');
      downloads++;
      valid=true;
      break;
    }catch(e){console.warn('Bron niet bruikbaar:',url,e.message);}
  }
  if(!valid)console.warn('Fotobestand overgeslagen wegens beveiliging op bronsite:',file);
}
console.log('Totaal echte fotos:',downloads,'/',files.length);
