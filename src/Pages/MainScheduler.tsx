/**
 * Main Scheduler page with edit functionality
 * Supports both mobile and desktop layouts with responsive design
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useRef, useEffect } from 'react';
// Material UI
import { Box, useMediaQuery, useTheme } from '@mui/material';
// Component
import SchedulerTable from '../components/MainScheduler/SchedulerTable';
import SchedulerTitle from '../components/MainScheduler/SchedulerTitle';
import SimpleHeader from '../components/Mvp/SimpleHeader/SimpleHeader';
import EditSchedulerPanel from '../components/MainScheduler/EditSchedulerPanel';
// Types
import type { EventData } from '../types/event';

/**
 * MainScheduler component with responsive layout
 * - Desktop: Side-by-side scheduler and edit panel (55%/45% split)
 * - Mobile: Stacked layout with scheduler maintaining consistent size
 * @return {React.ReactElement} The rendered MainScheduler page
 */
function MainScheduler(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [scheduleEvents, setScheduleEvents] = useState<EventData[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchPanelRef = useRef<HTMLDivElement>(null);

  const handleEditToggle = (): void => {
    setIsEditMode((prev) => !prev);
  };

  // Auto-scroll to search panel on mobile when edit mode is activated
  useEffect(() => {
    if (isEditMode && isMobile && searchPanelRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        searchPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [isEditMode, isMobile]);

  const addEvent = (event: EventData): void => {
    setScheduleEvents((prev) => [...prev, event]);
  };

  const updateEventColorsByClassId = (classId: string, color: string): void => {
    setScheduleEvents((prev) =>
      prev.map((event) => {
        // Check if this event belongs to the class being updated
        // Event IDs are in format: "classId-day"
        if (event.id.startsWith(`${classId}-`)) {
          return { ...event, color };
        }
        return event;
      }),
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SimpleHeader />
      <SchedulerTitle onEditClick={handleEditToggle} isEditMode={isEditMode} />

      {/* Main Content Area */}
      {isMobile ? (
        <Box sx={{ padding: '0 16px' }}>
          {/* Mobile: Scheduler always same size */}
          <SchedulerTable events={scheduleEvents} />
          {/* Mobile: Search panel below when in edit mode */}
          {isEditMode && (
            <Box ref={searchPanelRef} sx={{ marginTop: '16px' }}>
              <EditSchedulerPanel
                onAddEvent={addEvent}
                onUpdateEventColor={updateEventColorsByClassId}
              />
            </Box>
          )}
        </Box>
      ) : /* Desktop */
      isEditMode ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            alignItems: 'flex-start',
            padding: '0 16px',
            width: '100%',
          }}
        >
          {/* Scheduler Section */}
          <Box
            sx={{
              flex: '1 1 55%',
              minWidth: 0,
            }}
          >
            <SchedulerTable events={scheduleEvents} />
          </Box>

          {/* Search Panel Section */}
          <Box
            ref={searchPanelRef}
            sx={{
              flex: '1 1 45%',
              minWidth: '350px',
              maxWidth: '500px',
            }}
          >
            <EditSchedulerPanel
              onAddEvent={addEvent}
              onUpdateEventColor={updateEventColorsByClassId}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ padding: '0 16px' }}>
          <SchedulerTable events={scheduleEvents} />
        </Box>
      )}
    </Box>
  );
}

export default MainScheduler;
