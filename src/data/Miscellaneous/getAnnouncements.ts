/**
 * Mock API call to get announcement list
 * - Returns list of scheduled announcements for the user
 * - Simulates a 1-second delay to mimic real network latency
 * - Includes caching logic to prevent redundant fetches within 10 minutes
 * @author Daekyun Kim
 */

import { Dispatch } from 'react';
import { Action } from '../../GlobalContext';

// GET /announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  datetime: string;
}

export interface AnnouncementResponse {
  responseCode: number;
  content?: {
    announcementList: Announcement[];
  };
}

/**
 * Fetch announcements with caching and error fallback.
 *
 * - Returns a list of upcoming announcements for the user
 * - Uses a 10-minute cache to avoid redundant requests
 * - Updates GlobalContext state with announcements or empty array
 * - Prevents infinite retries by always updating `fetchedAt`, even on failure
 * @param {Dispatch<Action>} dispatch - GlobalContext dispatcher function
 * @param {number} [fetchedAt] - Timestamp of the last successful fetch
 */
export async function getAnnouncements(
  dispatch: Dispatch<Action>,
  fetchedAt?: number,
): Promise<void> {
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  if (fetchedAt && now - fetchedAt < TEN_MINUTES) {
    return;
  }

  try {
    // Always update state to avoid infinite retry or loading loop
    const response: AnnouncementResponse = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          responseCode: 200,
          content: {
            announcementList: [
              {
                id: 'goNEu9Jqp62FVJw2t7W66bYIhVCP5JAL0I5VmMdNmg4',
                title: '(July 2023) Scheduled Maintenance',
                content:
                  'During 3:00 AM to 5:00 AM of July 29th, users may not able to access to our application due to scheduled maintenance.\nSorry for the inconvenience.\n',
                datetime: '2023-05-30T14:48:00.000Z',
              },
              {
                id: 'zntfSaf9yreVZLhBjfl_D-I-OnvygPdyurRpJjXrqYI',
                title: '(August 2023) Scheduled Maintenance',
                content:
                  'During 3:00 AM to 5:00 AM of July 29th, users may not able to access to our application due to scheduled maintenance.\nSorry for the inconvenience.\n',
                datetime: '2023-05-31T14:48:00.000Z',
              },
              {
                id: 'fU-yU5khnbrAgGDfuZrBSP5NXwnZ4fTUEtA1rTmyBXs',
                title: '(September 2023) Scheduled Maintenance',
                content:
                  'During 3:00 AM to 5:00 AM of July 29th, users may not able to access to our application due to scheduled maintenance.\nSorry for the inconvenience.\n',
                datetime: '2023-05-02T14:48:00.000Z',
              },
            ],
          },
        });
      }, 1000);
    });

    if (response.responseCode === 200 && response.content) {
      dispatch({
        type: 'SET_ANNOUNCEMENTS',
        announcements: response.content.announcementList,
        fetchedAt: now,
      });
    } else {
      // Fallback to empty list to prevent re-fetch loop
      dispatch({
        type: 'SET_ANNOUNCEMENTS',
        announcements: [],
        fetchedAt: now,
      });
    }
  } catch (err) {
    // Error fallback: mark fetch as completed with empty data
    console.error('Failed to fetch announcements:', err);
    dispatch({
      type: 'SET_ANNOUNCEMENTS',
      announcements: [],
      fetchedAt: now,
    });
  }
}
