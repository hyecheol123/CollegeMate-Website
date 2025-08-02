/**
 * Renders the title for the Scheduler, including responsive icons for download, share, and edit.
 * Dynamically adjust icons's size based on the window width
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React, { useState, useEffect } from 'react';
// Material UI
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
// Material UI Icon
import Download from '@mui/icons-material/FileDownloadOutlined';
import Share from '@mui/icons-material/IosShareOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import Save from '@mui/icons-material/SaveOutlined';
// Mocking API
import getScheduleDetail from '../../data/Schedule/getScheduleDetail';

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
 * Determines the year and semester based on the term code.
 * @param {string} termCode - The term code to evaluate.
 * @return {string} The year and semester (e.g., '2023 Fall') or 'Unknown' if not matched.
 *
 * UW-Madison term codes reference: https://businessservices.wisc.edu/making-payments/charge-to-a-students-account/term-codes/
 */
const getYearAndSemester = (termCode: string): string => {
  if (termCode.length !== 4) return 'Invalid code';

  const middleDigits = parseInt(termCode.slice(1, 3), 10);
  const suffix = `${termCode[0]}${termCode[3]}`;

  let year = 2000 + middleDigits;
  let semester = 'Unknown';

  if (suffix === '14') {
    semester = 'Spring';
  } else if (suffix === '16') {
    semester = 'Summer';
  } else if (suffix === '12') {
    year -= 1;
    semester = 'Fall';
  }

  return `${year} ${semester}`;
};

// Props interface
interface SchedulerTitleProps {
  onEditClick?: () => void;
  isEditMode?: boolean;
}

/**
 * Renders the title for the Scheduler, including responsive icons for download, share, and edit.
 * Dynamically adjusts icon sizes based on the window width.
 * @param {SchedulerTitleProps} props - Props including edit click handler and edit mode state
 * @return {React.ReactElement} A React component representing the scheduler title and icons.
 */
function SchedulerTitle({
  onEditClick,
  isEditMode = false,
}: SchedulerTitleProps): React.ReactElement {
  // State to hold the current window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [semesterName, setSemesterName] = useState('Unknown');

  // Effect to update the window width state on resize
  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Mock API call to fetch schedule details
    getScheduleDetail('some-schedule-id').then((response) => {
      if (response.responseCode === 200 && response.content?.termCode) {
        setSemesterName(getYearAndSemester(response.content.termCode));
      }
    });
  }, []);

  // Determine the icon size based on the window width
  const iconSize = windowWidth < 300 ? 'small' : 'medium';

  return (
    <Box sx={containerStyle}>
      <Typography variant="h2" sx={titleStyle}>
        {semesterName}
      </Typography>
      <Box sx={iconBoxStyle}>
        <Tooltip title="Download">
          <IconButton
            disabled={isEditMode}
            sx={{
              color: isEditMode ? 'rgba(0,0,0,0.26)' : 'darkGrey.main',
              fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
            }}
          >
            <Download fontSize={iconSize} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton
            disabled={isEditMode}
            sx={{
              color: isEditMode ? 'rgba(0,0,0,0.26)' : 'darkGrey.main',
              fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
            }}
          >
            <Share fontSize={iconSize} />
          </IconButton>
        </Tooltip>
        <Tooltip title={isEditMode ? 'Save Changes' : 'Edit Schedule'}>
          <IconButton
            onClick={onEditClick}
            sx={{
              color: isEditMode ? 'red.main' : 'darkGrey.main',
              fontSize: iconSize === 'small' ? '1.25rem' : 'inherit',
              backgroundColor: isEditMode
                ? 'rgba(178, 0, 0, 0.1)'
                : 'transparent',
              '&:hover': {
                backgroundColor: isEditMode
                  ? 'rgba(178, 0, 0, 0.2)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {isEditMode ? <Save fontSize={iconSize} /> : <Edit fontSize={iconSize} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default SchedulerTitle;
