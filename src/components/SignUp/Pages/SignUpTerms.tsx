// React
import React from 'react';
// Material UI
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';

// Global Styles
import PageWrapperSignupStyle from '../Styles/PageWrapper';
import TermsStyle from '../Styles/Terms';
import CheckBoxStyle from '../Styles/Checkbox';
import ButtonStyle from '../Styles/Button';
import CollegeMateLogo from '../../../../assets/lg3 1.png'
import TitleStyle from '../Styles/Title';

/**
 * React Functional Component for About page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function SignUpTerms(): React.ReactElement {
  return (
    <Box sx={PageWrapperSignupStyle}>
        <Box sx={TitleStyle}> 
            <Box component="img"
            src={CollegeMateLogo}
            alt="Mockup of CollegeMateLogo"></Box>
        </Box>
        <Box sx={TermsStyle}>
            <Typography variant="h3" align="center" mb="15px">
               {}
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
