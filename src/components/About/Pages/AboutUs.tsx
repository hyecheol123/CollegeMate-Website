/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React, { useState } from 'react';
import TeamMembers from './AboutUs/TeamMembers';
// Material UI
import { Box, Button, Typography, Dialog, DialogContent } from '@mui/material';
// Custom Hook to Load AboutContext
import { useAboutContext } from './../AboutContext';
// Global Style
import PageWrapperStyle from '../Styles/PageWrapper';

const contentWrapperStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  mx: '15px',
};
const buttonStyle = {
  marginTop: '20px',
};

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function AboutUs(): React.ReactElement {
  // State for managing Dialog open/close
  const [open, setOpen] = useState(false);
  const aboutContext = useAboutContext();

  // Event Handler
  const handleOpen = React.useCallback((): void => {
    setOpen(true);
    aboutContext.dispatch({ type: 'DISABLE_SCROLL' });
  }, [aboutContext]);
  const handleClose = React.useCallback((): void => {
    setOpen(false);
    aboutContext.dispatch({ type: 'ENABLE_SCROLL' });
  }, [aboutContext]);

  return (
    <Box
      sx={{
        ...PageWrapperStyle,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h1" color="red.main" align="center">
        About Our Team
      </Typography>
      <Box sx={contentWrapperStyle}>
        <Typography variant="body1" align="center">
          We are a passionate team dedicated to enhancing the college experience
          of University of Wisconsin-Madison students.
        </Typography>
        <Button variant="contained" onClick={handleOpen} sx={buttonStyle}>
          Meet Our Team
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="lg">
        <DialogContent>
          <TeamMembers onBack={handleClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default React.memo(AboutUs);
