/**
 * About Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
// Material UI Icons
// Components
import Slides from './components/About/Slides';
import { Box, Typography } from '@mui/material';
// Global Style

/**
 * React Functional Component to generate About page
 * @return {React.ReactElement} Renders About page
 */
function About(): React.ReactElement {
  return (
    <Slides
      components={[
        <Box
          sx={{
            backgroundColor: 'red.light',
            width: '100%',
            height: '100%',
            position: 'fixed',
          }}
        />,
        <Box
          sx={{
            backgroundColor: 'green.light',
            width: '100%',
            height: '100%',
            position: 'fixed',
          }}
        />,
        [
          <Box
            sx={{
              backgroundColor: 'yellow.light',
              width: '100%',
              height: '100%',
              position: 'fixed',
            }}
          >
            <Typography>HorizontalScroll</Typography>
          </Box>,
          <Box
            sx={{
              backgroundColor: 'grey.light',
              width: '100%',
              height: '100%',
              position: 'fixed',
            }}
          />,
        ],
      ]}
    />
  );
}

export default About;
