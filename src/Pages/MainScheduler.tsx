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
import DownloadPopup from '../components/Schedule/Download';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

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
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const schedulerRef = useRef<HTMLDivElement>(null); // for schedule download
  const [selectedSize, setSelectedSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const handleDownload = async (): Promise<boolean> => {
    if (!schedulerRef.current) {
      return false;
    }

    const element = schedulerRef.current;

    try {
      // Basic options for image generation
      const options: Parameters<typeof toPng>[1] = {
        cacheBust: true,
        pixelRatio: 1,
        quality: 0.95,
      };

      if (selectedSize && selectedSize.width > 0 && selectedSize.height > 0) {
        // Calculate aspect ratio and determine mobile-friendly base size
        const aspectRatio = selectedSize.width / selectedSize.height;

        // Base mobile dimensions that will look good on screen
        let baseMobileWidth: number;
        let baseMobileHeight: number;

        if (aspectRatio > 1) {
          // Landscape orientation (wider than tall)
          baseMobileWidth = 600;
          baseMobileHeight = Math.round(600 / aspectRatio);
        } else {
          // Portrait orientation (taller than wide)
          baseMobileWidth = 400;
          baseMobileHeight = Math.round(400 / aspectRatio);
        }

        // Calculate the scale factor for final output
        const scaleFactorX = selectedSize.width / baseMobileWidth;
        const scaleFactorY = selectedSize.height / baseMobileHeight;
        const scaleFactor = Math.max(scaleFactorX, scaleFactorY);

        // Store original styles
        const originalStyles = {
          width: element.style.width,
          height: element.style.height,
          maxWidth: element.style.maxWidth,
          maxHeight: element.style.maxHeight,
          minWidth: element.style.minWidth,
          overflow: element.style.overflow,
        };

        // Store original window.innerWidth
        const originalInnerWidth = window.innerWidth;

        try {
          // Set container to mobile-friendly dimensions
          element.style.width = `${baseMobileWidth}px`;
          element.style.height = `${baseMobileHeight}px`;
          element.style.maxWidth = `${baseMobileWidth}px`;
          element.style.maxHeight = `${baseMobileHeight}px`;
          element.style.minWidth = `${baseMobileWidth}px`;
          element.style.overflow = 'hidden';

          // Mock window.innerWidth to mobile size for proper component behavior
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: baseMobileWidth,
          });

          // Trigger resize event for mobile layout
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);

          // Wait for layout to stabilize
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Capture with high pixel ratio for crisp output
          const dataUrl = await toPng(element, {
            cacheBust: true,
            pixelRatio: scaleFactor,
            quality: 0.95,
            width: baseMobileWidth,
            height: baseMobileHeight,
          });

          download(dataUrl, 'schedule.png');
          return true;
        } finally {
          // Restore original element styles
          element.style.width = originalStyles.width;
          element.style.height = originalStyles.height;
          element.style.maxWidth = originalStyles.maxWidth;
          element.style.maxHeight = originalStyles.maxHeight;
          element.style.minWidth = originalStyles.minWidth;
          element.style.overflow = originalStyles.overflow;

          // Restore original window.innerWidth
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
          });

          // Trigger resize to restore original layout
          const restoreEvent = new Event('resize');
          window.dispatchEvent(restoreEvent);

          // Brief wait for restoration
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      } else {
        // Regular image download without device-specific sizing
        const dataUrl = await toPng(element);
        download(dataUrl, 'schedule.png');
        return true;
      }
    } catch (err) {
      console.error('Download failed', err);
      return false;
    }
  };
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
      <SchedulerTitle
        onEditClick={handleEditToggle}
        isEditMode={isEditMode}
        onDownloadClick={() => setIsDownloadOpen(true)}
      />

      {/* Main Content Area */}
      {isMobile ? (
        <Box sx={{ padding: '0 16px' }}>
          {/* Mobile: Scheduler always same size */}
          <SchedulerTable events={scheduleEvents} ref={schedulerRef} />
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
            <SchedulerTable events={scheduleEvents} ref={schedulerRef} />
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
          <SchedulerTable events={scheduleEvents} ref={schedulerRef} />
        </Box>
      )}
      {isDownloadOpen && (
        <DownloadPopup
          onClose={() => setIsDownloadOpen(false)}
          onDownload={handleDownload}
          onSelectSize={(size) => setSelectedSize(size)}
        />
      )}
    </Box>
  );
}

export default MainScheduler;
