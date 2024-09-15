/**
 * This file provides a mock API for get the detail of schedule
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

interface IResponse {
  responseCode: number;
  content?: {
    email: string;
    termCode: string;
    sessionList: Array<{
      id: string;
      courseId: string;
      termCode: string;
      sessionId: string;
      courseName: string;
      description: string;
      fullCourseName: string;
      title: string;
      meetings: Array<{
        buildingName?: string;
        room?: string;
        meetingDaysList?: Array<
          | 'MONDAY'
          | 'TUESDAY'
          | 'WEDNESDAY'
          | 'THURSDAY'
          | 'FRIDAY'
          | 'SATURDAY'
          | 'SUNDAY'
        >;
        meetingType: string;
        startTime: {
          month: number; // [1..12]
          day: number; // [1..31]
          hour?: number; // [0..23]
          minute?: number; //[0..59]
        };
        endTime: {
          month: number; // [1..12]
          day: number; // [1..31]
          hour?: number; // [0..23]
          minute?: number; //[0..59]
        };
        instructors: Array<{
          campusId?: string;
          email: string;
          name: {
            first: string;
            last: string;
          };
        }>;
      }>;
      credit: number; // >= 0
      isAsynchronous: boolean;
      onlineOnly: boolean;
      topic?: string;
      colorCode: number; // [0..15]
    }>;
    eventList: Array<{
      id: string;
      title: string;
      location?: string;
      meetingDaysList: Array<
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY'
      >;
      startTime: {
        month: number; // [1..12]
        day: number; // [1..31]
        hour: number; // [0..23]
        minute: number; // [0..59]
      };
      endTime: {
        month: number; // [1..12]
        day: number; // [1..31]
        hour: number; // [0..23]
        minute: number; // [0..59]
      };
      memo?: string;
      colorCode: number; // [0..15]
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
                    buildingName: 'Building A',
                    room: '101',
                    meetingDaysList: ['MONDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 3, day: 10, hour: 9, minute: 0 },
                    endTime: { month: 3, day: 10, hour: 12, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst1',
                        email: 'examiner1@school.edu',
                        name: { first: 'Alice', last: 'Smith' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building B',
                    room: '202',
                    meetingDaysList: ['WEDNESDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 4, day: 15, hour: 14, minute: 0 },
                    endTime: { month: 4, day: 15, hour: 17, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst2',
                        email: 'examiner2@school.edu',
                        name: { first: 'Bob', last: 'Johnson' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building B',
                    room: '202',
                    meetingDaysList: ['WEDNESDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 4, day: 15, hour: 14, minute: 0 },
                    endTime: { month: 4, day: 15, hour: 17, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst2',
                        email: 'examiner2@school.edu',
                        name: { first: 'Bob', last: 'Johnson' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building B',
                    room: '202',
                    meetingDaysList: ['WEDNESDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 4, day: 15, hour: 14, minute: 0 },
                    endTime: { month: 4, day: 15, hour: 17, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst2',
                        email: 'examiner2@school.edu',
                        name: { first: 'Bob', last: 'Johnson' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building B',
                    room: '202',
                    meetingDaysList: ['WEDNESDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 4, day: 15, hour: 14, minute: 0 },
                    endTime: { month: 4, day: 15, hour: 17, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst2',
                        email: 'examiner2@school.edu',
                        name: { first: 'Bob', last: 'Johnson' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building B',
                    room: '202',
                    meetingDaysList: ['WEDNESDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 4, day: 15, hour: 14, minute: 0 },
                    endTime: { month: 4, day: 15, hour: 17, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst2',
                        email: 'examiner2@school.edu',
                        name: { first: 'Bob', last: 'Johnson' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building C',
                    room: '303',
                    meetingDaysList: ['FRIDAY'],
                    meetingType: 'EXAM',
                    startTime: { month: 5, day: 20, hour: 10, minute: 0 },
                    endTime: { month: 5, day: 20, hour: 13, minute: 0 },
                    instructors: [
                      {
                        campusId: 'exam-inst3',
                        email: 'examiner3@school.edu',
                        name: { first: 'Charlie', last: 'Brown' },
                      },
                    ],
                  },
                  {
                    buildingName: 'Building D',
                    room: '404',
                    meetingDaysList: ['THURSDAY'],
                    meetingType: 'Blah',
                    startTime: { month: 6, day: 5, hour: 11, minute: 30 },
                    endTime: { month: 6, day: 5, hour: 13, minute: 0 },
                    instructors: [
                      {
                        campusId: 'blah-inst1',
                        email: 'blahteacher@school.edu',
                        name: { first: 'David', last: 'Lee' },
                      },
                    ],
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
