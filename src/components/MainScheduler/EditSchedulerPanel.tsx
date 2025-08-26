/**
 * Edit Scheduler Panel component for searching and adding classes
 * @author Daekyun Kim <daekyun97@gmail.com>
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
  InputAdornment,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// Components
import ColorSelectionModal from '../Common/ColorSelectionModal';
import type { Term } from '../../data/Terms/getTerms';
// Utils
import { normalizeBuildingNameMemo } from '../../utils/buildingNameNormalizer';

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
  meetingType?: string;
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
  onRemoveConflictingEvents?: (eventId: string) => void;
  currentTerm?: Term | null;
  existingEvents?: EventData[];
}

/**
 * EditSchedulerPanel component for searching, customizing, and adding classes
 * Features include: class search, color customization, and responsive button layout
 * @param {EditSchedulerPanelProps} props - Props including callback functions for events
 * @return {React.ReactElement} The rendered EditSchedulerPanel component
 */
function EditSchedulerPanel({
  onAddEvent,
  onUpdateEventColor,
  onAddOnlineCourse,
  onRemoveConflictingEvents,
  currentTerm,
  existingEvents = [],
}: EditSchedulerPanelProps): React.ReactElement {
  // Enhanced debug function for scroll issues
  const debugScrollState = (context: string = 'Unknown') => {
    const timestamp = new Date().toLocaleTimeString();
    const scrollInfo = {
      context,
      timestamp,
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyComputedOverflow: window.getComputedStyle(document.body).overflow,
      htmlComputedOverflow: window.getComputedStyle(document.documentElement).overflow,
      canScroll: window.innerHeight < document.body.scrollHeight,
      scrollY: window.scrollY,
      windowHeight: window.innerHeight,
      documentHeight: document.body.scrollHeight,
    };
    return scrollInfo;
  };

  // Safe auto-scroll to search results (mobile only)
  const scrollToSearchResults = (): void => {
    if (resultsRef.current && isMobile) {
      debugScrollState('Before auto-scroll');
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Log scroll state after scrolling
        setTimeout(() => {
          debugScrollState('After auto-scroll');
        }, 500);
      }, 300); // Increased delay to be less jarring
    }
  };

  // Global scroll monitoring - temporarily disabled
  // React.useEffect(() => {
  //   const checkScrollPeriodically = (): void => {
  //     const info = debugScrollState('Periodic Check');
  //     if (info.bodyOverflow === 'hidden' || info.htmlOverflow === 'hidden') {
  //       console.warn('⚠️ SCROLL FROZEN DETECTED! Auto-fixing...');
  //       document.body.style.overflow = 'auto';
  //       document.documentElement.style.overflow = 'auto';
  //     }
  //   };

  //   const interval = setInterval(checkScrollPeriodically, 5000); // Check every 5 seconds
    
  //   return () => clearInterval(interval);
  // }, []);

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
  const [selectedLab, setSelectedLab] = useState<{
    [key: string]: string;
  }>({});
  const [loadingSections, setLoadingSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Time conflict modal states
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);

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
  const [hasAutoScrolledOnce, setHasAutoScrolledOnce] = 
    useState<boolean>(false);
  const [isAddingClass, setIsAddingClass] = useState<boolean>(false);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState<boolean>(false);
  const [dependencyModalMessage, setDependencyModalMessage] = useState<string>('');

  // Validate dependencies between Lecture/Discussion/Lab
  const validateDependencies = (course: ClassSearchResult, selectedLec: string, selectedDisc: string, selectedLabSection: string): string | null => {
    const lectureOptions = getLectureOptions(course);
    const discussionOptions = getDiscussionOptions(course);
    const labOptions = getLabOptions(course);

    // If no lectures exist, this is an independent course (lab-only, discussion-only) - no validation needed
    if (lectureOptions.length === 0) {
      return null;
    }

    // Case 1: Only Discussion selected but Lectures exist (need Lecture)
    if (selectedDisc && !selectedLec && lectureOptions.length > 0) {
      return 'Please select Lecture';
    }

    // Case 2: Only Lab selected but Lectures exist (need Lecture) 
    if (selectedLabSection && !selectedLec && lectureOptions.length > 0) {
      return 'Please select Lecture';
    }

    // Case 3: Only Lecture selected but Discussion available (need Discussion)
    if (selectedLec && !selectedDisc && !selectedLabSection && discussionOptions.length > 0 && labOptions.length === 0) {
      return 'Please select Discussion';
    }

    // Case 4: Only Lecture selected but Lab available (need Lab)
    if (selectedLec && !selectedDisc && !selectedLabSection && labOptions.length > 0 && discussionOptions.length === 0) {
      return 'Please select Lab';
    }

    // Case 5: Only Lecture selected but both Discussion and Lab available (need both)
    if (selectedLec && !selectedDisc && !selectedLabSection && discussionOptions.length > 0 && labOptions.length > 0) {
      return 'Please select Discussion and Lab';
    }

    // Case 6: Lecture + Discussion selected but Lab missing (when Lab is available)
    if (selectedLec && selectedDisc && !selectedLabSection && labOptions.length > 0) {
      return 'Please select Lab';
    }

    // Case 7: Lecture + Lab selected but Discussion missing (when Discussion is available)
    if (selectedLec && !selectedDisc && selectedLabSection && discussionOptions.length > 0) {
      return 'Please select Discussion';
    }

    return null; // All good
  };

  // Time conflict validation function
  const checkTimeConflict = (newEvents: EventData[]): string | null => {
    for (const newEvent of newEvents) {
      for (const existingEvent of existingEvents) {
        // Check if events are on the same day
        if (newEvent.day === existingEvent.day) {
          const newStart =
            newEvent.startTime.hour * 60 + newEvent.startTime.minute;
          const newEnd = newEvent.endTime.hour * 60 + newEvent.endTime.minute;
          const existingStart =
            existingEvent.startTime.hour * 60 + existingEvent.startTime.minute;
          const existingEnd =
            existingEvent.endTime.hour * 60 + existingEvent.endTime.minute;

          // Check if times overlap
          if (newStart < existingEnd && newEnd > existingStart) {
            const formatTime = (hour: number, minute: number): string => {
              const period = hour >= 12 ? 'PM' : 'AM';
              const displayHour =
                hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
            };

            return `Time conflict detected!\n\n"${newEvent.title}" (${formatTime(newEvent.startTime.hour, newEvent.startTime.minute)} - ${formatTime(newEvent.endTime.hour, newEvent.endTime.minute)}) overlaps with "${existingEvent.title}" (${formatTime(existingEvent.startTime.hour, existingEvent.startTime.minute)} - ${formatTime(existingEvent.endTime.hour, existingEvent.endTime.minute)}) on ${newEvent.day}.`;
          }
        }
      }
    }
    return null;
  };

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

        // Safe auto-scroll to results when new search results appear (only first time) - but not while adding class
        if ((response.hits || []).length > 0 && !hasScrolledToResults && !hasAutoScrolledOnce && !isAddingClass) {
          scrollToSearchResults();
          setHasScrolledToResults(true);
          setHasAutoScrolledOnce(true); // Never auto-scroll again in this session
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
    const newValue = event.target.value;
    setSearchInput(newValue);

    // Reset scroll flag when clearing input (but keep hasAutoScrolledOnce)
    if (newValue === '') {
      setHasScrolledToResults(false);
    } else if (newValue !== searchInput) {
      setHasScrolledToResults(false);
    }
  };

  const loadCourseSections = React.useCallback(
    async (course: ClassSearchResult): Promise<void> => {
      if (
        !currentTerm ||
        courseSections[course.courseId] ||
        loadingSections[course.courseId]
      ) {
        return;
      }

      setLoadingSections((prev) => ({ ...prev, [course.courseId]: true }));

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
        setLoadingSections((prev) => ({ ...prev, [course.courseId]: false }));
      }
    },
    [currentTerm, courseSections, loadingSections],
  );

  // Auto-load sections when search results change
  React.useEffect(() => {
    searchResults.forEach((course) => {
      if (!courseSections[course.courseId]) {
        loadCourseSections(course);
      }
    });
  }, [searchResults, loadCourseSections]);

  // Available color palette
  const AVAILABLE_COLORS = [
    '#758EA8', // Dusty Blue
    '#A6DDFF', // Sky Blue
    '#D9F6FF', // Aqua Blue
    '#CFF3E7', // Pale Mint
    '#B20000', // Red
    '#D46478', // Rose Pink
    '#F3B8DF', // Baby Pink
    '#F3ADA3', // Coral Pink
    '#00D0C5', // Mint
    '#D7DF5A', // Lime
    '#FFA944', // Tangerine
    '#F4EF56', // Lemon
    '#000000', // Black
    '#494949', // Dark Gray
    '#A0A0A0', // Mild Gray
    '#E8E8E8', // Light Gray
  ];

  // Function to get next sequential color (with relay when all used)
  const getNextSequentialColor = (): string => {
    const usedColors = new Set(Object.values(classColors));
    
    // Find first unused color in sequence
    for (const color of AVAILABLE_COLORS) {
      if (!usedColors.has(color)) {
        return color;
      }
    }
    
    // If all colors are used, start relay from beginning
    const totalAssignedColors = Object.keys(classColors).length;
    const colorIndex = totalAssignedColors % AVAILABLE_COLORS.length;
    return AVAILABLE_COLORS[colorIndex];
  };

  const handleAddSection = async (
    course: ClassSearchResult,
    section: Section,
  ): Promise<void> => {
    if (!currentTerm) {
      return;
    }

    const sectionId = `${course.courseId}-${section.sectionNumber}`;
    let selectedColor = classColors[course.courseId] || classColors[sectionId];
    
    // If no color is assigned yet, assign the next sequential color and save it
    if (!selectedColor) {
      selectedColor = getNextSequentialColor();
      setClassColors((prev) => ({
        ...prev,
        [course.courseId]: selectedColor,
      }));
    }

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
              ? 'Online'
              : meeting.building?.buildingName && meeting.room
                ? `${meeting.room} ${normalizeBuildingNameMemo(meeting.building.buildingName)}`
                : meeting.building?.buildingName
                  ? normalizeBuildingNameMemo(meeting.building.buildingName)
                  : 'TBA',
          instructor: instructorNames,
          credits,
        });
      });
    });

    // Check for time conflicts before adding events
    const conflictMessage = checkTimeConflict(events);
    
    if (conflictMessage) {
      setPendingEvents(prev => {
        // Avoid duplicates by filtering out events with same ID
        const existingIds = new Set(prev.map(e => e.id));
        const newEvents = events.filter(e => !existingIds.has(e.id));
        return [...prev, ...newEvents];
      });
      setIsConflictModalOpen(true);
      return;
    }

    // Add events all at once
    events.forEach((event, index) => {
      onAddEvent(event);
    });
    
    // Force enable scroll after adding all events - temporarily disabled
    // setTimeout(() => {
    //   document.body.style.overflow = 'auto';
    //   document.documentElement.style.overflow = 'auto';
    //     body: document.body.style.overflow,
    //     html: document.documentElement.style.overflow
    //   });
    // }, 50);
  };

  const handleCustomizeColor = (sectionId: string): void => {
    setSelectedClassId(sectionId);
    setColorModalOpen(true);
  };

  const handleConflictResolve = (keepExisting: boolean): void => {
    
    if (
      !keepExisting &&
      pendingEvents.length > 0 &&
      onRemoveConflictingEvents
    ) {
      // Remove conflicting events - check both time conflicts and same course
      const eventsToRemove = new Set<string>();
      
      
      // Simple logic: Find time conflicts, then remove entire conflicting courses
      const conflictingCourseIds = new Set<string>();
      
      // Find all courses that have time conflicts
      for (const newEvent of pendingEvents) {
        
        for (const existingEvent of existingEvents) {
          // Check time conflicts
          if (newEvent.day === existingEvent.day) {
            const newStart = newEvent.startTime.hour * 60 + newEvent.startTime.minute;
            const newEnd = newEvent.endTime.hour * 60 + newEvent.endTime.minute;
            const existingStart = existingEvent.startTime.hour * 60 + existingEvent.startTime.minute;
            const existingEnd = existingEvent.endTime.hour * 60 + existingEvent.endTime.minute;

            if (newStart < existingEnd && newEnd > existingStart) {
              const conflictingCourseId = existingEvent.id.split('-')[0];
              conflictingCourseIds.add(conflictingCourseId);
            }
          }
        }
      }
      
      // Remove all events from conflicting courses
      for (const existingEvent of existingEvents) {
        const existingCourseId = existingEvent.id.split('-')[0];
        if (conflictingCourseIds.has(existingCourseId)) {
          eventsToRemove.add(existingEvent.id);
        }
      }
      
      
      // Remove all identified events
      eventsToRemove.forEach(eventId => {
        onRemoveConflictingEvents(eventId);
      });

      // Add new events
      pendingEvents.forEach((event, index) => {
        onAddEvent?.(event);
      });
    }

    // Reset modal state
    setIsConflictModalOpen(false);
    setPendingEvents([]);
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

  const handleLectureChange = (
    courseId: string,
    lectureNumber: string,
  ): void => {
    setSelectedLecture((prev) => ({
      ...prev,
      [courseId]: lectureNumber,
    }));

    // Reset discussion and lab selection when lecture changes
    setSelectedDiscussion((prev) => ({
      ...prev,
      [courseId]: '',
    }));
    setSelectedLab((prev) => ({
      ...prev,
      [courseId]: '',
    }));
  };

  const getLectureOptions = (course: ClassSearchResult): Section[] => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return [];

    const lectures: Section[] = [];
    const seenSections = new Set<string>();

    (sectionData as EnrollmentPackage[]).forEach(
      (enrollmentPackage: EnrollmentPackage) => {
        // Skip closed sections
        if (enrollmentPackage.packageEnrollmentStatus?.status === 'CLOSED') {
          return;
        }

        enrollmentPackage.sections?.forEach((section: Section) => {
          // Include only LEC and other non-DIS, non-LAB section types as "lectures"
          if (section.type !== 'DIS' && section.type !== 'LAB') {
            const sectionKey = `${section.type}-${section.sectionNumber}`;
            if (!seenSections.has(sectionKey)) {
              seenSections.add(sectionKey);
              lectures.push(section);
            }
          }
        });
      },
    );

    return lectures.sort((a, b) => {
      const aNum = parseInt(a.sectionNumber || '0', 10);
      const bNum = parseInt(b.sectionNumber || '0', 10);
      return aNum - bNum;
    });
  };

  const getDiscussionOptions = (
    course: ClassSearchResult,
    selectedLectureNumber?: string,
  ): Section[] => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return [];

    // If no lecture is selected, return all discussions
    if (!selectedLectureNumber) {
      const discussions: Section[] = [];
      const seenSections = new Set<string>();

      (sectionData as EnrollmentPackage[]).forEach(
        (enrollmentPackage: EnrollmentPackage) => {
          // Skip closed sections
          if (enrollmentPackage.packageEnrollmentStatus?.status === 'CLOSED') {
            return;
          }

          enrollmentPackage.sections?.forEach((section: Section) => {
            if (section.type === 'DIS') {
              const sectionKey = `${section.type}-${section.sectionNumber}`;
              if (!seenSections.has(sectionKey)) {
                seenSections.add(sectionKey);
                discussions.push(section);
              }
            }
          });
        },
      );

      return discussions.sort((a, b) => {
        const aNum = parseInt(a.sectionNumber || '0', 10);
        const bNum = parseInt(b.sectionNumber || '0', 10);
        return aNum - bNum;
      });
    }

    // Find the selected lecture first
    let selectedLecture: Section | null = null;
    (sectionData as EnrollmentPackage[]).forEach(
      (enrollmentPackage: EnrollmentPackage) => {
        enrollmentPackage.sections?.forEach((section: Section) => {
          if (
            section.type === 'LEC' &&
            section.sectionNumber === selectedLectureNumber
          ) {
            selectedLecture = section;
          }
        });
      },
    );

    if (!selectedLecture) return [];

    // Find all discussions that are in the same enrollmentPackage as the selected lecture
    const relatedDiscussions: Section[] = [];
    const seenSections = new Set<string>();

    (sectionData as EnrollmentPackage[]).forEach(
      (enrollmentPackage: EnrollmentPackage) => {
        // Skip closed sections
        if (enrollmentPackage.packageEnrollmentStatus?.status === 'CLOSED') {
          return;
        }

        // Check if this enrollmentPackage contains the selected lecture
        const hasSelectedLecture = enrollmentPackage.sections?.some(
          (section: Section) =>
            section.type === 'LEC' &&
            section.sectionNumber === selectedLectureNumber,
        );

        if (hasSelectedLecture) {
          // Include discussions only from this specific enrollmentPackage
          enrollmentPackage.sections?.forEach((section: Section) => {
            if (section.type === 'DIS') {
              const sectionKey = `${section.type}-${section.sectionNumber}`;
              if (!seenSections.has(sectionKey)) {
                seenSections.add(sectionKey);
                relatedDiscussions.push(section);
              }
            }
          });
        }
      },
    );

    return relatedDiscussions.sort((a, b) => {
      const aNum = parseInt(a.sectionNumber || '0', 10);
      const bNum = parseInt(b.sectionNumber || '0', 10);
      return aNum - bNum;
    });
  };

  const getLabOptions = (
    course: ClassSearchResult,
    selectedLectureNumber?: string,
    selectedDiscussionNumber?: string,
  ): Section[] => {
    
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) {
      return [];
    }
    

    // If no lecture is selected, return all labs (with discussion filtering if applicable)
    if (!selectedLectureNumber) {
      const labs: Section[] = [];
      const seenSections = new Set<string>();

      (sectionData as EnrollmentPackage[]).forEach(
        (enrollmentPackage: EnrollmentPackage) => {
          // Skip closed sections
          if (enrollmentPackage.packageEnrollmentStatus?.status === 'CLOSED') {
            return;
          }

          enrollmentPackage.sections?.forEach((section: Section) => {
            if (section.type === 'LAB') {
              // If discussion is selected, filter labs based on API enrollment packages
              if (selectedDiscussionNumber) {
                
                // Find which enrollment packages contain both the selected discussion and this lab
                let isCompatible = false;
                
                (sectionData as any[]).forEach((pkg: any) => {
                  
                  // Check if this package contains both the discussion and lab
                  const hasSelectedDiscussion = pkg.sections?.some((s: any) => 
                    s.type === 'DIS' && s.sectionNumber === selectedDiscussionNumber
                  );
                  const hasThisLab = pkg.sections?.some((s: any) => 
                    s.type === 'LAB' && s.sectionNumber === section.sectionNumber
                  );
                  
                  
                  if (hasSelectedDiscussion && hasThisLab) {
                    isCompatible = true;
                  }
                });
                
                
                // Only include labs that are compatible with selected discussion
                if (!isCompatible) {
                  return;
                }
              }

              const sectionKey = `${section.type}-${section.sectionNumber}`;
              if (!seenSections.has(sectionKey)) {
                seenSections.add(sectionKey);
                labs.push(section);
              }
            }
          });
        },
      );

      return labs.sort((a, b) => {
        const aNum = parseInt(a.sectionNumber || '0', 10);
        const bNum = parseInt(b.sectionNumber || '0', 10);
        return aNum - bNum;
      });
    }

    // If no lectures exist for this course, show all labs
    const lectureOptions = getLectureOptions(course);
    if (lectureOptions.length === 0) {
      // No lectures exist, return all labs
      const labs: Section[] = [];
      const seenSections = new Set<string>();

      (sectionData as EnrollmentPackage[]).forEach(
        (enrollmentPackage: EnrollmentPackage) => {
          // Skip closed sections
          if (enrollmentPackage.packageEnrollmentStatus?.status === 'CLOSED') {
            return;
          }

          enrollmentPackage.sections?.forEach((section: Section) => {
            if (section.type === 'LAB') {
              const sectionKey = `${section.type}-${section.sectionNumber}`;
              if (!seenSections.has(sectionKey)) {
                seenSections.add(sectionKey);
                labs.push(section);
              }
            }
          });
        },
      );

      return labs.sort((a, b) => {
        const aNum = parseInt(a.sectionNumber || '0', 10);
        const bNum = parseInt(b.sectionNumber || '0', 10);
        return aNum - bNum;
      });
    }

    // If lecture is selected, find related labs based on instructor matching
    const selectedLectureSection = lectureOptions.find(
      (lec) => lec.sectionNumber === selectedLectureNumber,
    );

    if (!selectedLectureSection) return [];

    const relatedLabs: Section[] = [];
    const seenSections = new Set<string>();

    (sectionData as EnrollmentPackage[]).forEach(
      (enrollmentPackage: EnrollmentPackage) => {
        // Skip closed sections
        if (enrollmentPackage.packageEnrollmentStatus?.status === 'CLOSED') {
          return;
        }

        // Check if this enrollmentPackage contains the selected lecture
        const hasSelectedLecture = enrollmentPackage.sections?.some(
          (section: Section) =>
            section.type === 'LEC' &&
            section.sectionNumber === selectedLectureNumber,
        );

        if (hasSelectedLecture) {
          // Include labs only from this specific enrollmentPackage
          enrollmentPackage.sections?.forEach((section: Section) => {
            if (section.type === 'LAB') {
              
              // If discussion is selected, filter labs based on discussion compatibility
              if (selectedDiscussionNumber) {
                
                // Check if this enrollment package contains both the selected discussion and this lab
                const hasSelectedDiscussion = enrollmentPackage.sections?.some((s: Section) => 
                  s.type === 'DIS' && s.sectionNumber === selectedDiscussionNumber
                );
                
                
                // Only include labs that are in the same package as the selected discussion
                if (!hasSelectedDiscussion) {
                  return;
                }
                
              }
              
              const sectionKey = `${section.type}-${section.sectionNumber}`;
              if (!seenSections.has(sectionKey)) {
                seenSections.add(sectionKey);
                relatedLabs.push(section);
              }
            }
          });
        }
      },
    );

    return relatedLabs.sort((a, b) => {
      const aNum = parseInt(a.sectionNumber || '0', 10);
      const bNum = parseInt(b.sectionNumber || '0', 10);
      return aNum - bNum;
    });
  };

  const hasDiscussions = (course: ClassSearchResult): boolean => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return false;

    // Check if there are any discussion sections
    return (sectionData as EnrollmentPackage[]).some(
      (enrollmentPackage: EnrollmentPackage) =>
        enrollmentPackage.sections?.some(
          (section: Section) => section.type === 'DIS',
        ),
    );
  };

  const hasLabs = (course: ClassSearchResult): boolean => {
    const sectionData = courseSections[course.courseId];
    if (!Array.isArray(sectionData)) return false;

    // Check if there are any lab sections
    return (sectionData as EnrollmentPackage[]).some(
      (enrollmentPackage: EnrollmentPackage) =>
        enrollmentPackage.sections?.some(
          (section: Section) => section.type === 'LAB',
        ),
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
      SUNDAY: 'U',
    };
    return daysList.map((day) => dayMap[day] || day).join(', ');
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
          marginBottom: isMobile ? '12px' : '20px',
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
        variant="body3"
        sx={{
          marginBottom: '0px',
          marginLeft: isMobile ? '-10px' : '0px',
          whiteSpace: 'nowrap',
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
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          marginTop: isMobile ? '8px' : '6px'
        }}
      >
        {searchError ? (
          <Card sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="body2" color="error">
              Error: {searchError}
            </Typography>
          </Card>
        ) : searchResults.length === 0 && searchInput.trim() && !isSearching ? (
          null
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
                    display: 'flex',
                    flexDirection: 'column',
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
                      marginBottom: '8px',
                    }}
                  >
                    {course.subject.formalDescription}
                  </Typography>
                  <Typography
                    variant="body3"
                    sx={{
                      color: 'darkGrey.main',
                    }}
                  >
                    {course.credits?.min && course.credits?.max
                      ? course.credits.min === course.credits.max
                        ? `${course.credits.min} credits`
                        : `${course.credits.min}-${course.credits.max} credits`
                      : course.minimumCredits && course.maximumCredits
                        ? course.minimumCredits === course.maximumCredits
                          ? `${course.minimumCredits} credits`
                          : `${course.minimumCredits}-${course.maximumCredits} credits`
                        : 'Credits TBA'}
                  </Typography>
                </Box>

                {/* Lecture Dropdown - Only show if lectures exist */}
                {getLectureOptions(course).length > 0 && (
                  <FormControl fullWidth>
                    <Select
                      value={selectedLecture[course.courseId] || ''}
                      onChange={(e) =>
                        handleLectureChange(course.courseId, e.target.value)
                      }
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
                            maxHeight: '40vh',
                            '& .MuiMenuItem-root': {
                              whiteSpace: 'normal',
                              height: 'auto',
                              minHeight: 'auto',
                              maxWidth: '100%',
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
                      <MenuItem
                        value=""
                        sx={{ color: 'darkGrey.main', opacity: 0.7 }}
                      >
                        <Typography
                          variant="body3"
                          sx={{ color: 'darkGrey.main', opacity: 0.7 }}
                        >
                          {loadingSections[course.courseId]
                            ? 'Loading sections...'
                            : 'Select section'}
                        </Typography>
                      </MenuItem>
                      {getLectureOptions(course).map((lecture) => {
                        const instructorNames =
                          lecture.instructors
                            ?.map(
                              (inst: Instructor) =>
                                `${inst.name.first} ${inst.name.last}`,
                            )
                            .join(', ') || 'TBA';

                        let timeDisplay = 'TBA';
                        let locationDisplay = 'TBA';

                        if (
                          lecture.classMeetings &&
                          lecture.classMeetings.length > 0
                        ) {
                          // Show all meeting times (exclude EXAM meetings)
                          const timeSlots = lecture.classMeetings
                            .filter(
                              (meeting: Meeting) =>
                                meeting.meetingType !== 'EXAM',
                            )
                            .map((meeting: Meeting) => {
                              if (
                                meeting.meetingTimeStart &&
                                meeting.meetingTimeEnd &&
                                meeting.meetingType !== 'EXAM'
                              ) {
                                const startTime = formatTime(
                                  meeting.meetingTimeStart,
                                );
                                const endTime = formatTime(
                                  meeting.meetingTimeEnd,
                                );
                                const days = formatDays(
                                  meeting.meetingDaysList || [],
                                );
                                return `${days} ${startTime}-${endTime}`;
                              } else if (
                                meeting.building?.buildingName === 'ONLINE'
                              ) {
                                return 'ONLINE';
                              }
                              return null;
                            })
                            .filter(Boolean);

                          timeDisplay =
                            timeSlots.length > 0 ? timeSlots.join(', ') : 'TBA';

                          // Use the first non-EXAM meeting for location display
                          const classMeeting = lecture.classMeetings.find(
                            (meeting: Meeting) =>
                              meeting.meetingType !== 'EXAM',
                          );
                          if (
                            classMeeting?.building?.buildingName &&
                            classMeeting.room
                          ) {
                            locationDisplay = `${classMeeting.room} ${normalizeBuildingNameMemo(classMeeting.building.buildingName)}`;
                          } else if (classMeeting?.building?.buildingName) {
                            locationDisplay =
                              normalizeBuildingNameMemo(classMeeting.building.buildingName);
                          }
                        }

                        const sectionType =
                          lecture.type === 'LEC'
                            ? 'Lecture'
                            : lecture.type === 'LAB'
                              ? 'Lab'
                              : lecture.type;

                        return (
                          <MenuItem
                            key={lecture.sectionNumber}
                            value={lecture.sectionNumber}
                            sx={{ display: 'block', whiteSpace: 'normal' }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                py: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'visible',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  display: 'block',
                                }}
                              >
                                {sectionType} {lecture.sectionNumber}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {instructorNames}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  display: 'block',
                                }}
                              >
                                {timeDisplay}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  display: 'block',
                                }}
                              >
                                {locationDisplay}
                              </Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {/* Discussion Dropdown - Only show if discussions exist */}
                {(loadingSections[course.courseId] ||
                  hasDiscussions(course)) && (
                  <FormControl fullWidth>
                    <Select
                      value={selectedDiscussion[course.courseId] || ''}
                      onChange={(e) =>
                        setSelectedDiscussion((prev) => ({
                          ...prev,
                          [course.courseId]: e.target.value,
                        }))
                      }
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
                            maxHeight: '40vh',
                            '& .MuiMenuItem-root': {
                              whiteSpace: 'normal',
                              height: 'auto',
                              minHeight: 'auto',
                              maxWidth: '100%',
                              padding: '8px 16px',
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
                        disableAutoFocusItem: true,
                        autoFocus: false,
                        variant: 'menu',
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{ color: 'darkGrey.main', opacity: 0.7 }}
                      >
                        <Typography
                          variant="body3"
                          sx={{ color: 'darkGrey.main', opacity: 0.7 }}
                        >
                          {loadingSections[course.courseId]
                            ? 'Loading discussions...'
                            : selectedLecture[course.courseId]
                              ? 'Select discussion for this section'
                              : 'Select section first or choose any discussion'}
                        </Typography>
                      </MenuItem>
                      {getDiscussionOptions(
                        course,
                        selectedLecture[course.courseId],
                      ).map((discussion) => {
                        const instructorNames =
                          discussion.instructors
                            ?.map(
                              (inst: Instructor) =>
                                `${inst.name.first} ${inst.name.last}`,
                            )
                            .join(', ') || 'TBA';

                        let timeDisplay = 'TBA';
                        let locationDisplay = 'TBA';

                        if (
                          discussion.classMeetings &&
                          discussion.classMeetings.length > 0
                        ) {
                          const meeting = discussion.classMeetings[0];

                          if (
                            meeting.meetingTimeStart &&
                            meeting.meetingTimeEnd &&
                            meeting.meetingType !== 'EXAM'
                          ) {
                            const startTime = formatTime(
                              meeting.meetingTimeStart,
                            );
                            const endTime = formatTime(meeting.meetingTimeEnd);
                            const days = formatDays(
                              meeting.meetingDaysList || [],
                            );
                            timeDisplay = `${days} ${startTime}-${endTime}`;
                          } else if (
                            meeting.building?.buildingName === 'ONLINE'
                          ) {
                            timeDisplay = 'Online';
                          }

                          if (meeting.building?.buildingName && meeting.room) {
                            locationDisplay = `${meeting.room} ${normalizeBuildingNameMemo(meeting.building.buildingName)}`;
                          } else if (meeting.building?.buildingName) {
                            locationDisplay = normalizeBuildingNameMemo(meeting.building.buildingName);
                          }
                        }

                        return (
                          <MenuItem
                            key={discussion.sectionNumber}
                            value={discussion.sectionNumber}
                            sx={{ display: 'block', whiteSpace: 'normal' }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                py: 1,
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  display: 'block',
                                }}
                              >
                                Discussion {discussion.sectionNumber}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {instructorNames}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  display: 'block',
                                }}
                              >
                                {timeDisplay}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  display: 'block',
                                }}
                              >
                                {locationDisplay}
                              </Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {/* Lab Dropdown - Only show if labs exist */}
                {(loadingSections[course.courseId] || hasLabs(course)) && (
                  <FormControl fullWidth>
                    <Select
                      value={selectedLab[course.courseId] || ''}
                      onChange={(e) =>
                        setSelectedLab((prev) => ({
                          ...prev,
                          [course.courseId]: e.target.value,
                        }))
                      }
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
                            maxHeight: '40vh',
                            '& .MuiMenuItem-root': {
                              whiteSpace: 'normal',
                              height: 'auto',
                              minHeight: 'auto',
                              maxWidth: '100%',
                              padding: '8px 16px',
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
                        disableAutoFocusItem: true,
                        autoFocus: false,
                        variant: 'menu',
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{ color: 'darkGrey.main', opacity: 0.7 }}
                      >
                        <Typography
                          variant="body3"
                          sx={{ color: 'darkGrey.main', opacity: 0.7 }}
                        >
                          {loadingSections[course.courseId]
                            ? 'Loading labs...'
                            : selectedLecture[course.courseId]
                              ? 'Select lab for this section'
                              : getLectureOptions(course).length === 0
                                ? 'Select lab'
                                : 'Select section first or choose any lab'}
                        </Typography>
                      </MenuItem>
                      {getLabOptions(
                        course,
                        selectedLecture[course.courseId] || undefined,
                        selectedDiscussion[course.courseId] || undefined,
                      ).map((lab) => {
                        const instructorNames =
                          lab.instructors
                            ?.map(
                              (inst: Instructor) =>
                                `${inst.name.first} ${inst.name.last}`,
                            )
                            .join(', ') || 'TBA';

                        let timeDisplay = 'TBA';
                        let locationDisplay = 'TBA';

                        if (lab.classMeetings && lab.classMeetings.length > 0) {
                          const meeting = lab.classMeetings[0];

                          if (
                            meeting.meetingTimeStart &&
                            meeting.meetingTimeEnd &&
                            meeting.meetingType !== 'EXAM'
                          ) {
                            const startTime = formatTime(
                              meeting.meetingTimeStart,
                            );
                            const endTime = formatTime(meeting.meetingTimeEnd);
                            const days = formatDays(
                              meeting.meetingDaysList || [],
                            );
                            timeDisplay = `${days} ${startTime}-${endTime}`;
                          } else if (
                            meeting.building?.buildingName === 'ONLINE'
                          ) {
                            timeDisplay = 'Online';
                          }

                          if (meeting.building?.buildingName && meeting.room) {
                            locationDisplay = `${meeting.room} ${normalizeBuildingNameMemo(meeting.building.buildingName)}`;
                          } else if (meeting.building?.buildingName) {
                            locationDisplay = normalizeBuildingNameMemo(meeting.building.buildingName);
                          }
                        }

                        return (
                          <MenuItem
                            key={lab.sectionNumber}
                            value={lab.sectionNumber}
                            sx={{ display: 'block', whiteSpace: 'normal' }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                py: 1,
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  display: 'block',
                                }}
                              >
                                Lab {lab.sectionNumber}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {instructorNames}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  mb: 0.5,
                                  display: 'block',
                                }}
                              >
                                {timeDisplay}
                              </Typography>
                              <Typography
                                variant="body3"
                                sx={{
                                  color: 'darkGrey.main',
                                  display: 'block',
                                }}
                              >
                                {locationDisplay}
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
                    // Set adding state to prevent auto-scroll interference
                    setIsAddingClass(true);
                    
                    // Clear any existing pending events before starting
                    setPendingEvents([]);
                    
                    // First load sections if not already loaded
                    await loadCourseSections(course);

                    const selectedLec = selectedLecture[course.courseId];
                    const selectedDisc = selectedDiscussion[course.courseId];
                    const selectedLabSection = selectedLab[course.courseId];

                    // User-friendly validation
                    if (!selectedLec && !selectedDisc && !selectedLabSection) {
                      const courseHasDiscussions = hasDiscussions(course);
                      const courseHasLabs = hasLabs(course);
                      if (courseHasDiscussions && courseHasLabs) {
                        alert(
                          'Please select at least a section, discussion, or lab to add.',
                        );
                      } else if (courseHasDiscussions) {
                        alert(
                          'Please select at least a section or discussion to add.',
                        );
                      } else if (courseHasLabs) {
                        alert(
                          'Please select at least a section or lab to add.',
                        );
                      } else {
                        alert('Please select a section to add.');
                      }
                      setIsAddingClass(false);
                      return;
                    }

                    // Dependency validation
                    const dependencyError = validateDependencies(course, selectedLec, selectedDisc, selectedLabSection);
                    if (dependencyError) {
                      setDependencyModalMessage(dependencyError);
                      setIsDependencyModalOpen(true);
                      setIsAddingClass(false);
                      return;
                    }

                    // Get available options
                    const lectureOptions = getLectureOptions(course);

                    // Add selected lecture
                    if (selectedLec) {
                      const lecture = lectureOptions.find(
                        (l) => l.sectionNumber === selectedLec,
                      );
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

                      const discussion = availableDiscussions.find(
                        (d) => d.sectionNumber === selectedDisc,
                      );
                      if (discussion) {
                        await handleAddSection(course, discussion);
                      } else if (selectedLec) {
                        alert(
                          `Discussion ${selectedDisc} is not available for the selected lecture. Please choose a different discussion or lecture.`,
                        );
                        setIsAddingClass(false);
                        return;
                      }
                    }

                    // Add selected lab (with validation for lecture-lab compatibility)
                    if (selectedLabSection) {
                      // If lecture is selected, get labs for that lecture only
                      const availableLabs = selectedLec
                        ? getLabOptions(course, selectedLec, selectedDisc)
                        : getLabOptions(course, undefined, selectedDisc);

                      const lab = availableLabs.find(
                        (l) => l.sectionNumber === selectedLabSection,
                      );
                      if (lab) {
                        await handleAddSection(course, lab);
                      } else if (selectedLec) {
                        alert(
                          `Lab ${selectedLabSection} is not available for the selected lecture. Please choose a different lab or lecture.`,
                        );
                        setIsAddingClass(false);
                        return;
                      }
                    }

                    // Success feedback
                    const addedSections = [];
                    if (selectedLec) {
                      const lecture = lectureOptions.find(
                        (l) => l.sectionNumber === selectedLec,
                      );
                      const sectionType =
                        lecture?.type === 'LEC'
                          ? 'Lecture'
                          : lecture?.type === 'LAB'
                            ? 'Lab'
                            : lecture?.type || 'Section';
                      addedSections.push(`${sectionType} ${selectedLec}`);
                    }
                    if (selectedDisc)
                      addedSections.push(`Discussion ${selectedDisc}`);
                    if (selectedLabSection)
                      addedSections.push(`Lab ${selectedLabSection}`);

                    // Keep selections after successful add for easy color testing
                    
                    // Reset adding state
                    setIsAddingClass(false);
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

      {/* Time Conflict Modal */}
      {isConflictModalOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.primary',
                mb: 2,
              }}
            >
              Schedule conflict detected.
              <br />
              Do you want to remove conflicting
              <br />
              events and add this new class?
            </Typography>

            <Box
              sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleConflictResolve(true)}
                sx={{
                  py: 1.5,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                Keep Existing Events
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleConflictResolve(false)}
                sx={{
                  py: 1.5,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  backgroundColor: 'red.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'red.dark',
                  },
                }}
              >
                Remove and Add New Class
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Dependency Validation Modal */}
      <Dialog
        open={isDependencyModalOpen}
        onClose={() => setIsDependencyModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', padding: '16px 0' }}>
            {dependencyModalMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: '24px' }}>
          <Button
            onClick={() => setIsDependencyModalOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: 'red.main',
              color: 'white',
              minWidth: '80px',
              '&:hover': {
                backgroundColor: 'red.dark',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditSchedulerPanel;
