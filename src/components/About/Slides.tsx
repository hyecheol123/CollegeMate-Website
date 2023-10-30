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
import NavBar from './Slides/NavBar';
// Global Style

/**
 * Interface for SlideProps
 */
interface ISlideProps {
  components: (React.ReactElement | React.ReactElement[])[];
}

/**
 * React Functional Component for full-page scroll wrapper
 * @param {ISlideProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders full-page scroll wrapper
 */
function Slides(props: ISlideProps): React.ReactElement {
  const { components } = props;

  // States
  const [verticalIdx, setVerticalIdx] = React.useState<number>(0);
  const [horizontalIdx, setHorizontalIdx] = React.useState<number[]>([]);

  // variable that is not a state (cleared after every re-render)
  // For scroll detection
  let scrollTimeout: number | undefined;
  let acceptScroll = true;
  let deltaY = 0;
  let deltaX = 0;
  // Specific to touch screen
  let prevX = -1;
  let prevY = -1;

  // function to detect whether the child slide is horizontal scrollable or not
  const isHorizontal = React.useCallback(
    (slide: React.ReactElement | React.ReactElement[]): boolean => {
      return (slide as any)?.length !== undefined ? true : false;
    },
    [],
  );

  // function to modify horizontalIdx
  const horizontalIdxSetter = React.useCallback(
    (verticalIdx: number, newHorizontalIdx: number): void => {
      horizontalIdx[verticalIdx] = newHorizontalIdx;
      setHorizontalIdx([...horizontalIdx]);
    },
    [horizontalIdx],
  );

  // Initialize horitonalIdx
  React.useEffect(() => {
    setHorizontalIdx(components.map((slide) => (isHorizontal(slide) ? 0 : -1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Event Handler for scroll detection
  const scrollResetScroll = (): void => {
    scrollTimeout = undefined;
    acceptScroll = true;
    deltaY = 0;
    deltaX = 0;
    prevY = -1;
    prevX = -1;
  };
  const scrollTimeoutEvent = (): void => {
    if (Math.abs(deltaY) >= Math.abs(deltaX)) {
      // Vertical scroll detected
      if (deltaY > 50 && verticalIdx < components.length - 1) {
        setVerticalIdx(verticalIdx + 1);
      } else if (deltaY < -50 && verticalIdx > 0) {
        setVerticalIdx(verticalIdx - 1);
      }
    } else {
      // Horizontal scroll detected
      if (horizontalIdx[verticalIdx] !== -1) {
        if (
          deltaX > 50 &&
          horizontalIdx[verticalIdx] <
            (components[verticalIdx] as React.ReactElement[]).length - 1
        ) {
          horizontalIdx[verticalIdx] += 1;
          setHorizontalIdx([...horizontalIdx]);
        } else if (deltaX < -50 && horizontalIdx[verticalIdx] > 0) {
          horizontalIdx[verticalIdx] -= 1;
          setHorizontalIdx([...horizontalIdx]);
        }
      }
    }

    window.setTimeout(scrollResetScroll, 500);
  };
  const scrollEventHandler = (
    e: React.SyntheticEvent<HTMLDivElement>,
  ): void => {
    if (acceptScroll) {
      // Setup timer to detect end of wheel activity
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = window.setTimeout(scrollTimeoutEvent, 300);

      // Calculate delta
      if (e.type === 'wheel') {
        deltaY += (e as unknown as React.WheelEvent).deltaY;
        deltaX += (e as unknown as React.WheelEvent).deltaX;
      } else {
        const y = (e as unknown as React.TouchEvent).targetTouches[0].clientY;
        const x = (e as unknown as React.TouchEvent).targetTouches[0].clientX;

        // Not the first touch event - calculate delta
        if (prevY !== -1 || prevX !== -1) {
          deltaY += prevY - y;
          deltaX += prevX - x;
        }

        // Store current client coordinate as previous coordinate
        prevY = y;
        prevX = x;
      }
    }
  };

  return (
    <Box onWheel={scrollEventHandler} onTouchMove={scrollEventHandler}>
      <NavBar
        orientation="vertical"
        length={components.length}
        currIdx={verticalIdx}
        clickHandler={setVerticalIdx}
      />
      {isHorizontal(components[verticalIdx]) ? (
        <NavBar
          orientation="horizontal"
          length={(components[verticalIdx] as React.ReactElement[]).length}
          currIdx={horizontalIdx[verticalIdx]}
          clickHandler={(newHorizontalIdx: number): void =>
            horizontalIdxSetter(verticalIdx, newHorizontalIdx)
          }
        />
      ) : undefined}
      {isHorizontal(components[verticalIdx])
        ? (components[verticalIdx] as React.ReactElement[])[
            horizontalIdx[verticalIdx]
          ]
        : components[verticalIdx]}
    </Box>
  );
}

export default Slides;
