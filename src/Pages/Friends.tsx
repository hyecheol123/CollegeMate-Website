/**
 * Friends side menu Page
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
import MyFriends from "../components/Friends/View/MyFriends";
import FriendRequests from "../components/Friends/View/FriendRequests";
import MyRequests from "../components/Friends/View/MyRequest";
import MainHeader from "../components/Common/HeaderButton/HeaderButton";
import FriendsDrawer from "../components/Friends/View/FriendsDrawer";
// API call
import getReceivedFriendRequests from "../data/Friend/getReceivedFriendRequests";
import getSentFriendRequests from "../data/Friend/getSentFriendRequests";
import postSendFriendRequest from "../data/Friend/postSendFriendRequest";
import getUserProfile from "../data/Friend/getUserProfile";

const pageWrapperStyle = {
    flex: 1,
    display: "flex",
};
const drawerStyle = {
    width: "100%",
};

function Friends({ open }: { open: boolean }): React.ReactElement {
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
        <Box sx={{ display: "flex", flexDirection: "column", minHeight:"100%" }} >
            <MainHeader/>
            <FriendsDrawer/>
        </Box>
    );
}

export default Friends;
