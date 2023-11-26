/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

// Material UI
import { Box, IconButton, List, ListItem, ListItemText, Divider, Typography, Button } from '@mui/material';
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
function MyInfoPage(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose } = props;

    return (
        <Box sx={{ marginLeft: '10vw', width: '80vw', }}>
            {open ?
                <Box style={{
                    display: 'flex', flexDirection: 'column',
                    zIndex: 1, backgroundColor: 'white',
                    alignItems: 'center',
                }}>
                    <Box sx={{ alignSelf: 'flex-start', height: '5vh', marginTop: '2vh', }}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <ArrowIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column',
                        // justifyContent: '',
                        alignItems: 'center',
                        height: '80vh',
                        marginTop: '0vh',
                    }}>
                        <Typography variant="h2" color="red.main" align="center">My Information</Typography>
                        <List
                            sx={{ width: '100%' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            <ListItem >
                                <ListItemText primary="Name" />
                            </ListItem>
                            <Divider />
                            <ListItem >
                                <ListItemText primary="Nick Name" />
                            </ListItem>
                            <Divider />
                            <ListItem >
                                <ListItemText primary="School" />
                            </ListItem>
                            <Divider />
                            <ListItem >
                                <ListItemText primary="Major" />
                            </ListItem>
                            <Divider />
                            <ListItem >
                                <ListItemText primary="Class Standing" />
                            </ListItem>
                        </List>


                        <Box sx={{ marginTop: 'auto',  }}>
                            <Button variant="contained" onClick={handleClose} sx={buttonStyle}>
                                Edit
                            </Button>
                        </Box>
                    </Box>
                </Box> : <></>}

        </Box>
    );
}

export default MyInfoPage;