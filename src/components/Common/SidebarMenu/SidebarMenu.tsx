/**
 * SidebarMenu Component
 * - A reusable sidebar component that displays a list of menu items
 * - Supports a title, optional dividers, and custom spacing between items
 * - Automatically locks body scroll when open
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React from 'react';
import { Box, Typography, List } from '@mui/material';
import SidebarMenuItem from './SidebarMenuItem';
import { SidebarMenuProps } from './types';

function SidebarMenu({
  open,
  onClose,
  title,
  items,
  itemSpacing = 1,
  showDivider = true,
}: SidebarMenuProps): React.ReactElement | null {
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  // If sidebar is not open, render nothing
  if (!open) return null;

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        height: '100%',
        width: window.innerWidth <= 480 ? '100vw' : '400px',
        position: 'absolute',
        zIndex: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar title */}
      {title && (
        <Typography variant="h2" color="red.main" mb={2}>
          {title}
        </Typography>
      )}
      {/* Sidebar menu items list */}
      <List sx={{ width: '100%' }}>
        {items.map((item, idx) => (
          <SidebarMenuItem
            key={item.label}
            item={item}
            spacing={itemSpacing}
            showDivider={showDivider}
            isLast={idx === items.length - 1}
          />
        ))}
      </List>
    </Box>
  );
}

export default SidebarMenu;
