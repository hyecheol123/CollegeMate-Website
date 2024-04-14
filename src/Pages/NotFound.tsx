/**
 * NotFound Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Box, Button, Typography } from '@mui/material';

/**
 * React functional component to render NotFound page
 * @return {React.ReactElement} the entry point for NotFound page
 */
function NotFound(): React.ReactElement {
  // State
  const navigate = useNavigate();

  // Button Click Handler
  const handleButtonClick = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Box>
      <Typography variant="h1">404 Icon placeholder</Typography>
      <Typography variant="h1">We could not find this page.</Typography>
      <Typography variant="h3">
        But you can find plenty of other things in our homepage.
      </Typography>
      <Button onClick={handleButtonClick} variant="contained">
        Go to Homepage
      </Button>
    </Box>
  );
}

export default React.memo(NotFound);
