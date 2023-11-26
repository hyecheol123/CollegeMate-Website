/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

// Material UI
import { Modal, Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// Style
import ModalStyle from '../Styles/Modal';

/**
 * Interface for ContentModalProps
 */
interface SettingMenuProps {
    open: boolean;
    handleClose: () => void;
    logOut: () => void;
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
    const { open, handleClose, logOut} = props;

    return (
        <Box>
            {open &&
                <Modal open={open} onClose={handleClose}>
                    <Box sx={ModalStyle}>
                        <IconButton aria-label="close" onClick={handleClose} style={{ alignSelf: 'flex-end' }}>
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ aligh: 'center', }}>Are you sure you want to log out?</Box>
                        <Button variant="contained" onClick={logOut} sx={buttonStyle}>
                            Log Out
                        </Button>
                    </Box>
                </Modal>
                }

        </Box>
    );
}

export default LogOutAlert;