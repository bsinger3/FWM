'use client';

import React from 'react';
import { Measurements, SearchFilters } from '@/lib/types';
import DressForm from './DressForm';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

// Convert inches to feet and inches format (e.g., "5' 8"")
const formatHeight = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}"`;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [measurements, setMeasurements] = React.useState<Measurements>({
    height: 65, // 5'5" in inches
    waist: 28,
    bust: 34,
    hips: 36,
  });

  const handleSliderChange = (measurement: keyof Measurements) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeasurements(prev => ({
      ...prev,
      [measurement]: parseInt(e.target.value)
    }));
  };

  const handleSearch = () => {
    onSearch({
      ...measurements,
      tolerance: 2 // Default tolerance of 2 inches
    });
  };

  return (
    <div className="w-full bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-start gap-8">
        {/* Dress Form */}
        <div className="w-40 h-40 flex-shrink-0">
          <DressForm measurements={measurements} />
        </div>

        {/* Sliders */}
        <div className="flex-grow grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height ({formatHeight(measurements.height)})
            </label>
            <input
              type="range"
              min="48" // 4'0"
              max="78" // 6'6"
              value={measurements.height}
              onChange={handleSliderChange('height')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bust ({measurements.bust}&quot;)
            </label>
            <input
              type="range"
              min="28"
              max="48"
              value={measurements.bust}
              onChange={handleSliderChange('bust')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waist ({measurements.waist}&quot;)
            </label>
            <input
              type="range"
              min="22"
              max="42"
              value={measurements.waist}
              onChange={handleSliderChange('waist')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hips ({measurements.hips}&quot;)
            </label>
            <input
              type="range"
              min="32"
              max="52"
              value={measurements.hips}
              onChange={handleSliderChange('hips')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex-shrink-0 flex items-start pt-4">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
} 