/**
 * Scheduler Page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React, { useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface EventData {
  id: string;
  title: string;
  day: string;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  color: string;
}

const Scheduler: React.FC = () => {
  const myEvents: EventData[] = [
    {
      id: '1',
      title: 'Event 1',
      day: 'Mon',
      startTime: { hour: 3, minute: 15 },
      endTime: { hour: 11, minute: 5 },
      color: 'blue',
    },
    {
      id: '2',
      title: 'Event 2',
      day: 'Fri',
      startTime: { hour: 10, minute: 30 },
      endTime: { hour: 12, minute: 45 },
      color: 'blue',
    },
  ];

  const getHourLabel = (hour: number) => {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  // Set the default time for the scheduler.
  const { minHour, maxHour } = useMemo(() => {
    let min = 9; 
    let max = 17;
    myEvents.forEach(event => {
      min = Math.min(min, event.startTime.hour);
      max = Math.max(max, event.endTime.hour);
    });
    return { minHour: min, maxHour: max };
  }, [myEvents]);

  const majorHours = useMemo(() => {
    return Array.from({ length: maxHour - minHour + 1 }, (_, i) => getHourLabel(minHour + i));
  }, [minHour, maxHour]);

  const calculateRowSpan = (event: EventData) => {
    const start = event.startTime.hour * 60 + event.startTime.minute;
    const end = event.endTime.hour * 60 + event.endTime.minute;
    return Math.ceil((end - start) / 5); // Calculate the row span by 5min
  };

  // Case for adding the weekend.
  const days = useMemo(() => {
    const baseDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let includesWeekend = false;

    myEvents.forEach(event => {
      if (event.day === 'Sat' || event.day === 'Sun') {
        includesWeekend = true;
      }
    });

    return includesWeekend ? [...baseDays, 'Sat', 'Sun'] : baseDays;
  }, [myEvents]);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
      <Table sx={{ minWidth: 650 }} aria-label="scheduler table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            {days.map((day) => (
              <TableCell key={day} align="center">{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {majorHours.map((hourLabel, hourIndex) => {
            const hour = minHour + hourIndex;
            const hourRows = [];
            for (let i = 0; i < 12; i++) { // 5min slot for each time freame.
              const minute = i * 5;
              const timeSlotIndex = hour * 60 + minute;
              hourRows.push(
                <TableRow key={`${hourLabel}-${i * 5}`}>
                  {i === 0 && (
                    <TableCell
                      rowSpan={12}
                      sx={{
                        height: '10px',
                        padding: '3px 0',
                        borderRight: '1px solid rgba(224, 224, 224, 1)', 
                        borderBottom: '1px solid rgba(224, 224, 224, 1)'
                      }}
                    >
                      {hourLabel}
                    </TableCell>
                  )}
                  {days.map((day) => {
                    const eventsForDay = myEvents.filter(e => e.day === day);
                    const event = eventsForDay.find(e => {
                      const eventStartIndex = e.startTime.hour * 60 + e.startTime.minute;
                      const eventEndIndex = e.endTime.hour * 60 + e.endTime.minute;
                      return timeSlotIndex >= eventStartIndex && timeSlotIndex < eventEndIndex;
                    });

                    if (event && timeSlotIndex === event.startTime.hour * 60 + event.startTime.minute) {
                      const rowSpan = calculateRowSpan(event);
                      return (
                        <TableCell
                          key={`${day}-${hourLabel}-${i * 5}`}
                          align="center"
                          sx={{
                            backgroundColor: event.color,
                            height: '10px',
                            padding: '3px 0',
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: i === 11 ? '1px solid rgba(224, 224, 224, 1)' : 'none'
                          }}
                          rowSpan={rowSpan}
                        >
                          {event.title}
                        </TableCell>
                      );
                    } else if (!event || timeSlotIndex < event.startTime.hour * 60 + event.startTime.minute) {
                      return (
                        <TableCell
                          key={`${day}-${hourLabel}-${i * 5}`}
                          sx={{
                            height: '10px',
                            padding: '3px 0',
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: i === 11 ? '1px solid rgba(224, 224, 224, 1)' : 'none'
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </TableRow>
              );
            }
            return hourRows;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Scheduler;
