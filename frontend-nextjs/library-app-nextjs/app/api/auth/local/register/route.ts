import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const email = (raw.email || '').trim();
    const password = (raw.password || '').trim();
    const fullName = (raw.fullName || raw.name || (email ? email.split('@')[0] : '')).trim();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const res = await fetch(`${API_CONFIG.AUTH_SERVICE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });
    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ error: msg || 'Registration failed' }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}


