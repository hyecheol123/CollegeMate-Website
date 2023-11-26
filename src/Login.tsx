/**
 * Login Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Typography } from '@mui/material';

/**
 * React Functional Component to generate Login Page
 * @return {React.ReactElement} Renders Login Page
 */
function Login(): React.ReactElement {
  return (
    <Typography variant="h1" color="primary">
      Login
    </Typography>
  );
}

export default React.memo(Login);
