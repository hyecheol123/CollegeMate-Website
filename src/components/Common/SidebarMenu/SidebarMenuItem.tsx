/**
 * SidebarMenuItem Component
 * - Renders a single row item inside the sidebar menu
 * - Supports custom text style, optional right-side icon, and an optional divider
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Assets
import ArrowRightPng from '../../../../assets/arrow_right_icon.png';
import ArrowRightWebp from '../../../../assets/arrow_right_icon.png?as=webp';
import ArrowRightAvif from '../../../../assets/arrow_right_icon.png?as=avif';
// Types
import type { SidebarMenuItemPropsType } from '.';
// Custom Components
import CustomImage from '../Styles/CustomImage';
// Styles
import {
  StyledListItemButton,
  StyledListItemText,
  StyledDivider,
} from './SidebarMenuItem.styles';

/**
 * Renders an individual menu item for the sidebar.
 * @param {SidebarMenuItemPropsType} props - Props for the SidebarMenuItem component
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
      <StyledListItemButton sx={{ mb: spacing }} onClick={item.onClick}>
        <StyledListItemText
          primary={item.label}
          primaryTypographyProps={{ variant: item.textVariant || 'body1' }}
        />
        {item.icon !== null &&
          (item.icon ?? (
            <CustomImage
              png={ArrowRightPng}
              webp={ArrowRightWebp}
              avif={ArrowRightAvif}
              alt="Arrow"
              width="6.33px"
              height="12px"
              style={{ marginRight: '6px' }}
            />
          ))}
      </StyledListItemButton>

      {showDivider && !isLast && <StyledDivider />}
    </>
  );
}

export default SidebarMenuItem;
