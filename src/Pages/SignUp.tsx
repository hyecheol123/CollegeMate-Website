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
import SignUpCreatAccount from '../components/SignUp/View/SignUpCreatAccount';
// API call
import getTnC from '../data/Miscellaneous/getTnC';
import getMajorList from '../data/Miscellaneous/getMajorList';
import postCreateUser from '../data/User/postCreateUser';
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
  const [termsVersion, setTermsVersion] = React.useState<string>('');
  const [isTermsLoaded, setIsTermsLoaded] = React.useState<boolean>(false);
  // Step 1 - Privacy Act
  const [isPrivacyAgreed, setIsPrivacyAgreed] = React.useState<boolean>(false);
  const [privacyContent, setPrivacyContent] = React.useState<string>('');
  // Step 2 - Email Verification
  const [verifEmail, setVerifEmail] = React.useState<string>('');
  // Step 3 - Add Information
  const [tokenExpiresAfterSec, setTokenExpiresAfterSec] =
    React.useState<number>(-1);
  const [nickname, setNickname] = React.useState<string>('');
  const [major, setMajor] = React.useState<string>('');
  const [gradYear, setGradYear] = React.useState<number>(-1);
  const [majorList, setMajorList] = React.useState<string[]>([]);
  const [isMajorListLoaded, setIsMajorListLoaded] =
    React.useState<boolean>(false);
  // Step 4 - Success

  // Load Terms
  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!isTermsLoaded) {
        const jsonTnC = await getTnC();
        setTermsContent(jsonTnC.content.termsAndConditions);
        setPrivacyContent(jsonTnC.content.privacyAct);
        setTermsVersion(jsonTnC.version);
        setIsTermsLoaded(true);
      }
      if (!isMajorListLoaded) {
        const jsonMajorList = await getMajorList('wisc.edu');
        if (jsonMajorList.content?.majorList !== undefined) {
          setMajorList(jsonMajorList.content?.majorList);
        }
        setIsMajorListLoaded(true);
      }
    };
    loadData();
  }, [isMajorListLoaded, isTermsLoaded]);

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
        return verifEmail !== '';
      case 3:
        return (
          isMajorListLoaded &&
          nickname !== '' &&
          major !== '' &&
          gradYear !== -1
        );
      default:
        return false;
    }
  }, [
    step,
    isTermsLoaded,
    isTnCAgreed,
    isPrivacyAgreed,
    verifEmail,
    isMajorListLoaded,
    nickname,
    major,
    gradYear,
  ]);
  const moveStep = React.useCallback(async () => {
    if (ableToAdvanceStep()) {
      if (step === 3) {
        // API Call
        const postCreateUserResponse = await postCreateUser(
          verifEmail,
          nickname,
          major,
          gradYear,
          termsVersion,
        );
        if (postCreateUserResponse.responseCode === 201) {
          setStep(step + 1);
        } else {
          // TODO: Error Pop-Up
        }
      } else {
        setStep(step + 1);
      }
    }
  }, [
    ableToAdvanceStep,
    gradYear,
    major,
    nickname,
    step,
    termsVersion,
    verifEmail,
  ]);

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
          verifiedEmail={verifEmail}
          setVerifiedEmail={setVerifEmail}
          setTokenExpiresAfterSec={setTokenExpiresAfterSec}
        />
      )}
      {step === 3 && (
        <SignUpCreatAccount
          majorList={majorList}
          nickname={nickname}
          setNickname={setNickname}
          major={major}
          setMajor={setMajor}
          gradYear={gradYear}
          setGradYear={setGradYear}
        />
      )}
      <Box sx={footerButtonWrapperStyle}>
        <FooterButton onClick={moveStep} disabled={!ableToAdvanceStep()} />
      </Box>
    </Box>
  );
}

export default SignUp;
