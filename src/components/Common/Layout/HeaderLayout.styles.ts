/**
 * HeaderLayout Stylesheet
 * - Contains shared styles for HeaderLayout component
 * - Defines layout wrapper and content area styles
 * - Separating style constants improves readability and reusability
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { SxProps } from '@mui/material';

export const layoutWrapperSx: SxProps = {
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export const pageContentSx: SxProps = {
  flex: 1,
};
