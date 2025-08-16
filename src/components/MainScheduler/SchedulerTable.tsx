/**
 * Scheduler Table UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useMemo, useEffect } from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
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
    <Box sx={{ width: '100%', minWidth: windowWidth < 768 ? 'unset' : '600px', overflow: windowWidth < 768 ? 'auto' : 'visible' }}>
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${windowWidth < 300 ? '40px' : '45px'} repeat(${days.length}, 1fr)`,
            gridTemplateRows: `40px repeat(${(maxHour - minHour + 1) * 12}, 5px)`,
            width: '100%',
            height: `${40 + (maxHour - minHour + 1) * 60}px`,
            borderRadius: '6px',
            overflow: 'visible',
            position: 'relative',
            alignItems: 'stretch',
          }}
        >
          {/* Header Row */}
          <Box
            sx={{
              gridColumn: '1 / -1',
              gridRow: '1',
              display: 'grid',
              gridTemplateColumns: `${windowWidth < 300 ? '40px' : '45px'} repeat(${days.length}, 1fr)`,
              bgcolor: 'red.main',
              borderRadius: '6px 6px 0 0',
              alignItems: 'stretch',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gridColumn: '1',
              }}
            >
              <Typography variant="body2" color="white.main" align="center">
                {}
              </Typography>
            </Box>
            {days.map((day, index) => (
              <Box
                key={day}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gridColumn: index + 2,
                }}
              >
                <Typography variant="body2" color="white.main" align="center">
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Time Labels Column */}
          <Box
            sx={{
              gridColumn: '1',
              gridRow: '2 / -1',
              bgcolor: 'red.main',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {majorHours.map((hourLabel, hourIndex) => {
              return (
                <Box
                  key={`time-${minHour + hourIndex}`}
                  sx={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    top: '-25px',
                  }}
                >
                  <Typography variant="body2" color="white.main" align="center">
                    {hourLabel}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Background Grid Cells */}
          {majorHours.map((_, hourIndex) => {
            const hourColor = getColorForHourIndex(hourIndex);
            const hour = minHour + hourIndex;
            const cells: React.ReactElement[] = [];

            for (let i = 0; i < 12; i++) {
              const gridRowStart = 2 + hourIndex * 12 + i;

              days.forEach((day, dayIndex) => {
                cells.push(
                  <Box
                    key={`bg-${hour}-${i}-${day}`}
                    sx={{
                      gridColumn: dayIndex + 2,
                      gridRow: gridRowStart,
                      backgroundColor: hourColor,
                      minHeight: '5px',
                    }}
                  />,
                );
              });
            }
            return cells;
          })}

          {/* Event Blocks */}
          {myEvents.map((event, eventIndex) => {
            const dayIndex = days.indexOf(event.day);
            if (dayIndex === -1) return null;

            const startMin = event.startTime.hour * 60 + event.startTime.minute;
            const endMin = event.endTime.hour * 60 + event.endTime.minute;
            const startGridRow = 2 + Math.floor((startMin - minHour * 60) / 5);
            const endGridRow = 2 + Math.ceil((endMin - minHour * 60) / 5);

            return (
              <Box
                key={`event-${event.id}`}
                sx={{
                  gridColumn: dayIndex + 2,
                  gridRow: `${startGridRow} / ${endGridRow}`,
                  backgroundColor: event.color,
                  borderRadius: '4px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'default',
                  zIndex: 10 + eventIndex,
                  minWidth: 0,
                  overflow: 'visible',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '4px',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="white.main"
                    align="center"
                    sx={{
                      wordWrap: 'break-word',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    {event.title}
                  </Typography>
                  {event.location &&
                    event.location !== 'TBA' && (
                      <Typography
                        variant="body2"
                        color="white.main"
                        align="center"
                        sx={{
                          fontSize: '10px',
                          opacity: 0.8,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          width: '100%',
                          marginTop: '1px',
                        }}
                      >
                        {event.location}
                      </Typography>
                    )}
                </Box>
                {isEditMode && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '24px',
                      height: '24px',
                      color: '#494949',
                      fontSize: '24px',
                      fontWeight: '200',
                      cursor: 'pointer',
                      zIndex: 1000 + eventIndex,
                      lineHeight: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={(e): void => {
                      e.stopPropagation();
                      handleRemoveEvent(event.id);
                    }}
                  >
                    ×
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      {/* <InfoFooter>Remove due to mvp feature</InfoFooter> */}
    </Box>
  );
}

export default SchedulerTable;
