/**
 * Component for the second page of about page (Feature List).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React from 'react';
// Material UI
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Backdrop,
  Fade,
} from '@mui/material';
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
    width: '90%', // Set width to 90% of the viewport
    height: '90%', // Set height to 90% of the viewport
    maxHeight: '90%', // Ensure the modal does not exceed 90% of the viewport height
    overflowY: 'auto', // Enable scrolling for overflowing content
    borderRadius: '10px',
    padding: '24px',
    background: '#ffffff',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
  };

  const contentStyle = {
    mt: 2,
    flexGrow: 1, // Allows the content to grow and fill the space
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              left: '10px',
              top: '19px',
            }}
          >
            <ArrowIcon />
          </IconButton>
          <Typography variant="h2" color="red.main" align="center">
            {title}
          </Typography>
          <Typography id="modal-description" sx={contentStyle}>
            {children}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ContentModal;
