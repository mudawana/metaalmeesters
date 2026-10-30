import fs from 'node:fs/promises';
import path from 'node:path';

const files = [
  'Metaalmeesters_Home_04.jpg',
  'Metaalmeesters_Home_02.jpg',
  'Metaalmeesters_Home_03.jpg',
  'Metaalmeesters_Home_01.jpg',
  'Metaalmeesters_Home_2_450x338.jpg',
  'deuren.jpg',
  'deuren2.jpg',
  'deuren3.jpg',
  'deuren4.jpg'
];
const outputDir = 'public/images';
await fs.mkdir(outputDir,{recursive:true});
let failures = 0;
for (const file of files) {
  const url = 'https://metaalmeesters.eu/wp-content/uploads/2024/09/' + file;
  const target = path.join(outputDir,file);
  try {
    const res = await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; MetaalMeesters-Demo/1.0)'}, signal:AbortSignal.timeout(18000)});
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = Buffer.from(await res.arrayBuffer());
    if(data.byteLength < 1000) throw new Error('Onverwacht klein bestand');
    await fs.writeFile(target,data);
    console.log('Gedownload:',file,data.byteLength,'bytes');
  } catch(e) {
    failures++;
    console.error('Niet beschikbaar:',file,e.message);
  }
}
if(failures) console.warn('Aantal mislukte downloads:',failures,'— website gebruikt dan een originele externe fallback.');
