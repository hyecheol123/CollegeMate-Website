/**
 * Globally used style for Menu Bar UI
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useEffect } from 'react';
// Material UI
import {
  Box,
  IconButton,
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
interface SettingMenuProps {
  open: boolean;
  handleClose: () => void;
  handleMyInfo: () => void;
  handleDelAcc: () => void;
  handleLogOut: () => void;
}

const MenuStyle = {
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height:'100%',
  transition: '300ms',
  zIndex: 3,
  position: 'absolute',
};

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function MenuBar(props: SettingMenuProps): React.ReactElement {
  const { open, handleClose, handleMyInfo, handleDelAcc, handleLogOut } = props;

  const barWidth = window.innerWidth <= 480 ? '100vw' : '400px';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // cleanup function to reset overflow property.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <Box>
      {open ? (
        <Box sx={MenuStyle} style={{ width: barWidth }}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              padding: '10px 30px'
            }} 
          >
            <Typography
              variant="h2"
              color="red.main"
              style={{ alignSelf: 'flex-start', marginTop: '10px' }}
            >
              Hello, Andy!
            </Typography>
          </Box>
          <List
            sx={{ width: barWidth ? '360px' : '120px' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handleMyInfo}>
              <ListItemText primary="My Schedules" />
              <IconButton aria-label="navigate" onClick={handleMyInfo}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleDelAcc}>
              <ListItemText primary="My Friends" />
              <IconButton aria-label="navigate" onClick={handleDelAcc}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogOut}>
              <ListItemText primary="My Uw" />
              <IconButton aria-label="navigate" onClick={handleLogOut}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogOut}>
              <ListItemText primary="Settings" />
              <IconButton aria-label="navigate" onClick={handleLogOut}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>

          </List>
        </Box>
      ) : (
        <Box sx={MenuStyle} style={{ width: '0px' }}>
          <Box sx={MenuStyle} style={{ width: '0px' }} />
        </Box>
      )}
    </Box>
  );
}

export default MenuBar;