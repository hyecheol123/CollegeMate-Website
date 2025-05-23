/**
 * Reusable Main Header component with responsive layout and sidebar toggle
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuSharp';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import CustomBadge from '../Styles/CustomBadge';
import type { MainHeaderProps } from './types';
import LogoImg from '../../../../assets/logo.png';
import LogoWebp from '../../../../assets/logo.png?as=webp';
import LogoAvif from '../../../../assets/logo.png?as=avif';
import useIsMobile from '../../../hooks/useIsMobile';
import type { SidebarView } from '../SidebarMenu/types';
import SidebarMenu from '../SidebarMenu';

/**
 * React Functional Component to render the Main Header
 * @param {MainHeaderProps} props - Props including title and menu items
 * @returns {React.ReactElement} The rendered Main Header component
 */
function MainHeader({ title, menuItems }: MainHeaderProps): React.ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바가 열려있는지 여부
  const [currentSidebarView, setCurrentSidebarView] =
    useState<SidebarView>('main'); // 현재 사이드바안에서 보고있는 뷰가 main인지 setting인지
  const isMobile = useIsMobile(480);
  const friendRequestCount = 3; // TODO: API Mocking
  const notificationCount = 4; // TODO: API Mocking

  const handleMenuToggle = (): void => setIsSidebarOpen((prev) => !prev); // 사이드바 열려있는지 여부

  const renderIcons = (): React.ReactNode => (
    <>
      <Tooltip title="Friends">
        <IconButton sx={{ color: 'red.main' }}>
          <CustomBadge badgeContent={friendRequestCount}>
            <PersonIcon />
          </CustomBadge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton sx={{ color: 'red.main' }}>
          <CustomBadge badgeContent={notificationCount}>
            <NotificationsOutlinedIcon />
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
        {/* 왼쪽: 메뉴 + 친구 +알림 (데스크탑) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
