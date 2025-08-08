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
  const searchPayload = {
    selectedTerm: searchTerm,
    queryString: queryString,
    page: page,
    pageSize: pageSize,
    sortOrder: 'SCORE',
    filters: [
      {
        bool: {
          must: [
            {
              term: {
                termCode: searchTerm,
              },
            },
            {
              has_child: {
                type: 'enrollmentPackage',
                query: {
                  bool: {
                    must: [
                      {
                        match: {
                          'packageEnrollmentStatus.status': 'OPEN WAITLISTED',
                        },
                      },
                      {
                        match: {
                          published: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ],
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

  return data;
}
