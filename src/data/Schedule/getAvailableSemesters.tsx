/**
 * This file provides a mock API for retrieving the list of available semesters.
 * @author: Daekyun Kim
 */

interface IResponse {
  responseCode: number;
  content?: {
    semesterList?: string[];
  };
}

/**
 * Simulates an API call to retrieve the list of available semesters.
 * @param {string} origin - The origin of the request
 * @return {Promise<IResponse>} A promise that resolves to the response of the Get Available Semesters API call.
 */
export default function getAvailableSemesters(
  origin: string,
): Promise<IResponse> {
  console.log(
    `Retrieving available semesters for request from origin: ${origin}`,
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      if (origin === 'forbidden-origin') {
        resolve({ responseCode: 403 });
      } else {
        resolve({
          responseCode: 200,
          content: {
            semesterList: ['1234', '1236', '1242'],
          },
        });
      }
    }, 1000);
  });
}
