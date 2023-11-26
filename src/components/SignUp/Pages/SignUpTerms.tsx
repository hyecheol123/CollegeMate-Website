/**
 * Component for the first page of signup page (SignUpTerms).
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';

// Material UI
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';

// Global Styles
import PageWrapperSignupStyle from '../Styles/PageWrapper';
import TermsStyle from '../Styles/Terms';
import CheckBoxStyle from '../Styles/Checkbox';
import ButtonStyle from '../Styles/Button';

// Components
import Header from './Header/Header';

// API call
import getTnC from '../../../data/About/getTnC';

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
  const fetchData = React.useCallback(async () => {
    const json = await getTnC();
    if (!termsAgreed && !privacyAgreed) {
      setContent(json.content.termsAndConditions);
    } else if (termsAgreed && !privacyAgreed) {
      setContent(json.content.privacyAct);
    }
  }, [termsAgreed, privacyAgreed]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNextClick = (): void => {
    if (termsAgreed && !privacyAgreed) {
      // first Next button clicked
      setPrivacyAgreed(true);
    } else if (termsAgreed && privacyAgreed) {
      // Second Next button clicked
      console.log('User has agreed all!');
      // Need to navigate to the next step
    } else {
      // User has not agreed, show a message or handle accordingly
      console.log('User has not agreed!');
      alert('You has not agreed!');
    }
    fetchData();
  };

  const handleTermsCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setTermsAgreed(event.target.checked);
    console.log('User has agreed the terms and conditions!');
  };

  const handlePrivacyCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPrivacyAgreed(event.target.checked);
    console.log('User has agreed the the privacy policy!');
  };

  return (
    <Box sx={PageWrapperSignupStyle}>
      <Header />
      <Box sx={TermsStyle}>
        <Typography variant="h3" align="left" mb="5px">
          {content}
        </Typography>
      </Box>
      <Box sx={CheckBoxStyle}>
        {!privacyAgreed && (
          <FormControlLabel
            control={<Checkbox onChange={handleTermsCheckboxChange} />}
            label="I agree to the terms and conditions."
          />
        )}
        {privacyAgreed && (
          <FormControlLabel
            control={<Checkbox onChange={handlePrivacyCheckboxChange} />}
            label="I agree to the privacy policy."
          />
        )}
      </Box>
      <Box sx={ButtonStyle}>
        <Button
          variant="contained"
          onClick={handleNextClick}
          sx={{ width: '30%', height: '90%' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default SignUpTerms;
