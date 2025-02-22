import { NextResponse } from 'next/server';
import { getFriendsFromCSV } from '@/lib/data/csvUtils';

let cachedFriends: any = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedFriends && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json(cachedFriends);
    }

    // If not, fetch new data
    const friends = await getFriendsFromCSV();
    
    // Update cache
    cachedFriends = friends;
    lastFetch = now;

    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { error: 'Failed to read friends data' },
      { status: 500 }
    );
  }
} 