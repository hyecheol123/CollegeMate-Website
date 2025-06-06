/**
 * Reusable Main Header component with responsive layout and sidebar toggle
 * - Includes notification and friend request badges
 * - Data is fetched and cached using Global Context
 * @author Daekyun Kim
 */

// React
import React, { useState } from 'react';
// MUI
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuSharp';
import CloseIcon from '@mui/icons-material/Close';
import CustomBadge from '../Styles/CustomBadge';
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
// Hooks & Types
import useIsMobile from '../../../hooks/useIsMobile';
import type { SidebarView } from '../SidebarMenu/types';
import type { MainHeaderProps } from './types';
// Custom Components
import CustomImage from '../Styles/CustomImage';
import SidebarMenu from '../SidebarMenu';
import useFetchFriendRequests from '../../../hooks/useFetchFriendRequests';
import useFetchAnnouncements from '../../../hooks/useFetchAnnouncements';
import { useGlobalContext } from '../../../GlobalContext';

/**
 * React Functional Component to render the Main Header
 * @param {MainHeaderProps} props - Props including title and menu items
 * @returns {React.ReactElement} The rendered Main Header component
 */
function MainHeader({ title, menuItems }: MainHeaderProps): React.ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSidebarView, setCurrentSidebarView] =
    useState<SidebarView>('main');
  const isMobile = useIsMobile(480);

  // Fetch friend request and announcement data into global context
  useFetchFriendRequests();
  useFetchAnnouncements();

  const { friendRequests, announcements } = useGlobalContext();

  const handleMenuToggle = (): void => setIsSidebarOpen((prev) => !prev);

  const renderIcons = (): React.ReactNode => (
    <>
      <Tooltip title="Friends">
        <IconButton sx={{ color: 'red.main' }}>
          <CustomBadge badgeContent={friendRequests.length}>
            <CustomImage
              png={FriendIconPng}
              webp={FriendIconWebp}
              avif={FriendIconAvif}
              alt="Friends"
            />
          </CustomBadge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton sx={{ color: 'red.main' }}>
          <CustomBadge badgeContent={announcements.length}>
            <CustomImage
              png={BellIconPng}
              webp={BellIconWebp}
              avif={BellIconAvif}
              alt="Notifications"
            />
          </CustomBadge>
        </IconButton>
      </Tooltip>
    </>
  );

  const renderLogo = (): React.ReactNode => (
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CustomImage
        png={LogoImg}
        webp={LogoWebp}
        avif={LogoAvif}
        alt="CollegeMate Logo"
        height="20px"
        width="auto"
      />
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          bgcolor: 'whiteGrey.main',
          display: 'flex',
          justifyContent: 'space-between',
          height: '56px',
          pl: { xs: '12px', sm: '12px', md: '24px', lg: '24px', xl: '42px' },
          pr: { xs: '12px', sm: '12'},
          position: 'relative',
        }}
      >
        {/* 왼쪽: 메뉴 + 친구 + 알림 (데스크탑) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Tooltip title="Menu">
            <IconButton onClick={handleMenuToggle} sx={{ color: 'red.main' }}>
              {isMobile && isSidebarOpen && currentSidebarView === 'main' ? (
                <CloseIcon />
              ) : (
                <MenuIcon />
              )}
            </IconButton>
          </Tooltip>
          {!isMobile && renderIcons()}
        </Box>

        {/* 중앙 로고 */}
        {renderLogo()}

        {/* 모바일 우측: 친구 + 알림 */}
        {isMobile && (
          <Box sx={{ display: 'flex', gap: 2.5 }}>{renderIcons()}</Box>
        )}
      </Box>

      <SidebarMenu
        open={isSidebarOpen}
        onClose={handleMenuToggle}
        title={`Hello, ${title}!`}
        items={menuItems}
        itemSpacing={0}
        showDivider
        onViewChange={setCurrentSidebarView}
      />
    </>
  );
}

export default MainHeader;
