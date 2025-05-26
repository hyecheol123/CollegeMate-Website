/**
 * SidebarMenuItem Component
 * - Renders a single row item inside the sidebar menu
 * - Supports custom text style, optional right-side icon, and an optional divider
 * @author Daekyun Kim
 */

// React
import React from 'react';
// MUI
import { ListItemButton, ListItemText, Divider } from '@mui/material';
// Assets
import ArrowRightPng from '../../../../assets/arrow_right_icon.png';
import ArrowRightWebp from '../../../../assets/arrow_right_icon.png?as=webp';
import ArrowRightAvif from '../../../../assets/arrow_right_icon.png?as=avif';

import type { SidebarMenuItemPropsType } from '.';
/**
 * Renders an individual menu item for the sidebar.
 * @param {SidebarMenuItemPropsType} props - Props for the SidebarMenuItem component
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
}: SidebarMenuItemPropsType): React.ReactElement {
  return (
    <>
      <ListItemButton
        sx={{
          width: '100%',
          py: '20px',
          ml: '4px',
          verticalAlign: 'center',
          mb: spacing,
        }}
        onClick={item.onClick}
      >
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ variant: item.textVariant || 'body1' }}
        />
        {item.icon !== null &&
          (item.icon ?? (
            <picture>
              <source srcSet={ArrowRightAvif} type="image/avif" />
              <source srcSet={ArrowRightWebp} type="image/webp" />
              <img
                src={ArrowRightPng}
                alt="Arrow"
                style={{
                  width: '6.33px',
                  height: '12px',
                  marginRight: '6px',
                }}
              />
            </picture>
          ))}
      </ListItemButton>

      {/* Divider shown only if not the last item */}
      {showDivider && !isLast && <Divider />}
    </>
  );
}

export default SidebarMenuItem;
