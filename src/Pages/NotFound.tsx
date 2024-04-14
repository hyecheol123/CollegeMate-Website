/**
 * NotFound Page
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Box, Button, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const PageWrapperStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

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
    <Box
      sx={{
        ...PageWrapperStyle,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          pt: '32px',
          pb: '16px',
        }}
      >
        <WarningAmberIcon
          color={'error'}
          fontSize="large"
          sx={{ fontSize: '8em' }}
        />
        <Typography variant="h1" color={'darkgrey'}>
          We could not find this page.
        </Typography>
        <Typography mt={'20px'} variant="h3" color={'darkgrey'}>
          But you can find plenty of other things in our homepage.
        </Typography>
        <Box mt={'36px'}>
          <Button onClick={handleButtonClick} variant="contained">
            Go to Homepage
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(NotFound);
