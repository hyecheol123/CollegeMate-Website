/**
 * Main Scheduler page with edit functionality
 * Supports both mobile and desktop layouts with responsive design
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useRef, useEffect } from 'react';
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
// Types
import type { EventData } from '../types/event';
import type { Term } from '../data/Terms/getTerms';

// Online course interface (matching EditSchedulerPanel)
interface OnlineCourse {
  id: string;
  designation: string;
  instructor: string;
  credits?: string;
  color: string;
}

/**
 * MainScheduler component with responsive layout
 * - Desktop: Side-by-side scheduler and edit panel (55%/45% split)
 * - Mobile: Stacked layout with scheduler maintaining consistent size
 * @return {React.ReactElement} The rendered MainScheduler page
 */
function MainScheduler(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [scheduleEvents, setScheduleEvents] = useState<EventData[]>([]);
  const [onlineCourses, setOnlineCourses] = useState<OnlineCourse[]>([]);
  const [availableTerms, setAvailableTerms] = useState<Term[]>([]);
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [scheduleEventsByTerm, setScheduleEventsByTerm] = useState<
    Record<string, EventData[]>
  >({});
  const [onlineCoursesByTerm, setOnlineCoursesByTerm] = useState<
    Record<string, OnlineCourse[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchPanelRef = useRef<HTMLDivElement>(null);

  const handleEditToggle = (): void => {
    setIsEditMode((prev) => !prev);
  };

  // Load terms on component mount
  useEffect(() => {
    const loadTerms = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const termsData = await getTerms();
        const futureTerms = getUpcomingTerms(termsData.terms, 6); // Get next 6 terms
        setAvailableTerms(futureTerms);

        // Set current term
        const current = getCurrentTerm(termsData.terms);
        if (current) {
          setCurrentTerm(current);
          // Initialize with empty events and online courses for current term
          setScheduleEvents([]);
          setOnlineCourses([]);
        } else if (futureTerms.length > 0) {
          // If no current term, use the first available future term
          setCurrentTerm(futureTerms[0]);
          setScheduleEvents([]);
          setOnlineCourses([]);
        }
      } catch (error) {
        console.error('Failed to load terms:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load terms',
        );
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, []);

  // Auto-scroll to search panel on mobile when edit mode is activated
  useEffect(() => {
    if (isEditMode && isMobile && searchPanelRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        searchPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [isEditMode, isMobile]);

  // Handle term change
  const handleTermChange = (newTerm: Term): void => {
    // Save current events and online courses for the current term
    if (currentTerm) {
      setScheduleEventsByTerm((prev) => ({
        ...prev,
        [currentTerm.termCode]: scheduleEvents,
      }));
      setOnlineCoursesByTerm((prev) => ({
        ...prev,
        [currentTerm.termCode]: onlineCourses,
      }));
    }

    // Switch to new term
    setCurrentTerm(newTerm);

    // Load events and online courses for new term (if any saved)
    const savedEvents = scheduleEventsByTerm[newTerm.termCode] || [];
    const savedOnlineCourses = onlineCoursesByTerm[newTerm.termCode] || [];
    setScheduleEvents(savedEvents);
    setOnlineCourses(savedOnlineCourses);

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
        console.log('⚠️ Duplicate online course detected:', course.designation);
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

  const updateEventColorsByClassId = (sectionId: string, color: string): void => {
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

  const removeEvent = (eventId: string): void => {
    // Extract the class and section ID from the event ID (format: "courseId-sectionId-day")
    const courseId = eventId.split('-')[0];
    const sectionId = eventId.split('-')[1];

    // Remove all events that belong to the same course and section
    setScheduleEvents((prev) =>
      prev.filter((event) => !event.id.startsWith(`${courseId}-${sectionId}-`)),
    );

    // Also remove corresponding online course
    const onlineCourseId = `${courseId}-${sectionId}`;
    setOnlineCourses((prev) =>
      prev.filter((course) => course.id !== onlineCourseId),
    );
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
            height: '200px',
            gap: 2,
          }}
        >
          <CircularProgress size={24} />
          <Typography>Loading terms...</Typography>
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
      />

      {/* Main Content Area */}
      {isMobile ? (
        <Box sx={{ padding: '0 16px', overflow: 'visible' }}>
          {/* Mobile: Scheduler always same size */}
          <SchedulerTable
            events={scheduleEvents}
            onRemoveEvent={removeEvent}
            isEditMode={isEditMode}
          />

          {/* Online Classes Display */}
          {onlineCourses.length > 0 && (
            <Box
              sx={{
                marginTop: '16px',
                backgroundColor: 'white',
                padding: '8px 0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '12px',
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
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontWeight: 'book',
                  color: '#494949',
                }}
              >
                {((): string => {
                  let totalCredits = 0;
                  const allCourseIds = new Set<string>();

                  // Add credits from online courses
                  onlineCourses.forEach((course) => {
                    if (course.credits) {
                      allCourseIds.add(course.id);
                      const creditValue =
                        parseInt(course.credits.split('-')[0]) || 0;
                      totalCredits += creditValue;
                    }
                  });

                  // Add credits from scheduled events (only if not already counted as online)
                  scheduleEvents.forEach((event) => {
                    const parts = event.id.split('-');
                    const courseId = parts[0];
                    const sectionId = parts[1];
                    const uniqueId = `${courseId}-${sectionId}`;

                    if (!allCourseIds.has(uniqueId) && event.credits) {
                      allCourseIds.add(uniqueId);
                      const creditValue =
                        parseInt(event.credits.split('-')[0]) || 0;
                      totalCredits += creditValue;
                    }
                  });

                  return `${totalCredits} credits`;
                })()}
              </Typography>
            </Box>
          )}
          {/* Mobile: Search panel below when in edit mode */}
          {isEditMode && (
            <Box
              ref={searchPanelRef}
              sx={{ marginTop: '8px', width: '100%', minHeight: 'auto' }}
            >
              <EditSchedulerPanel
                onAddEvent={addEvent}
                onUpdateEventColor={updateEventColorsByClassId}
                onAddOnlineCourse={addOnlineCourse}
                currentTerm={currentTerm}
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
            <SchedulerTable
              events={scheduleEvents}
              onRemoveEvent={removeEvent}
              isEditMode={isEditMode}
            />

            {/* Online Classes Display - Always show credits */}
            <Box
              sx={{
                marginTop: '8px',
                backgroundColor: 'white',
                padding: '8px 0',
              }}
            >
              {onlineCourses.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '4px',
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
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontWeight: 'book',
                  color: '#494949',
                }}
              >
                {((): string => {
                  let totalCredits = 0;
                  const allCourseIds = new Set<string>();

                  // Add credits from online courses
                  onlineCourses.forEach((course) => {
                    if (course.credits) {
                      allCourseIds.add(course.id);
                      const creditValue =
                        parseInt(course.credits.split('-')[0]) || 0;
                      totalCredits += creditValue;
                    }
                  });

                  // Add credits from scheduled events (only if not already counted as online)
                  scheduleEvents.forEach((event) => {
                    const parts = event.id.split('-');
                    const courseId = parts[0];
                    const sectionId = parts[1];
                    const uniqueId = `${courseId}-${sectionId}`;

                    if (!allCourseIds.has(uniqueId) && event.credits) {
                      allCourseIds.add(uniqueId);
                      const creditValue =
                        parseInt(event.credits.split('-')[0]) || 0;
                      totalCredits += creditValue;
                    }
                  });

                  return `${totalCredits} credits`;
                })()}
              </Typography>
            </Box>
          </Box>

          {/* Search Panel Section */}
          <Box
            ref={searchPanelRef}
            sx={{
              flex: '1 1 40%',
              minWidth: '350px',
              maxWidth: '500px',
              height: 'calc(100vh - 140px)',
              overflowY: 'auto',
            }}
          >
            <EditSchedulerPanel
              onAddEvent={addEvent}
              onUpdateEventColor={updateEventColorsByClassId}
              onAddOnlineCourse={addOnlineCourse}
              currentTerm={currentTerm}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ padding: '0 32px', overflow: 'visible' }}>
          <SchedulerTable
            events={scheduleEvents}
            onRemoveEvent={removeEvent}
            isEditMode={isEditMode}
          />

          {/* Online Classes Display */}
          {onlineCourses.length > 0 && (
            <Box
              sx={{
                marginTop: '16px',
                backgroundColor: 'white',
                padding: '8px 0',
                zIndex: 10,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '12px',
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
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontWeight: 'book',
                  color: '#494949',
                }}
              >
                {((): string => {
                  let totalCredits = 0;
                  const allCourseIds = new Set<string>();

                  // Add credits from online courses
                  onlineCourses.forEach((course) => {
                    if (course.credits) {
                      allCourseIds.add(course.id);
                      const creditValue =
                        parseInt(course.credits.split('-')[0]) || 0;
                      totalCredits += creditValue;
                    }
                  });

                  // Add credits from scheduled events (only if not already counted as online)
                  scheduleEvents.forEach((event) => {
                    const parts = event.id.split('-');
                    const courseId = parts[0];
                    const sectionId = parts[1];
                    const uniqueId = `${courseId}-${sectionId}`;

                    if (!allCourseIds.has(uniqueId) && event.credits) {
                      allCourseIds.add(uniqueId);
                      const creditValue =
                        parseInt(event.credits.split('-')[0]) || 0;
                      totalCredits += creditValue;
                    }
                  });

                  return `${totalCredits} credits`;
                })()}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default MainScheduler;
