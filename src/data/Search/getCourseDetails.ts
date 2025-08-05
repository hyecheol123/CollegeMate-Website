/**
 * API integration for UW-Madison course details
 * Fetches detailed enrollment packages for specific courses
 * @author Generated for CollegeMate
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

const CACHE_KEY_PREFIX = 'uw_course_details_cache_';
const CACHE_DURATION = 1000 * 60 * 60; // 1시간

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
  courseId: string
): Promise<CourseDetailsResponse> {
  try {
    // Create cache key
    const cacheKey = `${CACHE_KEY_PREFIX}${termCode}_${subjectCode}_${courseId}`;
    
    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const ageMinutes = Math.floor(age / (1000 * 60));
        
        if (age < CACHE_DURATION) {
          console.log(`💾 Using cached course details (${ageMinutes}분 전 캐시)`);
          console.log(`📊 Cached: ${data.packages?.length || 0} packages for ${subjectCode} ${courseId}`);
          return data;
        } else {
          console.log(`⏰ Cache expired (${ageMinutes}분 전), fetching fresh data...`);
        }
      } catch (e) {
        console.log('🗑️ Invalid cache, fetching fresh data...');
        localStorage.removeItem(cacheKey);
      }
    }

    console.log(`🔄 Fetching course details: ${subjectCode} ${courseId} (term ${termCode})...`);

    const response = await fetch(`/api/course-details/${termCode}/${encodeURIComponent(subjectCode)}/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Course details API error ${response.status}: ${errorText}`);
    }

    const packages = await response.json();
    const data: CourseDetailsResponse = { packages };
    
    console.log('✅ Successfully fetched course details!');
    console.log(`📊 Found ${packages?.length || 0} enrollment packages`);

    // Cache the results
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('💾 Course details cached for 1 hour');

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch course details:', error);
    throw error; // Re-throw to let components handle the error
  }
}

/**
 * Batch fetch multiple course details
 * @param {string} termCode - The term code
 * @param {Array<{subjectCode: string, courseId: string}>} courses - Array of courses to fetch
 * @returns {Promise<CourseDetailsResponse[]>} Promise resolving to array of course details
 */
export async function getCourseDetailsBatch(
  termCode: string,
  courses: Array<{subjectCode: string, courseId: string}>
): Promise<CourseDetailsResponse[]> {
  console.log(`🔄 Batch fetching details for ${courses.length} courses...`);
  
  const promises = courses.map(course => 
    getCourseDetails(termCode, course.subjectCode, course.courseId)
  );
  
  const results = await Promise.allSettled(promises);
  
  const successful = results
    .filter((result): result is PromiseFulfilledResult<CourseDetailsResponse> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
    
  const failed = results.filter(result => result.status === 'rejected').length;
  
  console.log(`✅ Batch fetch completed: ${successful.length} successful, ${failed} failed`);
  
  return successful;
}