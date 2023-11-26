/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 * refered this link: https://mui.com/material-ui/react-list/#simple-list
 * Description: This file contains all the components of Side Menu of Setting page. 
 *              It gets properties from parent page(SettingPage.tsx)
 */


// React
import React from 'react';

// Material UI
import { Box, IconButton, List, ListItemButton, ListItemText, Divider, Typography} from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


// Global Styles
import MenuStyle from '../Styles/Menu';

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
    const { open, handleClose, handleMyInfo, handleDelAcc, handleLogOut } = props;

    return (
        <Box>
            {open ?
                <Box sx={MenuStyle}>
                    <Box style={{
                        display: "flex",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <IconButton aria-label="close" onClick={handleClose} style={{alignSelf: "flex-start"}}>
                            <ArrowIcon />
                        </IconButton>
                        <Typography variant="h2" color="red.main" align="center">Setting</Typography>
                    </Box>
                    <List
                        sx={{ width: '90%', marginLeft: '10%' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <ListItemButton onClick={handleMyInfo}>
                            <ListItemText primary="My Information" />
                            <IconButton aria-label="close" onClick={handleMyInfo}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={handleDelAcc}>

                            <ListItemText primary="Delete Account" />
                            <IconButton aria-label="close" onClick={handleDelAcc}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={handleLogOut}>
                            <ListItemText primary="Log Out" />
                            <IconButton aria-label="close" onClick={handleLogOut}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </ListItemButton>
                    </List>
                </Box>
                :  <Box style={{ height: '95vh', width: '0vw', backgroundColor: '#FFFFFF',display: 'flex', }}/>}
        </Box>
    );
}

export default MenuVar;
