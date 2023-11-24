/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState } from 'react';
import TeamMembers from './TeamMembers';
// Material UI
import { Box, Button, Typography, Dialog, DialogContent } from '@mui/material';

// Global Styles
const page3WrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 4,
  height: '100vh',
};

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function AboutUs(): React.ReactElement {
  // State for managing Dialog open/close
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  const handleBack = (): void => setOpen(false);

  return (
    <Box sx={page3WrapperStyle}>
      <Typography
        variant="h1"
        color="red.main"
        align="center"
        sx={{ position: 'absolute', top: '45px' }}
      >
        About Our Team
      </Typography>
      <Typography variant="body1" sx={{ mb: 5 }} align="center">
        We are a passionate team dedicated to enhancing the college experience
        of University of Wisconsin-Madison students.
      </Typography>
      <Button
        variant="contained"
        sx={{ textTransform: 'none' }}
        onClick={handleOpen}
      >
        Meet Our Team
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="lg">
        <DialogContent>
          <TeamMembers onBack={handleBack} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default React.memo(AboutUs);
