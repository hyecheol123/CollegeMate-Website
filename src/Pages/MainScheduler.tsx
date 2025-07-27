/**
 * Main Home page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Component
import Scheduler from '../components/MainScheduler/SchedulerTable';
import SchedulerTitle from '../components/MainScheduler/SchedulerTitle';

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function MainScheduler(): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <SchedulerTitle />
      <Scheduler />
    </Box>
  );
}

export default MainScheduler;
