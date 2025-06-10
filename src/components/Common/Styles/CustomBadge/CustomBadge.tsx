/**
 * Custom styled Badge component for consistent badge appearance
 * - Reusable badge with red background and white text
 * - Uses centralized styled component for consistency
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React from 'react';
import type { ReactNode } from 'react';
import { StyledBadge } from './CustomBadge.styles';

type CustomBadgeProps = {
  badgeContent: number;
  children: ReactNode;
};

/**
 * CustomBadge component wraps content with a styled red badge.
 * It is used to show notification count or similar indicators.
 * @param {CustomBadgeProps} props - The props for CustomBadge
 * @param {number} props.badgeContent - Number to show in badge
 * @param {ReactNode} props.children - Element to wrap with badge
 * @returns {React.ReactElement} Badge-wrapped content
 */
function CustomBadge({
  badgeContent,
  children,
}: CustomBadgeProps): React.ReactElement {
  return <StyledBadge badgeContent={badgeContent}>{children}</StyledBadge>;
}

export default CustomBadge;
