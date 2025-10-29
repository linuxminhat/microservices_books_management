import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-local-secret-change-me';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cfc_token')?.value;
    if (!token) return new NextResponse('Unauthorized', { status: 401 });
    // verify once before returning
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ accessToken: token });
  } catch {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}


