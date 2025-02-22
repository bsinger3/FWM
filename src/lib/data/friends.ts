import { Friend, SearchFilters } from '@/lib/types';

// Sample friends data - replace this with your actual data
export const friends: Friend[] = [
  {
    id: '1',
    name: 'Emma',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    measurements: {
      height: 65, // 5'5"
      bust: 34,
      waist: 28,
      hips: 36
    }
  },
  {
    id: '2',
    name: 'Sophia',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    measurements: {
      height: 67, // 5'7"
      bust: 36,
      waist: 30,
      hips: 38
    }
  },
  {
    id: '3',
    name: 'Isabella',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    measurements: {
      height: 63, // 5'3"
      bust: 32,
      waist: 26,
      hips: 34
    }
  }
];

// Helper function to search friends by measurements
export const searchFriends = (filters: SearchFilters): Friend[] => {
  const tolerance = filters.tolerance || 2;
  
  return friends.filter(friend => {
    const heightMatch = Math.abs(friend.measurements.height - filters.height) <= tolerance;
    const bustMatch = Math.abs(friend.measurements.bust - filters.bust) <= tolerance;
    const waistMatch = Math.abs(friend.measurements.waist - filters.waist) <= tolerance;
    const hipsMatch = Math.abs(friend.measurements.hips - filters.hips) <= tolerance;
    
    return heightMatch && bustMatch && waistMatch && hipsMatch;
  });
};

// Helper function to get all friends
export const getAllFriends = (): Friend[] => {
  return friends;
}; 