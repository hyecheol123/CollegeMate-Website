/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for terms and conditions,
 * and exports a functions.
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
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

/**
 * Simulates an API call to fetch terms and conditions.
 * @return {Promise<ApiResponse>} A promise that resolves with the terms and conditions data.
 */
export default function getTnC(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          version: 'v1.0.2',
          createdAt: '2023-05-30T14:48:00.000Z',
          content: {
            privacyAct: 'Some Privacy Agreement',
            termsAndConditions: 'Some Terms and Conditions',
          },
        }),
      1000,
    ); // Simulate a 1s delay
  });
}
