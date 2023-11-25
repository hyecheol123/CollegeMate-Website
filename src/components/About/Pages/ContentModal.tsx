/**
 * Component for the second page of about page (Feature List).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React from 'react';
// Material UI
import { Modal, Box, Typography, IconButton } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';

/**
 * Interface for ContentModalProps
 */
interface ContentModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Function component for content modal.
 * @param {ContentModalProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} The content modal as a React element for the last page of About.
 */
function ContentModal(props: ContentModalProps): React.ReactElement {
  const { open, handleClose, title, children } = props;
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    maxHeight: '90%',
    overflowY: 'auto',
    borderRadius: '10px',
    padding: '24px',
    background: '#ffffff',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
  };

  const contentStyle = {
    mt: '20px',
    flexGrow: 1,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton aria-label="close" onClick={handleClose}>
            <ArrowIcon />
          </IconButton>
          <Typography variant="h2" color="red.main" align="center">
            {title}
          </Typography>
          {/* Empty Box to balance the flex container */}
          <Box style={{ width: '48px' }}></Box>
        </Box>
        <Typography id="modal-description" sx={contentStyle}>
          {children}
        </Typography>
      </Box>
    </Modal>
  );
}

export default ContentModal;
