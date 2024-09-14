/**
 * This file provides a mock API for get the detail of schedule
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
interface IResponse {
  responseCode: number;
  content?: {
    email?: string;
    termCode?: string;
    sessionList?: Array<{
      id: string;
      courseId: string;
      termCode: string;
      sessionId: string;
      courseName: string;
      description: string;
      fullCourseName: string;
      title: string;
      meetings: Array<{
        id: string;
        courseId: string;
        termCode: string;
        sessionId: string;
        courseName: string;
        description: string;
        fullCourseName: string;
        title: string;
        credit: number;
        isAsynchronous: boolean;
        onlineOnly: boolean;
        topic: string;
        colorCode: number;
      }>;
      credit: number;
      isAsynchronous: boolean;
      onlineOnly: boolean;
      topic: string;
      colorCode: number;
    }>;
    eventList?: Array<{
      id: string;
      title: string;
      location?: string;
      meetingDaysList: string[];
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
      memo?: string;
      colorCode: number;
    }>;
  };
}

/**
 * Simulates an API call to retrieve the detail of a given schedule.
 * @param {string} scheduleId - ID of the schedule
 * @return {Promise<IResponse>} A promise that resolves to the response of the Get Schedule Detail API call.
 */
export default function getScheduleDetail(
  scheduleId: string,
): Promise<IResponse> {
  console.log(`Retrieving schedule detail for the schedule ID: ${scheduleId}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      if (scheduleId === 'unauthenticated-id') {
        resolve({ responseCode: 401 });
      } else if (scheduleId === 'forbidden-id') {
        resolve({ responseCode: 403 });
      } else if (scheduleId === 'notfound-id') {
        resolve({ responseCode: 404 });
      } else {
        resolve({
          responseCode: 200,
          content: {
            email: 'collegemate@wisc.edu',
            termCode: '1234',
            sessionList: [
              {
                id: 'session1',
                courseId: 'course1',
                termCode: '1',
                sessionId: 'session1',
                courseName: 'Course 1',
                description: 'Description of Course 1',
                fullCourseName: 'Full Course Name 1',
                title: 'Session Title 1',
                meetings: [
                  {
                    id: 'meeting1',
                    courseId: 'course1',
                    termCode: '1234',
                    sessionId: 'session1',
                    courseName: 'Course 1',
                    description: 'Description of Course 1',
                    fullCourseName: 'Full Course Name 1',
                    title: 'Meeting Title 1',
                    credit: 3,
                    isAsynchronous: false,
                    onlineOnly: true,
                    topic: 'Topic 1',
                    colorCode: 1,
                  },
                ],
                credit: 3,
                isAsynchronous: false,
                onlineOnly: true,
                topic: 'Topic 1',
                colorCode: 1,
              },
              {
                id: 'session2',
                courseId: 'course2',
                termCode: '1',
                sessionId: 'session2',
                courseName: 'Online Course 2',
                description: 'Description of Online Course 2',
                fullCourseName: 'Full Course Name 2',
                title: 'Session Title 2',
                meetings: [],
                credit: 3,
                isAsynchronous: false,
                onlineOnly: false,
                topic: 'Topic 2',
                colorCode: 2,
              },
            ],
            eventList: [
              {
                id: 'event1',
                title: 'Event 1',
                location: 'Location 1',
                meetingDaysList: ['MONDAY', 'FRIDAY'],
                startTime: { month: 1, day: 25, hour: 8, minute: 0 },
                endTime: { month: 5, day: 4, hour: 10, minute: 30 },
                memo: 'Memo for Event 1',
                colorCode: 15,
              },
            ],
          },
        });
      }
    }, 1000);
  });
}
