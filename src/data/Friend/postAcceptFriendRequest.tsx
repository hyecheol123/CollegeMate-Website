/**
 * This file defines a function to post a friend request based on its ID.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
}

/**
 * post a friend request with the specified ID.
 * @param {string} friendRequestId specified ID.
 * @return {Promise<IResponse>} A promise that resolves with responseCode.
 */
export default function postAcceptFriendRequest(
  friendRequestId: string,
): Promise<IResponse> {
  return new Promise((resolve) => {
    console.log(`Accepting friend request of ${friendRequestId}.`);
    // Simulate API call
    setTimeout(() => {
      if (!friendRequestId) {
        // 401 Unauthenticated
        setTimeout(() => resolve({ responseCode: 401 }), 1000);
      } else if (friendRequestId === 'nonexistent') {
        // 404 Not Found
        setTimeout(() => resolve({ responseCode: 404 }), 1000);
      } else if (friendRequestId === 'already_accepted') {
        // 409 Conflict
        setTimeout(() => resolve({ responseCode: 409 }), 1000);
      } else {
        // Successfully accept friend reuqest
        setTimeout(() => resolve({ responseCode: 200 }), 1000);
      }
    }, 1000); // Simulate a 1s delay
  });
}
