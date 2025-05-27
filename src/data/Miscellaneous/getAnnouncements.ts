/**
 * Mock API call to get announcement list
 * - Returns list of scheduled announcements for the user
 * - Simulates a 1-second delay to mimic real network latency
 * @author Daekyun Kim
 */
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
 * Simulates a backend API call to fetch announcements.
 * @returns {Promise<AnnouncementResponse>} Resolves with mock data
 */
export default function getAnnouncements(): Promise<AnnouncementResponse> {
  return new Promise((resolve) => {
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
    }, 1000); // Simulate a 1s delay
  });
}
