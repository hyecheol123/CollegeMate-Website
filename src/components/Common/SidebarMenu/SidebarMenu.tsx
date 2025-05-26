/**
 * SidebarMenu Component
 * - A reusable sidebar component that displays a list of menu items
 * - Supports a title, optional dividers, and custom spacing between items
 * - Automatically locks body scroll when open
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useEffect } from 'react';
// MUI
import { Box, Typography, List } from '@mui/material';
// Assets
import BackArrowPng from '../../../../assets/arrow_back_icon.png';
import BackArrowWebp from '../../../../assets/arrow_back_icon.png?as=webp';
import BackArrowAvif from '../../../../assets/arrow_back_icon.png?as=avif';
// Hooks
import useIsMobile from '../../../hooks/useIsMobile';

import type { SidebarView, SidebarMenuProps } from '.';
import SidebarMenuItem from './SidebarMenuItem';

/**
 * Renders the sidebar menu with title and selectable items.
 * @param {SidebarMenuProps} props - Sidebar properties
 * @param {boolean} props.open - Whether the sidebar is open
 * @param {() => void} props.onClose - Function to close the sidebar
 * @param {string} [props.title] - Optional title at the top of the sidebar
 * @param {SidebarMenuItemType[]} props.items - Menu item objects to display
 * @param {number} [props.itemSpacing] - Vertical spacing between each menu item
 * @param {boolean} [props.showDivider] - Whether to show dividers between items
 * @returns {React.ReactElement | null} Sidebar JSX or null if closed
 */
function SidebarMenu({
  open,
  onClose,
  title,
  items,
  itemSpacing = 0,
  showDivider = true,
  initialView = 'main',
  onViewChange,
}: SidebarMenuProps): React.ReactElement | null {
  const isMobile = useIsMobile(480);
  const [currentView, setCurrentView] = useState<SidebarView>(initialView);

  useEffect((): void => {
    if (!open) setCurrentView('main');
  }, [open]);

  useEffect((): void => {
    onViewChange?.(currentView);
  }, [currentView, onViewChange]);

  useEffect((): (() => void) => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  // If sidebar is not open, render nothing
  if (!open) return null;

  const showBackIcon = (isMobile && currentView !== 'main') || !isMobile; // 데스크탑에선 항상 보여야 함

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '56px',
        backgroundColor: '#fff',
        height: '100%',
        width: { xs: '100vw', sm: '488px' },
        zIndex: 3,
        p: 2,
        ml: { xs: 0, sm: 4 },
        mt: { xs: 0, sm: 1 },
        display: 'flex',
        flexDirection: 'column',
        verticalAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar title + Back Arrow Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {showBackIcon && (
          <Box
            onClick={() => {
              if (currentView === 'main') {
                onClose();
              } else {
                setCurrentView('main');
              }
            }}
            sx={{
              mr: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <picture>
              <source srcSet={BackArrowAvif} type="image/avif" />
              <source srcSet={BackArrowWebp} type="image/webp" />
              <img
                src={BackArrowPng}
                alt="Back"
                style={{ width: '14.67px', height: '12px' }}
              />
            </picture>
          </Box>
        )}
        {title && (
          <Typography
            variant="h2"
            color="red.main"
            sx={{ ml: { xs: '10px', sm: '4px' } }}
          >
            {title}
          </Typography>
        )}
      </Box>
      {/* Sidebar menu items list */}
      <List sx={{ width: '100%' }}>
        {items.map((item, idx) => (
          <SidebarMenuItem
            key={item.label}
            item={{
              ...item,
              onClick: () => {
                setCurrentView(item.label as SidebarView);
                item.onClick();
              },
            }}
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
