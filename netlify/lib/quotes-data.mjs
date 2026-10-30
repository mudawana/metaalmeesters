import { getStore } from '@netlify/blobs';
export const STAGES = ['nieuw','in behandeling','offerte verstuurd','afgerond'];
const REGION=process.env.BLOBS_REGION || 'eu-central-1';
function store() {return getStore({name:'metaalmeesters-offerteaanvragen',region:REGION,consistency:'strong'});}
export async function putQuote(q) {await store().setJSON(q.id,q);}
export async function getQuote(id) {return store().get(id,{type:'json'});}
export async function deleteQuote(id) {await store().delete(id);}
export async function listQuotes() {
  const items=await store().list();
  const keys=items.blobs.map(x=>x.key).sort().reverse().slice(0,250);
  const docs=await Promise.all(keys.map(key=>getQuote(key)));
  return docs.filter(Boolean).map(({image,...rest})=>({...rest,hasImage:!!image}));
}
export function summary(quote) {
  const {id,createdAt,status,name,email,phone,city,design,notification}=quote;
  return {id,createdAt,status,name,email,phone,city,design,notification,hasImage:!!quote.image};
}
