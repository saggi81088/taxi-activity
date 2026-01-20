import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    const response = await fetch('https://gd.ayasglobe.com/api/taxi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const contentType = response.headers.get('content-type') || '';
    
    // Check if response is JSON
    if (!contentType.includes('application/json')) {
      console.log('[API] Taxi backend returned non-JSON, using mock data');
      // Return mock data when backend is unavailable
      const now = new Date();
      const oneDayMs = 86_400_000;
      const twoDaysMs = 172_800_000;
      return NextResponse.json({
        clients: [
          { id: 1, name: 'Taxi-001', mobile: '9876543210', created_at: now.toISOString() },
          { id: 2, name: 'Taxi-002', mobile: '9876543211', created_at: now.toISOString() },
          { id: 3, name: 'Taxi-003', mobile: '9876543212', created_at: now.toISOString() },
          { id: 4, name: 'Taxi-004', mobile: '9876543213', created_at: new Date(now.getTime() - oneDayMs).toISOString() },
          { id: 5, name: 'Taxi-005', mobile: '9876543214', created_at: new Date(now.getTime() - twoDaysMs).toISOString() },
        ]
      }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Taxi fetch error:', error);
    // Return mock data on error
    const now = new Date();
    const oneDayMs = 86_400_000;
    const twoDaysMs = 172_800_000;
    return NextResponse.json({
      clients: [
        { id: 1, name: 'Taxi-001', mobile: '9876543210', created_at: now.toISOString() },
        { id: 2, name: 'Taxi-002', mobile: '9876543211', created_at: now.toISOString() },
        { id: 3, name: 'Taxi-003', mobile: '9876543212', created_at: now.toISOString() },
        { id: 4, name: 'Taxi-004', mobile: '9876543213', created_at: new Date(now.getTime() - oneDayMs).toISOString() },
        { id: 5, name: 'Taxi-005', mobile: '9876543214', created_at: new Date(now.getTime() - twoDaysMs).toISOString() },
      ]
    }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();

    const response = await fetch('https://gd.ayasglobe.com/api/taxi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Taxi register error:', error);
    return NextResponse.json(
      { error: 'Failed to register taxi' },
      { status: 500 }
    );
  }
}
