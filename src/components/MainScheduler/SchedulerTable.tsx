/**
 * Scheduler Table UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useMemo, useEffect } from 'react';
// Material UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';
// Components
import Modal from '../Common/Modal/Modal';
import InfoFooter from './InfoFooter';

// define the interface for EventData
interface EventData {
  id: string;
  title: string;
  day: string;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  color: string;
}

// Dummy Data
const myEvents = [
  {
    id: '1',
    title: 'Event 1',
    day: 'Mon',
    startTime: { hour: 9, minute: 15 },
    endTime: { hour: 11, minute: 5 },
    color: 'pink',
  },
  // {
  //   id: '2',
  //   title: 'Event 2',
  //   day: 'Tue',
  //   startTime: { hour: 9, minute: 15 },
  //   endTime: { hour: 11, minute: 55 },
  //   color: 'blue',
  // },
  // {
  //   id: '3',
  //   title: 'Event 3',
  //   day: 'Wed',
  //   startTime: { hour: 9, minute: 15 },
  //   endTime: { hour: 11, minute: 20 },
  //   color: 'blue',
  // },
  // {
  //   id: '4',
  //   title: 'Event 4',
  //   day: 'Sun',
  //   startTime: { hour: 9, minute: 15 },
  //   endTime: { hour: 11, minute: 20 },
  //   color: 'blue',
  // },
  // {
  //   id: '6',
  //   title: 'Event 6',
  //   day: 'Sun',
  //   startTime: { hour: 22, minute: 15 },
  //   endTime: { hour: 23, minute: 20 },
  //   color: 'blue',
  // },
];

/**
 * React Functional Component for the Scheduler Table
 * @return {React.ReactElement} Renders scheduler table
 */
function SchedulerTable(): React.ReactElement {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Function to handle window resize event
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Event time validation
    myEvents.forEach((event) => {
      const startTime = event.startTime.hour * 60 + event.startTime.minute;
      const endTime = event.endTime.hour * 60 + event.endTime.minute;
      if (startTime >= endTime) {
        setIsModalOpen(true);
        setModalMessage(
          `"${event.title}" start time must be earlier than end time.`,
        );
      }
    });

    // Cleanup function
    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, [myEvents]); // Dependency array for useEffect

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  // Function to determine the color based on the hour index
  const getColorForHourIndex = (hourLabel: number): string => {
    return hourLabel % 2 === 0 ? 'whiteGrey.main' : 'white.main';
  };

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
    return Math.ceil((end - start) / 5); // calculate the row span by 5 minutes
  };

  const days = useMemo(() => {
    const baseDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let hasSaturdayEvent = false;
    let hasSundayEvent = false;

    // check for events on Saturday and Sunday
    myEvents.forEach((event) => {
      if (event.day === 'Sat') hasSaturdayEvent = true;
      if (event.day === 'Sun') hasSundayEvent = true;
    });

    // logic to conditionally include Saturday
    if (hasSaturdayEvent || hasSundayEvent) {
      baseDays.push('Sat');
    }

    // logic to conditionally include Sunday
    if (hasSundayEvent) {
      baseDays.push('Sun');
    }

    return baseDays;
  }, [myEvents]);

  return (
    <Box sx={{ height: '100%', flexGrow: 1 }}>
      <Modal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        message={modalMessage}
      />
      {/* start of the biggest box */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        {/* start of the scheduler box */}

        <Table
          sx={{
            width: '90%',
            margin: 'auto',
            tableLayout: 'fixed',
            height: '100%',
          }}
        >
          <TableHead>
            {/* Start of the table header row */}
            <TableRow sx={{ bgcolor: 'red.main' }}>
              <TableCell
                sx={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  width: windowWidth < 300 ? '20px' : '40px',
                  border: '0',
                }}
              >
                <Typography variant="body2" color="white.main" align="center">
                  {}
                </Typography>
              </TableCell>

              {days.map((day) => (
                <TableCell
                  key={day}
                  sx={{ paddingLeft: 0, paddingRight: 0, border: '0' }}
                >
                  <Typography variant="body2" color="white.main" align="center">
                    {day}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* End of the table header row */}
          <TableBody>
            {/* Start of the table body */}
            {majorHours.map((hourLabel, hourIndex) => {
              const hourColor = getColorForHourIndex(hourIndex);
              const hour = minHour + hourIndex;
              const hourRows = [];
              for (let i = 0; i < 12; i++) {
                const minute = i * 5;
                const timeSlotIndex = hour * 60 + minute;
                hourRows.push(
                  <TableRow key={`${hourLabel}-${i * 5}`}>
                    {i === 0 && (
                      <TableCell
                        rowSpan={12}
                        sx={{
                          verticalAlign: 'top',
                          bgcolor: 'red.main',
                          border: 0,
                          padding: 0,
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
                              borderRadius: '4px',
                              padding: 0,
                              border: 'none',
                            }}
                            rowSpan={rowSpan}
                          >
                            <Typography
                              variant="body2"
                              color="white.main"
                              align="center"
                              style={{ wordWrap: 'break-word' }}
                            >
                              {event.title}
                            </Typography>
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
                              backgroundColor: hourColor,
                              padding: '3px',
                              borderTop: '0px',
                              borderLeft: '0px',
                              borderBottom: '0px',
                              // borderRight: '1px solid #DADFE1'
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
      <InfoFooter></InfoFooter>
    </Box>
  );
}

export default SchedulerTable;
