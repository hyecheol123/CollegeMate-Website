// React
import React from 'react';

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
import ArrowIcon from '@mui/icons-material/ArrowBack';
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
  height: '95vh',
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

  return (
    <Box>
      {open ? (
        <Box sx={MenuStyle} style={{ width: '33vw' }}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              marginLeft: '5vw',
              marginTop: '2vh',
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ alignSelf: 'flex-start' }}
            >
              <ArrowIcon />
            </IconButton>
            <Typography
              variant="h2"
              color="red.main"
              align="center"
              style={{ marginLeft: '2%' }}
            >
              Setting
            </Typography>
          </Box>
          <List
            sx={{ width: '28vw', marginLeft: '5vw' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handleMyInfo}>
              <ListItemText primary="My Information" />
              <IconButton aria-label="close" onClick={handleMyInfo}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleDelAcc}>
              <ListItemText primary="Delete Account" />
              <IconButton aria-label="close" onClick={handleDelAcc}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogOut}>
              <ListItemText primary="Log Out" />
              <IconButton aria-label="close" onClick={handleLogOut}>
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemButton>
          </List>
        </Box>
      ) : (
        <Box sx={MenuStyle} style={{ width: '0vw' }}>
          <Box sx={MenuStyle} style={{ width: '0vw' }} />
        </Box>
      )}
    </Box>
  );
}

export default MenuBar;
