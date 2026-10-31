import fs from 'node:fs/promises';
import path from 'node:path';

const photos=[
  {
    "id": "lichte-inkom",
    "file": "lichte-inkom.jpg",
    "photo_id": "5691591",
    "url": "https://images.pexels.com/photos/5691591/pexels-photo-5691591.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "source": "https://www.pexels.com/photo/interior-of-new-cozy-apartment-5691591/",
    "by": "Ksenia Chernaya",
    "type": "Echte appartementfoto · lege deuropening"
  },
  {
    "id": "moderne-voordeur",
    "file": "moderne-voordeur.jpg",
    "photo_id": "36777846",
    "url": "https://images.pexels.com/photos/36777846/pexels-photo-36777846/free-photo-of-modern-front-entrance-with-wooden-door.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "source": "https://www.pexels.com/photo/modern-front-entrance-with-wooden-door-36777846/",
    "by": "Curtis Adams",
    "type": "Echte moderne woning · bestaande houten deur"
  },
  {
    "id": "klassieke-inkom",
    "file": "klassieke-inkom.jpg",
    "photo_id": "9459176",
    "url": "https://images.pexels.com/photos/9459176/pexels-photo-9459176.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "source": "https://www.pexels.com/photo/entrance-to-a-house-9459176/",
    "by": "Erik Mclean",
    "type": "Echte klassieke woning · bestaande inkomdeur"
  },
  {
    "id": "woning-tuin",
    "file": "woning-tuin.jpg",
    "photo_id": "8031873",
    "url": "https://images.pexels.com/photos/8031873/pexels-photo-8031873.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "source": "https://www.pexels.com/photo/front-exterior-of-a-family-home-8031873/",
    "by": "Curtis Adams",
    "type": "Echte gezinswoning · frontaal exterieur"
  }
];
const destination=path.resolve('public/homes');
await fs.mkdir(destination,{recursive:true});
let total=0;
for(const item of photos) {
  const target=path.join(destination,item.file);
  console.log('Downloading Pexels #'+item.photo_id+' from '+item.url);
  try {
    const response=await fetch(item.url,{
      headers:{'User-Agent':'Mozilla/5.0 (MetaalMeesters/1.0; curated licensed photographs)','Accept':'image/jpeg,image/*'},
      signal:AbortSignal.timeout(25000)
    });
    if(!response.ok)throw Error('HTTP '+response.status);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length<30000||bytes.length>15000000)throw Error('Unexpected image size '+bytes.length);
    if(!(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff))throw Error('Not a real JPEG');
    await fs.writeFile(target,bytes);
    console.log('Saved '+target+' '+bytes.length+' bytes');
    total++;
  }catch(e){console.error('FAILED '+item.photo_id+': '+e.message);}
}
if(total!==photos.length) {
  console.error('Expected '+photos.length+' genuine JPEG photos, got '+total);
  process.exitCode=1;
}else{
  console.log('All '+total+' licensed Pexels photos imported.');
}
