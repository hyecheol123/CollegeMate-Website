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
import getDummyEvents from '../../data/Schedule/getDummyEvents';
import type { EventData } from '../../types/event';

interface SchedulerTableProps {
  events?: EventData[];
  onRemoveEvent?: (eventId: string) => void;
  isEditMode?: boolean;
}

/**
 * SchedulerTable component that displays a weekly schedule grid
 * Supports dynamic events, responsive design, and time validation
 * @param {SchedulerTableProps} props - Props including optional events array
 * @return {React.ReactElement} The rendered scheduler table
 */
function SchedulerTable({
  events,
  onRemoveEvent,
  isEditMode = false,
}: SchedulerTableProps): React.ReactElement {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [myEvents, setMyEvents] = useState<EventData[]>([]);

  useEffect(() => {
    // Use passed events or fall back to dummy data
    const currentEvents = events || getDummyEvents();
    setMyEvents(currentEvents);
    // Function to handle window resize event
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Event time validation
    currentEvents.forEach((event: EventData) => {
      const start = event.startTime.hour * 60 + event.startTime.minute;
      const end = event.endTime.hour * 60 + event.endTime.minute;
      if (start >= end) {
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
  }, [events]); // Dependency array for useEffect

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleRemoveEvent = (eventId: string): void => {
    if (onRemoveEvent) {
      onRemoveEvent(eventId);
    }
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
    <Box sx={{ height: '100%', flexGrow: 1, overflow: 'visible' }}>
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
          overflow: 'visible',
        }}
      >
        {/* start of the scheduler box */}

        <Table
          sx={{
            width: '100%',
            margin: 0,
            tableLayout: 'fixed',
            height: '100%',
            borderRadius: '6px',
            overflow: 'visible',
            marginRight: '15px', // Extra space for rightmost X buttons
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
                  border: 'none',
                }}
              >
                <Typography variant="body2" color="white.main" align="center">
                  {}
                </Typography>
              </TableCell>

              {days.map((day) => (
                <TableCell
                  key={day}
                  sx={{ paddingLeft: 0, paddingRight: 0, border: 'none' }}
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
                              position: 'relative',
                              ...(isEditMode && {
                                '&::after': {
                                  content: '"×"',
                                  position: 'absolute',
                                  top: '-12px',
                                  right: '-12px',
                                  width: '24px',
                                  height: '24px',
                                  color: '#494949',
                                  fontSize: '24px',
                                  fontWeight: '200',
                                  cursor: 'pointer',
                                  zIndex: 1000,
                                  lineHeight: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  '&:hover': {
                                    color: '#333',
                                  },
                                },
                              }),
                            }}
                            rowSpan={rowSpan}
                            onClick={
                              isEditMode
                                ? (): void => handleRemoveEvent(event.id)
                                : undefined
                            }
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
                              border: 'none',
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
      {/* <InfoFooter>Remove due to mvp feature</InfoFooter> */}
    </Box>
  );
}

export default SchedulerTable;
