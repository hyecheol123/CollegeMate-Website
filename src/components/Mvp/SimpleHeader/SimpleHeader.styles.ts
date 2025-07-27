/**
 * SimpleHeader Stylesheet
 * - Contains styled components for SimpleHeader layout
 * - Simplified version of MainHeader styles
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Full header container
export const HeaderContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.whiteGrey.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '56px',
  position: 'relative',
  paddingLeft: '12px',
  paddingRight: '12px',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  [theme.breakpoints.up('xl')]: {
    paddingLeft: '42px',
    paddingRight: '42px',
  },
}));

// Logo container (center aligned logo)
export const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
