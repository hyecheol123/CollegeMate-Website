/**
 * This file provides a mock API for searching courses and their associated sessions
 * @author: Daekyun Kim
 */

interface ICourseSearchRequest {
  searchTerm: string;
  termCode: string;
}

interface IMeeting {
  buildingName: string;
  room: string;
  meetingDaysList: string[];
  meetingType: string;
  startTime: {
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  endTime: {
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  instructors: Array<{
    email: string;
    name: {
      first: string;
      last: string;
    };
  }>;
}

interface ISession {
  id: string;
  sessionId: string;
  meetings: IMeeting[];
  credit: number;
  isAsynchronous: boolean;
  onlineOnly: boolean;
}

interface ICourseSearchResponse {
  responseCode: number;
  content?: {
    found: boolean;
    result?: {
      courseId: string;
      courseName: string;
      description: string;
      fullCourseName: string;
      title: string;
      sessionList: ISession[];
    };
  };
}

/**
 * Simulates an API call to search for courses and their associated sessions.
 * @param {ICourseSearchRequest} requestBody - Request body containing searchTerm and termCode
 * @param {string} origin - The origin of the request
 * @return {Promise<ICourseSearchResponse>} A promise that resolves to the response of the Course Search API call.
 */
export default function courseSearch(
  requestBody: ICourseSearchRequest,
  origin: string,
): Promise<ICourseSearchResponse> {
  console.log(
    `Searching for courses with term ${requestBody.termCode} and search term ${requestBody.searchTerm} from origin: ${origin}`,
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      if (origin === 'forbidden-origin') {
        resolve({ responseCode: 403 });
      } else if (!requestBody.searchTerm || !requestBody.termCode) {
        resolve({ responseCode: 400 });
      } else if (requestBody.searchTerm === 'MUSIC 113') {
        resolve({
          responseCode: 200,
          content: {
            found: true,
            result: {
              courseId: '012921',
              courseName: 'MUSIC 113',
              description:
                'Descriptive lectures on chamber music with performances by instructor and others.',
              fullCourseName: 'MUSIC 113',
              title: 'Music in Performance',
              sessionList: [
                {
                  id: '012921-1234-19416',
                  sessionId: '19416',
                  meetings: [
                    {
                      buildingName: 'Mosse Humanities Building',
                      room: '2340',
                      meetingDaysList: ['WEDNESDAY'],
                      meetingType: 'LEC',
                      startTime: { month: 1, day: 25, hour: 13, minute: 20 },
                      endTime: { month: 5, day: 4, hour: 14, minute: 10 },
                      instructors: [
                        {
                          email: 'wienholts@chem.wisc.edu',
                          name: { first: 'Johanna', last: 'Wienholts' },
                        },
                      ],
                    },
                  ],
                  credit: 1,
                  isAsynchronous: false,
                  onlineOnly: false,
                },
                {
                  id: '012921-1234-21120',
                  sessionId: '21120',
                  meetings: [
                    {
                      buildingName: 'Mosse Humanities Building',
                      room: '2340',
                      meetingDaysList: ['MONDAY', 'WEDNESDAY'],
                      meetingType: 'LEC',
                      startTime: { month: 1, day: 25, hour: 13, minute: 20 },
                      endTime: { month: 5, day: 4, hour: 14, minute: 10 },
                      instructors: [
                        {
                          email: 'mrkoester@chem.wisc.edu',
                          name: { first: 'Matthew', last: 'Koester' },
                        },
                      ],
                    },
                  ],
                  credit: 1,
                  isAsynchronous: false,
                  onlineOnly: false,
                },
                {
                  id: '012921-1234-13897',
                  sessionId: '13897',
                  meetings: [
                    {
                      buildingName: 'Mosse Humanities Building',
                      room: '2340',
                      meetingDaysList: ['MONDAY'],
                      meetingType: 'LEC',
                      startTime: { month: 1, day: 25, hour: 13, minute: 20 },
                      endTime: { month: 5, day: 4, hour: 14, minute: 10 },
                      instructors: [
                        {
                          email: 'tcurry@chem.wisc.edu',
                          name: { first: 'Tom', last: 'Curry' },
                        },
                      ],
                    },
                  ],
                  credit: 1,
                  isAsynchronous: false,
                  onlineOnly: false,
                },
              ],
            },
          },
        });
      } else {
        resolve({
          responseCode: 200,
          content: {
            found: false,
          },
        });
      }
    }, 1000);
  });
}
