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
  Menu,
  MenuItem,
} from '@mui/material';
// Material UI Icon
import Download from '@mui/icons-material/FileDownloadOutlined';
import Share from '@mui/icons-material/IosShareOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import Save from '@mui/icons-material/SaveOutlined';
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
  marginRight: '-8px',
};

// Props interface
interface SchedulerTitleProps {
  onEditClick?: () => void;
  isEditMode?: boolean;
  currentTerm?: Term | null;
  availableTerms?: Term[];
  onTermChange?: (term: Term) => void;
  onDownloadClick?: () => void;
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
  onDownloadClick,
}: SchedulerTitleProps): React.ReactElement {
  // State to hold the current window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [termMenuAnchor, setTermMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
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

  const handleTermMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    if (!isEditMode) {
      setTermMenuAnchor(event.currentTarget);
    }
  };

  const handleTermMenuClose = (): void => {
    setTermMenuAnchor(null);
  };

  const handleTermSelect = (term: Term): void => {
    if (onTermChange) {
      onTermChange(term);
    }
    setTermMenuAnchor(null);
  };

  return (
    <Box sx={containerStyle}>
      {/* Left side: Custom term selector */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '8px' : '16px',
          flex: 1,
        }}
      >
        {/* Custom Term Selector */}
        {availableTerms.length > 1 && onTermChange ? (
          <Box
            onClick={handleTermMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isEditMode ? 'default' : 'pointer',
              opacity: isEditMode ? 0.6 : 1,
              marginLeft: '1px',
              '&:hover': {
                opacity: isEditMode ? 0.6 : 0.8,
              },
            }}
          >
            <Typography variant="h2" sx={titleStyle}>
              {currentTermName}
            </Typography>

            {/* Red Triangle Arrow */}
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid #B20000',
                marginTop: '2px',
                marginLeft: '3px',
                transition: 'transform 0.2s ease',
                transform: termMenuAnchor ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </Box>
        ) : (
          <Typography variant="h2" sx={titleStyle}>
            {currentTermName}
          </Typography>
        )}

        {/* Term Menu */}
        <Menu
          anchorEl={termMenuAnchor}
          open={Boolean(termMenuAnchor)}
          onClose={handleTermMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              marginTop: '8px',
              minWidth: '200px',
            },
          }}
        >
          {availableTerms.map((term) => (
            <MenuItem
              key={term.termCode}
              onClick={() => handleTermSelect(term)}
              selected={currentTerm?.termCode === term.termCode}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(178, 0, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(178, 0, 0, 0.12)',
                  },
                },
              }}
            >
              <Typography variant="body2">
                {formatTermCode(term.termCode)}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Right side: Action icons */}
      <Box sx={iconBoxStyle}>
        <Tooltip title="Download">
          <IconButton
            disabled={isEditMode}
            onClick={onDownloadClick}
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
