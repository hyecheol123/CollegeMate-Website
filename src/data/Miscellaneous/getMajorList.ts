/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for major list and exports a functions.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
  content?: {
    majorList: string[];
  };
}

/**
 * Simulates an API call to fetch major list.
 * @param {string} schoolDomain school domain address
 * @returns {Promise<IResponse>} A promise that resolves with the major list.
 */
export default function getMajorList(schoolDomain: string): Promise<IResponse> {
  return new Promise((resolve) => {
    console.log(`Requesting major list for ${schoolDomain}`);
    setTimeout(
      () =>
        resolve({
          responseCode: 200,
          content: {
            majorList: [
              'Art',
              'Animal Science',
              'Computer Engineering',
              'Computer Science',
              'Data Science',
              'Physics',
              'Zoology',
              'Undecided',
            ],
          },
        }),
      1000,
    ); // Simulate a 1s delay
  });
}
