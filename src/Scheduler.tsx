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

interface EventData {
  id: string;
  title: string;
  day: string;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  color: string;
}

const Scheduler: React.FC = () => {
  // 주중의 요일을 나타내는 배열 
  // TODO: 토,일에 이벤트가 하나라도 추가되면 토,일 셀 만들기
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  // 24시간을 나타내는 배열
  const majorHours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const myEvents: EventData[] = [
    // TODO: API 맞게
    {
      id: '1',
      title: 'Event 1',
      day: 'Mon',
      startTime: { hour: 9, minute: 15 },
      endTime: { hour: 11, minute: 5 },
      color: 'blue',
    },
    {
      id: '2',
      title: 'Event 2',
      day: 'Tue',
      startTime: { hour: 10, minute: 30 },
      endTime: { hour: 11, minute: 5 },
      color: 'blue',
    },
  ];

  // 이벤트의 시간 계산해서 rowSpan을 결정하는 함수
  const calculateRowSpan = (event: EventData) => {
    const start = event.startTime.hour * 60 + event.startTime.minute;
    const end = event.endTime.hour * 60 + event.endTime.minute;
    return Math.ceil((end - start) / 5); // 5분 간격으로 rowSpan 계산
  };

  // TODO: 세로선 없애기 (요일만)
  // TODO: 시간 단위 바꾸기
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
            const hourRows = [];
            for (let i = 0; i < 12; i++) { // 각 시간별로 12개의 5분 간격 셀 생성함
              const timeSlotIndex = hourIndex * 12 + i;
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
                    // 해당 요일의 이벤트를 필터링함
                    const eventsForDay = myEvents.filter(e => e.day === day);
                    // 현재 셀에 해당하는이벤트를 찾음
                    const event = eventsForDay.find(e => {
                      const eventStartIndex = e.startTime.hour * 12 + e.startTime.minute / 5;
                      const eventEndIndex = e.endTime.hour * 12 + e.endTime.minute / 5;
                      return timeSlotIndex >= eventStartIndex && timeSlotIndex < eventEndIndex;
                    });

                    // 이벤트가 시작하는셀에 대한 로직
                    if (event && timeSlotIndex === event.startTime.hour * 12 + event.startTime.minute / 5) {
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
                    } else if (!event || timeSlotIndex < event.startTime.hour * 12 + event.startTime.minute / 5) {
                      // 이벤트가 없는셀에 대한 로직
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
