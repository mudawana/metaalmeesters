import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

const COOKIE = 'mm_beheer_session';
const LIFE = 8 * 60 * 60;
const disabled = () => !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 14 ||
  !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32;

function sign(value) {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('base64url');
}
function same(a,b) {
  const x=Buffer.from(a||'');
  const y=Buffer.from(b||'');
  return x.length===y.length && timingSafeEqual(x,y);
}
export function authConfigured() { return !disabled(); }
export function passwordMatches(password) {
  if(disabled() || typeof password!=='string' || password.length>1024) return false;
  const a=createHash('sha256').update(password).digest();
  const b=createHash('sha256').update(process.env.ADMIN_PASSWORD).digest();
  return timingSafeEqual(a,b);
}
export function sessionCookie(req) {
  const expires=Math.floor(Date.now()/1000)+LIFE;
  const token=Buffer.from(JSON.stringify({scope:'metaalmeesters-admin',exp:expires})).toString('base64url');
  const secure=new URL(req.url).protocol==='https:'?'; Secure':'';
  return COOKIE+'='+token+'.'+sign(token)+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+LIFE+secure;
}
export function clearCookie(req) {
  const secure=new URL(req.url).protocol==='https:'?'; Secure':'';
  return COOKIE+'=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+secure;
}
export function authorized(req) {
  if(disabled()) return false;
  const raw=req.headers.get('cookie')||'';
  const cookie=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));
  if(!cookie) return false;
  const value=cookie.slice(COOKIE.length+1);
  const idx=value.lastIndexOf('.');
  if(idx<0) return false;
  const data=value.slice(0,idx), signature=value.slice(idx+1);
  if(!same(signature,sign(data))) return false;
  try {
    const claims=JSON.parse(Buffer.from(data,'base64url').toString('utf8'));
    return claims.scope==='metaalmeesters-admin' &&
      Number.isFinite(claims.exp) && claims.exp > Math.floor(Date.now()/1000);
  } catch {return false;}
}
export function safeOrigin(req) {
  const origin=req.headers.get('origin');
  if(!origin) return true;
  try{return new URL(origin).origin===new URL(req.url).origin;}catch{return false;}
}
export function apiJSON(data,status=200,headers={}) {
  return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
}
