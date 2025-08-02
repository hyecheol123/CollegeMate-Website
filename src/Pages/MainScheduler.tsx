/**
 * Main Home page
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState } from 'react';
// Material UI
import { Box } from '@mui/material';
// Component
import Scheduler from '../components/MainScheduler/SchedulerTable';
import SchedulerTitle from '../components/MainScheduler/SchedulerTitle';
import SimpleHeader from '../components/Mvp/SimpleHeader/SimpleHeader';
import EditSchedulerPanel from '../components/MainScheduler/EditSchedulerPanel';
// Types
import type { EventData } from '../types/event';

/**
 * React Functional Component for MainScheduler page
 * @return {React.ReactElement} Renders MainScheduler page with edit functionality
 */
function MainScheduler(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [scheduleEvents, setScheduleEvents] = useState<EventData[]>([]);

  const handleEditToggle = (): void => {
    setIsEditMode((prev) => !prev);
  };

  const addEvent = (event: EventData): void => {
    setScheduleEvents((prev) => [...prev, event]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <SimpleHeader />
      <SchedulerTitle onEditClick={handleEditToggle} isEditMode={isEditMode} />
      <Scheduler events={scheduleEvents} />
      {isEditMode && <EditSchedulerPanel onAddEvent={addEvent} />}
    </Box>
  );
}

export default MainScheduler;
