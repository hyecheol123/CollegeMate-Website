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
// Custom Hook to Load AboutContext
import { useAboutContext } from './AboutContext';
// Global Style

/**
 * Interface for SlideProps
 */
interface ISlideProps {
  components: (React.ReactElement | React.ReactElement[])[];
}

/**
 * Interface for Index State
 */
interface IIdxState {
  currVIdx: number;
  pastVIdx: number;
  currHIdx: number[];
  pastHIdx: number[];
  isSwitching: boolean;
}

/**
 * React Functional Component for full-page scroll wrapper
 * @param {ISlideProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders full-page scroll wrapper
 */
function Slides(props: ISlideProps): React.ReactElement {
  const { components } = props;
  const transitionSpeed = 150;

  // States
  const [idxState, setIdxState] = React.useState<IIdxState>({
    currVIdx: 0,
    pastVIdx: 0,
    currHIdx: [],
    pastHIdx: [],
    isSwitching: false,
  });
  const aboutContext = useAboutContext();

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

  React.useEffect(() => {
    idxState.currHIdx = components.map((slide) =>
      isHorizontal(slide) ? 0 : -1,
    );
    idxState.pastHIdx = components.map((slide) =>
      isHorizontal(slide) ? 0 : -1,
    );
    setIdxState({ ...idxState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function to modify index
  const vIdxSetter = React.useCallback(
    (newIdx: number): void => {
      idxState.pastHIdx = [...idxState.currHIdx];
      idxState.pastVIdx = idxState.currVIdx;
      idxState.isSwitching = true;
      setIdxState({ ...idxState });

      window.setTimeout(() => {
        idxState.isSwitching = false;
        idxState.currVIdx = newIdx;
        setIdxState({ ...idxState });
      }, transitionSpeed);
    },
    [idxState],
  );
  const hIdxSetter = React.useCallback(
    (newIdx: number): void => {
      idxState.pastVIdx = idxState.currVIdx;
      idxState.pastHIdx = [...idxState.pastHIdx];
      idxState.pastHIdx[idxState.currVIdx] =
        idxState.currHIdx[idxState.currVIdx];
      idxState.isSwitching = true;
      setIdxState({ ...idxState });

      window.setTimeout(() => {
        idxState.isSwitching = false;
        idxState.currHIdx = [...idxState.currHIdx];
        idxState.currHIdx[idxState.currVIdx] = newIdx;
        setIdxState({ ...idxState });
      }, transitionSpeed);
    },
    [idxState],
  );

  // Event Handler for scroll detection
  const scrollReset = (): void => {
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
      if (deltaY > 50 && idxState.currVIdx < components.length - 1) {
        vIdxSetter(idxState.currVIdx + 1);
      } else if (deltaY < -50 && idxState.currVIdx > 0) {
        vIdxSetter(idxState.currVIdx - 1);
      }
    } else {
      // Horizontal scroll detected
      if (idxState.currHIdx[idxState.currVIdx] !== -1) {
        if (
          deltaX > 50 &&
          idxState.currHIdx[idxState.currVIdx] <
            (components[idxState.currVIdx] as React.ReactElement[]).length - 1
        ) {
          hIdxSetter(idxState.currHIdx[idxState.currVIdx] + 1);
        } else if (deltaX < -50 && idxState.currHIdx[idxState.currVIdx] > 0) {
          hIdxSetter(idxState.currHIdx[idxState.currVIdx] - 1);
        }
      }
    }

    window.setTimeout(scrollReset, 300);
  };
  const scrollEventHandler = (
    e: React.SyntheticEvent<HTMLDivElement>,
  ): void => {
    if (acceptScroll) {
      if (aboutContext.isFullpageScrollEnabled) {
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
    }
  };

  const slideStyle = {
    width: '100%',
    height: '100%',
    position: 'fixed',
  };

  return (
    <Box
      sx={{ overscrollBehavior: 'none' }}
      onWheel={scrollEventHandler}
      onTouchMove={scrollEventHandler}
    >
      <NavBar
        orientation="vertical"
        length={components.length}
        currIdx={idxState.currVIdx}
        clickHandler={vIdxSetter}
      />
      {isHorizontal(components[idxState.currVIdx]) ? (
        <NavBar
          orientation="horizontal"
          length={
            (components[idxState.currVIdx] as React.ReactElement[]).length
          }
          currIdx={idxState.currHIdx[idxState.currVIdx]}
          clickHandler={hIdxSetter}
        />
      ) : undefined}
      <Box
        sx={{
          ...slideStyle,
          zIndex: 3,
          transition: `all ${transitionSpeed}ms linear 0ms`,
          opacity: idxState.isSwitching ? 1 : 0,
        }}
        visibility={idxState.isSwitching ? undefined : 'hidden'}
      >
        {isHorizontal(components[idxState.pastVIdx])
          ? (components[idxState.pastVIdx] as React.ReactElement[])[
              idxState.pastHIdx[idxState.pastVIdx]
            ]
          : components[idxState.pastVIdx]}
      </Box>
      <Box sx={{ ...slideStyle, zIndex: 2 }}>
        {isHorizontal(components[idxState.currVIdx])
          ? (components[idxState.currVIdx] as React.ReactElement[])[
              idxState.currHIdx[idxState.currVIdx]
            ]
          : components[idxState.currVIdx]}
      </Box>
    </Box>
  );
}

export default Slides;
