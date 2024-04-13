/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for terms and conditions,
 * and exports a functions.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
export type ApiResponse = {
  email: string;
  nickname: string;
  major: string[];
  graduationYear: number[];
  tncVersion: string;
};

/**
 * Simulates an API call to fetch terms and conditions.
 * @return {Promise<ApiResponse>} A promise that resolves with the terms and conditions data.
 */
export default function postCreatUser(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          email: 'LovelyJerry@email.com',
          nickname: 'schoollifemaster',
          major: ['Computer Science', 'Data Science'],
          graduationYear: [
            2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
            2026, 2027, 2028,
          ],
          tncVersion: 'v1.0.2',
        }),
      1000,
    ); // Simulate a 1s delay
  });
}
