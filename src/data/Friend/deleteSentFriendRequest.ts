/**
 * This file defines a function to delete a sent friend request based on its ID.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// Define a type for the API response
interface IResponse {
    responseCode: number;
}

/**
 * Deletes a sent friend request with the specified ID.
 * @param {string} friendRequestId - The unique ID of the sent friend request to delete.
 * @return {Promise<IResponse>} A promise that resolves with the API response.
 */
export default function deleteSentFriendRequests(friendRequestId: string): Promise<IResponse> {
    return new Promise((resolve) => {
        console.log(
            `Deleting sent friend request of ${friendRequestId}.`,
        );
        // Simulate API call
        setTimeout(() => {
            // Simulate a successful response
            if (!friendRequestId) {
                // 401 Unauthenticated
                setTimeout(() => resolve({ responseCode: 401 }), 1000);
            } else if (friendRequestId === "nonexistent") {
                // 404 Not Found
                setTimeout(() => resolve({ responseCode: 404 }), 1000);
            } else {
                // Successfully delete sent friend reuqest
                setTimeout(() => resolve({ responseCode: 200 }), 1000);
            } 

            // Need to add 403 Forbidden 

        }, 1000); // Simulate a 1s delay
    });
}
