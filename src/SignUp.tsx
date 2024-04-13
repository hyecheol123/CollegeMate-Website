/**
 * Signup Page
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Components
import SignUpTerms from './components/SignUp/Pages/SignUpTerms';
import Header from './components/SignUp/Header';
import CreateAccount from './components/SignUp/Pages/CreateAccount';
// API call
import getTnC from './data/Common/getTnC';
// Global Styles
import PageWrapperStyle from './components/SignUp/Styles/PageWrapper';

/**
 * React functional component to render signUp page
 * @return {React.ReactElement} the entry point for About page
 */
function SignUp(): React.ReactElement {
  // State
  // For Terms
  const [isTnCAgreed, setIsTnCAgreed] = React.useState<boolean>(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = React.useState<boolean>(false);
  const [termsContent, setTermsContent] = React.useState<string>('');
  const [privacyContent, setPrivacyContent] = React.useState<string>('');
  const [isTermsLoaded, setIsTermsLoaded] = React.useState<boolean>(false);
  // Step 0 - Terms and Conditions
  // Step 1 - Privacy Act
  // Step 2 - Email Verification
  // Step 3 - Add Information
  // Step 4 - Success
  const [step, setStep] = React.useState<number>(0);

  // Load Terms
  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!isTermsLoaded) {
        const json = await getTnC();
        setTermsContent(json.content.termsAndConditions);
        setPrivacyContent(json.content.privacyAct);
        setIsTermsLoaded(true);
      }
    };
    loadData();
  }, [isTermsLoaded]);

  // Helper method to advance step
  const moveStep = React.useCallback(() => {
    // TODO: Validation Check
    setStep(step + 1);
  }, [step]);

  return (
    <Box sx={{ ...PageWrapperStyle }}>
      <Header />
      {step === 0 && (
        <SignUpTerms
          isLoaded={isTermsLoaded}
          title="Terms and Conditions"
          content={termsContent}
          checkboxHelperText="I agree to the terms and conditions."
          accepted={isTnCAgreed}
          setAccepted={setIsTnCAgreed}
        />
      )}
      {step === 1 && (
        <SignUpTerms
          isLoaded={isTermsLoaded}
          title="Privacy Policy"
          content={privacyContent}
          checkboxHelperText="I agree to the privacy policy."
          accepted={isPrivacyAgreed}
          setAccepted={setIsPrivacyAgreed}
        />
      )}
      {step === 2 && (
        <CreateAccount/>
      )}
    </Box>
  );
}

export default SignUp;
