/**
 * Main Home page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Component
import MainHeader from '../components/Scheduler/MainHeader';
import Scheduler from '../components/Scheduler/SchedulerTable';
import SchedulerTitle from '../components/Scheduler/SchedulerTitle';
import InfoFooter from '../components/Scheduler/InfoFooter';

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function Home(): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <MainHeader />
      <SchedulerTitle />
      <Scheduler />
      <InfoFooter />
    </Box>
  );
}

export default Home;
