/**
 * API integration for UW-Madison class search
 * Uses Express.js proxy to handle CORS issues
 * @author Generated for CollegeMate
 */

export interface ClassSearchResult {
  courseId: string;
  title: string;
  subject: {
    subjectCode: string;
    formalDescription: string;
  };
  courseDesignation: string;
  fullCourseDesignation: string;
  description: string;
  credits?: {
    min: number;
    max: number;
  };
}

export interface ClassSearchResponse {
  hits: ClassSearchResult[];
  found: number;
  page: number;
  pageSize: number;
}

const CACHE_KEY_PREFIX = 'uw_search_cache_';
const CACHE_DURATION = 1000 * 60 * 60; // 1시간

/**
 * Searches for classes from UW-Madison enrollment API via Express.js proxy with 1-hour cache
 * @param {string} searchTerm - The term code to search in
 * @param {string} queryString - User's search query
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Page size (default: 10)
 * @returns {Promise<ClassSearchResponse>} Promise resolving to search results
 */
export async function searchClasses(
  searchTerm: string,
  queryString: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<ClassSearchResponse> {
  // Create cache key based on search parameters
  const cacheKey = `${CACHE_KEY_PREFIX}${searchTerm}_${queryString}_${page}_${pageSize}`;

  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_DURATION) {
        return data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const searchPayload = {
    searchTerm: parseInt(searchTerm),
    queryString: queryString,
    page: page,
    pageSize: pageSize,
  };

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Search API error ${response.status}: ${errorText}`);
  }

  const data: ClassSearchResponse = await response.json();

  // Cache the results
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));

  return data;
}
