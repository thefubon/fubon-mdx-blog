import { NextResponse } from 'next/server';
import { getContentCounts } from '@/lib/content-utils';

export async function GET() {
  try {
    // Check if the request is from an authenticated admin
    // In a real app, you would verify a session token or similar
    // For this demo, we'll skip that step

    const counts = getContentCounts();
    
    return NextResponse.json(counts, { status: 200 });
  } catch (error) {
    console.error('Error fetching content counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content counts' }, 
      { status: 500 }
    );
  }
} 