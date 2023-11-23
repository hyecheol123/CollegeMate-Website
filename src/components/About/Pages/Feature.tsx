/**
 * Component for the second page of about page (Feature List).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Material UI Icons
// Components
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';
import PictureStyle from '../Styles/Picture';
// Assets
import feature1 from '../../../../assets/thumbnail_Feature1.png';

// Styles for portrait mode
const pictureWrapperStyle = { flex: 1, mx: '5%' };

const textContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  gap: '15px',
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
    getOrientation();
    window.addEventListener('resize', getOrientation);
    return () => window.removeEventListener('resize', getOrientation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        ...PageWrapperStyle,
        flexDirection: isLandscape ? 'row' : 'column',
      }}
    >
      <Box sx={textContainerStyle} maxWidth={isLandscape ? '50%' : undefined}>
        <Typography variant="h1" color="red.main" align="center">
          Customize Schedule
        </Typography>
        <Typography variant="body1" align="center" mt="30px" mb="30px">
          Customize your schedule effortlessly with CollegeMate - real-time data
          from UW's database at your fingertips. CollegeMate updates for you.
        </Typography>
      </Box>
      <Box
        sx={{ ...pictureWrapperStyle, pb: isLandscape ? undefined : '15px' }}
      >
        <Box
          sx={PictureStyle}
          component="img"
          src={feature1}
          alt="Mockup of Schedule Customization"
        />
      </Box>
    </Box>
  );
}

export default React.memo(Feature);
