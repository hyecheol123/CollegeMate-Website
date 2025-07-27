/**
 * Mock API call to get friend-request list **with built-in caching logic**.
 * - Returns list of received friend requests for the user
 * - Simulates a 1-second delay to mimic real network latency
 * - Prevents redundant fetches within 10 minutes (uses GlobalContext)
 * @author Daekyun Kim
 */

import { Dispatch } from 'react';
import { Action } from '../../GlobalContext';

// GET friend/request/received
export interface FriendRequest {
  requestId: string; // 요청의 고유 ID
  from: string; // 친구 요청을 보낸 사람의 이메일
}

export interface FriendRequestResponse {
  responseCode: number; // 200이면 성공
  content?: {
    friendRequests: FriendRequest[];
  };
}

/**
 * Fetch friend requests with caching and error fallback.
 *
 * - Returns a list of received friend requests
 * - Uses a 10-minute cache to avoid redundant requests
 * - Always updates GlobalContext to prevent infinite retry loops
 * @param {Dispatch<Action>} dispatch - GlobalContext dispatcher function
 * @param {number} [fetchedAt] - Timestamp of the last successful fetch
 */
export async function getFriendRequests(
  dispatch: Dispatch<Action>,
  fetchedAt?: number,
): Promise<void> {
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // 캐시 유지: 10분 이내엔 재호출하지 않음
  if (fetchedAt && now - fetchedAt < TEN_MINUTES) return;

  try {
    // Always update state to avoid infinite retry or loading loop
    const response: FriendRequestResponse = await new Promise((resolve) => {
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
      }, 1000);
    });

    if (response.responseCode === 200 && response.content) {
      dispatch({
        type: 'SET_FRIEND_REQUESTS',
        requests: response.content.friendRequests,
        fetchedAt: now,
      });
    } else {
      // Fallback to empty list to prevent re-fetch loop
      dispatch({
        type: 'SET_FRIEND_REQUESTS',
        requests: [],
        fetchedAt: now,
      });
    }
  } catch (err) {
    console.error('Failed to fetch friend requests:', err);
    // Error fallback: mark fetch as completed with empty data
    dispatch({
      type: 'SET_FRIEND_REQUESTS',
      requests: [],
      fetchedAt: now,
    });
  }
}
