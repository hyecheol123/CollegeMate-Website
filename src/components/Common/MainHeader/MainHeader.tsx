/**
 * Reusable Main Header component with responsive layout and sidebar toggle
 * @author Daekyun Kim <daekyun97@gmail.com>
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
// Hook
import useIsMobile from '../../../hooks/useIsMobile';

import type { SidebarView } from '../SidebarMenu/types';
import type { MainHeaderProps } from './types';
import SidebarMenu from '../SidebarMenu';

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
  const friendRequestCount = 3;
  const notificationCount = 4;

  const handleMenuToggle = (): void => setIsSidebarOpen((prev) => !prev);

  const renderIcons = (): React.ReactNode => (
    <>
      <Tooltip title="Friends">
        <IconButton sx={{ color: 'red.main' }}>
          <CustomBadge badgeContent={friendRequestCount}>
            <picture>
              <source srcSet={FriendIconAvif} type="image/avif" />
              <source srcSet={FriendIconWebp} type="image/webp" />
              <img
                src={FriendIconPng}
                alt="Friends"
                style={{ width: '24px', height: '24px' }}
              />
            </picture>
          </CustomBadge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton sx={{ color: 'red.main' }}>
          <CustomBadge badgeContent={notificationCount}>
            <picture>
              <source srcSet={BellIconAvif} type="image/avif" />
              <source srcSet={BellIconWebp} type="image/webp" />
              <img
                src={BellIconPng}
                alt="Notifications"
                style={{ width: '24px', height: '24px' }}
              />
            </picture>
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
      <picture>
        <source srcSet={LogoAvif} type="image/avif" />
        <source srcSet={LogoWebp} type="image/webp" />
        <img
          src={LogoImg}
          alt="CollegeMate Logo"
          style={{ height: '20px', width: 'auto' }}
        />
      </picture>
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
          pl: { xs: '12px', md: '42px' },
          pr: { xs: '12px' },
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
          <Box sx={{ display: 'flex', gap: 2 }}>{renderIcons()}</Box>
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
