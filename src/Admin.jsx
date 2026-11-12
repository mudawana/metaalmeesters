import React, {useCallback,useEffect,useRef,useState} from 'react';
import {GLASSES,FRAMES,HANDLES,CLOSURES,PANEL_LAYOUTS} from './product-options.mjs';
import {cmLabel} from './measurement-units.mjs';
import {hasLeftReturn,hasRightReturn,totalRailingLengthMm} from './balustrade-geometry.mjs';
import {balustradeTypeLabel,balustradeInfillLabel,balustradeColorLabel,BAL_LAYOUTS,BAL_GLASS,BAL_HANDRAILS,BAL_MOUNT} from './balustrade-options.mjs';
import {ArrowLeft,ArrowRight,Archive,CheckCircle2,Clock3,Download,Eye,Inbox,LockKeyhole,LogOut,Mail,Phone,RefreshCcw,Search,ShieldCheck,Trash2, X} from 'lucide-react';

const API='/.netlify/functions/';
const STAGES=['nieuw','in behandeling','offerte verstuurd','afgerond'];
async function jsonRequest(path,options={}) {
  const response=await fetch(API+path,{credentials:'same-origin',cache:'no-store',...options});
  let data;
  try {data=await response.json();}catch{throw Error('Deze website heeft nog geen aangesloten offerte-server. De privéomgeving werkt na publicatie op Netlify.');}
  if(!response.ok)throw Error(data.error||'De server kon de aanvraag niet verwerken.');
  return data;
}
const readableDate=date=>{try{return new Intl.DateTimeFormat('nl-BE',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(date));}catch{return date;}};
const typeLabel={enkel:'Enkele deur',dubbel:'Dubbele deur',schuif:'Schuifdeur',pivot:'Pivotdeur',wand:'Glaswand met deur'};
const isBalustrade=q=>q.product==='balustrade'||q.design?.category==='balustrade';
const requestLabel=q=>isBalustrade(q)?balustradeTypeLabel(q.design?.type):typeLabel[q.design?.type]||'Stalen deur';

function Detail({quote,onBack,onChanged}) {
  const [status,setStatus]=useState(quote.status),[saving,setSaving]=useState(false),[message,setMessage]=useState('');
  const balustrade=isBalustrade(quote);
  async function updateStatus(next) {
    setSaving(true);setMessage('');
    try{
      await jsonRequest('quotes?id='+encodeURIComponent(quote.id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:next})});
      setStatus(next);onChanged(next);
    }catch(e){setMessage(e.message);}
    finally{setSaving(false);}
  }
  function exportQuote() {
    const a=document.createElement('a');
    const blob=new Blob([JSON.stringify({...quote,image:undefined},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);a.href=url;a.download='offerte-'+quote.id+'.json';a.click();URL.revokeObjectURL(url);
  }
  return <div className="admin-detail">
    <div className="admin-detail-bar"><button onClick={onBack} className="admin-back"><ArrowLeft size={18}/> Alle aanvragen</button><button onClick={exportQuote} className="admin-secondary"><Download size={15}/> Download gegevens</button></div>
    <div className="admin-detail-heading"><div><span className="eyebrow">OFFERTEAANVRAAG</span><h2>{quote.name}</h2><p>Ontvangen op {readableDate(quote.createdAt)} · Referentie: {quote.id.slice(-12)}</p></div><span className={'admin-status status-'+status.replaceAll(' ','-')}>{status}</span></div>
    <div className="admin-detail-grid">
      <section className="admin-white-card"><h3>{balustrade?'3D-voorbeeld van de balustrade':'Afbeelding van de ontworpen deur'}</h3>{quote.image?<img className="admin-door-image" src={quote.image} alt={'3D-'+(balustrade?'balustradeontwerp':'deurontwerp')+' van '+quote.name}/>:<p>Voor deze aanvraag is geen afbeelding beschikbaar.</p>}<div className="admin-image-caption"><ShieldCheck size={15}/> Alleen zichtbaar na aanmelden in het beheerportaal.</div></section>
      <div className="admin-detail-stack">
        <section className="admin-white-card"><h3>Klantgegevens</h3><div className="admin-data-row"><span>Naam</span><strong>{quote.name}</strong></div><div className="admin-data-row"><span>E-mail</span><a href={'mailto:'+quote.email}>{quote.email}</a></div><div className="admin-data-row"><span>Telefoon</span>{quote.phone?<a href={'tel:'+quote.phone}>{quote.phone}</a>:<strong>—</strong>}</div><div className="admin-data-row"><span>Gemeente</span><strong>{quote.city||'—'}</strong></div><div className="admin-data-row"><span>Opmerkingen</span><strong className="admin-notes">{quote.notes||'—'}</strong></div></section>
        {balustrade?<section className="admin-white-card"><h3>Balustradespecificaties</h3>
          <p className="admin-mini">Indicatieve afmetingen in cm · opmeting, veiligheid en definitieve prijs ter plaatse te bepalen.</p>
          {[
            ['Type',balustradeTypeLabel(quote.design?.type)],
            ['Toepassing',quote.design?.placement==='buiten'?'Buiten':'Binnen'],
            ['Verloop',quote.design?.type==='trap'?'Rechte trapbalustrade':BAL_LAYOUTS.find(x=>x.id===(quote.design?.layout||'recht'))?.label||'Rechte opstelling'],
            ['Voorzijde (indicatie)',cmLabel(quote.design?.length)],
            ...(hasLeftReturn(quote.design?.layout)?[['Linkerzijde (indicatie)',cmLabel(quote.design?.sideLeft)]]:[]),
            ...(hasRightReturn(quote.design?.layout)?[['Rechterzijde (indicatie)',cmLabel(quote.design?.sideRight)]]:[]),
            ['Totale lengte (indicatie)',cmLabel(totalRailingLengthMm(quote.design||{}))],
            ['Gewenste hoogte (indicatie)',cmLabel(quote.design?.height)],
            ['Invulling',balustradeInfillLabel(quote.design?.infill)],
            ...(quote.design?.infill==='glas'?[['Glasuitstraling',BAL_GLASS.find(x=>x.id===quote.design?.glass)?.label||'Nader te bepalen']]:[]),
            ['Kleur',balustradeColorLabel(quote.design?.color)],
            ...(quote.design?.color==='andere'?[['Gewenste kleur',quote.design?.customColor||'Nog te bepalen']]:[]),
            ['Handregel',BAL_HANDRAILS.find(x=>x.id===quote.design?.handrail)?.label||'Nader te bepalen'],
            ['Bevestiging',BAL_MOUNT.find(x=>x.id===quote.design?.mount)?.label||'Nader te bepalen']
          ].map(([key,value])=><div className="admin-data-row" key={key}><span>{key}</span><strong>{value}</strong></div>)}
        </section>:<section className="admin-white-card"><h3>Deurspecificaties</h3><p className="admin-mini">Indicatieve maten in cm · MetaalMeesters komt zelf opmeten vóór productie.</p>{[
          ['Type',typeLabel[quote.design?.type]||'—'],
          ['Breedte (indicatie)',cmLabel(quote.design?.width)],['Hoogte (indicatie)',cmLabel(quote.design?.height)],
          ['Bovenvorm',quote.design?.topShape==='boog'?'Boog':'Recht'],
          ...(quote.design?.topShape==='boog'?[['Boogvorm','Exact op te meten door MetaalMeesters']]:[]),
          ...(quote.design?.type==='wand'?[['Geïntegreerde deur',cmLabel(quote.design.doorWidth)]]:[]),
          ['Glas',GLASSES.find(x=>x.id===quote.design?.glass)?.label||quote.design?.glass],
          ['Glasopbouw',GLASSES.find(x=>x.id===quote.design?.glass)?.safety||'Te bevestigen'],
          ['Kader',FRAMES.find(x=>x.id===quote.design?.frame)?.label||quote.design?.frame],
          ['Deurvulling',PANEL_LAYOUTS.find(x=>x.id===quote.design?.panelLayout)?.label||'Volledig glas'],
          ...(quote.design?.panelLayout==='staal-onder'?[['Stalen onderpaneel',cmLabel(quote.design.lowerPanelHeight)]]:[]),
          ['Verticaal',quote.design?.vertical+' verdelingen'],
          ['Horizontaal',quote.design?.horizontal+' verdelingen'],
          ['Handgreep',HANDLES.find(x=>x.id===quote.design?.handle)?.label||quote.design?.handle],
          ['Sluiting',CLOSURES.find(x=>x.id===quote.design?.closure)?.label||'Nog niet opgegeven'],
          ['Draairichting',quote.design?.opening]
        ].map(([key,value])=><div className="admin-data-row" key={key}><span>{key}</span><strong>{value}</strong></div>)}</section>}
        <section className="admin-white-card"><h3>Verwerking</h3><label className="admin-label">Status van deze offerte<select value={status} disabled={saving} onChange={e=>updateStatus(e.target.value)}>{STAGES.map(x=><option key={x}>{x}</option>)}</select></label><p className="admin-mini">E-mailmelding: {quote.notification||'onbekend'}.</p><a className="admin-email-link" href={'mailto:'+quote.email+'?subject='+encodeURIComponent('Uw offerteaanvraag bij MetaalMeesters')}>Beantwoord deze klant <Mail size={16}/></a>{message&&<p className="admin-error">{message}</p>}</section>
      </div>
    </div>
  </div>;
}
function Dashboard({onLogout}) {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[selected,setSelected]=useState(null),[filter,setFilter]=useState('alle'),[productFilter,setProductFilter]=useState('alle'),[query,setQuery]=useState(''),[newNotice,setNewNotice]=useState(0);
  const loadedOnce=useRef(false),idsRef=useRef(new Set());
  const refresh=useCallback(async()=>{
    try{
      const data=await jsonRequest('quotes');
      const list=data.quotes||[];
      if(loadedOnce.current) {
        const incoming=list.filter(x=>!idsRef.current.has(x.id));
        if(incoming.length) {
          setNewNotice(incoming.length);
          if('Notification' in window && Notification.permission==='granted')
            new Notification('Nieuwe offerteaanvraag bij MetaalMeesters',{body:incoming.length+' nieuwe aanvraag/aanvragen.'});
        }
      }
      idsRef.current=new Set(list.map(x=>x.id));
      loadedOnce.current=true;
      setItems(list);setError('');
    } catch(e){setError(e.message);}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{refresh();const timer=setInterval(refresh,45000);return()=>clearInterval(timer);},[refresh]);
  async function openQuote(id) {
    setError('');
    try{const {quote}=await jsonRequest('quotes?id='+encodeURIComponent(id));setSelected(quote);setNewNotice(0);}
    catch(e){setError(e.message);}
  }
  async function removeQuote(id) {
    if(!window.confirm('Deze aanvraag en de privéfoto definitief verwijderen?'))return;
    try{await jsonRequest('quotes?id='+encodeURIComponent(id),{method:'DELETE'});setSelected(null);refresh();}
    catch(e){setError(e.message);}
  }
  const filtered=items.filter(x=>(filter==='alle'||x.status===filter)&&(productFilter==='alle'||(productFilter==='balustrade'?isBalustrade(x):!isBalustrade(x)))&&[x.name,x.email,x.city,x.id,x.product,x.design?.type,x.design?.infill].join(' ').toLowerCase().includes(query.toLowerCase()));
  const newCount=items.filter(x=>x.status==='nieuw').length;
  return <div className="admin-shell container">
    <div className="admin-top"><div><span className="eyebrow">PRIVÉ · METAALMEESTERS</span><h1>Offerte<em>portaal.</em></h1><p>Uw aanvragen, afmetingen en 3D-ontwerpen op één plek.</p></div><div className="admin-top-actions"><button className="admin-secondary" onClick={refresh}><RefreshCcw size={16}/> Vernieuwen</button><button className="admin-secondary" onClick={onLogout}><LogOut size={16}/> Uitloggen</button></div></div>
    <div className="admin-metrics"><div><span>Totaal aanvragen</span><strong>{items.length}</strong></div><div><span>Nieuw</span><strong>{newCount}</strong></div><div><span>In behandeling</span><strong>{items.filter(x=>x.status==='in behandeling').length}</strong></div><div><span>Offerte verstuurd</span><strong>{items.filter(x=>x.status==='offerte verstuurd').length}</strong></div></div>
    {newNotice>0&&<div className="admin-alert"><Inbox size={17}/>{newNotice} nieuwe aanvraag/aanvragen sinds uw vorige controle. <button onClick={()=>setNewNotice(0)}>Verbergen</button></div>}
    {error&&<p className="admin-error" role="alert">{error}</p>}
    {selected?<><Detail quote={selected} onBack={()=>{setSelected(null);refresh();}} onChanged={status=>{setSelected(s=>({...s,status}));setItems(a=>a.map(q=>q.id===selected.id?{...q,status}:q));}}/><button className="admin-danger" onClick={()=>removeQuote(selected.id)}><Trash2 size={16}/> Aanvraag definitief verwijderen</button></>:
      <section className="admin-list-card">
        <div className="admin-list-tools"><div className="admin-search"><Search size={18}/><input aria-label="Zoek aanvragen" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zoek op naam, e-mail of referentie..."/></div><select aria-label="Filter op product" value={productFilter} onChange={e=>setProductFilter(e.target.value)}><option value="alle">Alle producten</option><option value="deur">Stalen deuren</option><option value="balustrade">Balustrades</option></select><select aria-label="Filter op status" value={filter} onChange={e=>setFilter(e.target.value)}><option value="alle">Alle statussen</option>{STAGES.map(x=><option key={x}>{x}</option>)}</select></div>
        {loading?<div className="admin-empty">Aanvragen ophalen...</div>:filtered.length===0?<div className="admin-empty"><Inbox size={36}/><h3>Geen aanvragen gevonden</h3><p>Zodra een klant een ontwerp verstuurt, verschijnt het hier automatisch.</p></div>:
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Klant</th><th>Product</th><th>Afmetingen</th><th>Datum</th><th>Status</th><th/></tr></thead><tbody>{filtered.map(item=><tr key={item.id} onClick={()=>openQuote(item.id)} tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')openQuote(item.id);}}>
            <td><strong>{item.name}</strong><small>{item.email}</small></td><td><strong>{isBalustrade(item)?'Balustrade':'Stalen deur'}</strong><small>{requestLabel(item)}</small></td><td>{isBalustrade(item)?cmLabel(item.design?.length)+' × '+cmLabel(item.design?.height):cmLabel(item.design?.width)+' × '+cmLabel(item.design?.height)}</td><td>{readableDate(item.createdAt)}</td><td><span className={'admin-status status-'+item.status.replaceAll(' ','-')}>{item.status}</span></td><td><Eye size={18}/></td>
          </tr>)}</tbody></table></div>}
      </section>}
    <div className="admin-bottom-hint"><ShieldCheck size={16}/> De inhoud van dit portaal is enkel via een beveiligde sessie toegankelijk. <span>De lijst toont maximaal 250 recentste aanvragen.</span></div>
  </div>;
}
export default function Admin() {
  const [ready,setReady]=useState(false),[loggedIn,setLoggedIn]=useState(false),[configured,setConfigured]=useState(true),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{let live=true;jsonRequest('auth').then(data=>{if(live){setLoggedIn(!!data.authenticated);setConfigured(!!data.configured);}}).catch(e=>{if(live)setError(e.message);}).finally(()=>{if(live)setReady(true);});return()=>{live=false;};},[]);
  async function login(e) {
    e.preventDefault();setBusy(true);setError('');
    try{await jsonRequest('auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});setPassword('');setLoggedIn(true);}
    catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  async function logout() {
    try{await jsonRequest('auth',{method:'DELETE'});}catch{}
    setLoggedIn(false);setPassword('');
  }
  if(!ready)return <main className="admin-page"><div className="admin-login-card"><p>Beveiligde omgeving laden...</p></div></main>;
  if(loggedIn)return <main className="admin-page"><Dashboard onLogout={logout}/></main>;
  return <main className="admin-page admin-login"><form className="admin-login-card" onSubmit={login}><div className="admin-login-icon"><LockKeyhole size={27}/></div><span className="eyebrow">UITSLUITEND VOOR METAALMEESTERS</span><h1>Welkom <em>terug.</em></h1><p>Log in om nieuwe offerteaanvragen, klantgegevens en deurfoto's te bekijken.</p><label>Beheerwachtwoord<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" placeholder="Uw privé-wachtwoord" disabled={!configured}/></label><button className="btn btn-dark" type="submit" disabled={busy||!configured}>{busy?'Aanmelden...':'Aanmelden'} <ArrowRight size={17}/></button>{error&&<p className="admin-error" role="alert">{error}</p>}{!configured&&!error&&<p className="admin-error">De serverbeheerder moet eerst een beheerwachtwoord en sessiesleutel instellen op Netlify.</p>}<small><ShieldCheck size={14}/> Offertes en afbeeldingen zijn privé en niet openbaar.</small></form></main>;
}
