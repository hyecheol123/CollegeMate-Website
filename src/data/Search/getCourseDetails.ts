/**
 * API integration for UW-Madison course details
 * Fetches detailed enrollment packages for specific courses
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

export interface CourseInstructor {
  campusId?: string;
  email: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
}

export interface CourseMeeting {
  buildingName?: string;
  room?: string;
  meetingDaysList: string[];
  meetingType: string;
  meetingTimeStart: number;
  meetingTimeEnd: number;
  instructors: CourseInstructor[];
}

export interface CourseSection {
  id: string;
  topic?: string;
  startDate: number;
  endDate: number;
  classMeetings: CourseMeeting[];
  instructors: CourseInstructor[];
}

export interface CourseEnrollmentPackage {
  termCode: string;
  courseId: string;
  id: string;
  creditRange: string;
  isAsynchronous: boolean;
  onlineOnly: boolean;
  sections: CourseSection[];
}

export interface CourseDetailsResponse {
  packages: CourseEnrollmentPackage[];
}

/**
 * Fetches detailed course information from UW-Madison enrollment API
 * @param {string} termCode - The term code
 * @param {string} subjectCode - The subject code (e.g., "COMP SCI")
 * @param {string} courseId - The course ID (e.g., "577")
 * @returns {Promise<CourseDetailsResponse>} Promise resolving to course details
 */
export async function getCourseDetails(
  termCode: string,
  subjectCode: string,
  courseId: string,
): Promise<CourseDetailsResponse> {
  const response = await fetch(
    `https://api.collegemate.app/api/course-details/${termCode}/${encodeURIComponent(subjectCode)}/${courseId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Course details API error ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();

  return data;
}

/**
 * Batch fetch multiple course details
 * @param {string} termCode - The term code
 * @param {Array<{subjectCode: string, courseId: string}>} courses - Array of courses to fetch
 * @returns {Promise<CourseDetailsResponse[]>} Promise resolving to array of course details
 */
export async function getCourseDetailsBatch(
  termCode: string,
  courses: Array<{ subjectCode: string; courseId: string }>,
): Promise<CourseDetailsResponse[]> {
  console.log(`🔄 Batch fetching details for ${courses.length} courses...`);

  const promises = courses.map((course) =>
    getCourseDetails(termCode, course.subjectCode, course.courseId),
  );

  const results = await Promise.allSettled(promises);

  const successful = results
    .filter(
      (result): result is PromiseFulfilledResult<CourseDetailsResponse> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);

  const failed = results.filter(
    (result) => result.status === 'rejected',
  ).length;

  console.log(
    `✅ Batch fetch completed: ${successful.length} successful, ${failed} failed`,
  );

  return successful;
}
