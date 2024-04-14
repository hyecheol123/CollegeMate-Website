/**
 * Component for general modal components
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal as MUIModal,
  Typography,
} from '@mui/material';

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  message: string;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '500px',
  p: 1,
  border: '2px solid black',
  borderRadius: '5px',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

/**
 * General modal component for CollegeMate
 * @param {ModalProps} props Props for this modal
 * @return {React.ReactElement} Modal/Pop-ups
 */
function Modal(props: ModalProps): React.ReactElement {
  return (
    <MUIModal
      open={props.isOpen}
      onClose={props.handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={props.isOpen}>
        <Box sx={modalStyle}>
          <Typography variant="body1" align="center">
            {props.message}
          </Typography>
          <Button>Close</Button>
        </Box>
      </Fade>
    </MUIModal>
  );
}

export default Modal;
