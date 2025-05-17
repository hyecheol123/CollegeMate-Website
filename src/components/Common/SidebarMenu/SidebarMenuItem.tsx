/**
 * SidebarMenuItem Component
 * - Renders a single row item inside the sidebar menu
 * - Supports custom text style, optional right-side icon, and an optional divider
 * @author Daekyun Kim
 */

import React from 'react';
import { ListItemButton, ListItemText, Divider } from '@mui/material';
import { SidebarMenuItemProps } from './types';

function SidebarMenuItem({ item, spacing, showDivider, isLast }: SidebarMenuItemProps): React.ReactElement {
  return (
    <>
      <ListItemButton sx={{ width: '100%', mb: spacing }} onClick={item.onClick}>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ variant: item.textVariant || 'body1' }}
        />
        {item.icon} {/* Optional right-side icon */}
      </ListItemButton>
      {/* Divider shown only if not the last item */}
      {showDivider && !isLast && <Divider />}
    </>
  );
}

export default SidebarMenuItem;
