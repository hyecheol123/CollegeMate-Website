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

  // TODO: Create each circle here
  return <></>;
}

export default NavBarCircle;
