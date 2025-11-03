import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_token', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('cfc_token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}


