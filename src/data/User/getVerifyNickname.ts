/**
 * This file defines a TypeScript type for an API response,
 * provides a mock API response for checking nickname.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface INicknameResponse {
  responseCode: number;
  content?: {
    isAvailable: boolean;
  };
}

/**
 * Simulates an API call to check nickname.
 * @param {string} nickname nickname to be checked
 * @return {Promise<INicknameResponse>} A promise that resolves with API response.
 */
export default function getNickname(
  nickname: string,
): Promise<INicknameResponse> {
  return new Promise((resolve) => {
    console.log(`${nickname} is checked`);

    if (nickname === 'exist') {
      // Already existing
      setTimeout(
        () => resolve({ responseCode: 200, content: { isAvailable: false } }),
        1000,
      );
    } else {
      setTimeout(
        () => resolve({ responseCode: 200, content: { isAvailable: true } }),
        1000,
      );
    }
  });
}
