/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

// Material UI
import { Box, IconButton, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';


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
function MyInfoPage(props: SettingMenuProps): React.ReactElement {
    const { open, handleClose } = props;

    return (
        <Box>
            {open ?
                <Box style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '10vh', left: '10vw', zIndex: 1, backgroundColor: 'white' }}>
                    <Box style={{ display: 'flex', flexDirection: 'row', }}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <ArrowIcon />
                        </IconButton>
                        <Typography variant="h2" color="red.main" align="center">My Information</Typography>
                    </Box>

                    <List
                        sx={{ width: '90%', marginLeft: '10%' }}
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

                </Box> : <></>}

        </Box>
    );
}

export default MyInfoPage;