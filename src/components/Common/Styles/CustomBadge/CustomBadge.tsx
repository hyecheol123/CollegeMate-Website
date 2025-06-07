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
 *
 * @param root0
 * @param root0.badgeContent
 * @param root0.children
 */
function CustomBadge({
  badgeContent,
  children,
}: CustomBadgeProps): React.ReactElement {
  return <StyledBadge badgeContent={badgeContent}>{children}</StyledBadge>;
}

export default CustomBadge;
