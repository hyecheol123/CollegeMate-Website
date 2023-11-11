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

  // Function to generate the list of navigation circles
  const generateNavBarCircles = (): React.ReactNode[] => {
    const circles: React.ReactNode[] = [];
    for (let i = 0; i < length; i++) {
      circles.push(
        <NavBarCircle
          key={i}
          isCurrent={currIdx === i}
          thisIdx={i}
          clickHandler={() => clickHandler(i)}
        />,
      );
    }
    return circles;
  };

  // Style for the vertical navigation bar
  const verticalBoxStyle = {
    position: 'fixed',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: 1000,
  };

  // Style for the horizontal navigation bar
  const horizontalBoxStyle = {
    position: 'fixed',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: 1000,
  };

  // Conditional rendering based on the orientation prop
  return (
    <Box
      sx={orientation === 'vertical' ? verticalBoxStyle : horizontalBoxStyle}
    >
      {generateNavBarCircles()}
    </Box>
  );
}

export default NavBar;
