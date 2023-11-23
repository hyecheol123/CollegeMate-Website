/**
 * Component for the second page of about page (Feature List).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
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
  minHeight: '100%',
  width: 0,
  minWidth: '100%',
  objectFit: 'contain',
};
// // Style for the image in landscape mode for a smaller size
// const imageStyleLandscape = {
//   maxWidth: '85%',
//   maxHeight: '400px',
//   height: 'auto',
//   width: 'auto',
// };

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

/**
 * React Functional Component for About page's second page
 * @return {React.ReactElement} Renders second page of about page
 */
function Feature(): React.ReactElement {
  // States
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);

  // Detect orientation of viewport
  const getOrientation = React.useCallback(() => {
    setIsLandscape(
      window.innerWidth > window.innerHeight && window.innerHeight < 500,
    );
  }, []);
  React.useEffect(() => {
    window.addEventListener('resize', getOrientation);
    return () => window.removeEventListener('resize', getOrientation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={isLandscape ? Page2WrapperLandscapeStyle : Page2WrapperStyle}>
      <Box sx={isLandscape ? textContainerStyle : undefined}>
        <Typography
          variant="h1"
          color="red.main"
          align="center"
          marginTop="30px"
        >
          Customize Schedule
        </Typography>
        <Typography variant="body1" align="center" marginTop="30px" mb="30px">
          Customize your schedule effortlessly with CollegeMate - real-time data
          from UW's database at your fingertips. CollegeMate updates for you.
        </Typography>
      </Box>
      <Box sx={isLandscape ? imageContainerStyle : pictureWrapperStyle}>
        <Box
          sx={pictureStyle}
          component="img"
          src={feature1}
          alt="Mockup of Schedule Customization"
        />
      </Box>
    </Box>
  );
}

export default React.memo(Feature);
