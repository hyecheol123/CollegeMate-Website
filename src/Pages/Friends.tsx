/**
 * Friends side menu Page
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React, { useState } from 'react';
// Material UI
import { Box, Drawer, List, ListItem, Typography, Divider, IconButton, TextField, InputAdornment } from '@mui/material';
// Material UI ICON
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
// Components
import MyFriends from '../components/Friends/View/MyFriends';
import FriendRequests from '../components/Friends/View/FriendRequests';
import MyRequests from '../components/Friends/View/MyRequest';
// API call
import getReceivedFriendRequests from '../data/Friend/getReceivedFriendRequests';
import getSentFriendRequests from '../data/Friend/getSentFriendRequests';
import postSendFriendRequest from '../data/Friend/postSendFriendRequest';

const pageWrapperStyle = {
    flex: 1,
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


function Friends({ open }: { open: boolean }): React.ReactElement {
    const [myFriends, setMyFriends] = useState(false);
    const [friendRequests, setFriendRequests] = useState(false);
    const [receivedRequests, setReceivedRequests] = React.useState<{ requestId: string; from: string; }[]>([]);
    const [myRequests, setMyRequests] = useState(false);
    const [sentRequests, setSentRequests] = React.useState<{ requestId: string; from: string; }[]>([]);
    const [email, setEmail] = useState('');

    const handleGoBack = () => {
        // Add logic to go back when clicked
    };

    const handleMyFriends = () => {
        setMyFriends(true);
    };
    const handleFriendRequests = () => {
        setFriendRequests(true);
    };
    const handleMyRequests = () => {
        setMyRequests(true);
    };

    // Search exact email
    const handleSearch = async () => {
        try {
            const response = await postSendFriendRequest(email);
            if (response.responseCode === 201) {
                console.log('Friend request sent successfully');
            } else if (response.responseCode === 404) {
                console.log('User not found');
            } else if (response.responseCode === 409) {
                console.log('User is already a friend');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleEnter = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Load friends list
    React.useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const jsonRequestList = await getReceivedFriendRequests();
                const jsonSentList = await getSentFriendRequests();
                if (jsonRequestList.content?.friendRequests !== undefined) {
                    setReceivedRequests(jsonRequestList.content?.friendRequests);
                }
                if (jsonSentList.content?.friendRequests !== undefined) {
                    setSentRequests(jsonSentList.content?.friendRequests);
                }
            } catch (error) {
                console.error('Error loading received friend requests:', error);
            }
        };
        loadData();
    }, []);

    return (
        <Box sx={{ ...pageWrapperStyle }}>
            <Drawer
                sx={{ ...drawerStyle }}
                variant="persistent"
                anchor="left"
                open={true}
            >
                <Box alignItems="center" display="flex" width={'100%'} >
                    <IconButton
                        sx={{ color: 'whiteGray.main' }}
                        aria-label="back"
                        onClick={handleGoBack}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant='h2' color={'red.main'}>Friends</Typography>
                </Box>
                <Box alignItems="center" display="flex" justifyContent={'center'} >
                    <List sx={{ width: '340px' }}>

                        {/* My Friends */}
                        <ListItem onClick={handleMyFriends} sx={{ margin: '10px', width: '100%' }}>
                            <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                                <Typography variant='h3' fontWeight={500} color={'red.main'}>My Friends</Typography>
                                <IconButton
                                    sx={{ color: 'whiteGray.main', }}
                                    aria-label="forward"
                                >
                                    <ArrowForwardIosIcon fontSize='small' />
                                </IconButton>
                            </Box>
                        </ListItem>
                        {<MyFriends myFriends={myFriends} setMyFriends={setMyFriends} />}
                        <Divider />

                        {/* Friend Requests */}
                        <ListItem onClick={handleFriendRequests} sx={{ margin: '10px', width: '100%' }}>
                            <Box display="flex" justifyContent="space-between" flexDirection={'column'} width="100%">
                                <Typography variant='h3' fontWeight={500} color={'red.main'}>Friend Requests</Typography>
                                {receivedRequests.length === 0 ? (
                                    <Typography variant='body2'>No request found</Typography>
                                ) : (
                                    <Typography variant='body2'>{`You have ${receivedRequests.length} requests`}</Typography>
                                )}
                            </Box>
                        </ListItem>
                        {<FriendRequests friendRequests={friendRequests} setFriendRequests={setFriendRequests} receivedRequests={receivedRequests} />}
                        <Divider />

                        {/* My Requests */}
                        <ListItem onClick={handleMyRequests} sx={{ margin: '10px', width: '100%' }}>
                            <Box display="flex" justifyContent="space-between" flexDirection={'column'} width="100%">
                                <Typography variant='h3' fontWeight={500} color={'red.main'}>My Requests</Typography>
                                {sentRequests.length === 0 ? (
                                    <Typography variant='body2'>No request found</Typography>
                                ) : (
                                    <Typography variant='body2'>{`You have sent ${sentRequests.length} requests`}</Typography>
                                )}
                            </Box>
                        </ListItem>
                        {<MyRequests myRequests={myRequests} setMyRequests={setMyRequests} receivedRequests={receivedRequests} />}
                        <Divider />

                        {/* Add Friends */}
                        <ListItem sx={{ margin: '10px', width: '100%' }}>
                            <Box display="flex" flexDirection="column" width="100%">
                                <Typography variant="h3" fontWeight={500} color="red.main">Add Friends</Typography>
                                <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                                    <TextField
                                        label="Search by Friend Name"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleSearch}>
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="standard"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleEnter}
                                    />
                                </Box>
                            </Box>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Friends;
