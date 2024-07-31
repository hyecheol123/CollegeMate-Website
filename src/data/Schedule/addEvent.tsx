/**
 * This file provides a mock API for adding an event or session to a given schedule.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// Define the request object interface
interface IAddEventSessionRequest {
    eventType: "event" | "session";
    sessionId?: string;
    title?: string;
    location?: string;
    meetingDaysList?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[];
    startTime?: {
        month: number;
        day: number;
        hour: number;
        minute: number;
    };
    endTime?: {
        month: number;
        day: number;
        hour: number;
        minute: number;
    };
    memo?: string;
    colorCode: number;
}

// Define the response object interface
interface IAddEventSessionResponse {
    responseCode: string; // Response code
}

/**
 * Simulate an API call to add an event or session to a given schedule.
 * @param {string} scheduleId The schedule ID
 * @param {IAddEventSessionRequest} requestData The request data for adding event or session
 * @return {Promise<IAddEventSessionResponse>} A promise that resolves to the response of
 *  the add event/session request API call.
 */
export default function addEventSessionRequest(
    scheduleId: string,
    requestData: IAddEventSessionRequest,
): Promise<IAddEventSessionResponse> {
    console.log(
        `Adding ${requestData.eventType} to schedule with ID: ${scheduleId}`,
    );
    console.log('Request data:', requestData);

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
                    responseCode: '404', // Not Found response code
                });
            } else if (requestData.eventType === 'event' && requestData.title === 'conflict-event') {
                resolve({
                    responseCode: '409', // Conflict response code
                });
            } else if (requestData.eventType === 'session' && requestData.sessionId === 'conflict-session') {
                resolve({
                    responseCode: '409', // Conflict response code
                });
            } else {
                resolve({
                    responseCode: '200', // Success response code
                });
            }
        }, 1000); // Simulate 1 second delay
    });
}
