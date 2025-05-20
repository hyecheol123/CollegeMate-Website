/**
 * SidebarMenuItem Component
 * - Renders a single row item inside the sidebar menu
 * - Supports custom text style, optional right-side icon, and an optional divider
 * @author Daekyun Kim
 */

import React from 'react';
import { ListItemButton, ListItemText, Divider } from '@mui/material';
import { SidebarMenuItemProps } from './types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Renders an individual menu item for the sidebar.
 * @param {SidebarMenuItemProps} props - Props for the SidebarMenuItem component
 * @param {SidebarMenuItem} props.item - The menu item object containing label, icon, etc.
 * @param {number} props.spacing - Bottom margin spacing between this and the next item
 * @param {boolean} props.showDivider - Whether to show a divider after this item
 * @param {boolean} props.isLast - Whether this is the last item in the list
 * @returns {React.ReactElement} Rendered sidebar menu item
 */
function SidebarMenuItem({
  item,
  spacing,
  showDivider,
  isLast,
}: SidebarMenuItemProps): React.ReactElement {
  return (
    <>
      <ListItemButton
        sx={{ width: '100%', py: `24px`, verticalAlign: 'center' }}
        onClick={item.onClick}
      >
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ variant: item.textVariant || 'body2' }}
        />
              {item.icon !== null && (item.icon ?? <ArrowForwardIosIcon fontSize="small" />)}
      </ListItemButton> 
      {/* Divider shown only if not the last item */}
      {showDivider && !isLast && <Divider />}
    </>
  );
}

export default SidebarMenuItem;
