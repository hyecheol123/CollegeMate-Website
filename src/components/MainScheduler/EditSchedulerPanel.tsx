/**
 * Edit Scheduler Panel component for searching and adding classes
 * @author Claude AI Assistant
 */

// React
import React, { useState, useMemo, useEffect } from 'react';
// Types
import type { EventData } from '../../types/event';
// API
import { searchClasses, type ClassSearchResult } from '../../data/Search/searchClasses';
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

// Helper function to convert course details to event data
const convertCourseToEvents = (
  course: ClassSearchResult, 
  courseDetails: any, 
  color: string
): EventData[] => {
  const events: EventData[] = [];
  
  console.log(`🔄 Converting course ${course.fullCourseDesignation} to events...`);
  
  if (!courseDetails || !courseDetails.length) {
    console.log(`⚠️ No course details found for ${course.fullCourseDesignation}`);
    return events;
  }

  courseDetails.forEach((enrollmentPackage: any) => {
    enrollmentPackage.sections?.forEach((section: any) => {
      section.classMeetings?.forEach((meeting: any) => {
        // Convert meeting days list to individual days
        meeting.meetingDaysList?.forEach((day: string) => {
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
          const instructorNames = section.instructors?.map((inst: any) => 
            `${inst.name.first} ${inst.name.last}`
          ).join(', ') || 'TBA';

          // Create unique event ID
          const eventId = `${course.courseId}-${section.id}-${day}`;

          events.push({
            id: eventId,
            title: course.courseDesignation,
            startTime,
            endTime,
            day,
            color,
            location: meeting.buildingName && meeting.room 
              ? `${meeting.buildingName} ${meeting.room}` 
              : 'TBA',
            instructor: instructorNames,
          });

          console.log(`  ✅ Created event: ${course.courseDesignation} on ${day} ${startTime.hour}:${startTime.minute.toString().padStart(2, '0')}-${endTime.hour}:${endTime.minute.toString().padStart(2, '0')}`);
        });
      });
    });
  });

  console.log(`📊 Created ${events.length} events for ${course.fullCourseDesignation}`);
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      
      console.log(`🔍 Starting search for "${searchInput}" in term ${currentTerm.termCode}...`);

      try {
        const response = await searchClasses(currentTerm.termCode, searchInput, 1, 10);
        
        console.log(`✅ Search completed! Found ${response.found} total results`);
        setSearchResults(response.hits || []);
        
        if (response.hits.length === 0) {
          console.log(`ℹ️ No results found for "${searchInput}"`);
        }
        
      } catch (error) {
        console.error('❌ Search failed:', error);
        setSearchError(error instanceof Error ? error.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, currentTerm]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchInput(event.target.value);
  };

  const handleAddClass = async (course: ClassSearchResult): Promise<void> => {
    if (!onAddEvent || !currentTerm) {
      console.log('❌ Cannot add class: missing onAddEvent callback or currentTerm');
      return;
    }

    console.log(`🎯 Adding class ${course.fullCourseDesignation}...`);
    
    try {
      // Get course details
      console.log(`📡 Fetching details for ${course.subject.subjectCode} ${course.courseId}...`);
      const courseDetails = await getCourseDetails(
        currentTerm.termCode,
        course.subject.subjectCode,
        course.courseId
      );

      const selectedColor = classColors[course.courseId] || '#9E9E9E';
      const events = convertCourseToEvents(course, courseDetails.packages, selectedColor);
      
      if (events.length === 0) {
        console.log(`⚠️ No events created for ${course.fullCourseDesignation}`);
        return;
      }

      console.log(`✅ Adding ${events.length} events to schedule...`);
      events.forEach((event) => onAddEvent(event));
      
      console.log(`🎉 Successfully added ${course.fullCourseDesignation} to schedule!`);
      
    } catch (error) {
      console.error(`❌ Failed to add class ${course.fullCourseDesignation}:`, error);
    }
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
        padding: isMobile ? '16px' : '24px',
        backgroundColor: isMobile ? 'transparent' : 'whiteGrey.main',
        borderRadius: isMobile ? '0px' : '8px',
        border: isMobile ? 'none' : '1px solid #e0e0e0',
      }}
    >
      {/* Panel Title */}
      <Typography
        variant="h2"
        sx={{
          color: 'red.main',
          marginBottom: '20px',
          textAlign: 'left',
        }}
      >
        Edit Schedule
      </Typography>

      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for classes (name, code, or instructor)"
        value={searchInput}
        onChange={handleSearchChange}
        sx={{ marginBottom: '20px' }}
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
          marginBottom: '16px',
          color: 'darkGrey.main',
          fontWeight: 500,
        }}
      >
        {isSearching ? 'Searching...' : 
         searchError ? 'Search error' :
         searchResults.length > 0 ? `${searchResults.length} class(es) found` :
         searchInput.trim() ? 'No classes found' : 'Enter search term above'}
      </Typography>

      {/* Class List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {searchError ? (
          <Card sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="body2" color="error">
              Error: {searchError}
            </Typography>
          </Card>
        ) : searchResults.length === 0 && searchInput.trim() && !isSearching ? (
          <Card sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No classes found matching your search.
            </Typography>
          </Card>
        ) : (
          searchResults.map((course, index) => (
            <Card
              key={`${course.courseId}-${course.subject.subjectCode}-${index}`}
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
                      onClick={() => handleAddClass(course)}
                      sx={{
                        flex: 1,
                        fontSize: '12px',
                        padding: '6px 12px',
                      }}
                    >
                      Add Class
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
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
