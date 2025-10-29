import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ message: 'No session' }, { status: 401 });
  const res = await fetch(`${API_CONFIG.AUTH_SERVICE}/validate`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  const payload = await res.json();
  return NextResponse.json({ email: payload.email, name: payload.fullName, roles: [payload.role], sub: String(payload.userId) });
}


