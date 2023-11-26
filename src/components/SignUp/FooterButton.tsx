/**
 * Globally used style for footer button in UI
 * @author Daekyun Kim <daekyun97@gmail.com>
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
 * @param {object} props - The props for the FooterButton component.
 * @param {Function} props.onClick - Function to be called when the button is clicked.
 * @param {boolean} props.disabled - Indicates if the button should be disabled.
 * @return {React.ReactElement} A React Element representing the FooterButton.
 */
function FooterButton({
  onClick,
  disabled = false,
}: FooterButtonProps): React.ReactElement {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={ButtonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      Next
    </Button>
  );
}

export default FooterButton;
