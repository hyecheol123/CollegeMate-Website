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
 * MockHome (MainScheduler) page used for visual testing of header and sidebar
 * @returns {React.ReactElement} Temporary layout container with header
 */
function MainScheduler(): React.ReactElement {
  // const [title, setTitle] = useState('Daekyun');
  const title = 'Daekyun';

  const sidebarItems: SidebarMenuItem[] = [
    { label: 'My Schedule', onClick: () => alert('Go to My Schedule') },
    { label: 'My Friends', onClick: () => alert('Go to Friends') },
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

export default MainScheduler;
