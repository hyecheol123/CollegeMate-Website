/**
 * Reusable Main Header component with responsive layout and sidebar toggle
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuSharp';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import CustomBadge from '../Styles/CustomBadge';
import type { MainHeaderProps } from './types';
import LogoImg from '../../../../assets/logo.png';
import LogoWebp from '../../../../assets/logo.png?as=webp';
import LogoAvif from '../../../../assets/logo.png?as=avif';


/**
 * React Functional Component to render the Main Header
 * @param {MainHeaderProps} props - Props including title and menu items
 * @returns {React.ReactElement} The rendered Main Header component
 */
function MainHeader({ title, menuItems }: MainHeaderProps): React.ReactElement {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [friendRequestCount, setFriendRequestCount] = useState(3); // TODO: MOCK API
    const [notificationCount, setNotificationCount] = useState(4); // TODO: MOCK API

    const isFold = windowWidth < 300;

    useEffect(() => {
        const handleResize = (): void => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMenuToggle = (): void => setIsSidebarOpen((prev) => !prev);

    return (
        <>
            <Box
                sx={{
                    bgcolor: 'whiteGrey.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '56px',
                    px: '0.5em',
                    position: 'relative',
                }}
            >
                {/* 왼쪽: 메뉴 + 친구 +알림 (데스크탑) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Menu">
                        <IconButton onClick={handleMenuToggle} sx={{ color: 'red.main' }}>
                            <MenuIcon fontSize={isFold ? 'small' : 'medium'} />
                        </IconButton>
                    </Tooltip>

                    {windowWidth > 480 && (
                        <>
                            <Tooltip title="Friends">
                                <IconButton sx={{ color: 'red.main' }}>
                                    <CustomBadge badgeContent={friendRequestCount}>
                                        <PersonIcon fontSize={isFold ? 'small' : 'medium'} />
                                    </CustomBadge>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Notifications">
                                <IconButton sx={{ color: 'red.main' }}>
                                    <CustomBadge badgeContent={notificationCount}>
                                        <NotificationsOutlinedIcon fontSize={isFold ? 'small' : 'medium'} />
                                    </CustomBadge>
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>

                {/* 중앙 로고 */}
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
                            style={{
                                height: '20px',
                                width: 'auto',
                            }}
                        />
                    </picture>
                </Box>

                {/* 모바일 우측: 친구 + 알림 */}
                {windowWidth <= 480 && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Tooltip title="Friends">
                            <IconButton sx={{ color: 'red.main' }}>
                                <CustomBadge badgeContent={friendRequestCount}>
                                    <PersonIcon fontSize={isFold ? 'small' : 'medium'} />
                                </CustomBadge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Notifications">
                            <IconButton sx={{ color: 'red.main' }}>
                                <CustomBadge badgeContent={notificationCount}>
                                    <NotificationsOutlinedIcon fontSize={isFold ? 'small' : 'medium'} />
                                </CustomBadge>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>

            <SidebarMenu
                open={isSidebarOpen}
                onClose={handleMenuToggle}
                title={`Hello, ${title}!`}
                items={menuItems}
                itemSpacing={1.5}
                showDivider
            />
        </>
    );
}

export default MainHeader;
