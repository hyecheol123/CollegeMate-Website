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

/**
 * Fetches terms from UW-Madison enrollment API via Express.js proxy
 * @returns {Promise<TermsResponse>} Promise resolving to terms data
 */
export async function getTerms(): Promise<TermsResponse> {
  try {
    console.log('🔄 Fetching terms from UW-Madison API via Express proxy...');

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

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch terms from API:', error);
    throw error; // Re-throw to let components handle the error
  }
}