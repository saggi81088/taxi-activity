import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    const response = await fetch('https://gd.ayasglobe.com/api/userlist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      console.log('[API] Userlist backend returned non-JSON, using mock data');
      // Return mock data when backend is unavailable
      return NextResponse.json({
        data: [
          { id: 1, name: 'Admin User', email: 'admin@example.com', mobile: '9876543210', role: 'admin', created_at: new Date().toISOString(), created_by: 'System' },
          { id: 2, name: 'Promoter User', email: 'promoter@example.com', mobile: '9876543211', role: 'promoter', created_at: new Date().toISOString(), created_by: 'System' },
        ]
      }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Userlist fetch error:', error);
    // Return mock data on error
    return NextResponse.json({
      data: [
        { id: 1, name: 'Admin User', email: 'admin@example.com', mobile: '9876543210', role: 'admin', created_at: new Date().toISOString(), created_by: 'System' },
        { id: 2, name: 'Promoter User', email: 'promoter@example.com', mobile: '9876543211', role: 'promoter', created_at: new Date().toISOString(), created_by: 'System' },
      ]
    }, { status: 200 });
  }
}
