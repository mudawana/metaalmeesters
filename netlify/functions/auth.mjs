import {authConfigured,passwordMatches,sessionCookie,clearCookie,authorized,safeOrigin,apiJSON} from '../lib/session.mjs';

export default async function auth(req) {
  if(req.method==='GET') return apiJSON({authenticated:authorized(req),configured:authConfigured()});
  if(!safeOrigin(req))return apiJSON({error:'Ongeldige herkomst.'},403);
  if(req.method==='DELETE')return apiJSON({ok:true},200,{'Set-Cookie':clearCookie(req)});
  if(req.method!=='POST')return apiJSON({error:'Methode niet toegestaan'},405);
  if(!authConfigured())return apiJSON({error:'Beheerlogin is nog niet geconfigureerd op de server.'},503);
  let input;
  try {input=await req.json();}catch{return apiJSON({error:'Ongeldige gegevens'},400);}
  if(!passwordMatches(input?.password))return apiJSON({error:'Wachtwoord niet correct'},401);
  return apiJSON({authenticated:true},200,{'Set-Cookie':sessionCookie(req)});
}
