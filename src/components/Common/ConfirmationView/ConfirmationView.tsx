/**
 * Component for the Confirmation View
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Assets
import CompletedPng from '../../../../assets/completed.png';
import CompletedWebp from '../../../../assets/completed.png?as=webp';
import CompletedAvif from '../../../../assets/completed.png?as=avif';

interface IConfirmationViewProps {
  message: string;
}

const pageWrapperStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

/**
 * Functional component representing the account creation confirmation.
 * @param {IConfirmationViewProps} props message that will be shown
 * @return {React.ReactElement} React component
 */
function ConfirmationView(props: IConfirmationViewProps): React.ReactElement {
  return (
    <Box sx={pageWrapperStyle}>
      <Box sx={{ textAlign: 'center' }}>
        <picture>
          <source srcSet={CompletedAvif} type="image/avif" />
          <source srcSet={CompletedWebp} type="image/webp" />
          <Box component="img" src={CompletedPng} alt="Completed Image" />
        </picture>
        <Typography mt={'16px'} variant="h2" color="darkGrey" align="center">
          {props.message}
        </Typography>
      </Box>
    </Box>
  );
}

export default ConfirmationView;
