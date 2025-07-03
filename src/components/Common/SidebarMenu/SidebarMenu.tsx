/**
 * SidebarMenu Component
 * - Fully reusable and scrollable sidebar menu component
 * - Supports title, dynamic items, and mobile responsive behavior
 * - Manages internal sidebar view state and back navigation
 * @author Daekyun Kim
 */

import React, { useState, useEffect } from 'react';
import BackArrowPng from '../../../../assets/arrow_back_icon.png';
import BackArrowWebp from '../../../../assets/arrow_back_icon.png?as=webp';
import BackArrowAvif from '../../../../assets/arrow_back_icon.png?as=avif';
import useIsMobile from '../../../hooks/useIsMobile';
import type { SidebarView, SidebarMenuProps } from '.';
import SidebarMenuItem from './SidebarMenuItem';
import CustomImage from '../Styles/CustomImage';
import {
  SidebarContainer,
  TitleRow,
  BackButtonWrapper,
  SidebarList,
  SidebarTitle,
  InnerWrapper,
} from './SidebarMenu.styles';

/**
 * SidebarMenu Component
 * @param {SidebarMenuProps} props - Sidebar props
 * @returns {React.ReactElement | null} The rendered SidebarMenu component
 */
const SidebarMenu = ({
  open,
  onClose,
  title,
  items,
  itemSpacing = 0,
  showDivider = true,
  initialView = 'main',
  onViewChange,
}: SidebarMenuProps): React.ReactElement | null => {
  const isMobile = useIsMobile(480);
  const [currentView, setCurrentView] = useState<SidebarView>(initialView);

  useEffect(() => {
    if (!open) setCurrentView('main');
  }, [open]);

  useEffect(() => {
    onViewChange?.(currentView);
  }, [currentView, onViewChange]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return (): void => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open) return null;

  const showBackIcon = (isMobile && currentView !== 'main') || !isMobile;

  return (
    <SidebarContainer>
      <InnerWrapper>
        <TitleRow>
          {showBackIcon && (
            <BackButtonWrapper
              onClick={(): void => {
                if (currentView === 'main') {
                  onClose();
                } else {
                  setCurrentView('main');
                }
              }}
            >
              <CustomImage
                png={BackArrowPng}
                webp={BackArrowWebp}
                avif={BackArrowAvif}
                alt="Back"
                width="14.67px"
                height="12px"
              />
            </BackButtonWrapper>
          )}
          {title && <SidebarTitle variant="h2">{title}</SidebarTitle>}
        </TitleRow>

        <SidebarList>
          {items.map((item, idx) => (
            <SidebarMenuItem
              key={item.label}
              item={{
                ...item,
                onClick: (): void => {
                  setCurrentView(item.label as SidebarView);
                  item.onClick();
                },
              }}
              spacing={itemSpacing}
              showDivider={showDivider}
              isLast={idx === items.length - 1}
            />
          ))}
        </SidebarList>
      </InnerWrapper>
    </SidebarContainer>
  );
};

export default SidebarMenu;
