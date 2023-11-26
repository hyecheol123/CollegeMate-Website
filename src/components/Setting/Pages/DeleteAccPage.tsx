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
    children: React.ReactNode;
}



/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component

 * @return {React.ReactElement} Renders Setting Page
 */
function DeleteAccountPage(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose, children } = props;

    const [menuClicked, setMenuClick] = React.useState<boolean>(false);

    return (
        <Box>
            {open ?
                <Box >
                    <IconButton aria-label="close" onClick={handleClose}>
                        <ArrowIcon />
                    </IconButton>
                    <Box>DeleteAcocunt Page</Box>

                </Box> : <></>}

        </Box>
    );
}

export default DeleteAccountPage;