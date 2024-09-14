/**
 * Globally used style for Menu Bar UI
 * @autor Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useEffect, useState } from 'react';
// Material UI
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Mocking
import getRenewToken from '../../../data/Authentication/getRenewToken';
import getUserProfile from '../../../data/Friend/getUserProfile';

/**
 * Interface for ContentModalProps
 */
interface HomeMenuProps {
  open: boolean;
  handleClose: () => void;
  handleMyAnnouncement: () => void;
  handleMySchedule: () => void;
  handleMyFriends: () => void;
  handleMyUW: () => void;
  handleSettings: () => void;
}

const MenuStyle = {
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  height: '100%',
  transition: '300ms',
  zIndex: 3,
  position: 'absolute',
  padding: '20px 20px',
  boxSizing: 'border-box' as const,
};

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function MenuBar(props: HomeMenuProps): React.ReactElement {
  const {
    open,
    handleMyAnnouncement,
    handleMySchedule,
    handleMyFriends,
    handleMyUW,
    handleSettings,
  } = props;
  const [nickname, setNickname] = useState<string>('');
  const barWidth = window.innerWidth <= 480 ? '100vw' : '400px';

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        const tokenResponse = await getRenewToken();
        const email = tokenResponse.content.email;
        const userProfile = await getUserProfile(email);

        if (userProfile.content) {
          setNickname(userProfile.content.nickname);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    if (open) {
      // if sidebar open, then deactivate the schedule ui scroll
      document.body.style.overflow = 'hidden';
      if (!nickname) {
        fetchUserProfile();
      }
    } else {
      document.body.style.overflow = 'auto';
    }

    // cleanup function
    return (): void => {
      document.body.style.overflow = 'auto';
    };
  }, [open, nickname]);

  return (
    <Box>
      {open ? (
        <Box sx={{ ...MenuStyle, width: barWidth }}>
          <Typography
            variant="h2"
            color="red.main"
            style={{ marginBottom: '10px' }}
          >
            Hello, {nickname}!
          </Typography>
          <List
            sx={{ width: '100%' }} 
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <Divider />
            <ListItemButton
              sx={{ width: '100%' }}
              onClick={handleMyAnnouncement}
            >
              <ListItemText
                primary="Announcements"
                primaryTypographyProps={{ variant: 'body1' }}
              />
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ width: '100%' }} onClick={handleMySchedule}>
              <ListItemText
                primary="My Schedules"
                primaryTypographyProps={{ variant: 'body1' }}
              />
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ width: '100%' }} onClick={handleMyFriends}>
              <ListItemText
                primary="My Friends"
                primaryTypographyProps={{ variant: 'body1' }}
              />
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ width: '100%' }} onClick={handleMyUW}>
              <ListItemText
                primary="My Uw"
                primaryTypographyProps={{ variant: 'body1' }}
              />
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ width: '100%' }} onClick={handleSettings}>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ variant: 'body1' }}
              />
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemButton>
          </List>
        </Box>
      ) : null}
    </Box>
  );
}

export default MenuBar;
