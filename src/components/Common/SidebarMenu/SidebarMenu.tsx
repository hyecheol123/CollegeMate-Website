/**
 * SidebarMenu Component
 * - Fully reusable and scrollable sidebar menu component
 * - Supports title, dynamic items, and multi-level back navigation using view history stack
 * @author Daekyun Kim
 */

// React
import React, { useState, useEffect } from 'react';
// Types
import type { SidebarView, SidebarMenuProps } from '.';
// Components
import SidebarMenuItem from './SidebarMenuItem';
import CustomImage from '../Styles/CustomImage';
// Styles
import {
  SidebarContainer,
  TitleRow,
  BackButtonWrapper,
  SidebarList,
  SidebarTitle,
  InnerWrapper,
} from './SidebarMenu.styles';
// Assets
import BackArrowPng from '../../../../assets/arrow_back_icon.png';
import BackArrowWebp from '../../../../assets/arrow_back_icon.png?as=webp';
import BackArrowAvif from '../../../../assets/arrow_back_icon.png?as=avif';
import NotificationView from '../SidebarView/NotificationView';
import { Announcement } from '../../../data/Miscellaneous/getAnnouncements';

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
  // View history stack to support multi-level back navigation.
  const [viewHistory, setViewHistory] = useState<SidebarView[]>([initialView]);
  const [selectedNotification, setSelectedNotification] =
    useState<Announcement | null>(null);

  // When entering notification detail page
  const handleSelect = (item: Announcement): void => {
    setSelectedNotification(item);
  };

  // When closing notification detail page
  const notiGoBack = (): void => {
    setSelectedNotification(null);
    setViewHistory(['notifications']);
  };

  // Current view is always the last item in history stack
  const currentView = viewHistory[viewHistory.length - 1];

  useEffect(() => {
    console.log('[DEBUG] viewHistory:', viewHistory);
  }, [viewHistory]);

  useEffect(() => {
    // Reset to initial view when sidebar closes
    if (!open) {
      setViewHistory([initialView]);
    }
  }, [open, initialView]);

  useEffect(() => {
    // Call onViewChange callback whenever currentView changes
    onViewChange?.(currentView);
  }, [currentView, onViewChange]);

  useEffect(() => {
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return (): void => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open) return null;

  // Show back icon only when there is more than one view in the stack
  const showBackIcon = viewHistory.length > 1;

  // Navigate to a new view by pushing it onto the stack
  const navigateTo = (view: SidebarView): void => {
    setViewHistory((prev) => [...prev, view]);
  };

  // Go back by popping one view from the stack
  const goBack = (): void => {
    setViewHistory((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      onClose();
      return prev;
    });
  };

  return (
    <SidebarContainer>
      <InnerWrapper>
        <TitleRow>
          {showBackIcon ||
            (selectedNotification && (
              <BackButtonWrapper
                onClick={currentView === 'notifications' ? notiGoBack : goBack}
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
            ))}
          {title && <SidebarTitle variant="h2">{title}</SidebarTitle>}
        </TitleRow>

        {currentView === 'main' ? (
          <SidebarList>
            {items.map((item, idx) => (
              <SidebarMenuItem
                key={item.label}
                item={{
                  ...item,
                  onClick: (): void => {
                    // Push new view to history when item is clicked
                    navigateTo(item.label as SidebarView);
                    item.onClick();
                  },
                }}
                spacing={itemSpacing}
                showDivider={showDivider}
                isLast={idx === items.length - 1}
              />
            ))}
          </SidebarList>
        ) : currentView === 'notifications' ? (
          <NotificationView
            selected={selectedNotification}
            onSelect={handleSelect}
          />
        ) : undefined}
      </InnerWrapper>
    </SidebarContainer>
  );
};

export default SidebarMenu;
