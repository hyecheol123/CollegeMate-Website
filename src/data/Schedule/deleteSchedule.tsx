/**
 * This file provides a mock API for deleting a given schedule.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// Define the response object interface
interface IDeleteScheduleResponse {
  responseCode: string; // Response code
}

/**
 * Simulate an API call to delete a given schedule.
 * @param {string} scheduleId The schedule ID
 * @return {Promise<IDeleteScheduleResponse>} A promise that resolves to the response of
 *  the delete schedule request API call.
 */
export default function deleteScheduleRequest(
  scheduleId: string,
): Promise<IDeleteScheduleResponse> {
  // Logging
  console.log(`Deleting schedule with ID: ${scheduleId}`);

  return new Promise((resolve) => {
    // Simulate API call with a timeout
    setTimeout(() => {
      // Example responses for different cases
      if (scheduleId === 'unauthenticated-id') {
        resolve({
          responseCode: '401', // Unauthenticated
        });
      } else if (scheduleId === 'forbidden-id') {
        resolve({
          responseCode: '403', // Forbidden
        });
      } else if (scheduleId === 'notfound-id') {
        resolve({
          responseCode: '404', // Not Found
        });
      } else {
        resolve({
          responseCode: '200', // Success
        });
      }
    }, 1000); // Simulate 1 second delay
  });
}
