/**
 * Scheduler Table UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React, { useMemo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';

// define the interface for EventData
interface EventData {
  id: string;
  title: string;
  day: string;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  color: string;
}

/**
 * React Functional Component for the Scheduler Table
 * @return {React.ReactElement} Renders scheduler table
 */
function SchedulerTable(): React.ReactElement {
  // const [errors, setErrors] = useState<string[]>([]); // Temporality implemented in order to cover edge case

  const myEvents = useMemo(
    () => [
      {
        id: '1',
        title: 'Event 1',
        day: 'Mon',
        startTime: { hour: 9, minute: 15 },
        endTime: { hour: 11, minute: 5 },
        color: 'pink',
      },
      {
        id: '2',
        title: 'Event 2',
        day: 'Tue',
        startTime: { hour: 9, minute: 15 },
        endTime: { hour: 11, minute: 55 },
        color: 'red',
      },
      {
        id: '3',
        title: 'Event 3',
        day: 'Wed',
        startTime: { hour: 9, minute: 15 },
        endTime: { hour: 11, minute: 20 },
        color: 'blue',
      },
      {
        id: '4',
        title: 'Event 4',
        day: 'Sun',
        startTime: { hour: 9, minute: 15 },
        endTime: { hour: 11, minute: 30 },
        color: 'blue',
      },
    ],
    [],
  );

  // // Temporality implemented in order to cover edge case
  // useEffect(() => {
  //   const validationErrors: string[] = [];

  //   myEvents.forEach((event) => {
  //     const startTime = event.startTime.hour * 60 + event.startTime.minute;
  //     const endTime = event.endTime.hour * 60 + event.endTime.minute;

  //     if (startTime >= endTime) {
  //       validationErrors.push(
  //         `Error: "${event.title}" has a start time later than or equal to its end time.`,
  //       );
  //     }
  //   });

  //   setErrors(validationErrors);
  // }, [myEvents]);

  const getHourLabel = (hour: number): string => {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}`;
    // return `${hour12} ${hour < 12 ? 'AM' : 'PM'}`;
  };

  const { minHour, maxHour } = useMemo(() => {
    let min = 9;
    let max = 17;
    myEvents.forEach((event) => {
      min = Math.min(min, event.startTime.hour);
      max = Math.max(max, event.endTime.hour);
    });
    return { minHour: min, maxHour: max };
  }, [myEvents]);

  const majorHours = useMemo(() => {
    return Array.from({ length: maxHour - minHour + 1 }, (_, i) =>
      getHourLabel(minHour + i),
    );
  }, [minHour, maxHour]);

  const calculateRowSpan = (event: EventData): number => {
    const start = event.startTime.hour * 60 + event.startTime.minute;
    const end = event.endTime.hour * 60 + event.endTime.minute;
    return Math.ceil((end - start) / 5); // Calculate the row span by 5 minutes
  };

  const days = useMemo(() => {
    const baseDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let includesWeekend = false;

    myEvents.forEach((event) => {
      if (event.day === 'Sat' || event.day === 'Sun') {
        includesWeekend = true;
      }
    });

    return includesWeekend ? [...baseDays, 'Sat', 'Sun'] : baseDays;
  }, [myEvents]);

  return (
    <Box>
      {/* start of the biggest box */}
      <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        {' '}
        {/* start of the scheduler box */}
        <Table>
          <TableHead>
            {/* Start of the table header row */}
            <TableRow sx={{ bgcolor: 'red.main' }}>
              <TableCell>
                <Typography variant="body2" color="white.main" align="center">
                  Time
                </Typography>
              </TableCell>
              {days.map((day) => (
                <TableCell key={day}>
                  <Typography variant="body2" color="white.main" align="center">
                    {day}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>{' '}
          {/* End of the table header row */}
          <TableBody>
            {/* Start of the table body */}
            {majorHours.map((hourLabel, hourIndex) => {
              const hour = minHour + hourIndex;
              const hourRows = [];
              for (let i = 0; i < 12; i++) {
                const minute = i * 5;
                const timeSlotIndex = hour * 60 + minute;
                hourRows.push(
                  <TableRow sx={{ border: 0 }} key={`${hourLabel}-${i * 5}`}>
                    {i === 0 && (
                      <TableCell
                        rowSpan={12}
                        sx={{
                          align: 'center',
                          bgcolor: 'red.main',
                          border: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="white.main"
                          align="center"
                        >
                          {hourLabel}
                        </Typography>
                      </TableCell>
                    )}
                    {days.map((day) => {
                      const eventsForDay = myEvents.filter(
                        (e) => e.day === day,
                      );
                      const event = eventsForDay.find((e) => {
                        const eventStartIndex =
                          e.startTime.hour * 60 + e.startTime.minute;
                        const eventEndIndex =
                          e.endTime.hour * 60 + e.endTime.minute;
                        return (
                          timeSlotIndex >= eventStartIndex &&
                          timeSlotIndex < eventEndIndex
                        );
                      });

                      if (
                        event &&
                        timeSlotIndex ===
                          event.startTime.hour * 60 + event.startTime.minute
                      ) {
                        const rowSpan = calculateRowSpan(event);
                        return (
                          <TableCell
                            key={`${day}-${hourLabel}-${i * 5}`}
                            align="center"
                            sx={{
                              backgroundColor: event.color,
                              padding: '3px',
                            }}
                            rowSpan={rowSpan}
                          >
                            {event.title}
                          </TableCell>
                        );
                      } else if (
                        !event ||
                        timeSlotIndex <
                          event.startTime.hour * 60 + event.startTime.minute
                      ) {
                        return (
                          <TableCell
                            key={`${day}-${hourLabel}-${i * 5}`}
                            sx={{
                              padding: '3px',
                              borderTop: '0px',
                              borderLeft: '0px',
                              borderBottom: '0px',
                              borderRight: '1px solid #DADFE1',
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </TableRow>,
                );
              }
              return hourRows;
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default SchedulerTable;
