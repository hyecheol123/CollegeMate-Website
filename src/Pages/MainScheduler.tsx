/**
 * Main Scheduler page with edit functionality
 * Supports both mobile and desktop layouts with responsive design
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useRef, useEffect } from 'react';
// Material UI
import {
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
// Icons
import Download from '@mui/icons-material/FileDownloadOutlined';
import Share from '@mui/icons-material/IosShareOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import Save from '@mui/icons-material/SaveOutlined';
// Component
import SchedulerTable from '../components/MainScheduler/SchedulerTable';
import TermSelector from '../components/MainScheduler/TermSelector';
import SimpleHeader from '../components/Mvp/SimpleHeader/SimpleHeader';
import EditSchedulerPanel from '../components/MainScheduler/EditSchedulerPanel';
// Types
import type { EventData } from '../types/event';
import type { TermData } from '../types/term';
// API
import { fetchTerms } from '../api/termsApi';
// Utils
import { getCurrentTerm, getSelectableTerms } from '../utils/termUtils';

/**
 * MainScheduler component with responsive layout
 * - Desktop: Side-by-side scheduler and edit panel (55%/45% split)
 * - Mobile: Stacked layout with scheduler maintaining consistent size
 * @return {React.ReactElement} The rendered MainScheduler page
 */
function MainScheduler(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [scheduleEvents, setScheduleEvents] = useState<EventData[]>([]);
  const [terms, setTerms] = useState<TermData[]>([]);
  const [selectedTermCode, setSelectedTermCode] = useState<string>('');
  const [currentTermCode, setCurrentTermCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchPanelRef = useRef<HTMLDivElement>(null);

  const handleEditToggle = (): void => {
    setIsEditMode((prev) => !prev);
  };

  const handleTermChange = (termCode: string): void => {
    setSelectedTermCode(termCode);
    // Clear events when switching terms to show empty scheduler
    setScheduleEvents([]);
  };

  // Fetch terms on component mount
  useEffect(() => {
    const loadTerms = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetchTerms();
        const selectableTerms = getSelectableTerms(response.terms);
        setTerms(selectableTerms);

        // Set current term
        const current = getCurrentTerm(response.terms);
        if (current) {
          setCurrentTermCode(current.termCode);
          setSelectedTermCode(current.termCode);
        } else if (selectableTerms.length > 0) {
          // Fallback to first available term
          setSelectedTermCode(selectableTerms[0].termCode);
        }
      } catch (err) {
        setError('Failed to load terms. Please try again later.');
        console.error('Error loading terms:', err);
      } finally {
        setIsLoading(false);
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

  // Determine the icon size based on the window width
  const iconSize = window.innerWidth < 300 ? 'small' : 'medium';

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <SimpleHeader />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <CircularProgress color="inherit" sx={{ color: 'red.main' }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <SimpleHeader />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SimpleHeader />

      {/* Title and Actions Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: '1em',
          px: { xs: '16px', md: '32px' },
          width: '100%',
          margin: 0,
        }}
      >
        <TermSelector
          terms={terms}
          selectedTermCode={selectedTermCode}
          onTermChange={handleTermChange}
          currentTermCode={currentTermCode}
        />

        <Box sx={{ marginRight: 0 }}>
          <Tooltip title="Download">
            <IconButton
              disabled={isEditMode}
              sx={{
                color: isEditMode ? 'rgba(0,0,0,0.26)' : 'darkGrey.main',
                fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
              }}
            >
              <Download fontSize={iconSize} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton
              disabled={isEditMode}
              sx={{
                color: isEditMode ? 'rgba(0,0,0,0.26)' : 'darkGrey.main',
                fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
              }}
            >
              <Share fontSize={iconSize} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isEditMode ? 'Save Changes' : 'Edit Schedule'}>
            <IconButton
              onClick={handleEditToggle}
              sx={{
                color: isEditMode ? 'red.main' : 'darkGrey.main',
                fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
                backgroundColor: isEditMode
                  ? 'rgba(178, 0, 0, 0.1)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: isEditMode
                    ? 'rgba(178, 0, 0, 0.2)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {isEditMode ? (
                <Save fontSize={iconSize} />
              ) : (
                <Edit fontSize={iconSize} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

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
