/**
 * Utility functions to normalize building names from inconsistent API data
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

const specialCases: Record<string, string> = {
  'ONLINE': 'Online',
  'TBA': 'TBA',
  'MORGRIDGE': 'Morgridge Institute',
  'VILAS': 'Vilas Hall',
  'STERLING': 'Sterling Hall',
  'BASCOM': 'Bascom Hall',
};

/**
 * Check if a string is all uppercase (excluding numbers and special characters)
 */
const isAllCaps = (str: string): boolean => {
  const letters = str.replace(/[^a-zA-Z]/g, '');
  if (letters.length === 0) return false;
  return letters === letters.toUpperCase();
};

/**
 * Normalize building name to consistent proper case format
 */
export const normalizeBuildingName = (buildingName: string): string => {
  if (!buildingName) return '';
  
  const trimmed = buildingName.trim();
  
  // Handle special cases first
  const upperKey = trimmed.toUpperCase();
  if (specialCases[upperKey]) {
    return specialCases[upperKey];
  }
  
  // If it's all caps, convert to proper case
  if (isAllCaps(trimmed)) {
    return trimmed
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
  
  // If it's already in proper case, return as is
  return trimmed;
};

// Memoization cache for performance
const buildingCache = new Map<string, string>();

/**
 * Memoized version of normalizeBuildingName for better performance
 */
export const normalizeBuildingNameMemo = (buildingName: string): string => {
  if (buildingCache.has(buildingName)) {
    return buildingCache.get(buildingName)!;
  }
  
  const normalized = normalizeBuildingName(buildingName);
  buildingCache.set(buildingName, normalized);
  return normalized;
};