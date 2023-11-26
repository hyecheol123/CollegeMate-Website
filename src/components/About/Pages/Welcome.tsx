/**
 * Component for the first page of about page (Welcome).
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Box, Button, Typography } from '@mui/material';
// Material UI Icons
// Components
// Global Styles
import PageWrapperStyle from '../../Common/Styles/PageWrapper';
import PictureStyle from '../../Common/Styles/FilledPicture';
import ButtonWrapperStyle from '../Styles/ButtonWrapper';
// Assets
import MockupImageWebp from '../../../../assets/landing_page_mockup.png?as=webp';
import MockupImagePng from '../../../../assets/landing_page_mockup.png';
import MockUpImageAvif from '../../../../assets/landing_page_mockup.png?as=avif';

const pictureWrapperStyle = { flex: 1, mx: '5%', py: '15px' };

/**
 * React Functional Component for About page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function Welcome(): React.ReactElement {
  const navigate = useNavigate();

  // Button Click Event Handler
  const onLoginClick = React.useCallback(() => navigate('/login'), [navigate]);
  const onSignupClick = React.useCallback(
    () => navigate('/signup'),
    [navigate],
  );

  return (
    <Box sx={PageWrapperStyle}>
      <Typography variant="h1" color="red.main" align="center" mb="15px">
        Boost college life with CollegeMate
      </Typography>
      <Box sx={pictureWrapperStyle}>
        <picture style={PictureStyle}>
          <source srcSet={MockUpImageAvif} type="image/avif" />
          <source srcSet={MockupImageWebp} type="image/webp" />
          <Box
            sx={{ ...PictureStyle, objectFit: 'contain' }}
            component="img"
            src={MockupImagePng}
            alt="Mockup of CollegeMate"
          />
        </picture>
      </Box>
      <Box sx={ButtonWrapperStyle}>
        <Button
          variant="contained"
          onClick={onLoginClick}
          sx={{ textTransform: 'none' }}
        >
          Log In
        </Button>
        <Button
          variant="contained"
          color="whiteGrey"
          onClick={onSignupClick}
          sx={{ textTransform: 'none' }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(Welcome);
