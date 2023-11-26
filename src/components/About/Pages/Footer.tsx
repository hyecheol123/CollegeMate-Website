/**
 * Component for the last page of about page (Footer).
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Component
import ContentModal from './Footer/ContentModal';
import Loading from '../../Common/Loading/Loading';
// Custom Hook to Load AboutContext
import { useAboutContext } from '../AboutContext';
// API call
import getTnC from '../../../data/Common/getTnC';
// Global Style
import PageWrapperStyle from '../../Common/Styles/PageWrapper';
import LinkStyle from '../../Common/Styles/Link';

// Type for ModalType
type ModalType = 'terms' | 'privacy';

const linkStyle = { ...LinkStyle, marginRight: '20px' };
const titleBoxStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const linksContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

/**
 * React Functional Component for About page's last page
 * @return {React.ReactElement} Renders last page of about page
 */
function Footer(): React.ReactElement {
  // State
  const aboutContext = useAboutContext();
  // Set initial state for term of service and privacy policy
  const [termsContent, setTermsContent] = React.useState<string>('');
  const [privacyContent, setPrivacyContent] = React.useState<string>('');
  // Modal state
  const [modalType, setModalType] = React.useState<ModalType | undefined>();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isModalContentLoaded, setIsModalContentLoaded] =
    React.useState<boolean>(false);

  // Function to load TnC
  const loadModalContents = React.useCallback(async () => {
    if (!isModalContentLoaded) {
      const json = await getTnC();
      setTermsContent(json.content.termsAndConditions);
      setPrivacyContent(json.content.privacyAct);
      setIsModalContentLoaded(true);
    }
  }, [isModalContentLoaded]);

  // Event Handlers to open/close modal
  const openTnCModal = React.useCallback(async () => {
    setModalType('terms');
    await loadModalContents();
    setIsModalOpen(true);
    aboutContext.dispatch({ type: 'DISABLE_SCROLL' });
  }, [aboutContext, loadModalContents]);
  const openPAModal = React.useCallback(async () => {
    setModalType('privacy');
    loadModalContents();
    setIsModalOpen(true);
    aboutContext.dispatch({ type: 'DISABLE_SCROLL' });
  }, [aboutContext, loadModalContents]);
  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
    setModalType(undefined);
    aboutContext.dispatch({ type: 'ENABLE_SCROLL' });
  }, [aboutContext]);

  return (
    <Box sx={PageWrapperStyle}>
      <Box sx={titleBoxStyle}>
        <Typography variant="h1" color="red.main">
          Boost college life with CollegeMate
        </Typography>
      </Box>
      <Box>
        <Box sx={linksContainerStyle}>
          <Typography
            variant="body1"
            color="red.main"
            sx={linkStyle}
            onClick={openTnCModal}
          >
            Terms and Conditions
          </Typography>
          <Typography
            variant="body1"
            color="red.main"
            sx={linkStyle}
            onClick={openPAModal}
          >
            Privacy Policy
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ marginTop: '12px' }}>
          Contact: contact@collegemate.app
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '12px' }}>
          © 2023 CollegeMate. All Rights Reserved.
        </Typography>
      </Box>
      <ContentModal
        open={isModalOpen}
        handleClose={closeModal}
        title={
          modalType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'
        }
      >
        {isModalContentLoaded ? (
          <Typography variant="body1">
            {modalType === 'terms' ? termsContent : privacyContent}
          </Typography>
        ) : (
          <Loading />
        )}
      </ContentModal>
    </Box>
  );
}

export default React.memo(Footer);
