/**
 * Scheduler Page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

// 이벤트 데이터 타입 정의
interface EventData {
  id: string;
  title: string;
  day: string;
  startTime: number; // 24-hour format
  endTime: number; // 24-hour format
  color: string;
}

interface SchedulerProps {
  events: EventData[]; // 이벤트 목록을 props으로 받음
}

const Scheduler: React.FC<SchedulerProps> = ({ events }) => {
  const times = ['9', '10', '11', '12', '13', '14', '15', '16', '17']; // Use 24-hour format for times
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // 주어진 시간에 해당하는 이벤트가 있는지 확인.
  const isEventInTimeRange = (event: EventData, hour: number) => {
    return event.startTime <= hour && hour < event.endTime;
  };

  // 주어진 시간에 해당하는 이벤트의 시간 범위에 맞는 높이를 계산
  const calculateEventHeight = (event: EventData) => {
    return `${(event.endTime - event.startTime) * 100}%`; // Each hour corresponds to 100% height
  };

  // 이벤트 렌더링
  const renderEvent = (event: EventData, time: string) => {
    const hour = parseInt(time);
    if (hour === event.startTime) {
      // Only start the event box at the starting hour
      return (
        <Box
          key={event.id}
          bgcolor={event.color}
          position="absolute"
          top={`${(hour - 9) * 52}px`} // Example: each hour block has a height of 52px
          height={calculateEventHeight(event)}
          width="100%"
          zIndex="1"
          borderRadius={1}
        >
          {event.title}
        </Box>
      );
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650, position: 'relative' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell />
            {days.map((day) => (
              <TableCell key={day} align="center">
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {times.map((time) => (
            <TableRow key={time}>
              <TableCell component="th" scope="row">
                {time}
              </TableCell>
              {days.map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{ position: 'relative', height: '52px' }}
                >
                  {' '}
                  {/* 필요에따라 Adjust height (일단 하드코딩)  */}
                  {events
                    .filter((event) => event.day === day)
                    .map((event) => {
                      return renderEvent(event, time);
                    })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Scheduler;
