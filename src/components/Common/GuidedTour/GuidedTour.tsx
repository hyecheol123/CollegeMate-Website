/**
 * Guided Tour Component for first-time users
 * Shows helpful tips about main features
 * @author Claude Code Assistant
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface TourStep {
  target: string; // CSS selector or ref name
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: 'edit-button',
    title: '',
    content: 'Search classes. Add or remove them as needed!',
    position: 'bottom',
  },
  {
    target: 'scheduler-table',
    title: '',
    content:
      'Customize your schedule with different colors and quickly check your schedule on the go!',
    position: 'top',
  },
  {
    target: 'download-button',
    title: '',
    content: 'Download your schedule that perfectly fits your phone screen!',
    position: 'bottom',
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tooltipStyle = {
  backgroundColor: 'white.main',
  borderRadius: '4px',
  padding: '20px',
  width: '300px',
  minWidth: '300px',
  maxWidth: '300px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

/**
 * GuidedTour component that shows step-by-step introduction
 * @param {GuidedTourProps} props - Props including tour state
 * @returns {React.ReactElement} The guided tour overlay
 */
function GuidedTour({
  isOpen,
  onComplete,
  onSkip,
}: GuidedTourProps): React.ReactElement | null {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (isOpen && currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      let element: HTMLElement | null = null;

      // Find target element using specific IDs
      if (step.target === 'edit-button') {
        // Find the edit/save button in scheduler actions
        const actionsBox = document.getElementById('scheduler-actions');
        if (actionsBox) {
          element = actionsBox.querySelector(
            'button:last-child',
          ) as HTMLElement; // Edit button is usually last
        }
      } else if (step.target === 'download-button') {
        // Find the download button in scheduler actions
        const actionsBox = document.getElementById('scheduler-actions');
        if (actionsBox) {
          element = actionsBox.querySelector(
            'button:first-child',
          ) as HTMLElement; // Download button is usually first
        }
      } else if (step.target === 'scheduler-table') {
        // Find the main schedule grid
        element = document.getElementById('scheduler-grid');
      }

      setTargetElement(element);
    }
  }, [isOpen, currentStep]);

  // Simple scroll handler to update spotlight position
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (): void => {
      forceUpdate({});
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleNext = (): void => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }

    // Reset transition state after a brief delay
    setTimeout((): void => setIsTransitioning(false), 100);
  };

  const handlePrevious = (): void => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }

    // Reset transition state after a brief delay
    setTimeout((): void => setIsTransitioning(false), 100);
  };

  const getSpotlightOverlays = (): Array<Record<string, unknown>> => {
    if (!targetElement) return [];

    const rect = targetElement.getBoundingClientRect();

    // Check if this is the scheduler table step (step 1, index 1)
    if (currentStep === 1) {
      // Rectangular spotlight for scheduler table with slight padding to account for rounded corners
      const padding = 1; // Small padding to slightly cover rounded corners naturally

      return [
        // Top overlay
        {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          height: `${Math.max(0, rect.top - padding)}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          pointerEvents: 'none' as const,
        },
        // Bottom overlay
        {
          position: 'fixed' as const,
          bottom: 0,
          left: 0,
          right: 0,
          height: `${Math.max(0, window.innerHeight - (rect.bottom + padding))}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          pointerEvents: 'none' as const,
        },
        // Left overlay
        {
          position: 'fixed' as const,
          top: `${Math.max(0, rect.top - padding)}px`,
          left: 0,
          width: `${Math.max(0, rect.left - padding)}px`,
          height: `${rect.height + padding * 2}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          pointerEvents: 'none' as const,
        },
        // Right overlay
        {
          position: 'fixed' as const,
          top: `${Math.max(0, rect.top - padding)}px`,
          right: 0,
          width: `${Math.max(0, window.innerWidth - (rect.right + padding))}px`,
          height: `${rect.height + padding * 2}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          pointerEvents: 'none' as const,
        },
      ];
    } else {
      // Circular spotlight for buttons (edit, download)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, rect.height) / 2 - 2; // Negative padding for much tighter fit

      return [
        {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, transparent ${radius}px, rgba(0, 0, 0, 0.7) ${radius + 1}px)`,
          zIndex: 9998,
          pointerEvents: 'none' as const,
        },
      ];
    }
  };

  if (!isOpen || currentStep >= tourSteps.length) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(178, 0, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(178, 0, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(178, 0, 0, 0); }
          }
          
          .spotlight-overlay {
            transition: opacity 0.15s ease-in-out;
          }
          
          .spotlight-overlay.transitioning {
            opacity: 0;
          }
        `}
      </style>

      <Box sx={overlayStyle}>
        {/* Spotlight overlays - darkens everything except target */}
        {targetElement &&
          getSpotlightOverlays().map((overlayStyle, index) => (
            <Box
              key={`${currentStep}-${index}`}
              className={`spotlight-overlay ${isTransitioning ? 'transitioning' : ''}`}
              sx={overlayStyle}
            />
          ))}

        {/* Tooltip */}
        <Paper
          sx={{
            ...tooltipStyle,
            position: 'relative',
            zIndex: 10000, // Ensure modal is above spotlight overlay
          }}
        >
          {/* Close button with X icon */}
          <Box
            onClick={onSkip}
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '50%',
              },
            }}
          >
            <svg
              width="11.87"
              height="11.87"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.4585 1.84735C12.7579 1.54795 12.7579 1.06252 12.4585 0.763124C12.1591 0.463724 11.6737 0.463724 11.3743 0.763124L6.74974 5.38768L2.1252 0.763124C1.82578 0.463724 1.34036 0.463724 1.04096 0.763124C0.741556 1.06252 0.741556 1.54795 1.04096 1.84735L5.66552 6.47191L1.04096 11.0965C0.741556 11.3959 0.741556 11.8813 1.04096 12.1807C1.34036 12.4801 1.82578 12.4801 2.1252 12.1807L6.74974 7.55614L11.3743 12.1807C11.6737 12.4801 12.1591 12.4801 12.4585 12.1807C12.7579 11.8813 12.7579 11.3959 12.4585 11.0965L7.83397 6.47191L12.4585 1.84735Z"
                fill="#494949"
              />
            </svg>
          </Box>

          {/* Step indicator at top center */}
          <Typography
            variant="body3"
            sx={{
              color: '#C0C0C0',
              textAlign: 'center',
              width: '100%',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            {currentStep + 1} of {tourSteps.length}
          </Typography>

          {step.title && (
            <Typography
              variant="h3"
              sx={{
                color: 'red.main',
                fontWeight: 'bold',
                marginBottom: '8px',
                fontSize: '18px', // Override h3 size to be smaller like h6
              }}
            >
              {step.title}
            </Typography>
          )}

          <Typography
            variant="body1"
            sx={{
              color: 'darkGrey.main',
              marginBottom: '16px',
              lineHeight: 1.4,
              textAlign: 'center',
            }}
          >
            {step.content}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '8px',
              paddingRight: '8px',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              {currentStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  sx={{
                    color: 'darkGrey.main',
                    fontSize: '16px',
                    fontWeight: 500,
                    minWidth: 'auto',
                    padding: '6px 24px',
                    textTransform: 'none',
                  }}
                >
                  Back
                </Button>
              )}

              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  backgroundColor: 'red.main',
                  color: 'white.main',
                  fontSize: '16px',
                  fontWeight: 500,
                  minWidth: 'auto',
                  padding: '6px 32px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#990000',
                  },
                }}
              >
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Close'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default GuidedTour;
