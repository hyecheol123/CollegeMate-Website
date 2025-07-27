/**
 * This file provides a mock API for deleting an event or session from a given schedule.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// Define the response object interface
interface IRemoveEventSessionResponse {
  responseCode: string; // Response code
}

/**
 * Simulate an API call to remove an event or session from a given schedule.
 * @param {string} scheduleId The schedule ID
 * @param {string} eventId The event or session ID
 * @return {Promise<IRemoveEventSessionResponse>} A promise that resolves to the response of
 *  the remove event/session request API call.
 */
export default function removeEventSessionRequest(
  scheduleId: string,
  eventId: string,
): Promise<IRemoveEventSessionResponse> {
  console.log(
    `Removing event/session with ID: ${eventId} from schedule with ID: ${scheduleId}`,
  );

  return new Promise((resolve) => {
    // Simulate API call with a timeout
    setTimeout(() => {
      // Example responses for different cases
      if (scheduleId === 'unauthenticated-id') {
        resolve({
          responseCode: '401', // Unauthenticated response code
        });
      } else if (scheduleId === 'forbidden-id') {
        resolve({
          responseCode: '403', // Forbidden response code
        });
      } else if (scheduleId === 'notfound-id' || eventId === 'notfound-id') {
        resolve({
          responseCode: '404', // Not Found response code
        });
      } else {
        resolve({
          responseCode: '200', // Successfully Deleted response code
        });
      }
    }, 1000); // Simulate 1 second delay
  });
}
