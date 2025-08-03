/**
 * Main Scheduler page with edit functionality
 * Supports both mobile and desktop layouts with responsive design
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useRef, useEffect } from 'react';
// Material UI
import { Box, useMediaQuery, useTheme, Alert, CircularProgress, Typography } from '@mui/material';
// Component
import SchedulerTable from '../components/MainScheduler/SchedulerTable';
import SchedulerTitle from '../components/MainScheduler/SchedulerTitle';
import SimpleHeader from '../components/Mvp/SimpleHeader/SimpleHeader';
import EditSchedulerPanel from '../components/MainScheduler/EditSchedulerPanel';
// API and Utils
import { getTerms } from '../data/Terms/getTerms';
import { getCurrentTerm, getUpcomingTerms } from '../utils/termUtils';
// Types
import type { EventData } from '../types/event';
import type { Term } from '../data/Terms/getTerms';

/**
 * MainScheduler component with responsive layout
 * - Desktop: Side-by-side scheduler and edit panel (55%/45% split)
 * - Mobile: Stacked layout with scheduler maintaining consistent size
 * @return {React.ReactElement} The rendered MainScheduler page
 */
function MainScheduler(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [scheduleEvents, setScheduleEvents] = useState<EventData[]>([]);
  const [availableTerms, setAvailableTerms] = useState<Term[]>([]);
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [scheduleEventsByTerm, setScheduleEventsByTerm] = useState<
    Record<string, EventData[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchPanelRef = useRef<HTMLDivElement>(null);

  const handleEditToggle = (): void => {
    setIsEditMode((prev) => !prev);
  };

  // Load terms on component mount
  useEffect(() => {
    const loadTerms = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const termsData = await getTerms();
        const futureTerms = getUpcomingTerms(termsData.terms, 6); // Get next 6 terms
        setAvailableTerms(futureTerms);

        // Set current term
        const current = getCurrentTerm(termsData.terms);
        if (current) {
          setCurrentTerm(current);
          // Initialize with empty events for current term
          setScheduleEvents([]);
        } else if (futureTerms.length > 0) {
          // If no current term, use the first available future term
          setCurrentTerm(futureTerms[0]);
          setScheduleEvents([]);
        }
      } catch (error) {
        console.error('Failed to load terms:', error);
        setError(error instanceof Error ? error.message : 'Failed to load terms');
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, []);

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

  // Handle term change
  const handleTermChange = (newTerm: Term): void => {
    // Save current events for the current term
    if (currentTerm) {
      setScheduleEventsByTerm((prev) => ({
        ...prev,
        [currentTerm.termCode]: scheduleEvents,
      }));
    }

    // Switch to new term
    setCurrentTerm(newTerm);

    // Load events for new term (if any saved)
    const savedEvents = scheduleEventsByTerm[newTerm.termCode] || [];
    setScheduleEvents(savedEvents);

    // Exit edit mode when switching terms
    setIsEditMode(false);
  };

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

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <SimpleHeader />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            gap: 2,
          }}
        >
          <CircularProgress size={24} />
          <Typography>Loading terms...</Typography>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <SimpleHeader />
        <Box sx={{ padding: '16px' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please make sure the Express API server is running on port 3001.
            <br />
            Run: <code>npm run dev:full</code> to start both servers.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SimpleHeader />
      <SchedulerTitle
        onEditClick={handleEditToggle}
        isEditMode={isEditMode}
        currentTerm={currentTerm}
        availableTerms={availableTerms}
        onTermChange={handleTermChange}
      />

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
            gap: '32px',
            alignItems: 'flex-start',
            padding: '0 32px',
            width: '100%',
          }}
        >
          {/* Scheduler Section */}
          <Box
            sx={{
              flex: '1 1 65%',
              minWidth: 0,
            }}
          >
            <SchedulerTable events={scheduleEvents} />
          </Box>

          {/* Search Panel Section */}
          <Box
            ref={searchPanelRef}
            sx={{
              flex: '1 1 35%',
              minWidth: '300px',
              maxWidth: '450px',
            }}
          >
            <EditSchedulerPanel
              onAddEvent={addEvent}
              onUpdateEventColor={updateEventColorsByClassId}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ padding: '0 32px' }}>
          <SchedulerTable events={scheduleEvents} />
        </Box>
      )}
    </Box>
  );
}

export default MainScheduler;
