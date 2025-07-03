/**
 * SidebarMenu Styles
 * - Contains reusable styled components for SidebarMenu layout
 * - Clean separation of layout logic from rendering
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { styled } from '@mui/material/styles';
import { Box, Typography, List } from '@mui/material';

/** Sidebar container positioned on the left side of the screen */
export const SidebarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '56px',
  bottom: 0,
  backgroundColor: theme.palette.white.main,
  width: '100vw',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  verticalAlign: 'center',
  boxSizing: 'border-box',
  [theme.breakpoints.up('lg')]: {
    width: 'min(480px, 25%)',
    marginLeft: theme.spacing(4),
  },
}));

/** Inner wrapper providing padding and flex container for scrolling */
export const InnerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0, // Critical for vertical scroll inside flex container
  padding: theme.spacing(2),
}));

/** Top row for title and back button */
export const TitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  [theme.breakpoints.up('sm')]: { gap: '12px' },
  [theme.breakpoints.up('md')]: { gap: '12px' },
  [theme.breakpoints.up('lg')]: { gap: '16px' },
}));

/** Back button wrapper with responsive left margin */
export const BackButtonWrapper = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px',
  [theme.breakpoints.up('md')]: { marginLeft: '16px' },
  [theme.breakpoints.up('xl')]: { marginLeft: '16px' },
}));

/** Sidebar menu list area with vertical scrolling enabled */
export const SidebarList = styled(List)(({ theme }) => ({
  width: '100%',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: theme.spacing(2),
  boxSizing: 'border-box',
}));

/** Sidebar title text styling */
export const SidebarTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.red.main,
  marginLeft: '16px',
  [theme.breakpoints.up('sm')]: { marginLeft: '4px' },
}));
