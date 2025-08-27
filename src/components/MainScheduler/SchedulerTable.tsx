/**
 * Scheduler Table UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useMemo, useEffect } from 'react';
// Material UI
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
// Components
import Modal from '../Common/Modal/Modal';
import ColorSelectionModal from '../Common/ColorSelectionModal/ColorSelectionModal';
import getDummyEvents from '../../data/Schedule/getDummyEvents';
import type { EventData } from '../../types/event';

interface SchedulerTableProps {
  events?: EventData[];
  onRemoveEvent?: (eventId: string) => void;
  onEventColorChange?: (eventId: string, color: string) => void;
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
  onEventColorChange,
  isEditMode = false,
}: SchedulerTableProps): React.ReactElement {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [myEvents, setMyEvents] = useState<EventData[]>([]);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Function to determine text color based on background brightness
  const getTextColor = (backgroundColor: string): string => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance using standard formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return dark text for bright backgrounds, white text for dark backgrounds
    // Use higher threshold (0.7) so gray colors still use white text
    return luminance > 0.7 ? '#494949' : '#FFFFFF';
  };

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

  const handleEventClick = (eventId: string): void => {
    if (isEditMode && onEventColorChange) {
      setSelectedEventId(eventId);
      setIsColorModalOpen(true);
    }
  };

  const handleColorSelect = (color: string): void => {
    if (selectedEventId && onEventColorChange) {
      onEventColorChange(selectedEventId, color);
    }
    setIsColorModalOpen(false);
    setSelectedEventId(null);
  };

  const handleColorModalClose = (): void => {
    setIsColorModalOpen(false);
    setSelectedEventId(null);
  };

  // Function to determine the color based on the hour index
  const getColorForHourIndex = (hourLabel: number): string => {
    return hourLabel % 2 === 0 ? 'whiteGrey.main' : 'white.main';
  };

  // Function to reorder location string to put building number first
  const formatLocation = (location: string): string => {
    // Match pattern: "Building Name Number" -> "Number Building Name"
    const match = location.match(/^(.+?)\s+(\d+)$/);
    if (match) {
      const [, buildingName, number] = match;
      return `${number} ${buildingName}`;
    }
    return location;
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
    <Box
      sx={{
        width: '100%',
        overflow: 'visible',
      }}
    >
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
            overflow: 'visible',
            position: 'relative',
            alignItems: 'stretch',
            borderRadius: '4px',
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
              alignItems: 'stretch',
              borderRadius: '4px 4px 0 0',
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
              borderRadius: '0 0 0 4px',
              position: 'relative',
              overflow: 'hidden',
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
                    top: '-24px',
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
                // Check if this is the bottom-right corner cell
                const isLastHour = hourIndex === majorHours.length - 1;
                const isLastMinuteSlot = i === 11;
                const isLastDay = dayIndex === days.length - 1;
                const isBottomRightCorner =
                  isLastHour && isLastMinuteSlot && isLastDay;

                cells.push(
                  <Box
                    key={`bg-${hour}-${i}-${day}`}
                    sx={{
                      gridColumn: dayIndex + 2,
                      gridRow: gridRowStart,
                      backgroundColor: hourColor,
                      minHeight: '5px',
                      ...(isBottomRightCorner && {
                        borderRadius: '0 0 4px 0',
                      }),
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
                key={`event-container-${event.id}`}
                sx={{
                  gridColumn: dayIndex + 2,
                  gridRow: `${startGridRow} / ${endGridRow}`,
                  position: 'relative',
                  zIndex: 10 + eventIndex,
                  minWidth: 0,
                  overflow: 'visible',
                }}
              >
                <Box
                  key={`event-${event.id}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: event.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isEditMode ? 'pointer' : 'default',
                    borderRadius: '4px',
                    '&:hover': isEditMode
                      ? {
                          opacity: 0.8,
                        }
                      : {},
                  }}
                  onClick={(e) => {
                    if (!isEditMode) {
                      return;
                    }
                    e.stopPropagation();
                    handleEventClick(event.id);
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      padding: '2px 4px',
                      textAlign: 'center',
                      overflow: 'visible',
                    }}
                  >
                    <Typography
                      variant={isMobile ? 'body2' : 'body3'}
                      align="center"
                      sx={{
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        overflow: 'hidden',
                        width: '100%',
                        fontSize: isMobile
                          ? event.title.length > 20
                            ? '8px'
                            : event.title.length > 15
                              ? '9px'
                              : '10px'
                          : undefined, // Use variant's default fontSize for desktop
                        fontWeight: isMobile ? '500' : 'inherit',
                        lineHeight: isMobile ? '1.1' : undefined, // Use variant's default lineHeight for desktop
                        color: getTextColor(event.color),
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center',
                        margin: '0 auto',
                        marginBottom: '2px',
                      }}
                    >
                      {event.title}
                    </Typography>
                    {event.location && event.location !== 'TBA' && (
                      <Typography
                        variant={isMobile ? 'body2' : 'body3'}
                        align="center"
                        sx={{
                          fontSize: isMobile
                            ? event.location.length > 30
                              ? '5px'
                              : event.location.length > 20
                                ? '6px'
                                : event.location.length > 12
                                  ? '7px'
                                  : '8px'
                            : '12px', // Slightly smaller than body3 for location on desktop
                          opacity: 0.8,
                          whiteSpace: 'normal',
                          overflow: 'visible',
                          width: '100%',
                          marginTop: '1px',
                          lineHeight: isMobile ? '0.9' : '1.2',
                          color: getTextColor(event.color),
                          textAlign: 'center',
                          margin: '1px auto 0',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                        }}
                      >
                        {formatLocation(event.location)}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {isEditMode && (
                  <Box
                    data-remove-button="true"
                    sx={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-2px',
                      width: '24px',
                      height: '24px',
                      color: getTextColor(event.color),
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

      {/* Color Selection Modal */}
      <ColorSelectionModal
        open={isColorModalOpen}
        onClose={handleColorModalClose}
        onColorSelect={handleColorSelect}
        title="Change Event Color"
        message="Select a new color for this class"
        buttonText="Apply Color"
      />
    </Box>
  );
}

export default SchedulerTable;
