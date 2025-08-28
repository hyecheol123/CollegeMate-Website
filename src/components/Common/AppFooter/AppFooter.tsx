/**
 * Main App Footer Component
 * Displays disclaimer in header-style format
 * @author Claude Code Assistant
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

const footerContainerStyle = {
  width: '100%',
  backgroundColor: 'whiteGrey.main',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50px',
  paddingLeft: { xs: '12px', md: '24px', xl: '42px' },
  paddingRight: { xs: '12px', md: '24px', xl: '42px' },
  marginTop: 'auto',
};

/**
 * AppFooter component that displays legal disclaimer in header style
 * @returns {React.ReactElement} The rendered footer component
 */
function AppFooter(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={footerContainerStyle}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'darkGrey.main',
            fontSize: '10px',
          }}
        >
          CollegeMate is unaffiliated with UW-Madison
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'darkGrey.main',
            fontSize: '10px',
            marginTop: '2px',
          }}
        >
          © {currentYear} CollegeMate. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default AppFooter;
