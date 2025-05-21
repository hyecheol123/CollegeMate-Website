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
 * @param {number | string} [props.width] - Width of the popup (default: 640px)
 * @param {number | string} [props.maxWidth] - Maximum width of the popup (default: 95%)
 * @returns {React.ReactElement} Rendered popup component
 */
function PopupBox({
  onClose,
  children,
  width = '620px',
  maxWidth = '95%',
}: PopupBoxProps): React.ReactElement {
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width,
        maxWidth,
        borderRadius: 2,
        p: 2,
        pb: 3,
        zIndex: 1300,
        backgroundColor: 'background.paper',
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        //alignItems="center" //'PopupHeader' is not always centered.
        width="100%"
        gap={2}
      >
        {children}
      </Box>
    </Paper>
  );
}

export default PopupBox;
