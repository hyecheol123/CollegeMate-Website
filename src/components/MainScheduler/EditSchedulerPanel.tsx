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
  Select,
  MenuItem,
  FormControl,
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

interface OnlineCourse {
  id: string;
  designation: string;
  instructor: string;
  credits?: string;
  color: string;
}

interface EditSchedulerPanelProps {
  onAddEvent?: (event: EventData) => void;
  onUpdateEventColor?: (classId: string, color: string) => void;
  onAddOnlineCourse?: (course: OnlineCourse) => void;
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
  onAddOnlineCourse,
  currentTerm,
}: EditSchedulerPanelProps): React.ReactElement {
  const [searchInput, setSearchInput] = useState<string>('');
  const [classColors, setClassColors] = useState<{ [key: string]: string }>({});
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ClassSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [courseSections, setCourseSections] = useState<{
    [key: string]: unknown;
  }>({});
  const [selectedLecture, setSelectedLecture] = useState<{
    [key: string]: string;
  }>({});
  const [selectedDiscussion, setSelectedDiscussion] = useState<{
    [key: string]: string;
  }>({});
  const [loadingSections, setLoadingSections] = useState<{
    [key: string]: boolean;
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

  const loadCourseSections = async (course: ClassSearchResult) => {
    if (!currentTerm || courseSections[course.courseId] || loadingSections[course.courseId]) {
      return;
    }

    setLoadingSections(prev => ({ ...prev, [course.courseId]: true }));

    try {
      const courseDetails = await getCourseDetails(
        currentTerm.termCode,
        course.subject.subjectCode,
        course.courseId,
      );
      setCourseSections((prev) => ({
        ...prev,
        [course.courseId]: courseDetails,
      }));
    } catch (error) {
      console.error('Failed to load course sections:', error);
    } finally {
      setLoadingSections(prev => ({ ...prev, [course.courseId]: false }));
    }
  };

  const handleAddSection = async (
    course: ClassSearchResult,
    section: Section,
  ): Promise<void> => {
    if (!currentTerm) {
      return;
    }

    const sectionId = `${course.courseId}-${section.sectionNumber}`;
    const selectedColor = classColors[sectionId] || '#9E9E9E';

    // Check if this is an online course
    const hasOnlineMeetings = section.classMeetings?.some(
      (meeting) => !meeting.meetingTimeStart || !meeting.meetingTimeEnd,
    );

    const instructorNames =
      section.instructors
        ?.map((inst: Instructor) => `${inst.name.first} ${inst.name.last}`)
        .join(', ') || 'TBA';

    const credits =
      course.minimumCredits && course.maximumCredits
        ? course.minimumCredits === course.maximumCredits
          ? `${course.minimumCredits}`
          : `${course.minimumCredits}-${course.maximumCredits}`
        : course.credits
          ? course.credits.min === course.credits.max
            ? `${course.credits.min}`
            : `${course.credits.min}-${course.credits.max}`
          : '';

    // Only add to online courses if there are actual online meetings
    if (hasOnlineMeetings && onAddOnlineCourse) {
      onAddOnlineCourse({
        id: `${course.courseId}-${section.sectionNumber}`,
        designation: course.courseDesignation,
        instructor: instructorNames,
        credits,
        color: selectedColor,
      });
    }

    // If it's online-only (no scheduled meetings), we're done
    if (
      hasOnlineMeetings &&
      !section.classMeetings?.some(
        (meeting) => meeting.meetingTimeStart && meeting.meetingTimeEnd,
      )
    ) {
      return;
    }

    if (!onAddEvent) {
      return;
    }

    // Handle regular scheduled courses
    const events: EventData[] = [];

    section.classMeetings?.forEach((meeting: Meeting) => {
      // Skip online meetings (already handled above)
      if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
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

        // Apply 6-hour offset correction for local time
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
            meeting.building?.buildingName === 'ONLINE'
              ? 'ONLINE'
              : meeting.building?.buildingName && meeting.room
                ? `${meeting.building.buildingName} ${meeting.room}`
                : 'TBA',
          instructor: instructorNames,
          credits,
        });
      });
    });

    events.forEach((event) => {
      onAddEvent(event);
    });
  };

  const handleCustomizeColor = (sectionId: string): void => {
    setSelectedClassId(sectionId);
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

  const handleLectureChange = (courseId: string, lectureNumber: string) => {
    setSelectedLecture(prev => ({
      ...prev,
      [courseId]: lectureNumber
    }));
    
    // Reset discussion selection when lecture changes
    setSelectedDiscussion(prev => ({
      ...prev,
      [courseId]: ''
    }));
  };

  const getLectureOptions = (course: ClassSearchResult) => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return [];
    
    const lectures: Section[] = [];
    const seenSections = new Set<string>();

    (sectionData as EnrollmentPackage[]).forEach((enrollmentPackage: EnrollmentPackage) => {
      enrollmentPackage.sections?.forEach((section: Section) => {
        // Include LEC, LAB, and other non-DIS section types as "lectures"
        if (section.type !== 'DIS') {
          const sectionKey = `${section.type}-${section.sectionNumber}`;
          if (!seenSections.has(sectionKey)) {
            seenSections.add(sectionKey);
            lectures.push(section);
          }
        }
      });
    });

    return lectures.sort((a, b) => {
      const aNum = parseInt(a.sectionNumber || '0', 10);
      const bNum = parseInt(b.sectionNumber || '0', 10);
      return aNum - bNum;
    });
  };

  const getDiscussionOptions = (course: ClassSearchResult, selectedLectureNumber?: string) => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return [];
    
    // If no lecture is selected, return all discussions
    if (!selectedLectureNumber) {
      const discussions: Section[] = [];
      const seenSections = new Set<string>();

      (sectionData as EnrollmentPackage[]).forEach((enrollmentPackage: EnrollmentPackage) => {
        enrollmentPackage.sections?.forEach((section: Section) => {
          if (section.type === 'DIS') {
            const sectionKey = `${section.type}-${section.sectionNumber}`;
            if (!seenSections.has(sectionKey)) {
              seenSections.add(sectionKey);
              discussions.push(section);
            }
          }
        });
      });

      return discussions.sort((a, b) => {
        const aNum = parseInt(a.sectionNumber || '0', 10);
        const bNum = parseInt(b.sectionNumber || '0', 10);
        return aNum - bNum;
      });
    }

    // Find the selected lecture first
    let selectedLecture: Section | null = null;
    (sectionData as EnrollmentPackage[]).forEach((enrollmentPackage: EnrollmentPackage) => {
      enrollmentPackage.sections?.forEach((section: Section) => {
        if (section.type === 'LEC' && section.sectionNumber === selectedLectureNumber) {
          selectedLecture = section;
        }
      });
    });

    if (!selectedLecture) return [];

    // Get instructor of the selected lecture
    const lectureInstructor = selectedLecture.instructors
      ?.map((inst) => `${inst.name.first} ${inst.name.last}`)
      .join(', ') || 'TBA';

    // Find discussions with the same instructor
    const relatedDiscussions: Section[] = [];
    const seenSections = new Set<string>();

    (sectionData as EnrollmentPackage[]).forEach((enrollmentPackage: EnrollmentPackage) => {
      enrollmentPackage.sections?.forEach((section: Section) => {
        if (section.type === 'DIS') {
          const discussionInstructor = section.instructors
            ?.map((inst) => `${inst.name.first} ${inst.name.last}`)
            .join(', ') || 'TBA';
          
          // Match discussions with same instructor as the lecture
          if (discussionInstructor === lectureInstructor) {
            const sectionKey = `${section.type}-${section.sectionNumber}`;
            if (!seenSections.has(sectionKey)) {
              seenSections.add(sectionKey);
              relatedDiscussions.push(section);
            }
          }
        }
      });
    });

    return relatedDiscussions.sort((a, b) => {
      const aNum = parseInt(a.sectionNumber || '0', 10);
      const bNum = parseInt(b.sectionNumber || '0', 10);
      return aNum - bNum;
    });
  };

  const hasDiscussions = (course: ClassSearchResult) => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return false;
    
    // Check if there are any discussion sections
    return (sectionData as EnrollmentPackage[]).some((enrollmentPackage: EnrollmentPackage) =>
      enrollmentPackage.sections?.some((section: Section) => section.type === 'DIS')
    );
  };

  const formatTime = (timeMs: number): string => {
    const offsetMs = 6 * 60 * 60 * 1000; // 6 hours offset
    const adjustedTime = timeMs - offsetMs;
    const hour = Math.floor(adjustedTime / (1000 * 60 * 60));
    const minute = Math.floor((adjustedTime % (1000 * 60 * 60)) / (1000 * 60));
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatDays = (daysList: string[]): string => {
    const dayMap: { [key: string]: string } = {
      MONDAY: 'M',
      TUESDAY: 'T', 
      WEDNESDAY: 'W',
      THURSDAY: 'R',
      FRIDAY: 'F',
      SATURDAY: 'S',
      SUNDAY: 'U'
    };
    return daysList.map(day => dayMap[day] || day).join(', ');
  };

  const getSectionDisplayInfo = (section: Section) => {
    const instructorNames = section.instructors
      ?.map((inst: Instructor) => `${inst.name.first} ${inst.name.last}`)
      .join(', ') || 'TBA';

    let timeAndDays = 'TBA';
    let building = 'TBA';

    if (section.classMeetings && section.classMeetings.length > 0) {
      const meeting = section.classMeetings[0];
      
      if (meeting.meetingTimeStart && meeting.meetingTimeEnd) {
        const startTime = formatTime(meeting.meetingTimeStart);
        const endTime = formatTime(meeting.meetingTimeEnd);
        const days = formatDays(meeting.meetingDaysList || []);
        timeAndDays = `${days} ${startTime}-${endTime}`;
      } else if (meeting.building?.buildingName === 'ONLINE') {
        timeAndDays = 'ONLINE';
      }

      if (meeting.building?.buildingName && meeting.room) {
        building = `${meeting.building.buildingName} ${meeting.room}`;
      } else if (meeting.building?.buildingName) {
        building = meeting.building.buildingName;
      }
    }

    return { instructorNames, timeAndDays, building };
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
          '& .MuiInputBase-input::placeholder': {
            color: '#494949',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '18px',
            fontFamily: 'Roboto',
            opacity: 1,
          },
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
        variant="body2"
        sx={{
          marginBottom: isMobile ? '12px' : '6px',
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
              marginBottom: isMobile ? '8px' : '0px',
            }}
          >
            <Typography variant="body2">
              No classes found matching your search.
            </Typography>
          </Card>
        ) : (
          searchResults.map((course, index) => (
            <React.Fragment
              key={`${course.courseId}-${course.subject.subjectCode}-${index}`}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {/* Class Info Box */}
                <Box
                  sx={{
                    backgroundColor: 'whiteGrey.main',
                    padding: '16px',
                    borderRadius: '8px',
                    minHeight: '120px',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'grey.main',
                    '&:hover': {
                      backgroundColor: 'grey.main',
                    },
                  }}
                  onClick={() => loadCourseSections(course)}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'red.main',
                      marginBottom: '8px',
                    }}
                  >
                    {course.courseDesignation}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'darkGrey.main',
                      marginBottom: '8px',
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body3"
                    sx={{
                      color: 'darkGrey.main',
                    }}
                  >
                    {course.subject.formalDescription}
                  </Typography>
                </Box>

                {/* Lecture Dropdown */}
                <FormControl fullWidth>
                  <Select
                    value={selectedLecture[course.courseId] || ''}
                    onChange={(e) => handleLectureChange(course.courseId, e.target.value)}
                    onOpen={() => loadCourseSections(course)}
                    displayEmpty
                    sx={{
                      backgroundColor: 'white.main',
                      border: '1px solid',
                      borderColor: 'grey.main',
                      borderRadius: '6px',
                      '& .MuiSelect-select': {
                        padding: '8px 12px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid',
                        borderColor: 'red.main',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 400,
                          width: 'auto',
                          minWidth: '100%',
                          '& .MuiMenuItem-root': {
                            whiteSpace: 'normal',
                            height: 'auto',
                            minHeight: 'auto',
                          },
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      {loadingSections[course.courseId] ? 'Loading sections...' : 'Select section'}
                    </MenuItem>
                    {getLectureOptions(course).map((lecture) => {
                      const { instructorNames, timeAndDays, building } = getSectionDisplayInfo(lecture);
                      const sectionType = lecture.type === 'LEC' ? 'Lecture' : 
                                          lecture.type === 'LAB' ? 'Lab' : 
                                          lecture.type;
                      
                      return (
                        <MenuItem key={lecture.sectionNumber} value={lecture.sectionNumber}>
                          <Box sx={{ width: '100%', py: 1 }}>
                            <Typography variant="body1" sx={{ color: 'darkGrey.main', mb: 0.5 }}>
                              {sectionType} {lecture.sectionNumber}
                            </Typography>
                            <Typography variant="body3" sx={{ color: 'darkGrey.main', mb: 0.5 }}>
                              Instructor: {instructorNames}
                            </Typography>
                            <Typography variant="body3" sx={{ color: 'darkGrey.main', mb: 0.5 }}>
                              {timeAndDays}
                            </Typography>
                            <Typography variant="body3" sx={{ color: 'darkGrey.main' }}>
                              {building}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* Discussion Dropdown - Only show if discussions exist */}
                {(loadingSections[course.courseId] || hasDiscussions(course)) && (
                  <FormControl fullWidth>
                    <Select
                      value={selectedDiscussion[course.courseId] || ''}
                      onChange={(e) => setSelectedDiscussion(prev => ({
                        ...prev,
                        [course.courseId]: e.target.value
                      }))}
                      onOpen={() => loadCourseSections(course)}
                      displayEmpty
                      sx={{
                        backgroundColor: 'white.main',
                        border: '1px solid',
                        borderColor: 'grey.main',
                        borderRadius: '6px',
                        '& .MuiSelect-select': {
                          padding: '8px 12px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid',
                          borderColor: 'red.main',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 400,
                            width: 'auto',
                            minWidth: '100%',
                            '& .MuiMenuItem-root': {
                              whiteSpace: 'normal',
                              height: 'auto',
                              minHeight: 'auto',
                            },
                          },
                        },
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {loadingSections[course.courseId] 
                          ? 'Loading discussions...' 
                          : selectedLecture[course.courseId] 
                            ? 'Select discussion for this section'
                            : 'Select section first or choose any discussion'
                        }
                      </MenuItem>
                      {getDiscussionOptions(course, selectedLecture[course.courseId]).map((discussion) => {
                        const { instructorNames, timeAndDays, building } = getSectionDisplayInfo(discussion);
                        
                        return (
                          <MenuItem key={discussion.sectionNumber} value={discussion.sectionNumber}>
                            <Box sx={{ width: '100%', py: 1 }}>
                              <Typography variant="body1" sx={{ color: 'darkGrey.main', mb: 0.5 }}>
                                Discussion {discussion.sectionNumber}
                              </Typography>
                              <Typography variant="body3" sx={{ color: 'darkGrey.main', mb: 0.5 }}>
                                Instructor: {instructorNames}
                              </Typography>
                              <Typography variant="body3" sx={{ color: 'darkGrey.main', mb: 0.5 }}>
                                {timeAndDays}
                              </Typography>
                              <Typography variant="body3" sx={{ color: 'darkGrey.main' }}>
                                {building}
                              </Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {/* Color Button */}
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: 'white.main',
                    color: 'darkGrey.main',
                    border: '1px solid',
                    borderColor: 'grey.main',
                    borderRadius: '6px',
                    padding: '10px',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'whiteGrey.main',
                      borderColor: 'darkGrey.main',
                    },
                  }}
                  onClick={() => handleCustomizeColor(course.courseId)}
                >
                  Color
                </Button>

                {/* Add Button */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'red.main',
                    color: 'white.main',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(178, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: '#900000',
                      boxShadow: '0 4px 8px rgba(178, 0, 0, 0.3)',
                    },
                  }}
                  onClick={async () => {
                    // First load sections if not already loaded
                    await loadCourseSections(course);
                    
                    const selectedLec = selectedLecture[course.courseId];
                    const selectedDisc = selectedDiscussion[course.courseId];
                    
                    // User-friendly validation
                    if (!selectedLec && !selectedDisc) {
                      const courseHasDiscussions = hasDiscussions(course);
                      if (courseHasDiscussions) {
                        alert('Please select at least a section or discussion to add.');
                      } else {
                        alert('Please select a section to add.');
                      }
                      return;
                    }
                    
                    // Get available options
                    const lectureOptions = getLectureOptions(course);
                    const discussionOptions = getDiscussionOptions(course, selectedLec);
                    
                    // Add selected lecture
                    if (selectedLec) {
                      const lecture = lectureOptions.find(l => l.sectionNumber === selectedLec);
                      if (lecture) {
                        await handleAddSection(course, lecture);
                      }
                    }
                    
                    // Add selected discussion (with validation for lecture-discussion compatibility)
                    if (selectedDisc) {
                      // If lecture is selected, get discussions for that lecture only
                      const availableDiscussions = selectedLec 
                        ? getDiscussionOptions(course, selectedLec)
                        : getDiscussionOptions(course);
                      
                      const discussion = availableDiscussions.find(d => d.sectionNumber === selectedDisc);
                      if (discussion) {
                        await handleAddSection(course, discussion);
                      } else if (selectedLec) {
                        alert(`Discussion ${selectedDisc} is not available for the selected lecture. Please choose a different discussion or lecture.`);
                        return;
                      }
                    }
                    
                    // Success feedback
                    const addedSections = [];
                    if (selectedLec) {
                      const lecture = lectureOptions.find(l => l.sectionNumber === selectedLec);
                      const sectionType = lecture?.type === 'LEC' ? 'Lecture' : 
                                          lecture?.type === 'LAB' ? 'Lab' : 
                                          lecture?.type || 'Section';
                      addedSections.push(`${sectionType} ${selectedLec}`);
                    }
                    if (selectedDisc) addedSections.push(`Discussion ${selectedDisc}`);
                    
                    // Reset selections after successful add
                    setSelectedLecture(prev => ({ ...prev, [course.courseId]: '' }));
                    setSelectedDiscussion(prev => ({ ...prev, [course.courseId]: '' }));
                  }}
                >
                  Add
                </Button>
              </Box>

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
