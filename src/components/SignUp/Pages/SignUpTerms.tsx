// React
import React from 'react';
// Material UI
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';

// Global Styles
import PageWrapperSignupStyle from '../Styles/PageWrapper';
import TermsStyle from '../Styles/Terms';
import CheckBoxStyle from '../Styles/Checkbox';
import ButtonStyle from '../Styles/Button';
import TitleStyle from '../Styles/Title';

// API call
import getTnC from '../../../data/About/getTnC';

// Assets
import CollegeMateLogo from '../../../../assets/lg3 1.png'

/**
 * React Functional Component for SignUp page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function SignUpTerms(): React.ReactElement {
    // Set initial state for term of service and privacy policy
    const [termsAgreed, setTermsAgreed] = React.useState<boolean>(false);
    const [privacyAgreed, setPrivacyAgreed] = React.useState<boolean>(false);
    const [content, setContent] = React.useState<string>('');

    // Function to load terms TnC
    React.useEffect(() => {
        const fetchData = async () => {
            const json = await getTnC();
            setContent(json.content.termsAndConditions);
        };
        fetchData();
    }, []);

    const handleNextClick = () => {
        if (termsAgreed && !privacyAgreed) {
            // User has agreed terms, show privacy content
            const fetchData = async () => {
                const json = await getTnC();
                setContent(json.content.privacyAct);
            };
            setPrivacyAgreed(true);
            fetchData();
        } else if (termsAgreed && privacyAgreed) {
            console.log("User has agreed all!");
            // Need to navigate to the next step
        } else {
            // User has not agreed, show a message or handle accordingly
            console.log("User has not agreed!");
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAgreed(event.target.checked);
    };

    return (
        <Box sx={PageWrapperSignupStyle}>
            <Box sx={TitleStyle}>
                <Box component="img"
                    src={CollegeMateLogo}
                    alt="Mockup of CollegeMateLogo"></Box>
            </Box>
            <Box sx={TermsStyle}>
                <Typography variant="h3" align="center" mb="15px">
                    {content}
                </Typography>
            </Box>
            <Box sx={CheckBoxStyle}>
                {!privacyAgreed ? <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} />} label="I agree to the terms and conditions." />
                    : <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} />} label="I agree to the privacy policy." />}
            </Box>
            <Box sx={ButtonStyle}>
                <Button variant="contained" onClick={handleNextClick} sx={{ width: '30%', height: '90%' }}>Next</Button>
            </Box>
        </Box>
    );
}

export default SignUpTerms;
