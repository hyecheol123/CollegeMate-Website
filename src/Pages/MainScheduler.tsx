/**
 * Main Scheduler page with edit functionality
 * Supports both mobile and desktop layouts with responsive design
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @param {string} termCode - The term code to load schedule for
 */

// React
import React, { useState, useRef, useEffect, useMemo } from 'react';
// Material UI
import {
  Box,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// Component
import SchedulerTable from '../components/MainScheduler/SchedulerTable';
import SchedulerTitle from '../components/MainScheduler/SchedulerTitle';
import SimpleHeader from '../components/Mvp/SimpleHeader/SimpleHeader';
import EditSchedulerPanel from '../components/MainScheduler/EditSchedulerPanel';
// API and Utils
import { getTerms } from '../data/Terms/getTerms';
import { getCurrentTerm, getUpcomingTerms } from '../utils/termUtils';
import { downloadScheduleAsWallpaper } from '../utils/scheduleDownload';
// Types
import type { EventData } from '../types/event';
import type { Term } from '../data/Terms/getTerms';
import DownloadPopup from '../components/Schedule/Download';

// Online course interface (matching EditSchedulerPanel)
interface OnlineCourse {
  id: string;
  designation: string;
  instructor: string;
  credits?: string;
  color: string;
}

// Helper functions for localStorage
/**
 * Load schedule data from localStorage for a given term
 * @param {string} termCode - The term code to load data for
 * @returns {{ events: EventData[]; courses: OnlineCourse[] }} The loaded schedule data
 */
const loadScheduleDataFromStorage = (
  termCode: string,
): { events: EventData[]; courses: OnlineCourse[] } => {
  try {
    const eventsKey = `collegemate_schedule_events_${termCode}`;
    const coursesKey = `collegemate_online_courses_${termCode}`;

    const savedEvents = localStorage.getItem(eventsKey);
    const savedCourses = localStorage.getItem(coursesKey);

    return {
      events: savedEvents ? JSON.parse(savedEvents) : [],
      courses: savedCourses ? JSON.parse(savedCourses) : [],
    };
  } catch (error) {
    console.error('Error loading schedule data from localStorage:', error);
    return { events: [], courses: [] };
  }
};

const saveScheduleDataToStorage = (
  termCode: string,
  events: EventData[],
  courses: OnlineCourse[],
): void => {
  try {
    const eventsKey = `collegemate_schedule_events_${termCode}`;
    const coursesKey = `collegemate_online_courses_${termCode}`;

    localStorage.setItem(eventsKey, JSON.stringify(events));
    localStorage.setItem(coursesKey, JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving schedule data to localStorage:', error);
  }
};

/**
 * MainScheduler component with responsive layout.
 * Desktop: Side-by-side scheduler and edit panel (55%/45% split).
 * Mobile: Stacked layout with scheduler maintaining consistent size.
 * @returns {React.ReactElement} The rendered MainScheduler page
 */
function MainScheduler(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [scheduleEvents, setScheduleEvents] = useState<EventData[]>([]);
  const [onlineCourses, setOnlineCourses] = useState<OnlineCourse[]>([]);
  const [availableTerms, setAvailableTerms] = useState<Term[]>([]);
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate total credits with useMemo
  const totalCreditsText = useMemo(() => {
    let totalCredits = 0;
    const allCourseIds = new Set<string>();

    // Add credits from online courses
    onlineCourses.forEach((course) => {
      if (course.credits) {
        const courseId = course.id.split('-')[0];
        allCourseIds.add(courseId);
        const creditValue = parseInt(course.credits.split('-')[0]) || 0;
        totalCredits += creditValue;
      }
    });

    // Add credits from scheduled events (only if not already counted as online)
    scheduleEvents.forEach((event) => {
      const parts = event.id.split('-');
      const courseId = parts[0];

      if (!allCourseIds.has(courseId) && event.credits) {
        allCourseIds.add(courseId);
        const creditValue = parseInt(event.credits.split('-')[0]) || 0;
        totalCredits += creditValue;
      }
    });

    return `${totalCredits} credits`;
  }, [scheduleEvents, onlineCourses]);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const schedulerRef = useRef<HTMLDivElement>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleEditToggle = (): void => {
    setIsEditMode((prev) => {
      const newEditMode = !prev;

      // Auto-scroll to search panel on mobile when entering edit mode
      if (newEditMode && isMobile) {
        // Small delay to ensure the panel is rendered before scrolling
        setTimeout(() => {
          if (searchPanelRef.current) {
            searchPanelRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 100);
      }

      return newEditMode;
    });
  };

  const handleDownload = async (): Promise<boolean> => {
    try {
      await downloadScheduleAsWallpaper({
        schedulerRef,
        selectedSize,
      });
      // Reset selectedSize after successful download
      setSelectedSize({ width: 0, height: 0 });
      return true; // Download succeeded
    } catch (error) {
      console.error('Download failed:', error);
      return false; // Download failed
    }
  };

  // Load terms on component mount
  useEffect(() => {
    const loadTerms = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const CACHE_KEY = 'collegemate_terms_cache';
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        const cachedData = localStorage.getItem(CACHE_KEY);
        let termsData;

        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

            if (!isExpired && parsed.data) {
              termsData = parsed.data;
            } else {
              termsData = await getTerms();

              // Cache the fresh data
              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                  data: termsData,
                  timestamp: Date.now(),
                }),
              );
            }
          } catch {
            termsData = await getTerms();

            // Cache the fresh data
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                data: termsData,
                timestamp: Date.now(),
              }),
            );
          }
        } else {
          termsData = await getTerms();

          // Cache the data
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: termsData,
              timestamp: Date.now(),
            }),
          );
        }
        const futureTerms = getUpcomingTerms(termsData.terms, 6); // Get next 6 terms
        setAvailableTerms(futureTerms);

        // Set current term
        const current = getCurrentTerm(termsData.terms);
        if (current) {
          setCurrentTerm(current);
          // Load saved data for current term
          const savedData = loadScheduleDataFromStorage(current.termCode);
          setScheduleEvents(savedData.events);
          setOnlineCourses(savedData.courses);
          console.log(
            `📱 Loaded ${savedData.events.length} events and ${savedData.courses.length} online courses for term ${current.termCode}`,
          );
        } else if (futureTerms.length > 0) {
          // If no current term, use the first available future term
          setCurrentTerm(futureTerms[0]);
          const savedData = loadScheduleDataFromStorage(
            futureTerms[0].termCode,
          );
          setScheduleEvents(savedData.events);
          setOnlineCourses(savedData.courses);
          console.log(
            `📱 Loaded ${savedData.events.length} events and ${savedData.courses.length} online courses for term ${futureTerms[0].termCode}`,
          );
        }
      } catch (error) {
        console.error('❌ Failed to load terms:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load terms',
        );
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, []);

  // Auto-save schedule data when events or courses change (with debouncing)
  useEffect(() => {
    if (currentTerm) {
      const timeoutId = setTimeout(() => {
        saveScheduleDataToStorage(
          currentTerm.termCode,
          scheduleEvents,
          onlineCourses,
        );
      }, 100); // 100ms debounce

      return (): void => clearTimeout(timeoutId);
    }
  }, [scheduleEvents, onlineCourses, currentTerm]);

  // Handle term change
  const handleTermChange = (newTerm: Term): void => {
    // Save current data to localStorage (handled by useEffect automatically)

    // Switch to new term
    setCurrentTerm(newTerm);

    // Load events and online courses for new term from localStorage
    const savedData = loadScheduleDataFromStorage(newTerm.termCode);
    setScheduleEvents(savedData.events);
    setOnlineCourses(savedData.courses);
    console.log(
      `🔄 Switched to term ${newTerm.termCode}, loaded ${savedData.events.length} events and ${savedData.courses.length} online courses`,
    );

    // Exit edit mode when switching terms
    setIsEditMode(false);
  };

  const addEvent = (event: EventData): void => {
    setScheduleEvents((prev) => [...prev, event]);
  };

  const addOnlineCourse = (course: OnlineCourse): void => {
    setOnlineCourses((prev) => {
      // Check if this course is already added
      const isDuplicate = prev.some(
        (existingCourse) => existingCourse.id === course.id,
      );

      if (isDuplicate) {
        return prev; // Don't add duplicate
      }

      return [...prev, course];
    });
  };

  const removeOnlineCourse = (courseId: string): void => {
    // Remove from online courses
    setOnlineCourses((prev) => prev.filter((course) => course.id !== courseId));

    // Also remove corresponding schedule events (courseId format: "courseId-sectionNumber")
    const courseIdOnly = courseId.split('-')[0];
    setScheduleEvents((prev) =>
      prev.filter((event) => !event.id.startsWith(`${courseIdOnly}-`)),
    );
  };

  const updateEventColorsByClassId = (
    sectionId: string,
    color: string,
  ): void => {
    setScheduleEvents((prev) =>
      prev.map((event) => {
        // Check if this event belongs to the section being updated
        // Event IDs are in format: "courseId-sectionNumber-day"
        // Section IDs are in format: "courseId-sectionNumber"
        if (event.id.startsWith(`${sectionId}-`)) {
          return { ...event, color };
        }
        return event;
      }),
    );
  };

  const updateEventColorByEventId = (eventId: string, color: string): void => {
    // Extract sectionId from eventId (format: "courseId-sectionNumber-day")
    const parts = eventId.split('-');
    if (parts.length >= 2) {
      const sectionId = `${parts[0]}-${parts[1]}`;
      updateEventColorsByClassId(sectionId, color);
    }
  };

  const removeEvent = (eventId: string): void => {
    // Extract the class and section ID from the event ID (format: "courseId-sectionId-day")
    const courseId = eventId.split('-')[0];
    const sectionId = eventId.split('-')[1];

    // Determine section type from the event title
    const removedEvent = scheduleEvents.find((e) => e.id === eventId);
    if (!removedEvent) return;

    const isDiscussion = removedEvent.title.includes('Discussion');
    const isLab = removedEvent.title.includes('Lab');
    const isLecture = !isDiscussion && !isLab;

    // Get all sections for this course
    const courseEvents = scheduleEvents.filter((event) =>
      event.id.startsWith(`${courseId}-`),
    );

    let sectionsToRemove: string[] = [];

    if (isDiscussion || isLab) {
      // If removing Discussion or Lab, also remove the related Lecture
      sectionsToRemove = courseEvents
        .filter((event) => {
          const eventSectionId = event.id.split('-')[1];
          const eventIsDiscussion = event.title.includes('Discussion');
          const eventIsLab = event.title.includes('Lab');
          const eventIsLecture = !eventIsDiscussion && !eventIsLab;

          // Remove the current section and any lecture from the same course
          return eventSectionId === sectionId || eventIsLecture;
        })
        .map((event) => event.id.split('-')[1]);
    } else if (isLecture) {
      // If removing Lecture, also remove all related Discussion and Lab sections
      sectionsToRemove = courseEvents.map((event) => event.id.split('-')[1]);
    }

    // Remove all events from the identified sections
    const sectionsToRemoveSet = new Set(sectionsToRemove);
    setScheduleEvents((prev) =>
      prev.filter((event) => {
        const eventCourseId = event.id.split('-')[0];
        const eventSectionId = event.id.split('-')[1];

        if (eventCourseId !== courseId) return true;
        return !sectionsToRemoveSet.has(eventSectionId);
      }),
    );

    // Also remove corresponding online courses
    sectionsToRemove.forEach((sectionToRemove) => {
      const onlineCourseId = `${courseId}-${sectionToRemove}`;
      setOnlineCourses((prev) =>
        prev.filter((course) => course.id !== onlineCourseId),
      );
    });
  };

  // Remove conflicting events - for conflict resolution only
  const removeConflictingEvent = (eventId: string): void => {
    console.log(`🗑️ Removing conflicting event: ${eventId}`);
    setScheduleEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <SimpleHeader />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress size={40} />
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <SimpleHeader />
        <Box sx={{ padding: '16px' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please make sure the Express API server is running on port 3001.
            <br />
            Run: <code>npm run dev:full</code> to start both servers.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SimpleHeader />
      <SchedulerTitle
        onEditClick={handleEditToggle}
        isEditMode={isEditMode}
        currentTerm={currentTerm}
        availableTerms={availableTerms}
        onTermChange={handleTermChange}
        onDownloadClick={() => setIsDownloadOpen(true)}
      />

      {/* Main Content Area */}
      {isMobile ? (
        <Box
          sx={{
            padding: '0 16px',
            overflow: 'auto',
          }}
        >
          {/* Mobile: Scheduler always same size */}
          <Box ref={schedulerRef}>
            <SchedulerTable
              events={scheduleEvents}
              onRemoveEvent={removeEvent}
              onEventColorChange={updateEventColorByEventId}
              isEditMode={isEditMode}
            />
          </Box>

          {/* Online Classes Display */}
          {onlineCourses.length > 0 && (
            <Box
              sx={{
                marginTop: '9px',
                backgroundColor: 'white',
                padding: '2px 0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '0px',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'book',
                    color: '#494949',
                  }}
                >
                  Online classes:{' '}
                </Typography>
                {onlineCourses.map((course, index) => (
                  <Box
                    key={course.id}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 'book',
                        color: '#494949',
                      }}
                    >
                      {course.designation}
                    </Typography>
                    {isEditMode && (
                      <IconButton
                        size="small"
                        onClick={() => removeOnlineCourse(course.id)}
                        sx={{
                          minWidth: '16px',
                          width: '16px',
                          height: '16px',
                          padding: 0,
                          marginLeft: '2px',
                          color: '#666',
                          '&:hover': {
                            color: '#ff4444',
                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: '12px' }} />
                      </IconButton>
                    )}
                    {index < onlineCourses.length - 1 && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '14px',
                          fontWeight: 'book',
                          color: '#494949',
                        }}
                      >
                        ,
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Credits Display - Always visible */}
          <Box
            sx={{
              marginTop: '8px',
              backgroundColor: 'white',
              padding: '0px 0',
              minHeight: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '14px',
                fontWeight: 'book',
                color: '#494949',
              }}
            >
              {totalCreditsText}
            </Typography>
          </Box>

          {/* Mobile: Search panel below when in edit mode */}
          {isEditMode && (
            <Box
              ref={searchPanelRef}
              sx={{ width: '100%', minHeight: 'auto', marginTop: '-3px' }}
            >
              <EditSchedulerPanel
                onAddEvent={addEvent}
                onUpdateEventColor={updateEventColorsByClassId}
                onAddOnlineCourse={addOnlineCourse}
                onRemoveConflictingEvents={removeConflictingEvent}
                currentTerm={currentTerm}
                existingEvents={scheduleEvents}
              />
            </Box>
          )}
        </Box>
      ) : /* Desktop */
      isEditMode ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '32px',
            alignItems: 'flex-start',
            padding: '0 32px',
            width: '100%',
            overflow: 'hidden',
            height: 'calc(100vh - 140px)', // Adjust based on header height
          }}
        >
          {/* Scheduler Section */}
          <Box
            sx={{
              flex: '1 1 60%',
              width: '60%',
              overflow: 'visible',
              position: 'sticky',
              top: '0px',
            }}
          >
            <Box ref={schedulerRef}>
              <SchedulerTable
                events={scheduleEvents}
                onRemoveEvent={removeEvent}
                onEventColorChange={updateEventColorByEventId}
                isEditMode={isEditMode}
              />
            </Box>

            {/* Online Classes Display - Always show credits */}
            <Box
              sx={{
                marginTop: '8px',
                backgroundColor: 'white',
                padding: '2px 0',
              }}
            >
              {onlineCourses.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '0px',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'book',
                      color: '#494949',
                    }}
                  >
                    Online classes:{' '}
                  </Typography>
                  {onlineCourses.map((course, index) => (
                    <Box
                      key={course.id}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '14px',
                          fontWeight: 'book',
                          color: '#494949',
                        }}
                      >
                        {course.designation}
                      </Typography>
                      {isEditMode && (
                        <IconButton
                          size="small"
                          onClick={() => removeOnlineCourse(course.id)}
                          sx={{
                            minWidth: '16px',
                            width: '16px',
                            height: '16px',
                            padding: 0,
                            marginLeft: '2px',
                            color: '#666',
                            '&:hover': {
                              color: '#ff4444',
                              backgroundColor: 'rgba(255, 68, 68, 0.1)',
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: '12px' }} />
                        </IconButton>
                      )}
                      {index < onlineCourses.length - 1 && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 'book',
                            color: '#494949',
                          }}
                        >
                          ,
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Credits Display */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontWeight: 'book',
                  color: '#494949',
                  marginTop: '8px',
                }}
              >
                {totalCreditsText}
              </Typography>
            </Box>
          </Box>

          {/* Search Panel Section */}
          <Box
            ref={searchPanelRef}
            sx={{
              flex: '1 1 35%',
              minWidth: '350px',
              maxWidth: '420px',
              height: 'calc(100vh - 140px)',
              overflowY: 'auto',
            }}
          >
            <EditSchedulerPanel
              onAddEvent={addEvent}
              onUpdateEventColor={updateEventColorsByClassId}
              onAddOnlineCourse={addOnlineCourse}
              onRemoveConflictingEvents={removeConflictingEvent}
              currentTerm={currentTerm}
              existingEvents={scheduleEvents}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ padding: '0 32px', overflow: 'visible' }}>
          <Box ref={schedulerRef}>
            <SchedulerTable
              events={scheduleEvents}
              onRemoveEvent={removeEvent}
              onEventColorChange={updateEventColorByEventId}
              isEditMode={isEditMode}
            />
          </Box>

          {/* Online Classes and Credits Display */}
          <Box
            sx={{
              marginTop: '8px',
              backgroundColor: 'white',
              padding: '2px 0',
            }}
          >
            {/* Online Classes Display */}
            {onlineCourses.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '0px',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'book',
                    color: '#494949',
                  }}
                >
                  Online classes:{' '}
                </Typography>
                {onlineCourses.map((course, index) => (
                  <Box
                    key={course.id}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 'book',
                        color: '#494949',
                      }}
                    >
                      {course.designation}
                    </Typography>
                    {isEditMode && (
                      <IconButton
                        size="small"
                        onClick={() => removeOnlineCourse(course.id)}
                        sx={{
                          minWidth: '16px',
                          width: '16px',
                          height: '16px',
                          padding: 0,
                          marginLeft: '2px',
                          color: '#666',
                          '&:hover': {
                            color: '#ff4444',
                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: '12px' }} />
                      </IconButton>
                    )}
                    {index < onlineCourses.length - 1 && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '14px',
                          fontWeight: 'book',
                          color: '#494949',
                        }}
                      >
                        ,
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Credits Display */}
            <Typography
              variant="body2"
              sx={{
                fontSize: '14px',
                fontWeight: 'book',
                color: '#494949',
                marginTop: '8px',
              }}
            >
              {totalCreditsText}
            </Typography>
          </Box>
        </Box>
      )}
      {isDownloadOpen && (
        <DownloadPopup
          onClose={() => setIsDownloadOpen(false)}
          onDownload={handleDownload}
          onSelectSize={(size) => setSelectedSize(size)}
        />
      )}
    </Box>
  );
}

export default MainScheduler;
