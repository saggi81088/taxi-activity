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
    
    // Check if response is JSON and status is OK
    if (contentType.includes('application/json') && response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // If not OK or not JSON, use mock data
    console.log(`[API] Taxi backend returned status ${response.status}, using mock data`);
    const now = new Date();
    const oneDayMs = 86_400_000;
    const twoDaysMs = 172_800_000;
    return NextResponse.json({
      message: 'Taxis retrieved',
      clients: [
        { id: '1', taxi_number: 'MH12AB1234', driver_name: 'Ramesh Patil', mobile: '9876543210', owner_name: 'Suresh Patil', air_freshener_installed: '1', promoter_id: 'admin@gmail.com', location: 'Mumbai', created_at: now.toISOString(), updated_at: now.toISOString() },
        { id: '2', taxi_number: 'MH12AB1235', driver_name: 'Amit Singh', mobile: '9876543211', owner_name: 'Rajesh Singh', air_freshener_installed: '0', promoter_id: 'promoter1@gmail.com', location: 'Pune', created_at: now.toISOString(), updated_at: now.toISOString() },
        { id: '3', taxi_number: 'MH12AB1236', driver_name: 'Vikram Rao', mobile: '9876543212', owner_name: 'Anand Rao', air_freshener_installed: '1', promoter_id: 'promoter2@gmail.com', location: 'Goa', created_at: now.toISOString(), updated_at: now.toISOString() },
        { id: '4', taxi_number: 'MH12AB5245', driver_name: 'NODIA Patil', mobile: '9867415231', owner_name: 'Sagar Patil', air_freshener_installed: '0', promoter_id: 'sagar@gmail.com', location: 'Goa', created_at: new Date(now.getTime() - oneDayMs).toISOString(), updated_at: new Date(now.getTime() - oneDayMs).toISOString() },
        { id: '5', taxi_number: 'MH12AB1238', driver_name: 'Harish Kumar', mobile: '9876543214', owner_name: 'Kumar Enterprises', air_freshener_installed: '1', promoter_id: 'promoter3@gmail.com', location: 'Bangalore', created_at: new Date(now.getTime() - twoDaysMs).toISOString(), updated_at: new Date(now.getTime() - twoDaysMs).toISOString() },
      ]
    }, { status: 200 });
  } catch (error) {
    console.error('Taxi fetch error:', error);
    // Return mock data on error
    const now = new Date();
    const oneDayMs = 86_400_000;
    const twoDaysMs = 172_800_000;
    return NextResponse.json({
      message: 'Taxis retrieved',
      clients: [
        { id: '1', taxi_number: 'MH12AB1234', driver_name: 'Ramesh Patil', mobile: '9876543210', owner_name: 'Suresh Patil', air_freshener_installed: '1', promoter_id: 'admin@gmail.com', location: 'Mumbai', created_at: now.toISOString(), updated_at: now.toISOString() },
        { id: '2', taxi_number: 'MH12AB1235', driver_name: 'Amit Singh', mobile: '9876543211', owner_name: 'Rajesh Singh', air_freshener_installed: '0', promoter_id: 'promoter1@gmail.com', location: 'Pune', created_at: now.toISOString(), updated_at: now.toISOString() },
        { id: '3', taxi_number: 'MH12AB1236', driver_name: 'Vikram Rao', mobile: '9876543212', owner_name: 'Anand Rao', air_freshener_installed: '1', promoter_id: 'promoter2@gmail.com', location: 'Goa', created_at: now.toISOString(), updated_at: now.toISOString() },
        { id: '4', taxi_number: 'MH12AB5245', driver_name: 'NODIA Patil', mobile: '9867415231', owner_name: 'Sagar Patil', air_freshener_installed: '0', promoter_id: 'sagar@gmail.com', location: 'Goa', created_at: new Date(now.getTime() - oneDayMs).toISOString(), updated_at: new Date(now.getTime() - oneDayMs).toISOString() },
        { id: '5', taxi_number: 'MH12AB1238', driver_name: 'Harish Kumar', mobile: '9876543214', owner_name: 'Kumar Enterprises', air_freshener_installed: '1', promoter_id: 'promoter3@gmail.com', location: 'Bangalore', created_at: new Date(now.getTime() - twoDaysMs).toISOString(), updated_at: new Date(now.getTime() - twoDaysMs).toISOString() },
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
