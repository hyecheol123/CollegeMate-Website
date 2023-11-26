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
    width: '30vw',
};


/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function DeleteAccountPage(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose } = props;

    return (
        <Box sx={{marginLeft:'5vw', width: '90vw',}}>
            {open ?
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    zIndex: 1, backgroundColor: 'white',
                    alignItems: 'center', 
                }}>
                    <Box sx={{ alignSelf: 'flex-start', height: '10vh' }}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <ArrowIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height:'80vh',
                        paddingBottom: '10vh',
                    }}>
                    <Typography variant="h2" color="red.main" align="center">Delete Account</Typography>

                    <Box>Send Code</Box>

                    <Button variant="contained" onClick={handleClose} sx={buttonStyle}>
                        Next
                    </Button>
                    </Box>
                </Box> : <></>}

        </Box>
    );
}

export default DeleteAccountPage;