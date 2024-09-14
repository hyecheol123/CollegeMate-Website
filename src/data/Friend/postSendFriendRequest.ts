/**
 * This file defines a function to post a sending friend request based on its ID.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface ISendFriendRequestResponse {
  responseCode: number;
}

/**
 * Send a friend request to a user.
 * @param {string} targetEmail The email of the user to send the friend request to.
 * @return {Promise<ISendFriendRequestResponse>} A promise that resolves with the response code.
 */
export default function postSendFriendRequest(
  targetEmail: string,
): Promise<ISendFriendRequestResponse> {
  return new Promise((resolve) => {
    console.log(`Sending friend request to ${targetEmail}.`);
    // Simulate API call
    setTimeout(() => {
      if (targetEmail === 'nonexistent@wisc.edu') {
        // 404 Not Found (target user not found)
        setTimeout(() => resolve({ responseCode: 404 }), 1000);
      } else if (targetEmail === 'already_friend@wisc.edu') {
        // 409 Conflict (target user is already a friend)
        setTimeout(() => resolve({ responseCode: 409 }), 1000);
      } else {
        // Successfully sent friend request
        setTimeout(() => resolve({ responseCode: 201 }), 1000);
      }
    }, 1000); // Simulate a 1s delay
  });
}
