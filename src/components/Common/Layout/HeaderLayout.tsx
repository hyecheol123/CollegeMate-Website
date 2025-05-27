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
 *
 * @param {HeaderLayoutProps} props - props including children, title, and menu items
 * @returns {React.ReactElement} React element representing the layout
 */
const HeaderLayout = ({
  children,
  title,
  menuItems,
}: HeaderLayoutProps): React.ReactElement => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top header (includes logo, friend,notification badges, and menu) */}
      <MainHeader title={title} menuItems={menuItems} />

      {/* Page-specific content rendered below header. */}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
};

export default HeaderLayout;
