/**
 * Popup Header
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

interface PopupHeaderProps {
  title?: string;
  align?: 'center' | 'start';
}

/**
 * Popup Header - Title to be displayed at the top of the popup
 * @param {object} props - Component props
 * @param {string} props.title - Title text
 * @param {string} props.align - Title align
 * @returns {React.ReactElement} Rendered popup component
 */
export default function PopupHeader({
  title = 'Popup Title',
  align = 'center',
}: PopupHeaderProps): React.ReactElement {
  return (
    <Box my={1} display="flex" justifyContent={align}>
      <Typography textAlign="center" variant="body1">
        {title}
      </Typography>
    </Box>
  );
}
