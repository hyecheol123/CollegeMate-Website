/**
 * NavBarCircle component to display circles for NavBar and
 *   to support quick navigationfor Slide component
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
 * Interface for NavBarProps
 */
interface INavBarCircleProps {
  isCurrent: boolean;
  thisIdx: number;
  clickHandler: () => void;
}

/**
 * React Functional Component for Slide's NavBarCircle
 * @param {INavBarCircleProps} props Properties that passed from the parent
 * @return {React.ReactElement} Renders NavBar for scroll
 */
function NavBarCircle(props: INavBarCircleProps): React.ReactElement {
  const { isCurrent, thisIdx, clickHandler } = props;

  const style = React.useMemo(() => {
    return {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: isCurrent ? 'red.main' : 'grey.dark',
      cursor: 'pointer',
    };
  }, [isCurrent]);

  return (
    <Box
      sx={style}
      onClick={clickHandler}
      role={'button'}
      aria-label={`Navigate to slide ${thisIdx + 1}`}
    />
  );
}

export default React.memo(NavBarCircle);
