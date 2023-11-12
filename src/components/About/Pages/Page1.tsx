/**
 * Component for the first page of about page.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Material UI Icons
// Components
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';
// Assets

/**
 * React Functional Component for About page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function Page1(): React.ReactElement {
  return (
    <Box sx={{ ...PageWrapperStyle, backgroundColor: 'darkGrey.light' }} />
  );
}

export default React.memo(Page1);
