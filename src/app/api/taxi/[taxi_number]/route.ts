import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ taxi_number: string }> }) {
  try {
    const { taxi_number } = await params;
    const token = request.headers.get('authorization');

    const response = await fetch(`https://gd.ayasglobe.com/api/taxi/${taxi_number}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Taxi search error:', error);
    return NextResponse.json(
      { error: 'Failed to search taxi' },
      { status: 500 }
    );
  }
}
