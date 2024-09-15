/**
 * Friends Drawer Page
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React, { useState } from "react";
// Material UI
import { Box, Drawer, List, ListItem, Typography, Divider, IconButton, TextField, InputAdornment, Button } from "@mui/material";
// Material UI ICON
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
// Components
import MyFriends from "./MyFriends";
import FriendRequests from "./FriendRequests";
import MyRequests from "./MyRequest";
// API call
import getReceivedFriendRequests from "../../../data/Friend/getReceivedFriendRequests";
import getSentFriendRequests from "../../../data/Friend/getSentFriendRequests";
import postSendFriendRequest from "../../../data/Friend/postSendFriendRequest";
import getUserProfile from "../../../data/Friend/getUserProfile";

const pageWrapperStyle = {
    flex: 1,
    display: "flex",
};
const MenuStyle = {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
    transition: '300ms',
    zIndex: -1,
    position: 'absolute',
    padding: '20px 20px', 
    boxSizing: 'border-box' as 'border-box',
  };

function FriendsDrawer({ open }: { open: boolean }): React.ReactElement {
    const [myFriends, setMyFriends] = useState(false);
    const [friendRequests, setFriendRequests] = useState(false);
    const [receivedRequests, setReceivedRequests] = React.useState<{ requestId: string; from: string; }[]>([]);
    const [myRequests, setMyRequests] = useState(false);
    const [sentRequests, setSentRequests] = React.useState<{ requestId: string; from: string; }[]>([]);
    const [email, setEmail] = useState("");
    const [searchResult, setSearchResult] = useState<{ nickname: string; lastLogin: string; signUpDate: string; major: string; graduationYear: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [receiveNickname, setReceiveNickname] = useState<{ nickname: string; lastLogin: string; signUpDate: string; major: string; graduationYear: number } | null>(null);
    const [sentNickname, setSentNickname] = useState<{ nickname: string; lastLogin: string; signUpDate: string; major: string; graduationYear: number } | null>(null);
    const barWidth = window.innerWidth <= 480 ? '100vw' : '400px';


    const handleGoBack = () => {
        // Add go back when clicked
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


    const handleSendRequest = async () => {
        try {
            const response = await postSendFriendRequest(email);
            if (response.responseCode === 201) {
                console.log("Friend request sent successfully");
            } else if (response.responseCode === 404) {
                console.log("User not found");
            } else if (response.responseCode === 409) {
                console.log("User is already a friend");
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    const searchFriendByEmail = async (): Promise<void> => {
        try {
            if (!email) {
                console.error("Email is required.");
                return;
            }
            const response = await getUserProfile(email);
            if (response.responseCode === 200) {
                setSearchResult(response.content || null);
                console.log("searchResult: ", searchResult)
                setError(null);
            } else {
                setSearchResult(null);
                console.log("searchResult: ", searchResult)
                setError("No user found");
            }
        } catch (error) {
            console.error("Error searching for friend:", error);
            setSearchResult(null);
            setError("Error searching for friend");
        }
    };

    const handleEnter = (event: { key: string; }) => {
        if (event.key === "Enter") {
            searchFriendByEmail();
        }
    };

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
                console.error("Error loading received friend requests:", error);
            }
        };

        const fetchProfile = async () => {
            if (receivedRequests.length > 0) {
                const response = await getUserProfile(receivedRequests[0].from);
                if (response.responseCode === 200) {
                    setReceiveNickname(response.content || null);
                }
            }
            if (sentRequests.length > 0) {
                const response = await getUserProfile(sentRequests[0].from);
                if (response.responseCode === 200) {
                    setSentNickname(response.content || null);
                }
            }
        };

        fetchProfile();
        loadData();
    }, [receivedRequests, sentRequests]);

    return (
        <Box sx={{ ...MenuStyle, width: barWidth }}>
                <Box mt={10} alignItems="center" display="flex" width="100%" >
                    <IconButton
                        sx={{ color: "whiteGray.main" }}
                        aria-label="back"
                        onClick={handleGoBack}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h2" color={"red.main"}>Friends</Typography>
                </Box>
                <Box alignItems="center" display="flex" justifyContent="center" >
                    <List sx={{ width: "340px" }}>

                        {/* My Friends */}
                        <ListItem onClick={handleMyFriends} sx={{ margin: "10px", width: "100%" }}>
                            <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                                <Typography variant="body1" fontWeight={500} color={"red.main"}>My Friends</Typography>
                                <IconButton
                                    sx={{ color: "whiteGray.main" }}
                                    aria-label="forward"
                                >
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </ListItem>
                        {<MyFriends myFriends={myFriends} setMyFriends={setMyFriends} />}
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Divider sx={{ width: "90%" }} />
                        </Box>

                        {/* Friend Requests */}
                        <ListItem onClick={handleFriendRequests} sx={{ margin: "10px", width: "100%" }}>
                            <Box display="flex" justifyContent="space-between" flexDirection={"column"} width="100%">
                                <Typography variant="body1" fontWeight={500} color={"red.main"}>Received Requests</Typography>
                                {receivedRequests.length === 0 ? (
                                    <Typography variant="body2" color={"grey"}>No request found</Typography>
                                ) : (
                                    <Typography variant="body2" color={"grey"}>{`${receiveNickname?.nickname}  +${receivedRequests.length - 1} others`}</Typography>
                                )}
                            </Box>
                            <IconButton
                                sx={{ color: "whiteGray.main", }}
                                aria-label="forward"
                            >
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </ListItem>
                        {<FriendRequests friendRequests={friendRequests} setFriendRequests={setFriendRequests} receivedRequests={receivedRequests} />}
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Divider sx={{ width: "90%" }} />
                        </Box>

                        {/* My Requests */}
                        <ListItem onClick={handleMyRequests} sx={{ margin: "10px", width: "100%" }}>
                            <Box display="flex" justifyContent="space-between" flexDirection={"column"} width="100%">
                                <Typography variant="body1" fontWeight={500} color={"red.main"}>Sent Requests</Typography>
                                {sentRequests.length === 0 ? (
                                    <Typography variant="body2" color={"grey"}>No request found</Typography>
                                ) : (
                                    <Typography variant="body2" color={"grey"}>{`${sentNickname?.nickname} +${sentRequests.length - 1} others`}</Typography>
                                )}
                            </Box>
                            <IconButton
                                sx={{ color: "whiteGray.main", }}
                                aria-label="forward"
                            >
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </ListItem>
                        {<MyRequests myRequests={myRequests} setMyRequests={setMyRequests} sentRequests={sentRequests} />}
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Divider sx={{ width: "90%" }} />
                        </Box>

                        {/* Add Friends */}
                        <Box>
                            <ListItem sx={{ margin: "10px", width: "100%" }}>
                                <Box display="flex" flexDirection="column" width="100%">
                                    <Typography variant="body1" fontWeight={500} color="red.main">Add Friend</Typography>
                                    <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                                        <TextField
                                            label="Search by Friend Email"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={searchFriendByEmail}>
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                style: {
                                                    color: "darkGrey.main",
                                                }
                                            }}
                                            variant="standard"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={handleEnter}
                                            sx={{ width: "100%" }}
                                        />
                                    </Box>

                                    {/* Display search results */}
                                    <Box mt={4} mb={2}>
                                        {error ? (
                                            <Typography variant="body2" color="error">{error}</Typography>
                                        ) : searchResult ? (
                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                <Box>
                                                    <Typography variant="body1" color="darkGrey" sx={{ mb: "10px" }}><strong>{searchResult.nickname}</strong></Typography>
                                                    <Typography variant="body2" color="darkGrey">{searchResult.major} - Class of {searchResult.graduationYear}</Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    sx={{ fontSize: "0.5rem", padding: "10px 8px", width: "50px" }}
                                                    onClick={() => handleSendRequest()}
                                                >
                                                    Send Request
                                                </Button>
                                            </Box>
                                        ) : (
                                            <></>
                                        )}
                                    </Box>
                                </Box>
                            </ListItem>
                        </Box>
                        {searchResult ? (
                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <Divider sx={{ width: "90%" }} />
                            </Box>
                        ) : (
                            <></>
                        )
                        }
                    </List>
                </Box>

        </Box>
    );
}

export default FriendsDrawer;
