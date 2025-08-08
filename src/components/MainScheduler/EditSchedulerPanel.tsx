/**
 * Edit Scheduler Panel component for searching and adding classes
 * @author Claude AI Assistant
 */

// React
import React, { useState, useEffect } from 'react';
// Types
import type { EventData } from '../../types/event';
// API
import {
  searchClasses,
  type ClassSearchResult,
} from '../../data/Search/searchClasses';
import { getCourseDetails } from '../../data/Search/getCourseDetails';
// Material UI
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// Components
import ColorSelectionModal from '../Common/ColorSelectionModal';
import type { Term } from '../../data/Terms/getTerms';

// Helper function to convert course details to event data (currently unused)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const convertCourseToEvents = (
  course: ClassSearchResult,
  courseDetails: any,
  color: string,
): EventData[] => {
  const events: EventData[] = [];

  if (!courseDetails || !courseDetails.length) {
    return events;
  }

  courseDetails.forEach((enrollmentPackage: any) => {
    enrollmentPackage.sections?.forEach((section: any) => {
      section.classMeetings?.forEach((meeting: any) => {
        // Convert meeting days list to individual days
        meeting.meetingDaysList?.forEach((fullDay: string) => {
          // Convert full day name to 3-letter format
          const dayMap: { [key: string]: string } = {
            MONDAY: 'Mon',
            TUESDAY: 'Tue',
            WEDNESDAY: 'Wed',
            THURSDAY: 'Thu',
            FRIDAY: 'Fri',
            SATURDAY: 'Sat',
            SUNDAY: 'Sun',
          };
          const day = dayMap[fullDay] || fullDay;
          // Convert timestamps to time objects
          const startDate = new Date(meeting.meetingTimeStart);
          const endDate = new Date(meeting.meetingTimeEnd);

          const startTime = {
            hour: startDate.getHours(),
            minute: startDate.getMinutes(),
          };

          const endTime = {
            hour: endDate.getHours(),
            minute: endDate.getMinutes(),
          };

          // Get instructor info
          const instructorNames =
            section.instructors
              ?.map((inst: any) => `${inst.name.first} ${inst.name.last}`)
              .join(', ') || 'TBA';

          // Create unique event ID
          const sectionId = section.id || 'default';
          const eventId = `${course.courseId}-${sectionId}-${day}`;

          events.push({
            id: eventId,
            title: course.courseDesignation,
            startTime,
            endTime,
            day,
            color,
            location:
              meeting.buildingName && meeting.room
                ? `${meeting.buildingName} ${meeting.room}`
                : 'TBA',
            instructor: instructorNames,
          });
        });
      });
    });
  });

  return events;
};

interface EditSchedulerPanelProps {
  onAddEvent?: (event: EventData) => void;
  onUpdateEventColor?: (classId: string, color: string) => void;
  currentTerm?: Term | null;
}

/**
 * EditSchedulerPanel component for searching, customizing, and adding classes
 * Features include: class search, color customization, and responsive button layout
 * @param {EditSchedulerPanelProps} props - Props including callback functions for events
 * @returns {React.ReactElement} The rendered EditSchedulerPanel component
 */
function EditSchedulerPanel({
  onAddEvent,
  onUpdateEventColor,
  currentTerm,
}: EditSchedulerPanelProps): React.ReactElement {
  const [searchInput, setSearchInput] = useState<string>('');
  const [classColors, setClassColors] = useState<{ [key: string]: string }>({});
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ClassSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [courseSections, setCourseSections] = useState<{
    [key: string]: unknown;
  }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const editTitleRef = React.useRef<HTMLHeadingElement>(null);
  const [hasScrolledToResults, setHasScrolledToResults] =
    useState<boolean>(false);

  // Perform search when search input changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchInput.trim() || !currentTerm) {
        setSearchResults([]);
        return;
      }

      if (searchInput.length < 2) {
        return; // Don't search for very short queries
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await searchClasses(
          currentTerm.termCode,
          searchInput,
          1,
          50,
        );
        setSearchResults(response.hits || []);

        // Scroll to edit title if there are search results (or no results) and on mobile (only first time)
        if (
          searchInput.trim() &&
          isMobile &&
          editTitleRef.current &&
          !hasScrolledToResults
        ) {
          setTimeout(() => {
            editTitleRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            setHasScrolledToResults(true);
          }, 100);
        }
      } catch (error) {
        setSearchError(
          error instanceof Error ? error.message : 'Search failed',
        );
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, currentTerm, hasScrolledToResults, isMobile]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchInput(event.target.value);
    // Reset scroll flag when search input changes
    if (event.target.value === '') {
      setHasScrolledToResults(false);
    }
  };

  const handleViewSections = async (
    course: ClassSearchResult,
  ): Promise<void> => {
    if (!currentTerm) return;

    // Toggle expanded state
    if (expandedCourse === course.courseId) {
      setExpandedCourse(null);
      return;
    }

    setExpandedCourse(course.courseId);

    // Check if we already have sections cached
    if (courseSections[course.courseId]) {
      return;
    }

    try {
      const courseDetails = await getCourseDetails(
        currentTerm.termCode,
        course.subject.subjectCode,
        course.courseId,
      );

      setCourseSections((prev) => ({
        ...prev,
        [course.courseId]: courseDetails.packages,
      }));
    } catch {
      // Handle error silently
    }
  };

  const handleAddSection = async (
    course: ClassSearchResult,
    section: any,
  ): Promise<void> => {
    if (!onAddEvent || !currentTerm) {
      return;
    }

    const selectedColor = classColors[course.courseId] || '#9E9E9E';

    // Convert only this section to events
    const events: EventData[] = [];

    section.classMeetings?.forEach((meeting: any) => {
      meeting.meetingDaysList?.forEach((fullDay: string) => {
        const dayMap: { [key: string]: string } = {
          MONDAY: 'Mon',
          TUESDAY: 'Tue',
          WEDNESDAY: 'Wed',
          THURSDAY: 'Thu',
          FRIDAY: 'Fri',
          SATURDAY: 'Sat',
          SUNDAY: 'Sun',
        };
        const day = dayMap[fullDay] || fullDay;

        const startDate = new Date(meeting.meetingTimeStart);
        const endDate = new Date(meeting.meetingTimeEnd);

        const startTime = {
          hour: startDate.getHours(),
          minute: startDate.getMinutes(),
        };

        const endTime = {
          hour: endDate.getHours(),
          minute: endDate.getMinutes(),
        };

        const instructorNames =
          section.instructors
            ?.map((inst: any) => `${inst.name.first} ${inst.name.last}`)
            .join(', ') || 'TBA';

        const sectionId = section.id || 'default';
        const eventId = `${course.courseId}-${sectionId}-${day}`;

        events.push({
          id: eventId,
          title: course.courseDesignation,
          startTime,
          endTime,
          day,
          color: selectedColor,
          location:
            meeting.buildingName && meeting.room
              ? `${meeting.buildingName} ${meeting.room}`
              : 'TBA',
          instructor: instructorNames,
        });
      });
    });

    events.forEach((event) => {
      onAddEvent(event);
    });
  };

  const handleCustomizeColor = (classId: string): void => {
    setSelectedClassId(classId);
    setColorModalOpen(true);
  };

  const handleColorSelect = (color: string): void => {
    if (selectedClassId) {
      setClassColors((prev) => ({
        ...prev,
        [selectedClassId]: color,
      }));

      // Update existing events with the new color
      if (onUpdateEventColor) {
        onUpdateEventColor(selectedClassId, color);
      }
    }
    setColorModalOpen(false);
    setSelectedClassId(null);
  };

  const handleColorModalClose = (): void => {
    setColorModalOpen(false);
    setSelectedClassId(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        margin: 0,
        padding: isMobile ? '16px 16px 0px 16px' : '24px',
        backgroundColor: isMobile ? 'transparent' : 'whiteGrey.main',
        borderRadius: isMobile ? '0px' : '8px',
        border: isMobile ? 'none' : '1px solid #e0e0e0',
      }}
    >
      {/* Panel Title */}
      <Typography
        ref={editTitleRef}
        variant="h2"
        sx={{
          color: 'red.main',
          marginBottom: isMobile ? '16px' : '20px',
          textAlign: 'left',
          marginLeft: isMobile ? '-15px' : '0px', // Align "E" with "2" from "2025 Summer" in mobile only
        }}
      >
        Edit Schedule
      </Typography>

      {/* Search Input */}
      <TextField
        ref={searchRef}
        fullWidth
        variant="outlined"
        placeholder={
          isMobile
            ? 'Search classes (e.g. MUSIC 113)'
            : 'Search for classes (name, code, or instructor)'
        }
        value={searchInput}
        onChange={handleSearchChange}
        size={isMobile ? 'small' : 'medium'}
        sx={{
          marginBottom: isMobile ? '8px' : '6px',
          ...(isMobile && {
            marginLeft: '-15px',
            width: 'calc(100% + 15px)',
          }),
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Results Header */}
      <Typography
        variant="body1"
        sx={{
          marginBottom: isMobile ? '12px' : '6px',
          color: 'darkGrey.main',
          fontWeight: 500,
          marginLeft: isMobile ? '-10px' : '0px',
        }}
      >
        {isSearching
          ? 'Searching...'
          : searchError
            ? 'Search error'
            : searchResults.length > 0
              ? `${searchResults.length} class(es) found`
              : searchInput.trim()
                ? 'No classes found'
                : ''}
      </Typography>

      {/* Class List */}
      <Box
        ref={resultsRef}
        sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {searchError ? (
          <Card sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="body2" color="error">
              Error: {searchError}
            </Typography>
          </Card>
        ) : searchResults.length === 0 && searchInput.trim() && !isSearching ? (
          <Card
            sx={{
              padding: '20px',
              textAlign: 'center',
              marginBottom: isMobile ? '20px' : '0px',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No classes found matching your search.
            </Typography>
          </Card>
        ) : (
          searchResults.map((course, index) => (
            <React.Fragment
              key={`${course.courseId}-${course.subject.subjectCode}-${index}`}
            >
              <Card
                sx={{
                  transition: 'box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ padding: '16px !important' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    {/* Class Info */}
                    <Box sx={{ flex: 1, minWidth: '250px' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <Typography variant="h3" color="red.main">
                          {course.courseDesignation}
                        </Typography>
                        {course.credits && (
                          <Chip
                            label={`${course.credits.min}-${course.credits.max} credits`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '12px' }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          marginBottom: '4px',
                          color: 'darkGrey.main',
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginBottom: '4px' }}
                      >
                        Subject: {course.subject.formalDescription}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: '4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {course.description}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '8px',
                        width: '100%',
                        marginTop: '12px',
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCustomizeColor(course.courseId)}
                        sx={{
                          flex: 1,
                          fontSize: '12px',
                          padding: '6px 12px',
                        }}
                      >
                        Customize Color
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewSections(course)}
                        sx={{
                          flex: 1,
                          fontSize: '12px',
                          padding: '6px 12px',
                        }}
                      >
                        {expandedCourse === course.courseId
                          ? 'Hide Sections'
                          : 'View Sections'}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Expanded Sections */}
              {expandedCourse === course.courseId && (
                <Box
                  sx={{
                    marginLeft: '16px',
                    marginTop: '8px',
                    marginBottom: '12px',
                  }}
                >
                  {!courseSections[course.courseId] ? (
                    <Typography>Loading sections...</Typography>
                  ) : (courseSections[course.courseId] as any[]).length === 0 ? (
                    <Typography>
                      No sections available for this course.
                    </Typography>
                  ) : (
                    (courseSections[course.courseId] as any[]).map(
                      (enrollmentPackage: any, packageIndex: number) =>
                        enrollmentPackage.sections?.map(
                          (section: any, sectionIndex: number) => (
                            <Card
                              key={`${packageIndex}-${sectionIndex}`}
                              sx={{
                                marginBottom: '8px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                              }}
                            >
                              <CardContent sx={{ padding: '12px !important' }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        marginBottom: '4px',
                                      }}
                                    >
                                      Section {section.id || 'N/A'}
                                    </Typography>

                                    {/* Instructor */}
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ marginBottom: '4px' }}
                                    >
                                      Instructor:{' '}
                                      {section.instructors
                                        ?.map(
                                          (inst: any) =>
                                            `${inst.name.first} ${inst.name.last}`,
                                        )
                                        .join(', ') || 'TBA'}
                                    </Typography>

                                    {/* Meeting Times */}
                                    {section.classMeetings?.map(
                                      (meeting: any, meetingIndex: number) => (
                                        <Typography
                                          key={meetingIndex}
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ marginBottom: '2px' }}
                                        >
                                          {meeting.meetingDaysList?.join(', ')}{' '}
                                          •{' '}
                                          {new Date(
                                            meeting.meetingTimeStart,
                                          ).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                          })}{' '}
                                          -{' '}
                                          {new Date(
                                            meeting.meetingTimeEnd,
                                          ).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                          })}
                                          {meeting.buildingName &&
                                            meeting.room && (
                                              <>
                                                {' '}
                                                • {meeting.buildingName}{' '}
                                                {meeting.room}
                                              </>
                                            )}
                                        </Typography>
                                      ),
                                    )}
                                  </Box>

                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      handleAddSection(course, section)
                                    }
                                    sx={{
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      minWidth: '80px',
                                    }}
                                  >
                                    Add Section
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          ),
                        ),
                    )
                  )}
                </Box>
              )}
            </React.Fragment>
          ))
        )}
      </Box>

      {/* Color Selection Modal */}
      <ColorSelectionModal
        open={colorModalOpen}
        onClose={handleColorModalClose}
        onColorSelect={handleColorSelect}
        selectedColor={
          selectedClassId ? classColors[selectedClassId] : undefined
        }
      />
    </Box>
  );
}

export default EditSchedulerPanel;
