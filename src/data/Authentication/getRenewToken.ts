/**
 * This file provides a mock API response for renew token.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

interface IResponse {
  responseCode: number;
  content: {
    email: string;
  };
}

/**
 * Simulates an API call to renew token.
 * @param {boolean | undefined} isSignup optional parameter to indicate signup
 *   purpose token
 * @returns {Promise<IResponse>} A promise that resolves renew token result.
 */
export default function getRenewToken(isSignup?: boolean): Promise<IResponse> {
  console.log(
    isSignup
      ? 'Renewing signup purpose token'
      : 'Renewing general purpose token',
  );
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          responseCode: 200,
          content: { email: 'user123@gmail.com' },
        }),
      1000,
    );
  });
}
