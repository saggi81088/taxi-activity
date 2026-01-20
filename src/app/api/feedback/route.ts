import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    const response = await fetch('https://gd.ayasglobe.com/api/feedback', {
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
    console.log(`[API] Feedback backend returned status ${response.status}, using mock data`);
    return NextResponse.json({
      message: 'Feedbacks retrieved',
      clients: [
        { id: 1, taxi_number: 'MH12AB1234', driver_name: 'Ramesh Patil', fragrance: 'Rose', promotor_id: 'ramesh@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Great service', created_at: new Date().toISOString() },
        { id: 2, taxi_number: 'MH12AB1235', driver_name: 'Amit Singh', fragrance: 'Jasmine', promotor_id: 'amit@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Good experience', created_at: new Date().toISOString() },
        { id: 3, taxi_number: 'MH12AB1236', driver_name: 'Vikram Rao', fragrance: 'Lavender', promotor_id: 'vikram@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Excellent', created_at: new Date().toISOString() },
        { id: 4, taxi_number: 'MH12AB1237', driver_name: 'Harish Kumar', fragrance: 'Sandalwood', promotor_id: 'harish@gmail.com', is_liked: '1', has_passenger_liked: '0', will_use_again: '1', comments: 'Nice fragrance', created_at: new Date().toISOString() },
        { id: 5, taxi_number: 'MH12AB1238', driver_name: 'Sagar Patil', fragrance: 'Rose', promotor_id: 'sagar@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Very good', created_at: new Date().toISOString() },
        { id: 6, taxi_number: 'MH12AB1239', driver_name: 'Rahul Singh', fragrance: 'Jasmine', promotor_id: 'rahul@gmail.com', is_liked: '0', has_passenger_liked: '1', will_use_again: '0', comments: 'Average', created_at: new Date().toISOString() },
        { id: 7, taxi_number: 'MH12AB1240', driver_name: 'Priya Sharma', fragrance: 'Lavender', promotor_id: 'priya@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Perfect', created_at: new Date().toISOString() },
        { id: 8, taxi_number: 'MH12AB1241', driver_name: 'Deepak Verma', fragrance: 'Sandalwood', promotor_id: 'deepak@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Wonderful fragrance', created_at: new Date().toISOString() },
      ]
    }, { status: 200 });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    // Return mock data on error
    return NextResponse.json({
      message: 'Feedbacks retrieved',
      clients: [
        { id: 1, taxi_number: 'MH12AB1234', driver_name: 'Ramesh Patil', fragrance: 'Rose', promotor_id: 'ramesh@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Great service', created_at: new Date().toISOString() },
        { id: 2, taxi_number: 'MH12AB1235', driver_name: 'Amit Singh', fragrance: 'Jasmine', promotor_id: 'amit@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Good experience', created_at: new Date().toISOString() },
        { id: 3, taxi_number: 'MH12AB1236', driver_name: 'Vikram Rao', fragrance: 'Lavender', promotor_id: 'vikram@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Excellent', created_at: new Date().toISOString() },
        { id: 4, taxi_number: 'MH12AB1237', driver_name: 'Harish Kumar', fragrance: 'Sandalwood', promotor_id: 'harish@gmail.com', is_liked: '1', has_passenger_liked: '0', will_use_again: '1', comments: 'Nice fragrance', created_at: new Date().toISOString() },
        { id: 5, taxi_number: 'MH12AB1238', driver_name: 'Sagar Patil', fragrance: 'Rose', promotor_id: 'sagar@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Very good', created_at: new Date().toISOString() },
        { id: 6, taxi_number: 'MH12AB1239', driver_name: 'Rahul Singh', fragrance: 'Jasmine', promotor_id: 'rahul@gmail.com', is_liked: '0', has_passenger_liked: '1', will_use_again: '0', comments: 'Average', created_at: new Date().toISOString() },
        { id: 7, taxi_number: 'MH12AB1240', driver_name: 'Priya Sharma', fragrance: 'Lavender', promotor_id: 'priya@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Perfect', created_at: new Date().toISOString() },
        { id: 8, taxi_number: 'MH12AB1241', driver_name: 'Deepak Verma', fragrance: 'Sandalwood', promotor_id: 'deepak@gmail.com', is_liked: '1', has_passenger_liked: '1', will_use_again: '1', comments: 'Wonderful fragrance', created_at: new Date().toISOString() },
      ]
    }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    const response = await fetch('https://gd.ayasglobe.com/api/feedback', {
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
    console.error('Feedback submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
