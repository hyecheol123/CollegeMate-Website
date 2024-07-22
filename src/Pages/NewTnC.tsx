/**
 * new TnC Page
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Box } from '@mui/material';
// Custom Hook to use Context
import { useGlobalContext } from '../GlobalContext';
// Components
import TermsConsentView from '../components/Common/TermsConsentView/TermsConsentView';
import Header from '../components/NewTnC/Header';
import ConfirmationView from '../components/Common/ConfirmationView/ConfirmationView';
import Modal from '../components/Common/Modal/Modal';
import FooterButton from '../components/Common/FooterButton/FooterButton';
// API call
import getTnC from '../data/Miscellaneous/getTnC';
import postAcceptNewTnC from '../data/User/postAcceptNewTnC';

const pageWrapperStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const footerButtonWrapperStyle = {
  width: '100%',
  paddingLeft: '15px',
  paddingRight: '15px',
  paddingBottom: '10px',
};

/**
 * React functional component to render newTnC page
 * @returns {React.ReactElement} the entry point for NewTnC page
 */
function NewTnC(): React.ReactElement {
  // States
  const [step, setStep] = React.useState<number>(0);
  const [initiated, setInitiated] = React.useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  // Step 0 - Terms and Conditions
  const [isTnCAgreed, setIsTnCAgreed] = React.useState<boolean>(false);
  const [termsContent, setTermsContent] = React.useState<string>('');
  const [termsVersion, setTermsVersion] = React.useState<string>('');
  const [isTermsLoaded, setIsTermsLoaded] = React.useState<boolean>(false);
  // Step 1 - Privacy Act
  const [isPrivacyAgreed, setIsPrivacyAgreed] = React.useState<boolean>(false);
  const [privacyContent, setPrivacyContent] = React.useState<string>('');
  // Step 2 - Success

  // Check validity of access (only users need to accept new terms and condition)
  React.useEffect(() => {
    if (!initiated) {
      if (!globalContext.newTnC) {
        navigate('/');
      }
      setInitiated(true);
    }
  }, [initiated, globalContext.newTnC, navigate]);

  // Load Terms
  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (initiated && !isTermsLoaded) {
        const jsonTnC = await getTnC();
        setTermsContent(jsonTnC.content.termsAndConditions);
        setPrivacyContent(jsonTnC.content.privacyAct);
        setTermsVersion(jsonTnC.version);
        setIsTermsLoaded(true);
      }
    };
    loadData();
  }, [isTermsLoaded, initiated]);

  // Helper method to advance step
  const ableToAdvanceStep = React.useCallback((): boolean => {
    switch (step) {
      case 0:
        return isTermsLoaded && isTnCAgreed;
      case 1:
        return isTermsLoaded && isPrivacyAgreed;
      case 2:
        return true;
      default:
        return false;
    }
  }, [step, isTermsLoaded, isTnCAgreed, isPrivacyAgreed]);

  const moveStep = React.useCallback(async () => {
    if (ableToAdvanceStep()) {
      if (step === 1) {
        // Completed sign up
        const postAcceptNewTnCResponse = await postAcceptNewTnC(
          globalContext.email,
          termsVersion,
        );
        if (postAcceptNewTnCResponse.responseCode === 200) {
          setStep(step + 1);
          globalContext.dispatch({ type: 'UNSET_NEW_TNC' });
          localStorage.removeItem('SET_NEW_TNC');
        } else {
          setModalIsOpen(true);
        }
      } else if (step === 2) {
        // Completed New TnC Accept
        navigate('/');
      } else {
        setStep(step + 1);
      }
    }
  }, [ableToAdvanceStep, navigate, termsVersion, step, globalContext]);

  const handleModalClose = React.useCallback(() => {
    setModalIsOpen(false);
    navigate('/');
  }, [navigate]);

  return (
    <Box sx={pageWrapperStyle}>
      <Header />
      {step === 0 && (
        <TermsConsentView
          isLoaded={isTermsLoaded}
          title="Terms and Conditions"
          content={termsContent}
          checkboxHelperText="I agree to the terms and conditions."
          accepted={isTnCAgreed}
          setAccepted={setIsTnCAgreed}
        />
      )}
      {step === 1 && (
        <TermsConsentView
          isLoaded={isTermsLoaded}
          title="Privacy Policy"
          content={privacyContent}
          checkboxHelperText="I agree to the privacy policy."
          accepted={isPrivacyAgreed}
          setAccepted={setIsPrivacyAgreed}
        />
      )}
      {step === 2 && (
        <ConfirmationView message="Completed All Terms and Condition" />
      )}
      <Box sx={footerButtonWrapperStyle}>
        <FooterButton onClick={moveStep} disabled={!ableToAdvanceStep()} />
      </Box>
      <Modal
        isOpen={modalIsOpen}
        handleClose={handleModalClose}
        message={'Something went wrong. Please retry or contact admin.'}
      />
    </Box>
  );
}

export default NewTnC;
