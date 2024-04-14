/**
 * new TnC Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Typography } from '@mui/material';
// Components
// API call
// Global Styles

/**
 * React functional component to render newTnC page
 * @return {React.ReactElement} the entry point for NewTnC page
 */
function NewTnC(): React.ReactElement {
  // TODO: /newtnc to get new terms and privacy act consent
  // 1. Check validity of access (only users need to accept new terms and condition)
  // 2. Get terms and condition
  // 3. Get agreements
  // 4. Send API call to update the agreement and display confirmation

  return <Typography>New TnC</Typography>;
}

export default NewTnC;
