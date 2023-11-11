/**
 * NavBar component to visualize current location and
 *   to support quick navigation for Slide component
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Material UI Icons
// Components
import NavBarCircle from './NavBarCircle';
// Global Style

/**
 * Interface for NavBarProps
 */
interface INavBarProps {
  orientation: 'vertical' | 'horizontal';
  length: number;
  currIdx: number;
  clickHandler: (navIdx: number) => void;
}

/**
 * React Functional Component for Slide's NavBar
 * @param {INavBarProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders NavBar for scroll
 */
function NavBar(props: INavBarProps): React.ReactElement {
  const { orientation, length, currIdx, clickHandler } = props;

  const style = React.useMemo(() => {
    return {
      position: 'fixed',
      top: orientation === 'vertical' ? '50%' : undefined,
      right: orientation === 'vertical' ? '0' : undefined,
      bottom: orientation === 'vertical' ? undefined : '10px',
      left: orientation === 'vertical' ? undefined : '50%',
      marginRight: orientation === 'vertical' ? '10px' : undefined,
      marginBottom: orientation === 'vertical' ? undefined : '10px',
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transform:
        orientation === 'vertical' ? 'translateY(-50%)' : 'translateX(-50%)',
      zIndex: 1000,
    };
  }, [orientation]);

  // Conditional rendering based on the orientation prop
  return (
    <Box sx={style}>
      {Array.from(Array(length)).map((_value, idx) => (
        <NavBarCircle
          key={idx}
          isCurrent={currIdx === idx}
          thisIdx={idx}
          clickHandler={(): void => clickHandler(idx)}
        />
      ))}
    </Box>
  );
}

export default React.memo(NavBar);
