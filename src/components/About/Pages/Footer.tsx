/**
 * Component for the last page of about page (Footer).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React, { useState, useEffect, useMemo } from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Import Statements
import ContentModal from './ContentModal';
import PrivacyPolicyContent from '../../../../assets/FooterContent/PrivacyPolicyContent';
import TermsOfServiceContent from '../../../../assets/FooterContent/TermsOfServiceContent';
/**
 * Interface for WindowSize
 */
interface WindowSize {
  width: number;
  height: number;
}

// Type for ModalType
type ModalType = 'terms' | 'privacy';

/**
 * React Functional Component for About page's last page
 * @return {React.ReactElement} Renders last page of about page
 */
function Footer(): React.ReactElement {
  // Set initial state for window dimensions
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = (): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Call handleResize immediately to set the initial size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Modal state
  const [openModal, setOpenModal] = useState<{
    terms: boolean;
    privacy: boolean;
  }>({
    terms: false,
    privacy: false,
  });

  // Event Handlers
  const handleOpenModal = (modalType: ModalType): void => {
    setOpenModal({ ...openModal, [modalType]: true });
  };

  const handleCloseModal = (modalType: ModalType): void => {
    setOpenModal({ ...openModal, [modalType]: false });
  };

  const footerStyle = useMemo(
    () => ({
      position: 'absolute',
      left: 0,
      top: '40%',
      transform: 'translateY(-50%)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      p: windowSize.width < 600 || windowSize.height < 600 ? 1.8 : 4,
    }),
    [windowSize.width, windowSize.height],
  );

  const titleBoxStyle = {
    maxWidth: 'calc(100% - 30px)', // Adjust the 30px based on the figma design
    wordBreak: 'break-word',
  };

  const bottomLinksStyle = useMemo(
    () => ({
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      p: windowSize.width < 600 || windowSize.height < 600 ? 1.8 : 4,
      mb: 1,
    }),
    [windowSize.width, windowSize.height],
  );

  const linksContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const linkStyle = {
    marginRight: 2,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  };

  const contactStyle = {
    mt: 1.5,
  };

  return (
    <>
      <Box sx={footerStyle}>
        <Box sx={titleBoxStyle}>
          <Typography variant="h1" color="red.main">
            Boost college life with CollegeMate
          </Typography>
        </Box>
      </Box>
      <Box sx={bottomLinksStyle}>
        <Box sx={linksContainerStyle}>
          <Typography
            variant="body1"
            color="red.main"
            sx={linkStyle}
            onClick={() => handleOpenModal('terms')}
          >
            Terms of Service
          </Typography>
          <Typography
            variant="body1"
            color="red.main"
            sx={linkStyle}
            onClick={() => handleOpenModal('privacy')}
          >
            Privacy Policy
          </Typography>
        </Box>
        <Typography variant="body2" sx={contactStyle}>
          Contact: contact@collegemate.app
        </Typography>
        <Typography variant="body2" sx={contactStyle}>
          © 2023 CollegeMate. All Rights Reserved.
        </Typography>
      </Box>
      <ContentModal
        open={openModal.terms}
        handleClose={() => handleCloseModal('terms')}
        title="Terms and Conditions"
      >
        <TermsOfServiceContent />
      </ContentModal>
      <ContentModal
        open={openModal.privacy}
        handleClose={() => handleCloseModal('privacy')}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </ContentModal>
    </>
  );
}

export default React.memo(Footer);
