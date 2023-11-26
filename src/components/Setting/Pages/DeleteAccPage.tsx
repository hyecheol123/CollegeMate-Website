/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

// Material UI
import { Box, IconButton, Typography, Button } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';

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
function DeleteAccountPage(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose } = props;

    return (
        <Box>
            {open ?
                <Box style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '10vh', left: '10vw', zIndex: 1, backgroundColor: 'white' }}>
                    <Box style={{ display: 'flex', flexDirection: 'row', }}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <ArrowIcon />
                        </IconButton>
                        <Typography variant="h2" color="red.main" align="center">Delete Account</Typography>
                    </Box>
                    <Box>Send Code</Box>

                    <Button variant="contained" onClick={handleClose} sx={buttonStyle}>
                        Next
                    </Button>
                </Box> : <></>}

        </Box>
    );
}

export default DeleteAccountPage;