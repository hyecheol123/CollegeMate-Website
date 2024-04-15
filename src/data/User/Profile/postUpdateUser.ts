/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for user update and exports 
 * a functions.
 * @author  Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
}

/**
 * Simulates an API call to post create user.
 * @param {string} email new user's email
 * @param {string} nickname new user's nickname
 * @param {string} major new user's major
 * @param {number} graduationYear new user's graduation year
 * @return {Promise<IResponse>} A promise that resolves with responseCode.
 */
export default function postUpdateUser(
  email: string,
  nickname: string,
  major: string,
  graduationYear: number,
): Promise<IResponse> {
  console.log(
    `Sending update user profile request with ${email} of nickname ${nickname}. His/her major is ${major} and class of ${graduationYear}.`,
  );

  return new Promise((resolve) => {
    if (nickname === 'badbad') {
      // Bad Request
      setTimeout(() => resolve({ responseCode: 400 }), 1000);
    } else {
      setTimeout(() => resolve({ responseCode: 200 }), 1000);
    }
  });
}
