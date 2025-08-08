/**
 * API integration for UW-Madison enrollment terms
 * Uses Express.js proxy to handle CORS issues
 * @author Generated for CollegeMate
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
const CACHE_DURATION = 1000 * 60 * 60; // 1시간

/**
 * Fetches terms from UW-Madison enrollment API via Express.js proxy with 1-hour cache
 * @returns {Promise<TermsResponse>} Promise resolving to terms data
 */
export async function getTerms(): Promise<TermsResponse> {
  try {
    // 캐시 확인
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const ageMinutes = Math.floor(age / (1000 * 60));

        if (age < CACHE_DURATION) {
          console.log(`💾 Using cached terms data (${ageMinutes}분 전 캐시)`);
          console.log(`📊 Cached: ${data.terms?.length || 0} terms`);
          return data;
        } else {
          console.log(
            `⏰ Cache expired (${ageMinutes}분 전), fetching fresh data...`,
          );
        }
      } catch {
        console.log('🗑️ Invalid cache, fetching fresh data...');
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const response = await fetch('/api/terms', {
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
    console.log('✅ Successfully fetched real UW-Madison terms data!');
    console.log(`📊 Loaded ${data.terms?.length || 0} terms`);

    // 캐시에 저장
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Terms data cached for 1 hour');

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch terms from API:', error);
    throw error; // Re-throw to let components handle the error
  }
}
