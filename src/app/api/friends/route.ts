import { NextResponse } from 'next/server';
import { getAllFriends, searchFriends } from '@/lib/data/friends';
import { SearchFilters } from '@/lib/types';

export async function GET(request: Request) {
  try {
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    
    // If there are search parameters, use them to filter friends
    if (searchParams.has('height') || searchParams.has('bust') || 
        searchParams.has('waist') || searchParams.has('hips')) {
      const filters: SearchFilters = {
        height: parseInt(searchParams.get('height') || '0'),
        bust: parseInt(searchParams.get('bust') || '0'),
        waist: parseInt(searchParams.get('waist') || '0'),
        hips: parseInt(searchParams.get('hips') || '0'),
        tolerance: parseInt(searchParams.get('tolerance') || '2')
      };
      
      const friends = searchFriends(filters);
      return NextResponse.json(friends);
    }
    
    // Otherwise return all friends
    const friends = getAllFriends();
    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error in friends API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
} 