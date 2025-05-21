/**
 * Props for IconComponents in MainHeader
 * Used to render friend icon with optional badge count and size.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { SvgIconProps } from '@mui/material';

export interface IconComponentsProps {
  size: SvgIconProps['fontSize'];
  isFold?: boolean;
  friendRequestCount?: number;
}
