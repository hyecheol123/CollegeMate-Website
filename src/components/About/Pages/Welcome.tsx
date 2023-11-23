/**
 * Component for the first page of about page (Welcome).
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Button, Typography } from '@mui/material';
// Material UI Icons
// Components
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';
import PictureStyle from '../Styles/Picture';
// Assets
import MockupImageWebp from '../../../../assets/landing_page_mockup.png?as=webp';
import MockupImagePng from '../../../../assets/landing_page_mockup.png';

const pictureWrapperStyle = { flex: 1, mx: '5%', py: '15px' };
const buttonWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  mt: '15px',
  mb: '8px',
};

/**
 * React Functional Component for About page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function Welcome(): React.ReactElement {
  return (
    <Box sx={PageWrapperStyle}>
      <Typography variant="h1" color="red.main" align="center" mb="15px">
        Boost college life with CollegeMate
      </Typography>
      <Box sx={pictureWrapperStyle}>
        <picture style={PictureStyle}>
          <source srcSet={MockupImageWebp} type="image/webp" />
          <Box
            sx={{ ...PictureStyle, objectFit: 'contain' }}
            component="img"
            src={MockupImagePng}
            alt="Mockup of CollegeMate"
          />
        </picture>
      </Box>
      <Box sx={buttonWrapperStyle}>
        <Button variant="contained">Log In</Button>
        <Button variant="contained" color="whiteGrey">
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(Welcome);
