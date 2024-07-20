/**
 * Main Home page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Component
import HeaderButton from '../components/Common/HeaderButton/HeaderButton';
import Scheduler from '../components/Scheduler/SchedulerTable';
import SchedulerTitle from '../components/Scheduler/SchedulerTitle';

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function Home(): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderButton />
      <SchedulerTitle />
      <Scheduler />
    </Box>
  );
}

export default Home;
