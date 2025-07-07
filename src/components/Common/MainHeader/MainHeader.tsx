/**
 * Reusable Main Header component with responsive layout and sidebar toggle
 * - Includes notification and friend request badges
 * - Data is fetched and cached using Global Context
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useEffect } from 'react';
// MUI
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/MenuSharp';
import CloseIcon from '@mui/icons-material/Close';
// Components
import CustomBadge from '../Styles/CustomBadge/CustomBadge';
import CustomImage from '../Styles/CustomImage';
import SidebarMenu from '../SidebarMenu';
// Hooks
import useIsMobile from '../../../hooks/useIsMobile';
// Global Context
import { useGlobalContext } from '../../../GlobalContext';
import { getAnnouncements } from '../../../data/Miscellaneous/getAnnouncements';
import { getFriendRequests } from '../../../data/Friend/getFriendRequests';
// Types
import type { SidebarView, SidebarMenuItemType } from '../SidebarMenu/types';
import type { MainHeaderProps } from './types';
// Assets
import LogoImg from '../../../../assets/logo.png';
import LogoWebp from '../../../../assets/logo.png?as=webp';
import LogoAvif from '../../../../assets/logo.png?as=avif';
import FriendIconPng from '../../../../assets/friend_Icon.png';
import FriendIconWebp from '../../../../assets/friend_Icon.png?as=webp';
import FriendIconAvif from '../../../../assets/friend_Icon.png?as=avif';
import BellIconPng from '../../../../assets/bell_Icon.png';
import BellIconWebp from '../../../../assets/bell_Icon.png?as=webp';
import BellIconAvif from '../../../../assets/bell_Icon.png?as=avif';
// Styles
import {
  HeaderContainer,
  LeftSection,
  RightSection,
  LogoContainer,
  StyledIconButton,
} from './MainHeader.styles';

/**
 * MainHeader component rendering top bar with menu and badges.
 * - Displays logo, menu toggle, and badges for friends & notifications.
 * - Uses Global Context to fetch & cache data.
 * @param {MainHeaderProps} props - Props including user's title and sidebar menu items
 * @param {string} props.title - User's display name shown in header
 * @param {SidebarMenuItemType[]} props.menuItems - Items to display in the sidebar menu
 * @returns {React.ReactElement} The rendered MainHeader component
 */
function MainHeader({ title, menuItems }: MainHeaderProps): React.ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentSidebarView, setCurrentSidebarView] =
    useState<SidebarView>('main');
  const isMobile = useIsMobile(480);

  // Global state
  const {
    announcementsFetchedAt,
    friendRequestsFetchedAt,
    dispatch,
    announcements,
    friendRequests,
  } = useGlobalContext();

  useEffect(() => {
    getAnnouncements(dispatch, announcementsFetchedAt ?? undefined).catch(
      (err) => console.error('Failed to fetch announcements:', err), // Will be replaced with Alert
    );
    getFriendRequests(dispatch, friendRequestsFetchedAt ?? undefined).catch(
      (err) => console.error('Failed to fetch friend requests:', err), // Will be replaced with Alert
    );
  }, [dispatch, announcementsFetchedAt, friendRequestsFetchedAt]);

  const handleMenuToggle = (targetView?: SidebarView): void => {
    if (targetView && targetView !== currentSidebarView) {
      setCurrentSidebarView(targetView);
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  const renderIcons = (): React.ReactNode => (
    <>
      <Tooltip title="Friends">
        <StyledIconButton>
          <CustomBadge badgeContent={friendRequests.length}>
            <CustomImage
              png={FriendIconPng}
              webp={FriendIconWebp}
              avif={FriendIconAvif}
              alt="Friends"
            />
          </CustomBadge>
        </StyledIconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <StyledIconButton onClick={() => handleMenuToggle('notifications')}>
          <CustomBadge badgeContent={announcements.length}>
            <CustomImage
              png={BellIconPng}
              webp={BellIconWebp}
              avif={BellIconAvif}
              alt="Notifications"
            />
          </CustomBadge>
        </StyledIconButton>
      </Tooltip>
    </>
  );

  const renderLogo = (): React.ReactNode => (
    <LogoContainer>
      <CustomImage
        png={LogoImg}
        webp={LogoWebp}
        avif={LogoAvif}
        alt="CollegeMate Logo"
        height="20px"
        width="auto"
      />
    </LogoContainer>
  );

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <Tooltip title="Menu">
            <StyledIconButton onClick={() => handleMenuToggle('main')}>
              {isMobile && isSidebarOpen && currentSidebarView === 'main' ? (
                <CloseIcon />
              ) : (
                <MenuIcon />
              )}
            </StyledIconButton>
          </Tooltip>
          {!isMobile && renderIcons()}
        </LeftSection>

        {renderLogo()}

        {isMobile && <RightSection>{renderIcons()}</RightSection>}
      </HeaderContainer>

      <SidebarMenu
        key={currentSidebarView}
        open={isSidebarOpen}
        onClose={() => handleMenuToggle()}
        initialView={currentSidebarView}
        onViewChange={setCurrentSidebarView}
        itemSpacing={0}
        showDivider
        title={
          currentSidebarView === 'main'
            ? `Hello, ${title}!`
            : currentSidebarView === 'notifications'
              ? 'Notifications'
              : undefined
        }
        items={currentSidebarView === 'main' ? menuItems : []}
      />
    </>
  );
}

export default MainHeader;
