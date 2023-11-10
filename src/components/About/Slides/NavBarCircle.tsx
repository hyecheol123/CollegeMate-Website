/**
 * NavBarCircle component to display circles for NavBar and
 *   to support quick navigationfor Slide component
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
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

  const style = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: isCurrent ? '#B20000' : '#DEE3E5',
    cursor: 'pointer',
    margin: '10px', // TODO: Adjust margin to control space between circles
  };

  return (
    <div style={style} onClick={clickHandler} aria-label={`Navigate to slide ${thisIdx + 1}`}>
    </div>
  );
}

export default NavBarCircle;
