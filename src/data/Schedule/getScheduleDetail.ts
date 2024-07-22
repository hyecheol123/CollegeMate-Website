// /**
//  * This file provides a mock API for retrieving the details of a given schedule.
//  * @author Daekyun Kim <daekyun97@gmail.com>
//  */

// // Define the response object interface.
// interface IScheduleDetailResponse {
//     responseCode: string; // Response code
//     content?: { // Response content 
//         email: string;
//         termCode: string;
//         sessionList: object[];
//         eventList: object[];
//     };
// }

// /**
//  * Simulate an API call to retrieve the details of a given schedule.
//  * @param {string} scheduleId The schedule ID
//  * @return {Promise<IScheduleDetailResponse>} A promise that resolves to the response of
//  *  the get schedule detail request API call.
//  */
// export default function getScheduleDetailRequest(
//     scheduleId: string,
// ): Promise<IScheduleDetailResponse> {
//     // Log the schedule ID
//     console.log(
//         `Retrieving schedule detail for the schedule ID: ${scheduleId}`,
//     );

//     return new Promise((resolve, reject) => {
//         // Simulate API call with a timeout
//         setTimeout(() => {
//             // Mock response object
//             const mockResponse: IScheduleDetailResponse = {
//                 responseCode: '200', // Success response code
//                 content: {
//                     email: 'collegemate@wisc.edu',
//                     termCode: '1234',
//                     sessionList: [{}, {}, {}, {}], // Empty session objects
//                     eventList: [{}, {}], // Empty event objects
//                 },
//             };

//             // Simulate different responses based on the scheduleId
//             if (scheduleId === 'unauthenticated-id') {
//                 resolve({
//                     responseCode: '401', // Unauthenticated response code
//                 });
//             } else if (scheduleId === 'forbidden-id') {
//                 resolve({
//                     responseCode: '403', // Forbidden response code
//                 });
//             } else if (scheduleId === 'notfound-id') {
//                 resolve({
//                     responseCode: '404', // Not found response code
//                 });
//             } else {
//                 resolve(mockResponse); // Return success response
//             }
//         }, 1000); // Simulate 1 second delay
//     });
// }
