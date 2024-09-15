/**
 * My friends request Page
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Drawer, List, ListItem, Typography, Divider, IconButton, Button } from '@mui/material';
// Material UI Icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// API call
import deleteSentFriendRequests from '../../../data/Friend/deleteSentFriendRequest';

interface IProps {
    myRequests: boolean;
    setMyRequests: React.Dispatch<React.SetStateAction<boolean>>;
    sentRequests: { requestId: string; from: string; }[];
}

const pageWrapperStyle = {
    display: 'flex',
};

const drawerStyle = {
    width: '100%',
    '& .MuiDrawer-paper': {
        width: '100%',
        '@media (min-width: 800px)': {
            width: 400,
        },
    },
};

/**
 * React functional component to render side menu for friends list 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Boolean value indicating whether the side menu is open or closed
 * @return {React.ReactElement} the entry point for friends page
 */
function MyRequests(props: IProps): React.ReactElement {

    const handleGoBack = () => {
        props.setMyRequests(false);
    };

    // Define function to delete sent friend request
    async function handleCancel(requestId: string): Promise<void> {
        try {
            // Make API call to delete sent friend request
            const response = await deleteSentFriendRequests(requestId);
            if (response.responseCode === 200) {
                // Update UI or state to reflect successful deletion
            } else {
                console.log("Error: API does not response")
            }
        } catch (error) {
            console.log("Error: API does not response")
        }
    }
    return (
        <Drawer
            sx={{ ...drawerStyle }}
            variant="persistent"
            anchor="left"
            open={props.myRequests}
        >
            <Box alignItems="center" display="flex" width={'100%'} >
                <IconButton
                    sx={{ color: 'whiteGray.main' }}
                    aria-label="back"
                    onClick={handleGoBack}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant='h2' color={'red.main'}>Friend Requests</Typography>
            </Box>
            <Box alignItems="center" display="flex" justifyContent="center">
                <List sx={{ width: '340px' }}>
                    {props.sentRequests.map((request, index) => (
                        <Box key={index}>
                            <ListItem sx={{ margin: '10px', width: '100%' }}>
                                <Box display={"flex"} flexDirection={'column'} width='100%'>
                                    <Typography variant="h3" fontWeight={500} color="darkGrey.main" >{request.from}</Typography>
                                    <Box mt='12px' display={"flex"} flexDirection={'row'} gap={'12px'} justifyContent='center'>
                                        <Button variant="contained" color="error" onClick={() => handleCancel(request.requestId)} sx={{ width: '100%' }}>Cancel Request</Button>
                                    </Box>
                                </Box>
                            </ListItem>
                            {index !== request.from.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </Box>

        </Drawer>
    );
}

export default MyRequests;
