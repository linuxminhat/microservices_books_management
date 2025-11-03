import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';

export async function POST(req: NextRequest) {
    try {
        const raw = await req.json();
        const body = { email: (raw.email || '').trim(), password: (raw.password || '').trim() };
        const res = await fetch(`${API_CONFIG.AUTH_SERVICE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const msg = await res.text();
            return NextResponse.json({ error: msg || 'Invalid credentials' }, { status: 400 });
        }
        const data = await res.json();
        const resp = NextResponse.json({ user: { email: data.email, name: data.fullName, roles: [data.role] } }, { status: 200 });
        resp.cookies.set('auth_token', data.token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
        return resp;
    } catch {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
}




