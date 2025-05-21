/**
 * Test page
 * @author Joomyoung Park <joommm516@gmail.com>
 */

// React
import React, { useState } from 'react';
// Material UI
import { Button } from '@mui/material';
// Component
import HeaderButton from '../components/Common/HeaderButton/HeaderButton';
import DownloadPopup from '../features/Download Schedule/DownloadPopup';

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function Test(): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HeaderButton />
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ position: 'flex', top: '50%', left: '50%' }}
      >
        Open Popup
      </Button>
      {open && <DownloadPopup onClose={() => setOpen(false)} />}
    </>
  );
}

export default Test;
