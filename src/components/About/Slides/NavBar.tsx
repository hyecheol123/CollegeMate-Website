/**
 * NavBar component to visualize current location and
 *   to support quick navigationfor Slide component
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

  // TODO: use clickHandler to properly handle icon click.
  // TODO: Use orientation, length, and currIdx prop to properly display the icons
  // TODO: Use NavBarCircle to display icons
  return (
    <Box>
      <NavBarCircle
        isCurrent={false}
        thisIdx={-1}
        clickHandler={(): void => clickHandler(-1)}
      />
    </Box>
  );
}

export default NavBar;
