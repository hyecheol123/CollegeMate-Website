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
import Header from '../components/SignUp/Header';
import FooterButton from '../components/SignUp/FooterButton';
import SignUpTerms from '../components/SignUp/View/SignUpTerms';
import SignUpEmail from '../components/SignUp/View/SignUpEmail';
// API call
import getTnC from '../data/Common/getTnC';
// Global Styles
import PageWrapperStyle from '../components/SignUp/Styles/PageWrapper';

const footerButtonWrapperStyle = {
  width: '100%',
  paddingLeft: '15px',
  paddingRight: '15px',
  paddingBottom: '10px',
};

/**
 * React functional component to render signUp page
 * @return {React.ReactElement} the entry point for About page
 */
function SignUp(): React.ReactElement {
  // State
  const [step, setStep] = React.useState<number>(0);
  // Step 0 - Terms and Conditions
  const [isTnCAgreed, setIsTnCAgreed] = React.useState<boolean>(false);
  const [termsContent, setTermsContent] = React.useState<string>('');
  const [isTermsLoaded, setIsTermsLoaded] = React.useState<boolean>(false);
  // Step 1 - Privacy Act
  const [isPrivacyAgreed, setIsPrivacyAgreed] = React.useState<boolean>(false);
  const [privacyContent, setPrivacyContent] = React.useState<string>('');
  // Step 2 - Email Verification
  const [verifiedEmail, setVerifiedEmail] = React.useState<string>('');
  // Step 3 - Add Information
  const [tokenExpiresAfterSec, setTokenExpiresAfterSec] =
    React.useState<number>(-1);
  // Step 4 - Success

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

  // Timeout for Token
  React.useEffect(() => {
    let timeout: any;
    if (tokenExpiresAfterSec > 0) {
      timeout = setTimeout(() => {
        setTokenExpiresAfterSec(tokenExpiresAfterSec - 1);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [tokenExpiresAfterSec]);

  // Helper method to advance step
  const ableToAdvanceStep = React.useCallback((): boolean => {
    switch (step) {
      case 0:
        return isTermsLoaded && isTnCAgreed;
      case 1:
        return isTermsLoaded && isPrivacyAgreed;
      case 2:
        return verifiedEmail !== '';
      default:
        return false;
    }
  }, [isPrivacyAgreed, isTermsLoaded, isTnCAgreed, step, verifiedEmail]);
  const moveStep = React.useCallback(() => {
    if (ableToAdvanceStep()) {
      setStep(step + 1);
    }
  }, [ableToAdvanceStep, step]);

  return (
    <Box sx={PageWrapperStyle}>
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
        <SignUpEmail
          verifiedEmail={verifiedEmail}
          setVerifiedEmail={setVerifiedEmail}
          setTokenExpiresAfterSec={setTokenExpiresAfterSec}
        />
      )}
      <Box sx={footerButtonWrapperStyle}>
        <FooterButton onClick={moveStep} disabled={!ableToAdvanceStep()} />
      </Box>
    </Box>
  );
}

export default SignUp;
