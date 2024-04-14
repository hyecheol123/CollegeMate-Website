/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for major list and exports a functions.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface NicknameResponse {
    responseCode: number;
    content?: {
        nickname: string;
    };
  }
  
  /**
   * Simulates an API call to fetch major list.
   * @return {Promise<NicknameResponse>} A promise that resolves with the Nickname.
   */
  export default function getNickname(): Promise<NicknameResponse> {
    return new Promise((resolve) => {
      console.log(`Requesting nickname for verifying`);
      setTimeout(
        () =>
          resolve({
            responseCode: 400,
            content: {
                nickname: "Bucky"
            },
          }),
        1000,
      ); // Simulate a 1s delay
    });
  }
  