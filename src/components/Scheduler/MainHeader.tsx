/**
 * Component for the Main Header for Home
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, IconButton, Badge } from '@mui/material';
// Material UI Icon
import Menusharp from '@mui/icons-material/Menusharp';
import NotificationNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// Assets
import CollegeMateLogoPng from '../../../assets/logo.png';
import CollegeMateLogoWebp from '../../../assets/logo.png?as=webp';
import CollegeMateLogAvif from '../../../assets/logo.png?as=avif';
// import FriendPng from "../../../assets/Friends.png"
// import FriendWebp from "../../../assets/Friends.png?as=webp"
// import FriendAvif from "../../../assets/Friends.png?as=avif"
// import NotificationPng from "../../../assets/Notification.png"
// import NotificationWebp from "../../../assets/Notification.png?as=webp"
// import NotificationAvif from "../../../assets/Notification.png?as=avif"

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

/**
 * React Functional Component Main Header for Home Page
 * @return {React.ReactElement} Renders Main Header for Home Page
 */
function MainHeader(): React.ReactElement {
  return (
    <Box sx={titleStyle}>
      <Box sx={{ flex: 1 }}>
        <IconButton sx={{ color: 'red.main' }} aria-label="Menu">
          <Menusharp />
        </IconButton>
        <IconButton sx={{ color: 'red.main' }} aria-label="Friend">
          <Badge badgeContent={4} color="error">
            <PersonOutlineOutlinedIcon sx={{ color: 'red.main' }} />
          </Badge>
        </IconButton>
        <IconButton sx={{ color: 'red.main' }} aria-label="Notification">
          <Badge badgeContent={4} color="error">
            <NotificationNoneSharpIcon sx={{ color: 'red.main' }} />
          </Badge>
        </IconButton>
        <picture style={{ ...logoStyle, position: 'absolute' }}>
          <source srcSet={CollegeMateLogAvif} type="image/avif" />
          <source srcSet={CollegeMateLogoWebp} type="image/webp" />
          <Box
            component="img"
            sx={{ ...logoStyle, position: 'absolute' }}
            src={CollegeMateLogoPng}
            alt="CollegeMate Logo"
          />
        </picture>
      </Box>
    </Box>
  );
}

export default MainHeader;
