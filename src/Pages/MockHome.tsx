/**
 * Temporary Main Home for testing layout components
 * @author Daekyun Kim
 */

// React
import React from 'react';
// MUI
import { Box } from '@mui/material';
// Components
import MainHeader from '../components/Common/MainHeader/MainHeader';
import type { SidebarMenuItem } from '../components/Common/SidebarMenu/types';

/**
 * MockHome (MockHome) page used for visual testing of header and sidebar
 * @returns {React.ReactElement} Temporary layout container with header
 */
function MockHome(): React.ReactElement {
  const title = 'Daekyun';

  const sidebarItems: SidebarMenuItem[] = [
    { label: 'My Schedule', onClick: () => alert('Go to My Schedule') },
    { label: 'My Friends', onClick: () => alert('Go to Friends') },
    { label: 'My UW', onClick: () => alert('Go to my UW') },
    { label: 'University of Wisconsin-Madison', onClick: () => alert('Go to UW-Madison Website') },
    { label: 'Settings', onClick: () => alert('Go to Settings') },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MainHeader title={title} menuItems={sidebarItems} />
    </Box>
  );
}

export default MockHome;
