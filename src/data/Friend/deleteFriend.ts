/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for friend list and exports a functions.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
}

/**
 * Simulates an API call to unfriend a friend.
 * @param {IUnfriendRequest} request The unfriend request.
 * @param base64Email
 * @return {Promise<IResponse>} A promise that resolves with the response.
 */
export default function deleteFriend(base64Email: string): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (!base64Email) {
        // 401 Unauthenticated
        reject({ responseCode: 401 });
      } else if (base64Email === 'nonexistent@example.com') {
        // 404 Not Found
        reject({ responseCode: 404 });
      } else {
        // Successfully unfriended
        resolve({ responseCode: 200 });
      }

      // Need to add 403 Forbidden
    }, 1000); // Simulate a 1s delay
  });
}
