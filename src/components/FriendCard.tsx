'use client';

import React, { useState } from 'react';
import { Friend } from '@/lib/types';
import Image from 'next/image';
import { ImageOff, ExternalLink } from 'lucide-react';

interface FriendCardProps {
  friend: Friend;
}

// Convert inches to feet and inches format (e.g., "5' 8"")
const formatHeight = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}"`;
};

// SVG icons for measurements
const MeasurementIcons = {
  Height: () => (
    <svg width="12" height="20" viewBox="0 0 12 20" className="inline-block mr-1">
      <line x1="6" y1="2" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="2" x2="10" y2="2" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="18" x2="10" y2="18" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Bust: () => (
    <svg width="20" height="12" viewBox="0 0 20 12" className="inline-block mr-1">
      <path
        d="M2 6 Q10 2 10 6 Q10 10 18 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  Waist: () => (
    <svg width="20" height="8" viewBox="0 0 20 8" className="inline-block mr-1">
      <path
        d="M2 4 L18 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Hips: () => (
    <svg width="20" height="12" viewBox="0 0 20 12" className="inline-block mr-1">
      <path
        d="M2 2 Q10 10 18 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
};

export default function FriendCard({ friend }: FriendCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const handleClick = (e: React.MouseEvent) => {
    if (friend.vigLink) {
      e.preventDefault();
      window.open(friend.vigLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setNaturalSize({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setIsLoading(false);
  };

  // Calculate dimensions for hover state
  const aspectRatio = naturalSize.width ? naturalSize.height / naturalSize.width : 1;
  const hoverStyle = {
    '--hover-width': '100%',
    '--hover-height': `${100 * aspectRatio}%`,
  } as React.CSSProperties;

  return (
    <div 
      onClick={handleClick}
      style={hoverStyle}
      className={`
        relative group aspect-square bg-white rounded-lg shadow-md overflow-hidden 
        transition-all duration-300 ease-out transform
        cursor-pointer
        hover:scale-100 hover:z-50
        hover:w-[var(--hover-width)] hover:h-[var(--hover-height)]
        hover:[aspect-ratio:unset]
      `}
    >
      <div className="relative w-full h-full">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageOff className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <Image
              src={friend.image}
              alt="Size reference photo"
              fill
              className={`object-cover transition-opacity duration-300 group-hover:object-contain ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={() => setImageError(true)}
              onLoad={handleImageLoad}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </>
        )}
      </div>
      
      {/* Measurements overlay on right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-end p-2">
        <div className="text-xs text-white text-right space-y-2">
          <p className="flex items-center justify-end">
            <MeasurementIcons.Height />
            {formatHeight(friend.measurements.height)}
          </p>
          <p className="flex items-center justify-end">
            <MeasurementIcons.Bust />
            {friend.measurements.bust}&quot;
          </p>
          <p className="flex items-center justify-end">
            <MeasurementIcons.Waist />
            {friend.measurements.waist}&quot;
          </p>
          <p className="flex items-center justify-end">
            <MeasurementIcons.Hips />
            {friend.measurements.hips}&quot;
          </p>
        </div>
      </div>

      {/* Link indicator */}
      {friend.vigLink && (
        <div className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ExternalLink size={16} />
        </div>
      )}
    </div>
  );
} 