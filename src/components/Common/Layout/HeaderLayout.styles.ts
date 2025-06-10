/**
 * HeaderLayout Stylesheet
 * - Contains shared styles for HeaderLayout component
 * - Defines layout wrapper and content area styles
 * - Uses 100dvh instead of % or 100vh for more reliable viewport height handling (especially on mobile)
 * - Separating style constants improves readability and reusability
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { SxProps } from '@mui/material';

export const layoutWrapperSx: SxProps = {
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
};

export const pageContentSx: SxProps = {
  flex: 1,
};
