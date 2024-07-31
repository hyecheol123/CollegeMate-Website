/**
 * Globally used style for Menu Bar UI
 * @autor Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useEffect } from 'react';
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

/**
 * Interface for ContentModalProps
 */
interface HomeMenuProps {
  open: boolean;
  handleClose: () => void;
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
  boxSizing: 'border-box' as 'border-box',
};

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function MenuBar(props: HomeMenuProps): React.ReactElement {
  const { open, handleMySchedule, handleMyFriends, handleMyUW, handleSettings } = props;

  const barWidth = window.innerWidth <= 480 ? '100vw' : '400px';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // cleanup function to reset overflow property
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <Box>
      {open ? (
        <Box sx={{ ...MenuStyle, width: barWidth }}>
          <Typography
            variant="h2"
            color="red.main"
            style={{ marginBottom: '10px' }}
          >
            Hello, Andy!
          </Typography>
          <List
            sx={{ width: '100%'}} // 일단 맥스로 늘림.(to-do: ask jerry)
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton sx={{ width: '100%', marginBottom: '10px' }} onClick={handleMySchedule}>
              <ListItemText primary="My Schedules"  primaryTypographyProps={{ variant: 'body1' }}  />
              <ArrowForwardIosIcon fontSize="small" /> 
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{  width: '100%', marginBottom: '10px' }} onClick={handleMyFriends}>
              <ListItemText primary="My Friends" primaryTypographyProps={{ variant: 'body1' }}  />
              <ArrowForwardIosIcon fontSize="small" /> 
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{  width: '100%', marginBottom: '10px' }} onClick={handleMyUW}>
              <ListItemText primary="My Uw" primaryTypographyProps={{ variant: 'body1' }} />
              <ArrowForwardIosIcon fontSize="small" /> 
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{  width: '100%', marginBottom: '10px' }} onClick={handleSettings}>
              <ListItemText primary="Settings" primaryTypographyProps={{ variant: 'body1' }} />
              <ArrowForwardIosIcon fontSize="small" /> 
            </ListItemButton>
          </List>
        </Box>
      ) : null}
    </Box>
  );
}

export default MenuBar;
