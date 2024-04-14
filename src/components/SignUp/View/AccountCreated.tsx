/**
 * Component for the Account Created.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Assets
import CompletedPng from '../../../../assets/completed.png';
import CompletedWebp from '../../../../assets/completed.png?as=webp';
import CompletedAvif from '../../../../assets/completed.png?as=avif';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';

/**
 * Functional component representing the account creation confirmation.
 * @return {React.ReactElement} React component
 */
function AccountCreated(): React.ReactElement {
  return (
    <Box
      sx={{
        ...PageWrapperStyle,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <picture>
          <source srcSet={CompletedAvif} type="image/avif" />
          <source srcSet={CompletedWebp} type="image/webp" />
          <Box component="img" src={CompletedPng} alt="Completed png" />
        </picture>
        <Typography mt={'16px'} variant="h2" color="darkGrey" align="center">
          Account created
        </Typography>
      </Box>
    </Box>
  );
}

export default AccountCreated;
