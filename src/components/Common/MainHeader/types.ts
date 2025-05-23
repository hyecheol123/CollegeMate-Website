/**
 * Reusable Main Header component with responsive layout and sidebar toggle
 * Displays a fixed-height header bar with menu icon, logo, and optional badges
 * Used globally across pages for consistent layout
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { SidebarMenuItemType } from '../SidebarMenu/types';

/**
 * Props for MainHeader component
 * @property {string} title - Sidebar title to display at the top
 * @property {SidebarMenuItemType[]} menuItems - Menu items shown in the sidebar
 */
export interface MainHeaderProps {
  title: string;
  menuItems: SidebarMenuItemType[];
}
