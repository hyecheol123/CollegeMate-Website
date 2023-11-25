/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for terms and conditions,
 * and exports a functions.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// Define a type for the API response
export type ApiResponse = {
  version: string;
  createdAt: string;
  content: {
    privacyAct: string;
    termsAndConditions: string;
  };
};

// Mock data structure that mimic the API response for the terms and conditions
const mockApiResponse: ApiResponse = {
  version: 'v1.0.2',
  createdAt: '2023-05-30T14:48:00.000Z',
  content: {
    privacyAct: 'Some Privacy Agreement',
    termsAndConditions: 'Some Terms and Conditions',
  },
};

/**
 * Simulates an API call to fetch terms and conditions.
 * @return {Promise<ApiResponse>} A promise that resolves with the terms and conditions data.
 */
export default function fetchTnC(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockApiResponse), 100); // Simulate a 100ms delay
  });
}
