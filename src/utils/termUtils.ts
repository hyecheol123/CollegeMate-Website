/**
 * Utility functions for handling term codes and calculations
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { TermData, TermInfo } from '../types/term';

/**
 * Parse term code to extract year and season information
 * Term code structure: YYYC (e.g., 1254 = 2025 Spring)
 * C = 4 (Spring), 6 (Summer), 2 (Fall)
 * @param {string} termCode - The term code to parse
 * @returns {TermInfo} TermInfo object with parsed data
 */
export function parseTermCode(termCode: string): TermInfo {
  const code = parseInt(termCode);
  const yearDigits = Math.floor(code / 10);
  const seasonCode = code % 10;

  // Convert YYY to full year (125 -> 2025)
  const year = yearDigits + 1900;

  let season: 'Spring' | 'Summer' | 'Fall';
  switch (seasonCode) {
    case 4:
      season = 'Spring';
      break;
    case 6:
      season = 'Summer';
      break;
    case 2:
      season = 'Fall';
      break;
    default:
      throw new Error(`Invalid season code: ${seasonCode}`);
  }

  return {
    termCode,
    displayName: `${year} ${season}`,
    year,
    season,
  };
}

/**
 * Generate term code for a given year and season
 * @param {number} year - The year (e.g., 2025)
 * @param {'Spring' | 'Summer' | 'Fall'} season - The season
 * @returns {string} The term code string
 */
export function generateTermCode(
  year: number,
  season: 'Spring' | 'Summer' | 'Fall',
): string {
  const yearDigits = year - 1900; // 2025 -> 125
  let seasonCode: number;

  switch (season) {
    case 'Spring':
      seasonCode = 4;
      break;
    case 'Summer':
      seasonCode = 6;
      break;
    case 'Fall':
      seasonCode = 2;
      break;
  }

  return `${yearDigits}${seasonCode}`;
}

/**
 * Determine the current term based on today's date and available terms
 * @param {TermData[]} terms - Array of term data from API
 * @returns {TermData | null} The current term, or null if no current term found
 */
export function getCurrentTerm(terms: TermData[]): TermData | null {
  const today = Date.now();

  // Find term where today's date falls within the term period
  const currentTerm = terms.find(
    (term) =>
      today >= term.beginDate && today <= term.endDate && !term.pastTerm,
  );

  if (currentTerm) {
    return currentTerm;
  }

  // If no current term, find the next upcoming term
  const futurTerms = terms
    .filter((term) => !term.pastTerm && term.beginDate > today)
    .sort((a, b) => a.beginDate - b.beginDate);

  return futurTerms[0] || null;
}

/**
 * Get all selectable terms (current and future terms only)
 * @param {TermData[]} terms - Array of term data from API
 * @returns {TermData[]} Filtered array of non-past terms
 */
export function getSelectableTerms(terms: TermData[]): TermData[] {
  return terms
    .filter((term) => !term.pastTerm)
    .sort((a, b) => a.beginDate - b.beginDate);
}

/**
 * Format term for display in dropdown
 * @param {TermData} term - Term data
 * @returns {string} Formatted display string
 */
export function formatTermForDisplay(term: TermData): string {
  // Use shortDescription but clean it up if needed
  return term.shortDescription.replace('Summr', 'Summer');
}
