export interface Measurements {
  height: number;  // in inches
  waist: number;   // in inches
  bust: number;    // in inches
  hips: number;    // in inches
}

export interface Friend {
  id: string;
  name: string;
  image: string;
  vigLink?: string;  // Optional VigLink URL
  measurements: Measurements;
}

export interface SearchFilters extends Measurements {
  tolerance?: number; // tolerance in inches for matching
} 