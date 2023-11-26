/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
    Button,
    InputAdornment,
    TextField,
} from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';
// Custom Hook to use Context
// import { useGlobalContext } from './GlobalContext';
// Global Style
import PageWrapperStyle from '../../Common/Styles/PageWrapper';
// import LinkStyle from '../../Common/Styles/Link';
// import FilledPictureStyle from '../../Common/Styles/FilledPicture';

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

// My Info Data
//   const myInfoData = [
//     {
//       name: ,
//       nickName: ,
//       school: ,
//       major: ,
//       classStanding: ,
//     },
//     {
//       name: ,
//       nickName: ,
//       school: ,
//       major: ,
//       classStanding: ,
//     },
//     {
//       name: ,
//       nickName: ,
//       school: ,
//       major: ,
//       classStanding: ,
//     },
//   ];

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function MyInfoPage(props: SettingMenuProps): React.ReactElement {


    const { open, handleClose } = props;

    // Event Handlers for buttons
    const editInfoHandler = (() =>
        handleClose
    );

    return (
        <Box style={{ marginLeft: 'auto', marginRight: 'auto', width: '90vw', alignSelf: 'slef-start' }}>
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
                        alignItems: 'center',
                        height: '80vh',
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


                        <Box sx={{ marginTop: 'auto', }}>
                            <Button variant="contained" onClick={editInfoHandler} sx={buttonStyle}>
                                Edit
                            </Button>
                        </Box>
                    </Box>
                </Box> : <></>}

        </Box>
    );
}

export default MyInfoPage;
