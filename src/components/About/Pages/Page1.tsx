/**
 * Component for the first page of about page.
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
// Assets
import MockupImagePng from '../../../../assets/landing_page_mockup.png';

const pictureWrapperStyle = { flex: 1, mx: '5%' };
const pictureStyle = {
  margin: 'auto',
  display: 'block',
  height: 0,
  minHeight: '100%',
  width: 0,
  minWidth: '100%',
  objectFit: 'contain',
};
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
function Page1(): React.ReactElement {
  return (
    <Box sx={PageWrapperStyle}>
      <Typography variant="h1" color="red.main" align="center" mb="15px">
        Boost college life with CollegeMate
      </Typography>
      <Box sx={pictureWrapperStyle}>
        <picture>
          <source srcSet={ MockupImagePng } type="image/webp" />
          <Box
            sx={pictureStyle}
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

export default React.memo(Page1);
