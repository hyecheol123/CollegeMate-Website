/**
 * Base Popup Box
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box, Button } from '@mui/material';

interface PopupButton {
  label?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: () => void;
}

interface PopupButtonProps {
  buttons: PopupButton[];
}

/**
 * PopupFooter - A flexible footer that supports rendering any number of action buttons.
 * @param {object} props - Component props
 * @param {PopupButtonProps[]} props.buttons - Array of button configs to be rendered
 * @returns {React.ReactElement} Footer with dynamically rendered buttons
 */
export default function PopupButton({
  buttons,
}: PopupButtonProps): React.ReactElement {
  //Define pop-up button default values
  const defaultButton: Required<PopupButton> = {
    label: 'Button',
    borderColor: 'grey.main',
    backgroundColor: 'white.main',
    variant: 'outlined',
    textColor: 'darkGrey.main',
    onClick: () => {},
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      mt={1}
      width="100%"
    >
      {buttons.map(({ ...rest }, idx) => {
        const merged = { ...defaultButton, ...rest };
        return (
          <Button
            key={idx}
            variant={merged.variant}
            onClick={merged.onClick}
            fullWidth
            sx={{
              height: 40,
              maxWidth: 420,
              color: merged.textColor,
              borderColor: merged.borderColor,
              backgroundColor: merged.backgroundColor,
            }}
          >
            {merged.label}
          </Button>
        );
      })}
    </Box>
  );
}
