'use client';

import React from 'react';
import { Friend } from '@/lib/types';
import FriendCard from './FriendCard';

interface FriendGridProps {
  friends: Friend[];
}

export default function FriendGrid({ friends }: FriendGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {friends.map(friend => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
} 