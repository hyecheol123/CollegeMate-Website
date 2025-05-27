/**
 * Custom Hook: useFetchAnnouncements
 * - Fetches announcement data and stores it in the Global Context
 * - Prevents redundant API calls by caching data for 10 minutes
 * @author Daekyun Kim
 */

import { useEffect } from 'react';
import { useGlobalContext } from '../GlobalContext';
import getAnnouncements from '../data/Miscellaneous/getAnnouncements';

/**
 * React Custom Hook to fetch and cache announcements
 * - Uses Global Context to store data and timestamp
 * - If data is older than 10 minutes or not fetched yet, fetch again
 */
export default function useFetchAnnouncements(): void {
  const { announcementsFetchedAt, dispatch } = useGlobalContext();

  useEffect(() => {
    const now = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000;

    if (announcementsFetchedAt && now - announcementsFetchedAt < TEN_MINUTES) {
      return;
    }

    const fetchData = async (): Promise<void> => {
      const response = await getAnnouncements();
      if (response.responseCode === 200 && response.content) {
        dispatch({
          type: 'SET_ANNOUNCEMENTS',
          announcements: response.content.announcementList,
          fetchedAt: now,
        });
      }
    };

    fetchData();
  }, [announcementsFetchedAt, dispatch]);
}
