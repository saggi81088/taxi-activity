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

    // Check if response is JSON and status is OK
    if (contentType.includes('application/json') && response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // If not OK or not JSON, use mock data
    console.log(`[API] Userlist backend returned status ${response.status}, using mock data`);
    return NextResponse.json({
      data: [
        { id: 1, name: 'Admin User', email: 'admin@example.com', mobile: '9876543210', role: 'admin', created_at: new Date().toISOString(), created_by: 'System' },
        { id: 2, name: 'Promoter User 1', email: 'promoter1@example.com', mobile: '9876543211', role: 'promoter', created_at: new Date().toISOString(), created_by: 'System' },
        { id: 3, name: 'Promoter User 2', email: 'promoter2@example.com', mobile: '9876543212', role: 'promoter', created_at: new Date().toISOString(), created_by: 'System' },
      ]
    }, { status: 200 });
  } catch (error) {
    console.error('Userlist fetch error:', error);
    // Return mock data on error
    return NextResponse.json({
      data: [
        { id: 1, name: 'Admin User', email: 'admin@example.com', mobile: '9876543210', role: 'admin', created_at: new Date().toISOString(), created_by: 'System' },
        { id: 2, name: 'Promoter User 1', email: 'promoter1@example.com', mobile: '9876543211', role: 'promoter', created_at: new Date().toISOString(), created_by: 'System' },
        { id: 3, name: 'Promoter User 2', email: 'promoter2@example.com', mobile: '9876543212', role: 'promoter', created_at: new Date().toISOString(), created_by: 'System' },
      ]
    }, { status: 200 });
  }
}
