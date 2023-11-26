/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

// Material UI
import { Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';
import LabelIcon from '@mui/icons-material/Label';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


/**
 * Interface for ContentModalProps
 */
interface SettingMenuProps {
    open: boolean;
    handleClose: () => void;
}



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
                <Box style={{display: 'flex', position: 'absolute', top: '10vh', left: '10vw'}}>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <ArrowIcon />
                    </IconButton>
                    <Box>DeleteAcocunt Page</Box>

                </Box> : <></>}

        </Box>
    );
}

export default DeleteAccountPage;