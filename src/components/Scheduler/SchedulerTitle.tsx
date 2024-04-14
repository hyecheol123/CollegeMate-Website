/**
 * Component for the Title and Icons above the Scheduler Table
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, IconButton, Typography } from '@mui/material';
// Material UI Icon
import Download from '@mui/icons-material/FileDownloadOutlined';
import Share from '@mui/icons-material/IosShareOutlined';
import Edit from '@mui/icons-material/EditOutlined';
// Assets

const titleStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: '0.7em',
  px: '0.5em',
};

const IconStyle = {
  left: '15%',
  transform: 'translateX(-90%)',
};

/**
 * React Functional Component for the Title and Icons
 * Above the Scheudler Table
 * @return {React.ReactElement} Renders first page of about page
 */
function SchedulerTitle(): React.ReactElement {
  return (
    <Box sx={titleStyle}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Typography variant="h2" sx={{ color: 'red.main' }}>
          {' '}
          Spring 2023
        </Typography>
        <IconButton sx={{ color: 'darkGrey.main' }}>
          <Download></Download>
        </IconButton>
        <IconButton sx={{ color: 'darkGrey.main', ...IconStyle }}>
          <Share></Share>
        </IconButton>
        <IconButton sx={{ color: 'darkGrey.main' }}>
          <Edit></Edit>
        </IconButton>
      </Box>
    </Box>
  );
}

export default SchedulerTitle;
