const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
}
export default async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed',{status:405});
  if (!process.env.RESEND_API_KEY || !process.env.QUOTE_FROM_EMAIL) {
    return Response.json({error:'E-maildienst nog niet ingesteld'},{status:503});
  }
  let data;
  try {data=await request.json();} catch {return Response.json({error:'Ongeldige aanvraag'},{status:400});}
  const {name,email,phone,city,notes,design}=data ?? {};
  if(!name || String(name).length>150 || !emailRegex.test(email||'') || !design ||
    !Number.isFinite(Number(design.width)) || !Number.isFinite(Number(design.height))) {
    return Response.json({error:'Ontbrekende of ongeldige velden'},{status:400});
  }
  if(Number(design.width)<500 || Number(design.width)>3600 || Number(design.height)<1400 || Number(design.height)>3500) {
    return Response.json({error:'Afmetingen buiten de demo-grenzen'},{status:400});
  }
  const designText = [
    'Type: '+String(design.type||''),'Breedte opening: '+design.width+' mm','Hoogte opening: '+design.height+' mm',
    'Kaderkleur: '+String(design.frame||''),'Glas: '+String(design.glass||''),
    'Verticale profielen: '+String(design.vertical??''),'Horizontale profielen: '+String(design.horizontal??''),
    'Handgreep: '+String(design.handle||''),'Draairichting: '+String(design.opening||'')
  ].join('\n');
  const body = 'Nieuwe MetaalMeesters 3D-deur aanvraag\n\nNaam: '+name+'\nE-mail: '+email+'\nTelefoon: '+(phone||'-')+'\nPlaats: '+(city||'-')+'\nOpmerkingen: '+(notes||'-')+'\n\n'+designText;
  if(body.length>15000)return Response.json({error:'Aanvraag te lang'},{status:400});
  try {
    const sent = await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({
        from:process.env.QUOTE_FROM_EMAIL,
        to:[process.env.QUOTE_TO_EMAIL||'info@metaalmeesters.eu'],
        reply_to:String(email),
        subject:'Nieuwe 3D-deur offerteaanvraag — '+String(name).slice(0,100),
        text:body,
        html:'<h2>Nieuwe 3D-deur offerteaanvraag</h2><pre style="font:14px/1.65 sans-serif;white-space:pre-wrap">'+escapeHtml(body)+'</pre>'
      })
    });
    if(!sent.ok)throw Error('Resend error: '+sent.status);
    return Response.json({ok:true});
  }catch(e){console.error('Mail delivery failed:',e.message);return Response.json({error:'Verzenden mislukt'},{status:502});}
};
