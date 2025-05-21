/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for retrieving a user's profile and exports a function.
 * @author Heewon Kim
 */

// Define a type for the API response
interface IUserProfileResponse {
  responseCode: number;
  content?: {
    nickname: string;
    lastLogin: string;
    signUpDate: string;
    nicknameChanged?: string;
    deleted: boolean;
    deletedAt?: string;
    locked: boolean;
    lockedDescription?: string;
    lockedAt?: string;
    major: string;
    graduationYear: number;
    tncVersion?: string;
  };
  error?: string;
}

/**
 * Simulates an API call to get the user's profile based on email.
 * @param {string} base64Email - The base64UrlSafe-encoded user email.
 * @return {Promise<IUserProfileResponse>} A promise that resolves with the user's profile or an error.
 */
export default function getUserProfile(
  base64Email: string,
): Promise<IUserProfileResponse> {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      // Check the base64Email value to simulate different scenarios
      if (base64Email === null) {
        // 401 Unauthenticated
        resolve({
          responseCode: 401,
          error: 'Unauthenticated: No token provided.',
        });
      } else if (base64Email === 'forbidden') {
        // 403 Forbidden
        resolve({
          responseCode: 403,
          error: 'Forbidden: Invalid application key or expired token.',
        });
      } else if (base64Email === 'user123@gmail.com') {
        // 200 Success with a valid profile
        resolve({
          responseCode: 200,
          content: {
            nickname: 'user123',
            lastLogin: new Date().toISOString(),
            signUpDate: new Date('2022-01-15').toISOString(),
            deleted: false,
            locked: false,
            major: 'Computer Science',
            graduationYear: 2025,
            tncVersion: '1.0',
          },
        });
      } else {
        resolve({
          responseCode: 404,
          error: 'Unauthenticated: No token provided.',
        });
      }
    }, 1000); // Simulate a 1s delay
  });
}
