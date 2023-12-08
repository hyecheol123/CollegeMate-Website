/**
 * Scheduler Page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// Event data type definition
interface EventData {
  id: string;
  title: string;
  day: string;
  startTime: number; // This should be changed as a right format
  endTime: number;   // This should be changed as a right format
  color: string;
}

const Scheduler: React.FC = () => {
  const defaultStartTime = 9; // Default start time (9 AM in 24-hour format)
  const defaultEndTime = 17; // Default end time (5 PM in 24-hour format)
  let maxEndTime = defaultEndTime; // Initialize max end time with default end time

  // Define time labels in the desired format (without minutes)
  const hours = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Sample event data (테스팅용, 근데 api 따라가야함 )
  const myEvents: EventData[] = [
    {
      id: '1',
      title: 'Event 1',
      day: 'Mon',
      startTime: 9, // 9 AM
      endTime: 11, // 11 AM
      color: 'blue',
    },
    {
      id: '2',
      title: 'Event 2',
      day: 'Mon',
      startTime: 14, // 2 PM
      endTime: 16, // 4 PM
      color: 'green',
    },
    {
      id: '3',
      title: 'Event 3',
      day: 'Sat',
      startTime: 10,
      endTime: 12,
      color: 'red',
    },
    {
      id: '4',
      title: 'Event 4',
      day: 'Tue',
      startTime: 18,
      endTime: 20,
      color: 'purple',
    },
  ];

  // Find the latest end time of all events
  myEvents.forEach((event) => {
    if (event.endTime > maxEndTime) {
      maxEndTime = event.endTime;
    }
  });

  // Check if there are weekend events, and add Sat and Sun if needed
  const hasWeekendEvent = (events: EventData[]) => {
    return events.some((event) => event.day === 'Sat' || event.day === 'Sun');
  };

  if (hasWeekendEvent(myEvents)) {
    days.push('Sat', 'Sun');
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
      <Table sx={{ minWidth: 650 }} aria-label="scheduler table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            {days.map((day) => (
              <TableCell key={day} align="center">
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {hours.map((hourLabel, hourIndex) => {
            // Map hour labels to 24-hour time for comparison with event times
            const hour24 = hourIndex % 12 + (hourLabel.includes('PM') ? 12 : 0);

            return (
              <TableRow key={hourLabel}>
                <TableCell component="th" scope="row">
                  {hourLabel}
                </TableCell>
                {days.map((day) => {
                  // Find an event for this day and time
                  const event = myEvents.find(
                    (e) => e.day === day && e.startTime <= hour24 && e.endTime > hour24
                  );

                  // Calculate rowSpan if this is the start of an event
                  const rowSpan = event && event.startTime === hour24
                    ? event.endTime - event.startTime
                    : 1;

                  // Only render a cell if there's an event or if this is the first hour for empty slots
                  if (!event || event.startTime === hour24) {
                    return (
                      <TableCell
                        key={`${day}-${hour24}`}
                        align="center"
                        sx={{ backgroundColor: event ? event.color : undefined }}
                        rowSpan={event ? rowSpan : undefined}
                      >
                        {event ? event.title : ''}
                      </TableCell>
                    );
                  }
                  // If this hour is within an event's duration, don't render a cell
                  return null;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Scheduler;
