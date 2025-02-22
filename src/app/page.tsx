'use client';

import React from 'react';
import { Friend, SearchFilters } from '@/lib/types';
import FriendCard from '@/components/FriendCard';
import SearchBar from '@/components/SearchBar';
import { Loader2 } from 'lucide-react';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const [allFriends, setAllFriends] = React.useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = React.useState<Friend[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/friends/csv')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data: Friend[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No valid data found');
        }
        const shuffled = shuffleArray(data);
        setAllFriends(shuffled);
        setFilteredFriends(shuffled);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching friends:', error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    const tolerance = filters.tolerance || 2;
    
    const filtered = allFriends.filter(friend => {
      const heightMatch = Math.abs(friend.measurements.height - filters.height) <= tolerance;
      const bustMatch = Math.abs(friend.measurements.bust - filters.bust) <= tolerance;
      const waistMatch = Math.abs(friend.measurements.waist - filters.waist) <= tolerance;
      const hipsMatch = Math.abs(friend.measurements.hips - filters.hips) <= tolerance;
      
      return heightMatch && bustMatch && waistMatch && hipsMatch;
    });
    
    setFilteredFriends(filtered);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <SearchBar onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-600">Loading size references...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-4">
              Found {filteredFriends.length} matches out of {allFriends.length} total references
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
