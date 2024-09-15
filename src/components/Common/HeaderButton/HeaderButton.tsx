 /**
 * Globally used style for Main Header
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useEffect } from 'react';
// Material UI
import { Box, IconButton, Badge, Tooltip, SvgIconProps } from '@mui/material';
// Material UI Icon
import Menusharp from '@mui/icons-material/MenuSharp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// Assets
import CollegeMateLogoPng from '../../../../assets/logo.png';
import CollegeMateLogoWebp from '../../../../assets/logo.png?as=webp';
import CollegeMateLogAvif from '../../../../assets/logo.png?as=avif';
// Mocking Data
import getReceivedFriendRequests from '../../../data/Friend/getReceivedFriendRequests';

import MenuBar from '../MenuBar/MenuBar';

const titleStyle = {
  bgcolor: 'whiteGrey.main',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: '0.7em',
  px: '0.5em',
};
const logoStyle = {
  left: '50%',
  top: '0.75em',
  transform: 'translateX(-50%)',
};

const IconComponents = ({
  size,
  isFold = false, // Pass isFold directly
  friendRequestCount = 0,
}: {
  size: SvgIconProps['fontSize'];
  isFold?: boolean;
  friendRequestCount?: number; 
}): React.ReactElement => (
  <>
    <Tooltip title="Friends">
      <IconButton
        sx={{
          color: 'red.main',
          mr: isFold ? '0em' : '0.5em', // Conditional margin based on isFold
        }}
        aria-label="Friend"
      >
        <Badge badgeContent={friendRequestCount} color="error" showZero={false}>
          <PersonOutlineOutlinedIcon fontSize={size} />
        </Badge>
      </IconButton>
    </Tooltip>
  </>
);

/**
 * React Functional Component Main Header for Home Page
 * @return {React.ReactElement} Renders Main Header for Home Page
 */
function MainHeader(): React.ReactElement {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [friendRequestCount, setFriendRequestCount] = useState<number>(0);

  useEffect(() => {
    const handleResize = (): void => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Fetch friend requests 
    getReceivedFriendRequests().then((response) => {
      if (response.content?.friendRequests) {
        setFriendRequestCount(response.content.friendRequests.length);
      }
    });
  }, []); //TODO: Ask Jerry about how to implement the code to call this api call whenever friendRequestCount got changed


  const isMobile = windowWidth <= 480;
  const isFold = windowWidth < 300;

  const handleMenuToggle = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <Box sx={titleStyle}>
        <Tooltip title="Menu">
          <IconButton
            sx={{ color: 'red.main'}}
            aria-label="Menu"
            onClick={handleMenuToggle}
          >
            <Menusharp fontSize={isFold ? 'small' : 'medium'} />
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'initial',
          }}
        >
          {!isMobile && (
            <IconComponents
              size={isFold ? 'small' : 'medium'}
              isFold={isFold}
              friendRequestCount = {friendRequestCount}
            />
          )}

          <picture style={{ ...logoStyle, position: 'absolute' }}>
            <source srcSet={CollegeMateLogAvif} type="image/avif" />
            <source srcSet={CollegeMateLogoWebp} type="image/webp" />
            <img
              style={{ ...logoStyle, position: 'absolute' }}
              src={CollegeMateLogoPng}
              alt="CollegeMate Logo"
            />
          </picture>

          {isMobile && (
            <Box ml="auto">
              <IconComponents
                size={isFold ? 'small' : 'medium'}
                isFold={isFold}
                friendRequestCount = {friendRequestCount}
              />
            </Box>
          )}
        </Box>
      </Box>
      <MenuBar
        open={isMenuOpen}
        handleClose={handleMenuToggle}
        handleMyAnnouncement={() => console.log('My Announcements')}
        handleMySchedule={() => console.log('My scheudlers')}
        handleMyFriends={() => console.log('myfriends')}
        handleMyUW={() => console.log('myuw')}
        handleSettings={() => console.log('Setting')}
      />
    </>
  );
}

export default MainHeader; 