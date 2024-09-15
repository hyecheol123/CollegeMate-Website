/**
 * Component for the Footer which contains
 * Classes, Credits and view exam options
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import { Typography, Box, Dialog, DialogContent } from '@mui/material';
import React, { useState, useEffect } from 'react';
// Mocking Data
import getScheduleDetail from '../../data/Schedule/getScheduleDetail';
// Custom Hook to Load ExamContext
import { useExamContext } from './ExamContext';
// Component
import Exam from './Exam';

const footerStyle = {
  display: 'flex',
  flexDirection: 'column',
  py: '0.7em',
  px: '0.5em',
  width: '91%',
  margin: 'auto',
};

/**
 * React Functional Component Main Header for Home Page
 * @return {React.ReactElement} Renders Main Header for Home Page
 */
function InfoFooter(): React.ReactElement {
  const [credits, setCredits] = useState<number>(0);
  const [onlineClasses, setOnlineClasses] = useState<string[]>([]);
  // State for managing Dialog open/close
  const [open, setOpen] = useState(false);
  const examContext = useExamContext();

  // Event Handler
  const handleOpen = React.useCallback((): void => {
    setOpen(true);
    examContext.dispatch({ type: 'DISABLE_SCROLL' });
  }, [examContext]);
  const handleClose = React.useCallback((): void => {
    setOpen(false);
    examContext.dispatch({ type: 'ENABLE_SCROLL' });
  }, [examContext]);

  useEffect(() => {
    // Call the mock to get the schedule details
    getScheduleDetail('mock-schedule-id')
      .then((response) => {
        if (response.responseCode === 200 && response.content) {
          // Calculate the total credits for all classes (both online and offline)
          const totalCredits =
            response.content.sessionList?.reduce(
              (acc, session) => acc + session.credit,
              0,
            ) || 0;

          // Filter for online-only sessions
          const onlineSessions =
            response.content.sessionList?.filter(
              (session) => session.onlineOnly,
            ) || [];

          // Extract the class names for online-only classes
          const classNames = onlineSessions.map(
            (session) => session.courseName,
          );
          setCredits(totalCredits);
          setOnlineClasses(classNames);
        } else {
          console.error('Failed to retrieve schedule details');
        }
      })
      .catch((error) => {
        console.error('Error fetching schedule detail', error);
      });
  }, []);

  return (
    <Box sx={footerStyle}>
      <Box sx={{ mb: 0.3, mt: 0.3 }}>
        <Typography variant="body2" color="text.secondary">
          {onlineClasses.length > 0
            ? `Online classes: ${onlineClasses.join(', ')}`
            : 'No online classes are currently assigned to you'}
        </Typography>
      </Box>
      <Box sx={{ mb: 0.3 }}>
        <Typography variant="body2" color="text.secondary">
          {credits} credits
        </Typography>
      </Box>
      <Box sx={{ mb: 0.3 }}>
        <Typography
          variant="body1"
          color="red.main"
          onClick={handleOpen}
          sx={{
            cursor: 'pointer',
          }}
        >
          View Exam Schedule
        </Typography>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="lg">
        <DialogContent>
          <Exam onBack={handleClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default InfoFooter;
