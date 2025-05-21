/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for friend requests list and exports a functions.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
  content?: {
    friendRequests: { requestId: string; from: string }[];
  };
}

/**
 * Simulates an API call to get received friend requests.
 * @return {Promise<IResponse>} A promise that resolves with the list of received friend requests.
 */
export default function getReceivedFriendRequests(): Promise<IResponse> {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      // Simulate a successful response with received friend requests
      resolve({
        responseCode: 200,
        content: {
          friendRequests: [
            { requestId: 'sadf989hvsad93ikj', from: 'random@wisc.edu' },
            { requestId: 'adsjbzvxn91fdsa', from: 'tedpowel123@wisc.edu' },
            { requestId: 'djakfixkdl93fdic', from: 'dalcmap@wisc.edu' },
          ],
        },
      });
    }, 1000); // Simulate a 1s delay
  });
}
