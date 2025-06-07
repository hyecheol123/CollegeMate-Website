/**
 * Base Popup Box
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PopupContentWrapper, StyledPopupPaper } from './PopupStyles';

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
  width = '80%',
  maxWidth = '500px',
}: PopupBoxProps): React.ReactElement {
  return (
    <StyledPopupPaper elevation={4} width={width} maxWidth={maxWidth}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={onClose} size="small" sx={{ p: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <PopupContentWrapper>{children}</PopupContentWrapper>
    </StyledPopupPaper>
  );
}

export default PopupBox;
