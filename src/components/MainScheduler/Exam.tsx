/**
 * Component for the Exam Schedule page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React, { useState, useEffect } from 'react';
// Material UI
import { Box, Typography, IconButton, Divider } from '@mui/material';
// Material UI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Mocking API
import getScheduleDetail from '../../data/Schedule/getScheduleDetail';

/**
 * Interface for exam modal
 */
interface IExamProps {
  onBack: () => void;
}

/**
 * Interface for the exam schedule data
 */
interface IExam {
  date: string;
  subject: string;
  time: string;
  location: string;
}

const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const titleWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  mb: '20px',
  position: 'relative',
};

const examItemStyle = {
  width: '100%',
  textAlign: 'center',
};

/**
 * Helper function to format time from 24-hour to 12-hour with AM/PM
 * @param hour
 * @param minute
 */
const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert to 12-hour format and handle "0" as "12"
  const formattedMinute = minute.toString().padStart(2, '0'); // Add leading zero to minute
  return `${formattedHour}:${formattedMinute} ${period}`;
};

/**
 * Helper function to format date to "Mar 10, 2024" format
 * @param month
 * @param day
 * @param year
 */
const formatDate = (month: number, day: number, year: number): string => {
  const date = new Date(year, month - 1, day); // Create a new Date object (month is zero-based)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const backIconStyle = { paddingLeft: 0 };
const titleStyle = { textAlign: 'center', flex: 1, mr: '40px' };

/**
 * React Functional Component for the modal of the exam page.
 * @param {IExamProps} props Properties passed from the parent component,
 *   including a function to handle the 'back' action.
 * @returns {React.ReactElement} Renders the pop-up of the exam schedule page
 */
function Exam(props: IExamProps): React.ReactElement {
  const [examSchedules, setExamSchedules] = useState<IExam[]>([]);

  useEffect(() => {
    // Mock API call to get the schedule details
    getScheduleDetail('some-schedule-id').then((response) => {
      if (response.responseCode === 200 && response.content) {
        // Extract meetings with "EXAM" type
        const exams = response.content.sessionList.flatMap((session) =>
          session.meetings
            .filter((meeting) => meeting.meetingType === 'EXAM')
            .map((meeting) => ({
              date: formatDate(
                meeting.startTime.month,
                meeting.startTime.day,
                2024,
              ),
              subject: session.courseName,
              time: `${formatTime(meeting.startTime.hour || 0, meeting.startTime.minute || 0)} - ${formatTime(meeting.endTime.hour || 0, meeting.endTime.minute || 0)}`,
              location: `${meeting.buildingName}, Room ${meeting.room}`,
            })),
        );
        setExamSchedules(exams);
      }
    });
  }, []);

  return (
    <Box sx={modalStyle}>
      <Box sx={titleWrapperStyle}>
        <IconButton sx={backIconStyle} onClick={props.onBack} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" color="red.main" sx={titleStyle}>
          Exam Schedule
        </Typography>
      </Box>
      {examSchedules.map((exam, index) => (
        <Box key={index} sx={examItemStyle}>
          <Typography variant="body1">{exam.date}</Typography>
          <Typography variant="body1">{exam.subject}</Typography>
          <Typography variant="body1">{exam.time}</Typography>
          <Typography variant="body1">{exam.location}</Typography>
          <Divider
            sx={{ my: 2, mb: index === examSchedules.length - 1 ? 0 : 2 }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default React.memo(Exam);
