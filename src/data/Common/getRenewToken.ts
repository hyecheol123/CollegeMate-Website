/**
 * This file provides a mock API response for renew token.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

/**
 * Simulates an API call to fetch terms and conditions.
 * @param {boolean | undefined} isSignup optional parameter to indicate signup
 *   purpose token
 * @return {Promise<void>} A promise that resolves renew token result.
 */
export default function getRenewToken(isSignup?: boolean): Promise<void> {
  console.log(
    isSignup
      ? 'Renewing signup purpose token'
      : 'Renewing general purpose token',
  );
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000); // Simulate a 1s delay
  });
}
