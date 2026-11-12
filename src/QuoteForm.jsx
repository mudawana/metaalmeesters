import React,{useState} from 'react';
import {Send,ShieldCheck} from 'lucide-react';
import {capturePreviewImage} from './previewCapture.js';
import {onsiteMeasureNote} from './measurement-units.mjs';
import {pageHref} from './seo-routes.js';

export default function QuoteForm({design,product='deur',stageId='door-canvas'}) {
  const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[city,setCity]=useState(''),[notes,setNotes]=useState(''),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[success,setSuccess]=useState(false),[website,setWebsite]=useState('');
  async function submit(e) {
    e.preventDefault();if(!consent||busy||success)return;
    setBusy(true);setStatus('');
    try {
      if(location.hostname.endsWith('github.io'))
        throw Error('Dit is de openbare ontwerp-demo. Aanvragen worden pas opgeslagen nadat de privé-offerteserver op Netlify is aangesloten.');
      const image=await capturePreviewImage({max:860,quality:0.78,stageId});
      const response=await fetch('/.netlify/functions/quotes',{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,phone,city,notes,product,design,image,consent,website})
      });
      if(!(response.headers.get('content-type')||'').includes('application/json'))
        throw Error('De offerteserver is nog niet aangesloten. Uw gegevens zijn niet verzonden.');
      const result=await response.json();
      if(!response.ok)throw Error(result.error||'De aanvraag kon niet worden opgeslagen.');
      setSuccess(true);
      setStatus('Uw aanvraag is veilig opgeslagen bij MetaalMeesters! Referentie: '+result.reference.slice(-12)+'. Wij nemen contact met u op.');
    } catch(err) {setStatus(err.message||'Verzenden mislukt. Probeer opnieuw.');}
    finally {setBusy(false);}
  }
  const isStaticDemo=typeof window!=='undefined' && window.location.hostname.endsWith('github.io');
  return <form className="quote-form" onSubmit={submit}>
    {isStaticDemo&&<p className="form-status form-status-error" role="status">Voorbeeldwebsite: echte offerteaanvragen zijn hier nog niet actief. Zodra de site met het privéportaal op Netlify staat, kunt u veilig verzenden.</p>}
    <div className="quote-note"><ShieldCheck size={20}/><div><strong>Vrijblijvende offerte op maat · exacte opmeting door ons</strong><span>{onsiteMeasureNote()} Er worden geen automatische prijzen berekend.</span></div></div>
    <div className="field-grid"><label>Naam *<input required autoComplete="name" maxLength={150} value={name} onChange={e=>setName(e.target.value)} placeholder="Uw volledige naam"/></label><label>E-mailadres *<input required type="email" autoComplete="email" maxLength={260} value={email} onChange={e=>setEmail(e.target.value)} placeholder="uw@email.be"/></label></div>
    <div className="field-grid"><label>Telefoonnummer<input type="tel" autoComplete="tel" maxLength={100} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+32 ..."/></label><label>Gemeente<input maxLength={150} value={city} onChange={e=>setCity(e.target.value)} placeholder="Waar komt uw project?"/></label></div>
    <label>Extra informatie<textarea value={notes} maxLength={1800} onChange={e=>setNotes(e.target.value)} rows="3" placeholder="Vertel gerust wat meer over uw project..."/></label>
    <div className="mm-honeypot" aria-hidden="true"><label>Laat dit veld leeg<input tabIndex="-1" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
    <label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>Ik heb de <a href={pageHref('privacy')} target="_blank" rel="noopener noreferrer">privacyverklaring</a> gelezen. Ik begrijp dat MetaalMeesters mijn contactgegevens en gekozen ontwerp (met eventuele eigen foto in de afbeelding) verwerkt om mijn offerteaanvraag te behandelen. *</span></label>
    <button type="submit" disabled={busy||!consent||success||isStaticDemo} className="btn btn-dark submit-btn">{isStaticDemo?'Aanvragen binnenkort beschikbaar':busy?'Aanvraag veilig opslaan...':success?'Aanvraag opgeslagen':'Verzend offerteaanvraag'} <Send size={17}/></button>
    {status&&<p className={'form-status '+(!success?'form-status-error':'')} role="status">{status}</p>}
  </form>;
}
