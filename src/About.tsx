/**
 * About Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Material UI Icons
// Components
import Slides from './components/About/Slides';
import Page1 from './components/About/Pages/Page1';
// Global Style

/**
 * React Functional Component to generate About page
 * @return {React.ReactElement} Renders About page
 */
function About(): React.ReactElement {
  return (
    <Slides
      components={[
        <Page1 />,
        [
          <Box
            sx={{
              backgroundColor: 'yellow.light',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography>Feature1 (Horizontal Slide)</Typography>
          </Box>,
          <Box
            sx={{
              backgroundColor: 'grey.light',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography>Feature2 (Horizontal Slide)</Typography>
          </Box>,
          <Box
            sx={{
              backgroundColor: 'red.light',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography>Feature3 (Horizontal Slide)</Typography>
          </Box>,
        ],
        <Box
          sx={{
            backgroundColor: 'green.light',
            width: '100%',
            height: '100%',
          }}
        />,
        <Box
          sx={{
            backgroundColor: 'whiteGrey.light',
            width: '100%',
            height: '100%',
          }}
        />,
      ]}
    />
  );
}

export default About;
