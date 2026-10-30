import test from 'node:test';
import assert from 'node:assert/strict';
import {passwordMatches,sessionCookie,authorized,clearCookie} from '../netlify/lib/session.mjs';

test('admin session is HttpOnly and invalid passwords are rejected', () => {
  process.env.ADMIN_PASSWORD='a long secret passphrase for the dashboard';
  process.env.ADMIN_SESSION_SECRET='this-session-signing-secret-is-at-least-32-characters';
  assert.equal(passwordMatches('incorrect'),false);
  assert.equal(passwordMatches(process.env.ADMIN_PASSWORD),true);
  const req=new Request('https://example.netlify.app/.netlify/functions/auth');
  const cookie=sessionCookie(req);
  assert.match(cookie,/HttpOnly/); assert.match(cookie,/SameSite=Strict/);assert.match(cookie,/Secure/);
  const signed=cookie.split(';')[0];
  assert.equal(authorized(new Request(req.url,{headers:{cookie:signed}})),true);
  assert.equal(authorized(new Request(req.url,{headers:{cookie:signed+'tampered'}})),false);
  assert.match(clearCookie(req),/Max-Age=0/);
});
