/**
 * Slides component to support full-page scroll in about page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Material UI Icons
// Components
// Global Style

/**
 * Interface for SlideProps
 */
interface SlideProps {
  components: (React.ReactElement | React.ReactElement[])[];
}

/**
 * React Functional Component for full-page scroll wrapper
 * @param {SlideProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders full-page scroll wrapper
 */
function Slides(props: SlideProps): React.ReactElement {
  const { components } = props;

  // States
  const [verticalIdx, setVerticalIdx] = React.useState(0);

  // variable that is not a state (cleared after every re-render)
  // For mouse wheel / trackpad gesture detection
  let wheelTimeout: number | undefined;
  let acceptScroll = true;
  let deltaY = 0;
  let deltaX = 0;

  // Event Handler for mouse wheel / trackpad gesture detection
  const wheelResetScroll = (): void => {
    deltaY = 0;
    deltaX = 0;
    acceptScroll = true;
  };
  const wheelTimeoutEvent = (): void => {
    if (Math.abs(deltaY) >= Math.abs(deltaX)) {
      // Vertical scroll detected
      if (deltaY > 50 && verticalIdx < components.length - 1) {
        setVerticalIdx(verticalIdx + 1);
      } else if (deltaY < -50 && verticalIdx > 0) {
        setVerticalIdx(verticalIdx - 1);
      }
    } else {
      // Horizontal scroll detected
      // TODO
    }

    window.setTimeout(wheelResetScroll, 500);
  };
  const wheelEventHandler = (event: React.WheelEvent<HTMLDivElement>): void => {
    // Prevent detault action
    event.stopPropagation();

    if (acceptScroll) {
      // Setup timer to detect end of wheel activity
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }
      wheelTimeout = window.setTimeout(wheelTimeoutEvent, 300);

      // Calculate delta
      deltaY += event.deltaY;
      deltaX += event.deltaX;
    }
  };

  // Event Handler for touch gesture detection
  // TODO

  return (
    <Box onWheel={wheelEventHandler}>
      {(components[verticalIdx] as any)?.length === undefined
        ? components[verticalIdx]
        : (components[verticalIdx] as React.ReactElement[])[0]}
    </Box>
  );
}

export default Slides;
