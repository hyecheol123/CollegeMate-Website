/**
 * Globally used style for footer button in UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const buttonWrapperBoxStyle = {
  width: '100%',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
};

interface FooterButtonProps {
  onClick: () => void; // Function to be called when the button is clicked
  disabled: boolean; // disabled state
  remainingTimeSec?: number;
}

// Function to format time
const formatTime = (seconds: number): string => {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
};

/**
 * FooterButton is a React component that renders a styled button.
 * @param {FooterButtonProps} props - The props for the FooterButton component.
 * @return {React.ReactElement} A React Element representing the FooterButton.
 */
function FooterButton(props: FooterButtonProps): React.ReactElement {
  return (
    <Box sx={buttonWrapperBoxStyle}>
      {props.remainingTimeSec !== undefined && (
        <Typography textAlign={'center'} color={'gray'} variant="body1">
          {formatTime(props.remainingTimeSec)}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ width: '100%', maxWidth: '400px' }}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        Next
      </Button>
    </Box>
  );
}

export default FooterButton;