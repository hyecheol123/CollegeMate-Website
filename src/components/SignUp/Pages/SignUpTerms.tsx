// React
import React from 'react';
// Material UI
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';

// Global Styles
import PageWrapperSignupStyle from '../Styles/PageWrapper';
import TermsStyle from '../Styles/Terms';
import CheckBoxStyle from '../Styles/Checkbox';
import ButtonStyle from '../Styles/Button';

const TitleStyle = { bgcolor: '#F7F7F7' };
/**
 * React Functional Component for About page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function SignUpTerms(): React.ReactElement {
  return (
    <Box sx={PageWrapperSignupStyle}>
        <Box sx={TitleStyle}>
            <Typography variant="h1" color="red.main" align="center" mb="15px">
                College Mate
            </Typography>
        </Box>
        <Box sx={TermsStyle}>
            <Typography variant="h3" align="center" mb="15px">
                기다려 하는 중이야.
            </Typography>
        </Box>
        <Box sx={CheckBoxStyle}>
            <FormControlLabel control={<Checkbox />} label="I agree to the terms and conditions." />
        </Box>
        <Box sx={ButtonStyle}>
            <Button variant="contained">Next</Button>
        </Box>
    </Box>
  );
}

export default SignUpTerms;
