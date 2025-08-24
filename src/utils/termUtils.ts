/**
 * Utility functions for handling UW-Madison term codes
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { Term } from '../data/Terms/getTerms';

/**
 * Calculates the current term based on today's date and term patterns
 * UW-Madison term codes follow this pattern:
 * - Spring: ends in 4 (e.g., 1254 = 2025 Spring)
 * - Summer: ends in 6 (e.g., 1256 = 2025 Summer)
 * - Fall: ends in 2 (e.g., 1262 = 2025 Fall)
 * @param {Term[]} terms Array of available terms
 * @returns {Term | null} The current term or the first future term if no current term found
 */
export function getCurrentTerm(terms: Term[]): Term | null {
  const now = Date.now();

  // Filter out past terms
  const futureTerms = terms.filter((term) => !term.pastTerm);

  if (futureTerms.length === 0) {
    return null;
  }

  // Find term that contains current date
  const currentTerm = futureTerms.find(
    (term) => now >= term.beginDate && now <= term.endDate,
  );

  if (currentTerm) {
    return currentTerm;
  }

  // If no current term, return the next upcoming term
  const upcomingTerms = futureTerms
    .filter((term) => now < term.beginDate)
    .sort((a, b) => a.beginDate - b.beginDate);

  return upcomingTerms[0] || futureTerms[0];
}

/**
 * Converts a term code to a human-readable format
 * @param {string} termCode The 4-digit term code (e.g., "1256")
 * @returns {string} Human readable format (e.g., "2025 Summer")
 */
export function formatTermCode(termCode: string): string {
  if (termCode.length !== 4) {
    return 'Invalid Term';
  }

  const firstDigit = parseInt(termCode[0]);
  const middleDigits = parseInt(termCode.slice(1, 3));
  const lastDigit = parseInt(termCode[3]);

  // Calculate year - UW uses this pattern
  let year = 2000 + middleDigits;

  // Determine semester
  let semester = 'Unknown';
  if (firstDigit === 1) {
    if (lastDigit === 4) {
      semester = 'Spring';
    } else if (lastDigit === 6) {
      semester = 'Summer';
    } else if (lastDigit === 2) {
      semester = 'Fall';
      // Fall semester of the previous year
      year -= 1;
    }
  }

  return `${year} ${semester}`;
}

/**
 * Sorts terms chronologically (earliest first)
 * @param {Term[]} terms Array of terms to sort
 * @returns {Term[]} Sorted array of terms
 */
export function sortTermsChronologically(terms: Term[]): Term[] {
  return [...terms].sort((a, b) => a.beginDate - b.beginDate);
}

/**
 * Filters terms to only include future and current terms
 * @param {Term[]} terms Array of terms to filter
 * @returns {Term[]} Filtered array of non-past terms
 */
export function getFutureTerms(terms: Term[]): Term[] {
  return terms.filter((term) => !term.pastTerm);
}

/**
 * Gets the next N terms starting from the current term
 * @param {Term[]} terms Array of available terms
 * @param {number} count Number of terms to return (default: 5)
 * @returns {Term[]} Array of upcoming terms
 */
export function getUpcomingTerms(terms: Term[], count: number = 5): Term[] {
  const futureTerms = getFutureTerms(terms);
  const sortedTerms = sortTermsChronologically(futureTerms);
  return sortedTerms.slice(0, count);
}
