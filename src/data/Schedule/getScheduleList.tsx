/**
 * This file provides a mock API for retrieving a list of schedules.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

interface IScheduleListResponse {
  responseCode: string;
  content?: {
    scheduleIds: string[];
  };
}

/**
 * Simulate an API call to retrieve the list of schedules for a given email address.
 * @param {string} base64Email The Base64UrlSafe-encoded user email associated with the account
 * @return {Promise<IScheduleListResponse>} A promise that resolves to the response of
 *  the retrieve schedule list request API call.
 */
export default function getScheduleListRequest(
  base64Email: string,
): Promise<IScheduleListResponse> {
  console.log(
    `Retrieving schedule list for the email (Base64UrlSafe-encoded): ${base64Email}`,
  );

  return new Promise((resolve) => {
    // Simulate API call with a timeout
    setTimeout(() => {
      // Mock response
      const mockResponse: IScheduleListResponse = {
        responseCode: '200',
        content: {
          scheduleIds: [
            'Y29sbGVnZW1hdGVAd2lzYy5lZHUtMTIzNA',
            'Y29sbGVnZW1hdGUud2lzYy5lZHUtMTIzNg',
            'Y29sbGVnZW1hdGUud2lzYy5lZHUtMTIwNA',
          ],
        },
      };

      // example condition to mock forbidden access
      if (base64Email === 'Zm9yYmlkZGVuLXRlc3Q=') {
        // result for 'forbidden-test's base64url enconding result
        resolve({
          responseCode: '403',
        });
      } else {
        resolve(mockResponse);
      }
    }, 1000);
  });
}
