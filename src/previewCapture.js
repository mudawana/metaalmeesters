// The exported image is composited from the actual on-screen photo and 3D renderer.
// It remains in the browser until explicitly sent with an eventual quote request.
export async function capturePreviewImage({max=860,quality=.78,stageId='door-canvas'}={}) {
  const stage=document.getElementById(stageId==='balustrade-canvas'?'balustrade-canvas':'door-canvas');
  const source=stage?.querySelector('canvas');
  if(!stage||!source||!source.width||!source.height)throw Error('De 3D-weergave is nog niet klaar. Probeer opnieuw.');
  const bounds=stage.getBoundingClientRect();
  if(!bounds.width||!bounds.height)throw Error('Geen geldige voorvertoning.');
  const scale=Math.min(1.7,max/Math.max(bounds.width,bounds.height));
  const output=document.createElement('canvas');
  output.width=Math.round(bounds.width*scale);
  output.height=Math.round(bounds.height*scale);
  const ctx=output.getContext('2d');
  if(!ctx)throw Error('Uw browser kan geen screenshot maken.');
  ctx.setTransform(scale,0,0,scale,0,0);
  const photo=stage.querySelector('img.house-real-photo');
  if(photo) {
    if(!photo.complete||!photo.naturalWidth)throw Error('De echte woningfoto is nog aan het laden.');
    const naturalW=photo.naturalWidth,naturalH=photo.naturalHeight;
    const cover=Math.max(bounds.width/naturalW,bounds.height/naturalH);
    const cropW=bounds.width/cover,cropH=bounds.height/cover;
    ctx.drawImage(photo,(naturalW-cropW)/2,(naturalH-cropH)/2,cropW,cropH,0,0,bounds.width,bounds.height);
  } else {
    ctx.fillStyle='#e7e5df';ctx.fillRect(0,0,bounds.width,bounds.height);
  }
  const doorBounds=source.getBoundingClientRect();
  const left=doorBounds.left-bounds.left,top=doorBounds.top-bounds.top;
  try{
    // Match the browser overlay's light/shadow adjustments in downloaded JPGs.
    const overlay=stage.querySelector('.house-door-overlay');
    const visualFilter=overlay?window.getComputedStyle(overlay).filter:'none';
    ctx.save();
    if(visualFilter&&visualFilter!=='none')ctx.filter=visualFilter;
    ctx.drawImage(source,left,top,doorBounds.width,doorBounds.height);
    ctx.restore();
  }catch{throw Error('De 3D-voorvertoning kon niet worden opgeslagen.');}
  return output.toDataURL('image/jpeg',quality);
}
