import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Auth Login] Request body:', { email: body.email, password: body.password ? '***' : undefined });

    const response = await fetch('https://gd.ayasglobe.com/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    console.log('[Auth Login] API Response status:', response.status);
    console.log('[Auth Login] API Response content-type:', contentType);
    
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('[Auth Login] API Response data:', data);
    } else {
      const text = await response.text();
      console.error('[Auth Login] API Response is not JSON:', text.substring(0, 200));
      return NextResponse.json(
        { error: `API error: Server returned ${contentType || 'unknown'} instead of JSON` },
        { status: response.status }
      );
    }

    if (!response.ok) {
      console.error('[Auth Login] API error response:', { status: response.status, data });
      return NextResponse.json(data || { error: 'Authentication failed' }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Auth Login] Proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Authentication failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
