import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    console.log('[Auth Register] Request body received');

    const response = await fetch('https://gd.ayasglobe.com/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Auth Register] API Response status:', response.status);
    console.log('[Auth Register] API Response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Auth Register] Proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to register user: ${errorMessage}` },
      { status: 500 }
    );
  }
}
