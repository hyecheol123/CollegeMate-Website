/**
 * This file provides a mock API response for deleting user account.
 * @author  Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */


// Define a type for the API response
interface IResponse {
    responseCode: number;
  }
  
  /**
   * Simulates an API call to post create user.
   * @param {string} email new user's emailc
   * @return {Promise<IResponse>} A promise that resolves with responseCode.
   */
  export default function postDeleteUser(
    email: string,
  ): Promise<IResponse> {
    console.log(
      `Sending deleting user request with ${email}`,
    );
  
    return new Promise((resolve) => {
      setTimeout(() => resolve({ responseCode: 200 }), 1000);
    });
  }
  