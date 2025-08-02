/**
 * Edit Scheduler Panel component for searching and adding classes
 * @author Claude AI Assistant
 */

// React
import React, { useState, useMemo } from 'react';
// Types
import type { EventData } from '../../types/event';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Dummy class data type
interface DummyClass {
  id: string;
  name: string;
  code: string;
  instructor: string;
  time: string;
  days: string;
  credits: number;
  location: string;
}

// Static dummy data
const DUMMY_CLASSES: DummyClass[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS 101',
    instructor: 'Dr. Smith',
    time: '10:00 AM - 11:15 AM',
    days: 'Mon, Wed, Fri',
    credits: 3,
    location: 'Science Building 101',
  },
  {
    id: '2',
    name: 'Calculus I',
    code: 'MATH 141',
    instructor: 'Prof. Johnson',
    time: '2:00 PM - 3:15 PM',
    days: 'Tue, Thu',
    credits: 4,
    location: 'Math Building 205',
  },
];

// Helper function to convert dummy class to event data
const convertClassToEvent = (classItem: DummyClass): EventData[] => {
  const events: EventData[] = [];
  const dayMap: { [key: string]: string } = {
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun',
  };

  // Parse time (assuming format like "10:00 AM - 11:15 AM")
  const [startTimeStr, endTimeStr] = classItem.time.split(' - ');
  const parseTime = (timeStr: string): { hour: number; minute: number } => {
    const [time, period] = timeStr.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return { hour, minute };
  };

  const startTime = parseTime(startTimeStr);
  const endTime = parseTime(endTimeStr);

  // Parse days (assuming format like "Mon, Wed, Fri")
  const daysList = classItem.days.split(', ');

  daysList.forEach((dayStr) => {
    const day = dayMap[dayStr];
    if (day) {
      events.push({
        id: `${classItem.id}-${day}`,
        title: classItem.code,
        startTime,
        endTime,
        day,
        color: '#1976d2', // Default blue color
        location: classItem.location,
        instructor: classItem.instructor,
      });
    }
  });

  return events;
};

interface EditSchedulerPanelProps {
  onAddEvent?: (event: EventData) => void;
}

/**
 * EditSchedulerPanel component for managing class search and addition
 * @param {EditSchedulerPanelProps} props - Props including onAddEvent function
 * @returns {React.ReactElement} The rendered EditSchedulerPanel component
 */
function EditSchedulerPanel({
  onAddEvent,
}: EditSchedulerPanelProps): React.ReactElement {
  const [searchInput, setSearchInput] = useState<string>('');

  // Filter classes based on search input
  const filteredClasses = useMemo(() => {
    if (!searchInput.trim()) {
      return DUMMY_CLASSES;
    }

    const searchTerm = searchInput.toLowerCase();
    return DUMMY_CLASSES.filter(
      (classItem) =>
        classItem.name.toLowerCase().includes(searchTerm) ||
        classItem.code.toLowerCase().includes(searchTerm) ||
        classItem.instructor.toLowerCase().includes(searchTerm),
    );
  }, [searchInput]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchInput(event.target.value);
  };

  const handleAddClass = (classItem: DummyClass): void => {
    if (onAddEvent) {
      const events = convertClassToEvent(classItem);
      events.forEach((event) => onAddEvent(event));
    }
  };

  return (
    <Box
      sx={{
        width: '90%',
        margin: '20px auto',
        padding: '24px',
        backgroundColor: 'whiteGrey.main',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Panel Title */}
      <Typography
        variant="h2"
        sx={{
          color: 'red.main',
          marginBottom: '20px',
          textAlign: 'center',
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
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
        {filteredClasses.length} class(es) found
      </Typography>

      {/* Class List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredClasses.length === 0 ? (
          <Card sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No classes found matching your search.
            </Typography>
          </Card>
        ) : (
          filteredClasses.map((classItem) => (
            <Card
              key={classItem.id}
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
                        {classItem.code}
                      </Typography>
                      <Chip
                        label={`${classItem.credits} credits`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '12px' }}
                      />
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        marginBottom: '4px',
                        color: 'darkGrey.main',
                      }}
                    >
                      {classItem.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginBottom: '4px' }}
                    >
                      Instructor: {classItem.instructor}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginBottom: '4px' }}
                    >
                      Time: {classItem.time}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginBottom: '4px' }}
                    >
                      Days: {classItem.days}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Location: {classItem.location}
                    </Typography>
                  </Box>

                  {/* Add Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddClass(classItem)}
                    sx={{
                      minWidth: '120px',
                      alignSelf: 'flex-end',
                    }}
                  >
                    Add Class
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}

export default EditSchedulerPanel;
