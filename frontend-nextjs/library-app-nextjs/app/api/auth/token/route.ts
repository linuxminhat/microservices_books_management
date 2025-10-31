import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    // Accept both legacy and current cookie names
    const token = req.cookies.get('auth_token')?.value || req.cookies.get('cfc_token')?.value;
    if (!token) return new NextResponse('Unauthorized', { status: 401 });
    // Do not verify here to avoid secret mismatch between services; backend will verify
    return NextResponse.json({ accessToken: token, idToken: token });
  } catch {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}


