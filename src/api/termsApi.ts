/**
 * API functions for fetching term data
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { TermResponse } from '../types/term';
import { mockTermsData } from '../data/Miscellaneous/mockTermsData';

// Use proxy path in development, full URL in production
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? '/api/search/v1'
    : 'https://public.enroll.wisc.edu/api/search/v1';

/**
 * Fetch all available terms from the University API
 * Falls back to mock data in development if API is unavailable
 * @returns {Promise<TermResponse>} Promise containing the terms data
 */
export async function fetchTerms(): Promise<TermResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/aggregate`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch terms: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching terms from API:', error);

    // In development, fall back to mock data if API fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to mock terms data in development mode');
      return mockTermsData;
    }

    // In production, re-throw the error
    throw error;
  }
}
