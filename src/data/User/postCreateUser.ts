/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for terms and conditions,
 * and exports a functions.
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
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
 * @param {string} tncVersion terms and condition version that new user agreed
 * @return {Promise<IResponse>} A promise that resolves with responseCode.
 */
export default function postCreatUser(
  email: string,
  nickname: string,
  major: string,
  graduationYear: number,
  tncVersion: string,
): Promise<IResponse> {
  console.log(
    `Sending create new user request with ${email} of nickname ${nickname}. His/her major is ${major} and class of ${graduationYear}. S/he agreed tnc: ${tncVersion}`,
  );

  return new Promise((resolve) => {
    if (nickname === 'bad') {
      // Bad Request
      setTimeout(() => resolve({ responseCode: 400 }), 1000);
    } else if (nickname === 'exist') {
      // Conflict
      setTimeout(() => resolve({ responseCode: 409 }), 1000);
    } else {
      setTimeout(() => resolve({ responseCode: 201 }), 1000);
    }
  });
}
