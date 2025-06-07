/**
 * Base Popup Box
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PopupBoxProps {
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  maxWidth?: number | string;
}

/**
 * PopupBox - A reusable popup component that appears above the current screen.
 * @param {object} props - Component props
 * @param {() => void} props.onClose - Function to handle popup close
 * @param {React.ReactNode} props.children - Content to be displayed inside the popup
 * @param {number | string} [props.width] - Width of the popup
 * @param {number} [props.maxWidth] - Maximum width of the popup (default: 500px)
 * @returns {React.ReactElement} Rendered popup component
 */
function PopupBox({
  onClose,
  children,
  width,
  maxWidth = '500px',
}: PopupBoxProps): React.ReactElement {
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width ?? {
          xs: '80%',
          md: '100%',
        },
        maxWidth,
        borderRadius: '4px',
        p: 2,
        zIndex: 1300,
        backgroundColor: 'background.paper',
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={onClose} size="small" sx={{ p: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        sx={{ p: 1 }} // Give difference padding between close button and children
        gap={{
          xs: 1,
          sm: 2,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

export default PopupBox;
