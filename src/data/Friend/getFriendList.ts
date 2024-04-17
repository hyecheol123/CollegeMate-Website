/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for friend list and exports a functions.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface IResponse {
  responseCode: number;
  content?: {
    friendList: string[];
  };
}

/**
 * Simulates an API call to fetch friend list.
 * @return {Promise<IResponse>} A promise that resolves with the major list.
 */
export default function getFriendList(): Promise<IResponse> {
  return new Promise((resolve) => {
    console.log(`Requesting friend list`);
    setTimeout(
      () =>
        resolve({
          responseCode: 200,
          content: {
            friendList: [
              "shan258@wisc.edu",
              "dkim01@wisc.edu",
              "jjang43@wisc.edu"
            ],
          },
        }),
      1000,
    ); // Simulate a 1s delay
  });
}
