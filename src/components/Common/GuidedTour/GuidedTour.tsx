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
    title: 'Edit Your Schedule',
    content: 'Click here to add or remove classes from your schedule.',
    position: 'bottom',
  },
  {
    target: 'download-button',
    title: 'Save as Image',
    content: 'Download your schedule as a wallpaper for your phone!',
    position: 'bottom',
  },
  {
    target: 'scheduler-table',
    title: 'Your Classes',
    content:
      'Your schedule will appear here. Colors help you identify different courses.',
    position: 'top',
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
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tooltipStyle = {
  backgroundColor: 'white.main',
  borderRadius: '8px',
  padding: '20px',
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

  const handleNext = (): void => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const highlightTarget = (): object => {
    if (!targetElement) return {};

    const rect = targetElement.getBoundingClientRect();
    return {
      position: 'fixed' as const,
      top: `${rect.top - 4}px`,
      left: `${rect.left - 4}px`,
      width: `${rect.width + 8}px`,
      height: `${rect.height + 8}px`,
      border: '3px solid #B20000',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      zIndex: 10000,
      pointerEvents: 'none' as const,
      animation: 'pulse 2s infinite',
    };
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
        `}
      </style>

      <Box sx={overlayStyle}>
        {/* Highlight target element */}
        {targetElement && <Box sx={highlightTarget()} />}

        {/* Tooltip */}
        <Paper
          sx={{
            ...tooltipStyle,
          }}
        >
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

          <Typography
            variant="body2"
            sx={{
              color: 'darkGrey.main',
              marginBottom: '16px',
              lineHeight: 1.4,
            }}
          >
            {step.content}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'lightGrey.main',
                fontSize: '12px',
              }}
            >
              {currentStep + 1} of {tourSteps.length}
            </Typography>

            <Box sx={{ display: 'flex', gap: '8px' }}>
              {currentStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  sx={{
                    color: 'darkGrey.main',
                    fontSize: '14px',
                    minWidth: 'auto',
                    padding: '4px 8px',
                  }}
                >
                  Back
                </Button>
              )}

              <Button
                onClick={onSkip}
                sx={{
                  color: 'darkGrey.main',
                  fontSize: '14px',
                  minWidth: 'auto',
                  padding: '4px 8px',
                }}
              >
                Skip
              </Button>

              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  backgroundColor: 'red.main',
                  color: 'white.main',
                  fontSize: '14px',
                  minWidth: 'auto',
                  padding: '6px 16px',
                  '&:hover': {
                    backgroundColor: '#990000',
                  },
                }}
              >
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Got it!'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default GuidedTour;
