/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

// Material UI
import { Modal, Box, Button, IconButton } from '@mui/material';
// import ArrowIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Interface for ContentModalProps
 */
interface SettingMenuProps {
    open: boolean;
    handleClose: () => void;
}

const buttonStyle = {
    marginTop: '20px',
    width: '60%',
};

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function LogOutAlert(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose } = props;

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        height: '30%',
        maxHeight: '90%',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        justifyContent: 'space-between',
        background: '#ffffff',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
    };

    return (
        <Box>
            {open ?
                <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                        <IconButton aria-label="close" onClick={handleClose} style={{ alignSelf: 'flex-end' }}>
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ aligh: 'center', }}>Are you sure you want to log out?</Box>
                        <Button variant="contained" onClick={handleClose} sx={buttonStyle}>
                            Log Out
                        </Button>
                    </Box>
                </Modal>
                : <></>}

        </Box>
    );
}

export default LogOutAlert;