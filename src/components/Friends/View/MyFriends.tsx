/**
 *  My friends list
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Drawer, List, ListItem, Typography, Divider, IconButton, Button } from '@mui/material';
// Material UI Icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// API call
import getFriendList from '../../../data/Friend/getFriendList';
import deleteFriend from '../../../data/Friend/deleteFriend';

interface IProps {
    myFriends: boolean;
    setMyFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const drawerStyle = {
    width: '100%',
    '& .MuiDrawer-paper': {
        width: '100%',
        '@media (min-width: 800px)': {
            width: 400,
        },
    },
};

const buttonStyle = {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
};

/**
 * React functional component to render friends list 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Boolean value indicating whether the side menu is open or closed
 * @return {React.ReactElement} the entry point for my friends page
 */
function MyFriends(props: IProps): React.ReactElement {
    const [friends, setFriends] = React.useState<string[]>([]);
    const [editMode, setEditMode] = React.useState<boolean>(false);

    // Load friends list
    React.useEffect(() => {
        const loadData = async (): Promise<void> => {
            if (props.myFriends) {
                const jsonFriendList = await getFriendList();
                if (jsonFriendList.content?.friendList !== undefined) {
                    setFriends(jsonFriendList.content?.friendList);
                }
            }
        };
        loadData();
    }, [props.myFriends]);

    // Go back to menu
    const handleGoBack = () => {
        props.setMyFriends(false);
    };

    // Enable editing
    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    // Delete the friend from the list
    const handleDeleteFriend = async (index: number) => {
        try {
            const base64Email = btoa(friends[index]); 
            await deleteFriend(base64Email);
            const updatedFriends = [...friends];
            updatedFriends.splice(index, 1);
            setFriends(updatedFriends);
        } catch (error) {
            console.error('Failed to delete friend:', error);
        }
    };

    return (
        <Drawer
            sx={{ ...drawerStyle }}
            variant="persistent"
            anchor="left"
            open={props.myFriends}
        >
                <Box alignItems="center" display="flex" width={'100%'} >
                <IconButton
                    sx={{ color: 'whiteGray.main' }}
                    aria-label="back"
                    onClick={handleGoBack}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant='h2' color={'red.main'}>My Friends</Typography>
            </Box>
            <Box alignItems="center" display="flex" justifyContent="center">
                <List sx={{ width: '340px' }}>
                    {friends.map((friend, index) => (
                        <Box key={index}>
                            <ListItem sx={{ margin: '10px', width: '100%' }}>
                                {editMode && (
                                    <IconButton onClick={() => handleDeleteFriend(index)}>
                                        <RemoveCircleOutlineIcon color='error' fontSize='small'/>
                                    </IconButton>
                                )}
                                <Typography variant="h3" fontWeight={500} color="darkGrey.main" >{friend}</Typography>
                            </ListItem>
                            {index !== friends.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </Box>
            <Box sx={{ ...buttonStyle }}>
                <Button
                    variant= {editMode ? "contained" : "outlined"}
                    color="primary"
                    sx={{ width: '100%', maxWidth: '240px' }}
                    onClick={handleEditClick} // Toggle edit mode
                >
                    {editMode ? 'save' : 'edit'} {/* Change button label based on edit mode */}
                </Button>
            </Box>
        </Drawer>
    );
}

export default MyFriends;
