/**
 * Friends Request Page
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Drawer, List, ListItem, Typography, Divider, IconButton, Button } from '@mui/material';
// Material UI Icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// API call
import deleteFriendRequest from '../../../data/Friend/deleteFriendRequest';
import postAcceptFriendRequest from '../../../data/Friend/postAcceptFriendRequest';

interface IProps {
    friendRequests: boolean;
    setFriendRequests: React.Dispatch<React.SetStateAction<boolean>>;
    receivedRequests: { requestId: string; from: string; }[];
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
function FriendRequests(props: IProps): React.ReactElement {

    const handleGoBack = () => {
        props.setFriendRequests(false);
    };

    // Define function to accept friend request
    async function handleAccept(requestId: string): Promise<void> {
        try {
            // Make API call to accept friend request
            const response = await postAcceptFriendRequest(requestId);
            if (response.responseCode === 200) {
                // Update UI or state to reflect successful acceptance
            } else {
                console.log("Error: API does not response")
            }
        } catch (error) {
            console.log("Error: API does not response")
        }
    }

    // Define function to delete friend request
    async function handleDelete(requestId: string): Promise<void> {
        try {
            // Make API call to delete friend request
            const response = await deleteFriendRequest(requestId);
            if (response.responseCode === 200) {
                // Update UI or state to reflect successful deletion
            } else {
                // Handle error or display error message
            }
        } catch (error) {
            // Handle network error
        }
    }
    return (
        <Drawer
            sx={{ ...drawerStyle }}
            variant="persistent"
            anchor="left"
            open={props.friendRequests}
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
                    {props.receivedRequests.map((request, index) => (
                        <Box key={index}>
                            <ListItem sx={{ margin: '10px', width: '100%' }}>
                                <Box display={"flex"} flexDirection={'column'} width='100%'>
                                    <Typography variant="h3" fontWeight={500} color="darkGrey.main" >{request.from}</Typography>
                                    <Box mt='12px' display={"flex"} flexDirection={'row'} gap={'12px'} justifyContent='center'>
                                        <Button variant="contained" color="primary" onClick={() => handleAccept(request.requestId)} sx={{ width: '100%' }}>Accept</Button>
                                        <Button variant="outlined" color="error" onClick={() => handleDelete(request.requestId)} sx={{ width: '100%' }}>Delete</Button>
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

export default FriendRequests;
