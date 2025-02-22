import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { Friend, Measurements } from '@/lib/types';

// Measurement validation ranges
const VALID_RANGES = {
  height: { min: 50, max: 80 },  // 4'2" to 6'8"
  bust: { min: 25, max: 55 },    // Very expanded bust range
  waist: { min: 18, max: 50 },   // Very expanded waist range
  hips: { min: 25, max: 60 }     // Very expanded hip range
};

// Helper function to extract numeric value from measurement string
function extractNumber(value: string): number | null {
  if (!value) return null;
  
  // Try to find a pattern like "34DD" or "34D"
  const bustMatch = value.match(/(\d+)[A-Z]+/);
  if (bustMatch) {
    return parseInt(bustMatch[1]);
  }

  // Then try regular number patterns
  const matches = value.match(/(\d+\.?\d*)/g);
  if (!matches) return null;

  return parseFloat(matches[0]);
}

// Helper function to convert height string to inches
function heightToInches(height: string): number | null {
  if (!height) return null;

  // Try to match patterns like "5'7"" or "5 feet 7 inches" or "67 inches"
  const feetInchesMatch = height.match(/(\d+)'[^\d]*(\d+)/);
  if (feetInchesMatch) {
    const feet = parseInt(feetInchesMatch[1]);
    const inches = parseInt(feetInchesMatch[2]);
    return feet * 12 + inches;
  }

  // If just inches, extract the number
  const justInches = extractNumber(height);
  if (justInches) return justInches;

  return null;
}

// Validate and normalize a measurement
function validateMeasurement(value: number | null, type: keyof typeof VALID_RANGES): number | null {
  if (value === null) return null;
  
  const range = VALID_RANGES[type];
  if (value < range.min || value > range.max) return null;
  
  return value;
}

// Clean and validate all measurements for a record
function cleanMeasurements(record: any): Measurements | null {
  // Extract measurements
  const height = heightToInches(record.Height);
  const bust = extractNumber(record.Bust);
  const waist = extractNumber(record.Waist);
  const hips = extractNumber(record.Hips);

  if (!height || !bust || !waist || !hips) return null;

  return { height, bust, waist, hips };
}

// Helper function to process VigLink URL
function processVigLink(url: string): string {
  if (!url) return '';
  
  // If it's already a Sovrn Commerce link, return as is
  if (url.includes('redirect.viglink.com')) {
    return url;
  }
  
  // Otherwise, encode it as a Sovrn Commerce link
  const baseUrl = 'https://redirect.viglink.com';
  const key = '2aba39b05bc3c8c85f46f6f98c7c728d';
  return `${baseUrl}?key=${key}&u=${encodeURIComponent(url)}`;
}

export async function readCSVFile(filePath: string): Promise<any[]> {
  const records: any[] = [];
  
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skipRecordsWithError: true,
      quote: '"',
      escape: '"',
      relax_quotes: true,
      relax_column_count: true
    }));

  for await (const record of parser) {
    // Clean up the record - remove empty fields and trim strings
    const cleanRecord = Object.fromEntries(
      Object.entries(record)
        .filter(([key, value]) => key && value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );
    records.push(cleanRecord);
  }

  return records;
}

export async function getFriendsFromCSV(): Promise<Friend[]> {
  const filePath = path.join(process.cwd(), 'friendsData', 'Ref - Sheet1.csv');
  const records = await readCSVFile(filePath);
  
  console.log(`Processing ${records.length} records`);
  if (records.length > 0) {
    console.log('Sample record:', {
      Height: records[0].Height,
      Bust: records[0].Bust,
      Waist: records[0].Waist,
      Hips: records[0].Hips
    });
  }

  const friends = records
    .map((record): Friend | null => {
      // Clean and validate measurements
      const measurements = cleanMeasurements(record);
      if (!measurements) return null;

      // Only include records with valid measurements
      return {
        id: record.RandID || String(Math.random()),
        name: `Size Reference ${Math.floor(Math.random() * 1000)}`,
        image: record.BigImage || record.BigImage_legacy || 'https://placehold.co/400x600',
        measurements,
        ...(record.VigLink ? { vigLink: record.VigLink.trim() } : {})
      };
    })
    .filter((friend): friend is Friend => friend !== null);

  console.log(`Found ${friends.length} valid friends`);
  if (friends.length > 0) {
    console.log('Sample valid friend:', friends[0]);
  }
  
  return friends;
} 