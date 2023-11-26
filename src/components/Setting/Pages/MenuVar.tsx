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

// Global Styles
import MenuStyle from '../Styles/Menu';
import MenuSubStyle from '../Styles/MenuSub';
/**
 * Interface for ContentModalProps
 */
interface SettingMenuProps {
    open: boolean;
    handleClose: () => void;
    handleMyInfo: () => void;
    handleDelAcc: () => void;
    handleLogOut: () => void;
}



/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component

 * @return {React.ReactElement} Renders Setting Page
 */
function MenuVar(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose, handleMyInfo, handleDelAcc, handleLogOut} = props;

    // const [menuClicked, setMenuClick] = React.useState<boolean>(false);

    return (
        <Box>
            {open ?
                <Box sx={MenuStyle}>
                    <Box style={{
                        display: "flex",
                        flexDirection: 'row', 
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <ArrowIcon />
                        </IconButton>
                        <Box>Setting</Box></Box>

                    <Box sx={MenuSubStyle}>
                        <Box onClick={handleMyInfo}>My Information</Box>
                        <Box onClick={handleDelAcc}>Delete Account</Box>
                        <Box onClick={handleLogOut}>Log Out</Box>
                    </Box>

                </Box> : <></>}

        </Box>
    );
}

export default MenuVar;
