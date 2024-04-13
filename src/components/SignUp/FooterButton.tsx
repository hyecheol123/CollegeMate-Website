/**
 * Globally used style for footer button in UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import Button from '@mui/material/Button';
import ButtonStyle from './Styles/Button';

interface FooterButtonProps {
  onClick: () => void; // Function to be called when the button is clicked
  disabled: boolean; // disabled state
}

/**
 * FooterButton is a React component that renders a styled button.
 * @param {FooterButtonProps} props - The props for the FooterButton component.
 * @return {React.ReactElement} A React Element representing the FooterButton.
 */
function FooterButton(props: FooterButtonProps): React.ReactElement {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={ButtonStyle}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      Next
    </Button>
  );
}

export default FooterButton;
