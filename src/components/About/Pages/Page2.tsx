/**
 * Component for the second page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useState, useEffect } from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Assets
import feature1 from '../../../../assets/thumbnail_Feature1.png';

// Styles for portrait mode
const pictureWrapperStyle = { flex: 1 };
const pictureStyle = {
  margin: 'auto',
  display: 'block',
  height: 0,
  minHeight: '90%',
  width: 0,
  minWidth: '90%',
  objectFit: 'contain' as const,
};

const Page2WrapperStyle = {
  maxWidth: '700px',
  margin: 'auto',
  height: '100%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
};

// Styles for landscape mode
const Page2WrapperLandscapeStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '1200px',
  margin: 'auto',
  height: '100%',
};

const textContainerStyle = {
  maxWidth: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
};

const imageContainerStyle = {
  maxWidth: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

// Style for the image in landscape mode for a smaller size
const imageStyleLandscape = {
  maxWidth: '85%',
  maxHeight: '400px',
  height: 'auto',
  width: 'auto',
};

/**
 * React Functional Component for About page's second page
 * @return {React.ReactElement} Renders second page of about page
 */
function Page2(): React.ReactElement {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLandscape = windowSize.width > windowSize.height && windowSize.height < 500;

  return (
    <Box sx={isLandscape ? Page2WrapperLandscapeStyle : Page2WrapperStyle}>
      <Box sx={isLandscape ? textContainerStyle : {}}>
        <Typography variant="h1" color="red.main" align="center" marginTop="30px">
          Customize Schedule
        </Typography>
        <Typography variant="body1" align="center" marginTop="30px" mb="30px">
        Customize your schedule effortlessly with CollegeMate - real-time data from UW's database at your fingertips. CollegeMate updates for you.
        </Typography>
      </Box>
      <Box sx={isLandscape ? imageContainerStyle : pictureWrapperStyle}>
        <img
          src={feature1}
          alt="Mockup of Schedule Customization"
          style={isLandscape ? imageStyleLandscape : pictureStyle}
        />
      </Box>
    </Box>
  );
}

export default React.memo(Page2);
