/**
 * Component for the Main Header for Home
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useEffect } from 'react';
// Material UI
import { Box, IconButton, Badge, Tooltip } from '@mui/material';
// Material UI Icon
import Menusharp from '@mui/icons-material/Menusharp';
import NotificationNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// Assets
import CollegeMateLogoPng from '../../../assets/logo.png';
import CollegeMateLogoWebp from '../../../assets/logo.png?as=webp';
import CollegeMateLogAvif from '../../../assets/logo.png?as=avif';

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

// A component for the icon
const IconComponents = (): React.ReactElement => (
  <>
    <Tooltip title="Friends">
      <IconButton sx={{ color: 'red.main', mr: '0.5em' }} aria-label="Friend">
        <Badge badgeContent={4} color="error">
          <PersonOutlineOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
    <Tooltip title="Notifications">
      <IconButton sx={{ color: 'red.main' }} aria-label="Notification">
        <Badge badgeContent={4} color="error">
          <NotificationNoneSharpIcon />
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

  useEffect(() => {
    const handleResize = (): void => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 480;

  return (
    <Box sx={titleStyle}>
      <Tooltip title="Menu">
        <IconButton sx={{ color: 'red.main', mr: '0.5em' }} aria-label="Menu">
          <Menusharp />
        </IconButton>
      </Tooltip>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: isMobile ? 'space-between' : 'initial',
        }}
      >
        {!isMobile && <IconComponents />}

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
            <IconComponents />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MainHeader;
