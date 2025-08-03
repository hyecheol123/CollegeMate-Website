/**
 * API functions for fetching term data
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { TermResponse } from '../types/term';
import { mockTermsData } from '../data/Miscellaneous/mockTermsData';

// For now, use mock data in development and real API in production
// The proxy approach was causing issues, so we'll use mock data locally
const API_BASE_URL = 'https://public.enroll.wisc.edu/api/search/v1';

// Cache configuration
const CACHE_KEY = 'terms_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CachedTermsData {
  data: TermResponse;
  timestamp: number;
}

/**
 * Get cached terms data if still valid
 * @returns {TermResponse | null} Cached data or null if expired/not found
 */
function getCachedTerms(): TermResponse | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cachedData: CachedTermsData = JSON.parse(cached);
    const now = Date.now();

    if (now - cachedData.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log('📦 Using cached terms data');
    return cachedData.data;
  } catch (error) {
    console.warn('Failed to read cached terms:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

/**
 * Cache terms data to localStorage
 * @param {TermResponse} data - Terms data to cache
 */
function setCachedTerms(data: TermResponse): void {
  try {
    const cacheData: CachedTermsData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cached terms data for 30 minutes');
  } catch (error) {
    console.warn('Failed to cache terms:', error);
  }
}

/**
 * Fetch all available terms from the University API
 * Falls back to mock data in development if API is unavailable
 * @returns {Promise<TermResponse>} Promise containing the terms data
 */
export async function fetchTerms(): Promise<TermResponse> {
  // Check cache first
  const cachedData = getCachedTerms();
  if (cachedData) {
    return cachedData;
  }

  console.log(`🔍 Attempting to fetch terms from: ${API_BASE_URL}/aggregate`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/aggregate`);
    console.log(`📡 API Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch terms: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched terms from API:', data);
    
    // Cache the successful response
    setCachedTerms(data);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching terms from API:', error);

    // In development, fall back to mock data if API fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Falling back to mock terms data in development mode');
      // Cache mock data too (shorter duration for development)
      setCachedTerms(mockTermsData);
      return mockTermsData;
    }

    // In production, re-throw the error
    throw error;
  }
}

/**
 * Clear cached terms data (useful for debugging or forced refresh)
 */
export function clearTermsCache(): void {
  localStorage.removeItem(CACHE_KEY);
  console.log('🗑️ Cleared terms cache');
}
