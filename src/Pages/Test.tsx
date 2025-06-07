/**
 * Test page
 * @author Joomyoung Park <joommm516@gmail.com>
 */

// React
import React, { useState } from 'react';
// Material UI
import { Box, Button } from '@mui/material';
// Component
import DownloadPopup from '../components/Schedule/Download/DownloadPopup';

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function Test(): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Popup
      </Button>
      {open && <DownloadPopup onClose={() => setOpen(false)} />}
    </Box>
  );
}

export default Test;
