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

// Local interfaces for API data
interface Instructor {
  name: {
    first: string;
    last: string;
  };
}

interface Meeting {
  meetingTimeStart: number | null;
  meetingTimeEnd: number | null;
  meetingDaysList: string[];
  building?: {
    buildingName: string;
  };
  room?: string;
}

interface Section {
  type: string;
  sectionNumber: string;
  instructors?: Instructor[];
  classMeetings?: Meeting[];
}

interface EnrollmentPackage {
  id: string;
  packageEnrollmentStatus?: {
    status: string;
    availableSeats: number;
  };
  sections?: Section[];
}

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

  // Clear all cache on component mount
  React.useEffect(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('uw_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const editTitleRef = React.useRef<HTMLHeadingElement>(null);
  const [hasScrolledToResults, setHasScrolledToResults] =
    useState<boolean>(false);

  // Perform search when search input changes
  useEffect(() => {
    const performSearch = async (): Promise<void> => {
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
          10,
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
    return (): void => clearTimeout(timeoutId);
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

      // API returns array directly, not wrapped in packages
      setCourseSections((prev) => ({
        ...prev,
        [course.courseId]: courseDetails,
      }));
    } catch {
      // Handle error silently
    }
  };

  const handleAddSection = async (
    course: ClassSearchResult,
    section: Section,
  ): Promise<void> => {
    if (!onAddEvent || !currentTerm) {
      return;
    }

    const selectedColor = classColors[course.courseId] || '#9E9E9E';

    // Convert only this section to events
    const events: EventData[] = [];

    section.classMeetings?.forEach((meeting: Meeting) => {
      // Skip online/asynchronous courses without specific meeting times
      if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
        // For online courses, create a single event without specific time
        const instructorNames =
          section.instructors
            ?.map((inst: Instructor) => `${inst.name.first} ${inst.name.last}`)
            .join(', ') || 'TBA';

        const sectionId = section.sectionNumber || 'default';
        const eventId = `${course.courseId}-${sectionId}-online`;

        events.push({
          id: eventId,
          title: course.courseDesignation,
          startTime: { hour: 0, minute: 0 },
          endTime: { hour: 0, minute: 0 },
          day: 'Online',
          color: selectedColor,
          location: meeting.building?.buildingName === 'ONLINE' ? 'ONLINE' : 'TBA',
          instructor: instructorNames,
        });
        return;
      }

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

        // UTC OFFSET CORRECTION - Madison is CST (UTC-6), API uses UTC
        const offsetMs = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        const correctedStartMs = meeting.meetingTimeStart! - offsetMs;
        const correctedEndMs = meeting.meetingTimeEnd! - offsetMs;

        const startTime = {
          hour: Math.floor(correctedStartMs / (1000 * 60 * 60)),
          minute: Math.floor(
            (correctedStartMs % (1000 * 60 * 60)) / (1000 * 60),
          ),
        };

        const endTime = {
          hour: Math.floor(correctedEndMs / (1000 * 60 * 60)),
          minute: Math.floor((correctedEndMs % (1000 * 60 * 60)) / (1000 * 60)),
        };

        const instructorNames =
          section.instructors
            ?.map((inst: Instructor) => `${inst.name.first} ${inst.name.last}`)
            .join(', ') || 'TBA';

        const sectionId = section.sectionNumber || 'default';
        const eventId = `${course.courseId}-${sectionId}-${day}`;

        events.push({
          id: eventId,
          title: course.courseDesignation,
          startTime,
          endTime,
          day,
          color: selectedColor,
          location:
            meeting.building?.buildingName && meeting.room
              ? `${meeting.building.buildingName} ${meeting.room}`
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
                  {((): React.ReactNode => {
                    const sectionData = courseSections[course.courseId];

                    if (!sectionData) {
                      return <Typography>Loading sections...</Typography>;
                    }

                    if (!Array.isArray(sectionData)) {
                      return (
                        <Typography color="error">
                          Error loading sections: Invalid data format (got{' '}
                          {typeof sectionData})
                        </Typography>
                      );
                    }

                    if (sectionData.length === 0) {
                      return (
                        <Typography>
                          No sections available for this course.
                        </Typography>
                      );
                    }

                    // Collect all unique sections from all packages
                    const allSections: Section[] = [];
                    const seenSections = new Set<string>();

                    (sectionData as EnrollmentPackage[]).forEach(
                      (enrollmentPackage: EnrollmentPackage) => {
                        // Only show sections from packages that are OPEN or have available seats
                        const packageStatus =
                          enrollmentPackage.packageEnrollmentStatus?.status;
                        const availableSeats =
                          enrollmentPackage.packageEnrollmentStatus
                            ?.availableSeats || 0;

                        // Skip closed packages with no available seats
                        if (
                          packageStatus === 'CLOSED' &&
                          availableSeats === 0
                        ) {
                          return;
                        }

                        enrollmentPackage.sections?.forEach(
                          (section: Section) => {
                            const sectionKey = `${section.type}-${section.sectionNumber}`;
                            if (!seenSections.has(sectionKey)) {
                              seenSections.add(sectionKey);
                              allSections.push(section);
                            }
                          },
                        );
                      },
                    );

                    return allSections.map(
                      (section: Section, sectionIndex: number) => {
                        const uniqueKey = `${course.courseId}-${section.type}-${section.sectionNumber}-${sectionIndex}`;
                        return (
                          <Card
                            key={uniqueKey}
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
                                    Section {section.sectionNumber || 'N/A'} (
                                    {section.type || 'CLASS'})
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
                                        (inst: Instructor) =>
                                          `${inst.name.first} ${inst.name.last}`,
                                      )
                                      .join(', ') || 'TBA'}
                                  </Typography>

                                  {/* Meeting Times */}
                                  {section.classMeetings?.map(
                                    (
                                      meeting: Meeting,
                                      meetingIndex: number,
                                    ) => (
                                      <Typography
                                        key={`${uniqueKey}-meeting-${meetingIndex}`}
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ marginBottom: '2px' }}
                                      >
{(() => {
                                          // Check if this is an online/asynchronous course
                                          if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
                                            if (meeting.building?.buildingName === 'ONLINE') {
                                              return 'ONLINE';
                                            }
                                            return 'TBA';
                                          }

                                          // Show days and time for scheduled classes
                                          const daysText = meeting.meetingDaysList?.join(', ') || '';
                                          
                                          // UTC OFFSET CORRECTION - Madison is CST (UTC-6), API uses UTC
                                          const offsetMs = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
                                          const correctedStartMs = meeting.meetingTimeStart! - offsetMs;
                                          const correctedEndMs = meeting.meetingTimeEnd! - offsetMs;

                                          const startHour = Math.floor(correctedStartMs / (1000 * 60 * 60));
                                          const startMinute = Math.floor((correctedStartMs % (1000 * 60 * 60)) / (1000 * 60));
                                          const endHour = Math.floor(correctedEndMs / (1000 * 60 * 60));
                                          const endMinute = Math.floor((correctedEndMs % (1000 * 60 * 60)) / (1000 * 60));

                                          const formatTime = (hour: number, minute: number): string => {
                                            const period = hour >= 12 ? 'PM' : 'AM';
                                            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                                            return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
                                          };

                                          const timeText = `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
                                          
                                          return daysText ? `${daysText} • ${timeText}` : timeText;
                                        })()}
                                        {meeting.building?.buildingName &&
                                          meeting.room && (
                                            <>
                                              {' '}
                                              • {
                                                meeting.building.buildingName
                                              }{' '}
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
                                  onClick={(): Promise<void> =>
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
                        );
                      },
                    );
                  })()}
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
