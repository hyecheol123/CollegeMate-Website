/**
 * Renders the title for the Scheduler, including responsive icons for download, share, and edit.
 * Dynamically adjust icons's size based on the window width
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React, { useState, useEffect } from 'react';
// Material UI
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
// Material UI Icon
import Download from '@mui/icons-material/FileDownloadOutlined';
import Share from '@mui/icons-material/IosShareOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import Save from '@mui/icons-material/SaveOutlined';
// Components
import TermSelector from './TermSelector';
// Types and Utils
import type { Term } from '../../data/Terms/getTerms';
import { formatTermCode } from '../../utils/termUtils';

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: '1em',
  px: { xs: '16px', md: '32px' },
  width: '100%',
  margin: 0,
};

const titleStyle = {
  color: 'red.main',
  marginLeft: 0,
};

const iconBoxStyle = {
  marginRight: 0,
};

// Props interface
interface SchedulerTitleProps {
  onEditClick?: () => void;
  isEditMode?: boolean;
  currentTerm?: Term | null;
  availableTerms?: Term[];
  onTermChange?: (term: Term) => void;
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
  currentTerm,
  availableTerms = [],
  onTermChange,
}: SchedulerTitleProps): React.ReactElement {
  // State to hold the current window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Determine the icon size based on the window width
  const iconSize = windowWidth < 300 ? 'small' : 'medium';

  // Get current term display name
  const currentTermName = currentTerm
    ? formatTermCode(currentTerm.termCode)
    : 'Loading...';

  return (
    <Box sx={containerStyle}>
      {/* Left side: Current term title and term selector */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '8px' : '16px',
          flex: 1,
        }}
      >
        <Typography variant="h2" sx={titleStyle}>
          {currentTermName}
        </Typography>

        {/* Term selector dropdown */}
        {availableTerms.length > 1 && onTermChange && (
          <TermSelector
            terms={availableTerms}
            selectedTerm={currentTerm}
            onTermChange={onTermChange}
            disabled={isEditMode}
          />
        )}
      </Box>

      {/* Right side: Action icons */}
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
            {isEditMode ? (
              <Save fontSize={iconSize} />
            ) : (
              <Edit fontSize={iconSize} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default SchedulerTitle;
