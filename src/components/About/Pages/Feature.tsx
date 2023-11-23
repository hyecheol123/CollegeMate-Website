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

/**
 * Interface for feature props
 */
interface IFeatureProps {
  title: string;
  body: string;
  pngImage: any;
  webpImage: any;
  avifImage: any;
  imageAlt: string;
}

/**
 * React Functional Component for About page's second page
 * @param {IFeatureProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders second page of about page
 */
function Feature(props: IFeatureProps): React.ReactElement {
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

  const pictureWrapperStyle = { flex: 1, mx: '5%' };
  const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '15px',
  };

  return (
    <Box
      sx={{
        ...PageWrapperStyle,
        flexDirection: isLandscape ? 'row' : 'column',
      }}
    >
      <Box sx={textContainerStyle} maxWidth={isLandscape ? '50%' : undefined}>
        <Typography variant="h1" color="red.main" align="center">
          {props.title}
        </Typography>
        <Typography variant="body1" align="center" mt="30px" mb="30px">
          {props.body}
        </Typography>
      </Box>
      <Box
        sx={{ ...pictureWrapperStyle, pb: isLandscape ? undefined : '15px' }}
      >
        <picture style={PictureStyle}>
          <source srcSet={props.avifImage} type="image/avif" />
          <source srcSet={props.webpImage} type="image/webp" />
          <Box
            sx={{ ...PictureStyle, objectFit: 'contain' }}
            component="img"
            src={props.pngImage}
            alt={props.imageAlt}
          />
        </picture>
      </Box>
    </Box>
  );
}

export default React.memo(Feature);
