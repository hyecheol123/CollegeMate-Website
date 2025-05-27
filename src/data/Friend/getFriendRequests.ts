/**
 * Mock API: getFriendRequests
 * - Returns a mock list of received friend requests
 * - Simulates a delay of 1 second to mimic a real API call
 * - Intended for development/testing before backend integration
 * @author Daekyun Kim
 */

// GET friend/request/received
export interface FriendRequest {
  requestId: string; // 요청의 고유 ID
  from: string; // 친구 요청을 보낸 사람의 이메일
}

// 타입 정의: API 응답 형식
export interface FriendRequestResponse {
  responseCode: number; // 200이면 성공
  content?: {
    friendRequests: FriendRequest[]; // 받은 친구 요청목록
  };
}

/**
 * Simulates an API call to fetch received friend requests.
 * @returns {Promise<FriendRequestResponse>} A promise that resolves with mock data.
 */
export default function getFriendRequests(): Promise<FriendRequestResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        responseCode: 200,
        content: {
          friendRequests: [
            { requestId: 'sadf989hvsad93ikj', from: 'random@wisc.edu' },
            { requestId: 'adsjbzvxn91fdsa', from: 'tedpowel123@wisc.edu' },
            { requestId: 'djakfixkdl93fdic', from: 'dalcmap@wisc.edu' },
          ],
        },
      });
    }, 1000); // API 응답 시뮬레이션 1초 지연
  });
}
