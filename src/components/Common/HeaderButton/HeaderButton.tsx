/**
 * Common Header Button Component with Logo and Notification
 * - Includes menu toggle, friend notification badge, and center-aligned logo
 * - Useful for minimal top bars in mobile or small layouts
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React from 'react';
import { Box, IconButton, Badge, Tooltip } from '@mui/material';
import MenuSharp from '@mui/icons-material/MenuSharp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CollegeMateLogoPng from '../../../../assets/logo.png';
import CollegeMateLogoWebp from '../../../../assets/logo.png?as=webp';
import CollegeMateLogAvif from '../../../../assets/logo.png?as=avif';
import type { HeaderButtonProps } from './types';

// Style for the entire header container
const titleStyle = {
  bgcolor: 'whiteGrey.main',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: '0.7em',
  px: '0.5em',
  position: 'relative',
};

// Style to center the logo absolutely within the header
const logoStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: '0.75em',
};

/**
 * HeaderButton Component
 * @param {HeaderButtonProps} props
 * - `onMenuOpen`: function to open the sidebar menu
 * - `friendRequestCount`: number of pending friend requests (used in badge)
 * - `showFriendIcon`: whether to show the friend icon on the right
 * @returns {React.ReactElement} A compact header UI element
 */
function HeaderButton({
  onMenuOpen,
  friendRequestCount = 0,
  showFriendIcon = true,
}: HeaderButtonProps): React.ReactElement {
  return (
    <Box sx={titleStyle}>
      <Tooltip title="Menu">
        <IconButton onClick={onMenuOpen} sx={{ color: 'red.main' }}>
          <MenuSharp />
        </IconButton>
      </Tooltip>

      {showFriendIcon && (
        <Box ml="auto">
          <Tooltip title="Friends">
            <IconButton sx={{ color: 'red.main' }}>
              <Badge badgeContent={friendRequestCount} color="error">
                <PersonOutlineOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <picture style={logoStyle}>
        <source srcSet={CollegeMateLogAvif} type="image/avif" />
        <source srcSet={CollegeMateLogoWebp} type="image/webp" />
        <img
          src={CollegeMateLogoPng}
          alt="CollegeMate Logo"
          style={{ height: '24px' }}
        />
      </picture>
    </Box>
  );
}

export default HeaderButton;
