/**
 * API integration for UW-Madison enrollment terms
 * Uses Express.js proxy to handle CORS issues
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

export interface Term {
  termCode: string;
  shortDescription: string;
  longDescription: string;
  beginDate: number;
  endDate: number;
  instructionBeginDate: number;
  instructionEndDate: number;
  academicYear: string;
  pastTerm: boolean;
}

export interface Subject {
  termCode: string;
  subjectCode: string;
  formalDescription: string;
}

export interface TermsResponse {
  terms: Term[];
  subjects: Record<string, Subject[]>;
}

const CACHE_KEY = 'uw_terms_cache';

/**
 * Fetches terms from UW-Madison enrollment API via Express.js proxy with 1-hour cache
 * @returns {Promise<TermsResponse>} Promise resolving to terms data
 */
export async function getTerms(): Promise<TermsResponse> {
  try {
    // Clear all terms cache for fresh data
    localStorage.removeItem(CACHE_KEY);

    const response = await fetch('https://api.collegemate.app/api/terms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data: TermsResponse = await response.json();

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch terms from API:', error);
    throw error; // Re-throw to let components handle the error
  }
}
