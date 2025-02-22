import React from 'react';
import { Measurements } from '@/lib/types';

interface DressFormProps {
  measurements: Measurements;
}

export default function DressForm({ measurements }: DressFormProps) {
  // Scale factors to convert inches to SVG units
  const heightScale = 2;
  const widthScale = 2;
  
  // Calculate dimensions
  const svgHeight = measurements.height * heightScale;
  const bustWidth = measurements.bust * widthScale;
  const waistWidth = measurements.waist * widthScale;
  const hipsWidth = measurements.hips * widthScale;

  // Calculate section heights
  const headSize = 30;
  const bustHeight = svgHeight * 0.25;
  const waistHeight = 10;
  const skirtHeight = svgHeight * 0.5;

  // Center line position
  const centerX = Math.max(bustWidth, waistWidth, hipsWidth) / 2 + 20;

  return (
    <svg
      width={Math.max(bustWidth, waistWidth, hipsWidth) + 40}
      height={svgHeight}
      viewBox={`0 0 ${Math.max(bustWidth, waistWidth, hipsWidth) + 40} ${svgHeight}`}
      className="transition-all duration-300 ease-in-out"
    >
      {/* Head */}
      <circle
        cx={centerX}
        cy={headSize / 2}
        r={headSize / 2}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Upper Body (Bust) */}
      <path
        d={`M ${centerX - bustWidth/2} ${headSize + 20}
           L ${centerX + bustWidth/2} ${headSize + 20}
           L ${centerX + waistWidth/2} ${headSize + bustHeight}
           L ${centerX - waistWidth/2} ${headSize + bustHeight}
           Z`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Waist */}
      <path
        d={`M ${centerX - waistWidth/2} ${headSize + bustHeight}
           L ${centerX + waistWidth/2} ${headSize + bustHeight}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Skirt */}
      <path
        d={`M ${centerX - waistWidth/2} ${headSize + bustHeight + waistHeight}
           L ${centerX + waistWidth/2} ${headSize + bustHeight + waistHeight}
           L ${centerX + hipsWidth/2} ${headSize + bustHeight + waistHeight + skirtHeight}
           L ${centerX - hipsWidth/2} ${headSize + bustHeight + waistHeight + skirtHeight}
           Z`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
} 