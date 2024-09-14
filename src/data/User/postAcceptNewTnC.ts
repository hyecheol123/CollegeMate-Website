/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for accepting new terms and condition.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
}

/**
 * Simulates an API call to post create user.
 * @param {string} email new user's email
 * @param {string} tncVersion accepting tnc version
 * @returns {Promise<IResponse>} A promise that resolves with responseCode.
 */
export default function postAcceptNewTnC(
  email: string,
  tncVersion: string,
): Promise<IResponse> {
  console.log(
    `Sending accepting new TnC request with ${email}. Accepting TnC version of ${tncVersion}.`,
  );

  return new Promise((resolve) => {
    if (email === 'bademail@gmail.com') {
      // Simulating any failure response
      setTimeout(() => resolve({ responseCode: 400 }), 1000);
    } else {
      setTimeout(() => resolve({ responseCode: 200 }), 1000);
    }
  });
}
