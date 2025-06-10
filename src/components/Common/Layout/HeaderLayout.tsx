/**
 * HeaderLayout Component
 * - A reusable layout that includes the MainHeader and dynamic child content
 * - Used as a top-level layout wrapper for pages that require a header and sidebar
 * @author Daekyun Kim <daekyun97@gmail.com)
 */

import React from 'react';
import { Box } from '@mui/material';
import MainHeader from '../MainHeader';
import type { SidebarMenuItemType } from '../SidebarMenu';
import { layoutWrapperSx, pageContentSx } from './HeaderLayout.styles';

// Props for the HeaderLayout component
type HeaderLayoutProps = {
  children: React.ReactNode; // The content rendered below the header (page-specific components)
  title: string; // User's name or any title to be shown in the header
  menuItems: SidebarMenuItemType[]; // Sidebar menu items passed to MainHeader
};

/**
 * HeaderLayout
 * - Provides a full-page layout with header at the top and dynamic content below
 * - Ensures consistent header + page body structure
 * @param {HeaderLayoutProps} props - props including children, title, and menu items
 * @returns {React.ReactElement} React element representing the layout
 */
const HeaderLayout = ({
  children,
  title,
  menuItems,
}: HeaderLayoutProps): React.ReactElement => {
  return (
    <Box sx={layoutWrapperSx}>
      {/* Top header (includes logo, friend,notification badges, and menu) */}
      <MainHeader title={title} menuItems={menuItems} />

      {/* Page-specific content rendered below header. */}
      <Box sx={pageContentSx}>{children}</Box>
    </Box>
  );
};

export default HeaderLayout;
