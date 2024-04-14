/**
 * Renders the title for the Scheduler, including responsive icons for download, share, and edit.
 * Dynamically adjust icons's size based on the window width
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import Download from '@mui/icons-material/FileDownloadOutlined';
import Share from '@mui/icons-material/IosShareOutlined';
import Edit from '@mui/icons-material/EditOutlined';

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: '1em',
  px: '1em',
  width: '90%',
  margin: 'auto',
};

const titleStyle = {
  color: 'red.main',
  marginLeft: '-0.5em',
};

const iconBoxStyle = {
  marginRight: '-1.3em',
};

/**
 * Renders the title for the Scheduler, including responsive icons for download, share, and edit.
 * Dynamically adjusts icon sizes based on the window width.
 * @return {React.ReactElement} A React component representing the scheduler title and icons.
 */
function SchedulerTitle(): React.ReactElement {
  // State to hold the current window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Effect to update the window width state on resize
  useEffect(() => {
    const handleResize = (): void => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine the icon size based on the window width
  const iconSize = windowWidth < 300 ? 'small' : 'medium';

  return (
    <Box sx={containerStyle}>
      <Typography variant="h2" sx={titleStyle}>
        Spring 2023
      </Typography>
      <Box sx={iconBoxStyle}>
        <Tooltip title="Download">
          <IconButton
            sx={{
              color: 'darkGrey.main',
              fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
            }}
          >
            <Download fontSize={iconSize} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton
            sx={{
              color: 'darkGrey.main',
              fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
            }}
          >
            <Share fontSize={iconSize} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            sx={{
              color: 'darkGrey.main',
              fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
            }}
          >
            <Edit fontSize={iconSize} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default SchedulerTitle;
