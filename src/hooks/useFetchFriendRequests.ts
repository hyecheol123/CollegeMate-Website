/**
 * Custom Hook: useFetchFriendRequests
 * - Fetches friend request data and stores it in the Global Context
 * - Prevents redundant API calls by caching data for 10 minutes
 * - Only re-fetches if no data or if the previous fetch is outdated
 * @author Daekyun Kim
 */

import { useEffect } from 'react';
import { useGlobalContext } from '../GlobalContext';
import getFriendRequests from '../data/Friend/getFriendRequests';

/**
 * React Custom Hook to fetch and cache received friend requests
 * - Uses Global Context to store data and timestamp
 * - If data is older than 10 minutes or not fetched yet, fetch again
 */
export default function useFetchFriendRequests(): void {
  const { friendRequestsFetchedAt, dispatch } = useGlobalContext();

  useEffect(() => {
    const now = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000;

    // 최근 10분 이내에 데이터를 가져왔으면 캐시된 데이터 사용.
    if (
      friendRequestsFetchedAt &&
      now - friendRequestsFetchedAt < TEN_MINUTES
    ) {
      return;
    }

    // API 호출 및 Context Update
    const fetchData = async (): Promise<void> => {
      const response = await getFriendRequests();
      if (response.responseCode === 200 && response.content) {
        dispatch({
          type: 'SET_FRIEND_REQUESTS',
          requests: response.content.friendRequests,
          fetchedAt: now,
        });
      }
    };

    fetchData();
  }, [friendRequestsFetchedAt, dispatch]);
}
