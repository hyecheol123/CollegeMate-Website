/**
 * MainHeader Stylesheet
 * - Contains styled components for MainHeader layout
 * - Centralizes padding, spacing, and responsive design
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

// Full header container
export const HeaderContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.whiteGrey.main,
  display: 'flex',
  justifyContent: 'space-between',
  height: '56px',
  position: 'relative',
  paddingLeft: '12px',
  paddingRight: '12px',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '24px',
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '24px',
  },
  [theme.breakpoints.up('xl')]: {
    paddingLeft: '42px',
  },
}));

// Left section (menu + friend icons)
export const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
});

// Right section (only for mobile friend + bell icons)
export const RightSection = styled(Box)({
  display: 'flex',
  gap: '14px',
});

// Logo container (center aligned logo)
export const LogoContainer = styled(Box)({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

// IconButton (menu icon style override)
export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.red.main,
}));
