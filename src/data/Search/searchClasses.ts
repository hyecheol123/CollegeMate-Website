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
  pageSize: number = 10
): Promise<ClassSearchResponse> {
  try {
    // Create cache key based on search parameters
    const cacheKey = `${CACHE_KEY_PREFIX}${searchTerm}_${queryString}_${page}_${pageSize}`;
    
    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const ageMinutes = Math.floor(age / (1000 * 60));
        
        if (age < CACHE_DURATION) {
          console.log(`💾 Using cached search results (${ageMinutes}분 전 캐시)`);
          console.log(`📊 Cached: ${data.hits?.length || 0} results`);
          return data;
        } else {
          console.log(`⏰ Cache expired (${ageMinutes}분 전), fetching fresh data...`);
        }
      } catch (e) {
        console.log('🗑️ Invalid cache, fetching fresh data...');
        localStorage.removeItem(cacheKey);
      }
    }

    console.log(`🔄 Searching classes: "${queryString}" in term ${searchTerm}...`);

    const searchPayload = {
      searchTerm: parseInt(searchTerm),
      queryString: queryString,
      page: page,
      pageSize: pageSize
    };

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search API error ${response.status}: ${errorText}`);
    }

    const data: ClassSearchResponse = await response.json();
    console.log('✅ Successfully fetched class search results!');
    console.log(`📊 Found ${data.found} total results, showing ${data.hits?.length || 0} on page ${page}`);
    
    // Log first few results for debugging
    if (data.hits && data.hits.length > 0) {
      console.log('🎯 Sample results:');
      data.hits.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.fullCourseDesignation} - ${result.title}`);
      });
    }

    // Cache the results
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('💾 Search results cached for 1 hour');

    return data;
  } catch (error) {
    console.error('❌ Failed to search classes:', error);
    throw error; // Re-throw to let components handle the error
  }
}