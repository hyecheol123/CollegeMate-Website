/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';

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
} from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';

// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';
// Calling other files
import MyInfoPageEdit from './MyInfoPageEdit';
// API Call
import getMajorList from '../../../data/Miscellaneous/getMajorList';
/**
 * Interface for ContentModalProps
 */
interface SettingMenuProps {
    open: boolean;
    handleClose: () => void;
    nickname: string;
    setNickname: React.Dispatch<React.SetStateAction<string>>;
    major: string;
    setMajor: React.Dispatch<React.SetStateAction<string>>;
    gradYear: number;
    setGradYear: React.Dispatch<React.SetStateAction<number>>;
    setCanSend: React.Dispatch<React.SetStateAction<boolean>>;
}

const titleStyle = {
    variant: 'body1',
    fontWeight: 'bold',
    align: 'left',
    color: 'darkGrey',
};

const subWrapperStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
};

const inputWrapperStyle = {
    ...PageWrapperStyle,
    padding: 0,
    justiftContent: 'center',
    display: 'flex',
    flexDirection: 'column',
};


const buttonStyle = {
    width: '30vw',
};

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function MyInfoPage(props: SettingMenuProps): React.ReactElement {
    const [buttonString, setButtonString] = React.useState<string>('Edit');
    const [editing, setEditing] = React.useState<boolean>(false);
    const [classStanding, setClassStanding] = React.useState<string>('Junior');
    const [school, setSchool] = React.useState<string>('UW Madison');
    const [majorList, setMajorList] = React.useState<string[]>([]);
    const [isMajorListLoaded, setIsMajorListLoaded] =
        React.useState<boolean>(false);

    const editInfoHandler = (): void => {
        if (buttonString === 'Edit') {
            setButtonString('Save');
            setEditing(true);
        } else if (buttonString === 'Save') {
            // Save functionality goes here
            // Once saved, revert to initial state
            setButtonString('Edit');
            setEditing(false);
        }
    };

    // Load Terms
    React.useEffect(() => {
        const loadData = async (): Promise<void> => {
            if (!isMajorListLoaded) {
                const jsonMajorList = await getMajorList('wisc.edu');
                if (jsonMajorList.content?.majorList !== undefined) {
                    setMajorList(jsonMajorList.content?.majorList);
                }
                setIsMajorListLoaded(true);
            }
        };
        loadData();
    }, [isMajorListLoaded]);


    return (
        // <Box style={{ marginLeft: 'auto', marginRight: 'auto', width: '90vw', alignSelf: 'slef-start' }}>
        <Box>
            {props.open &&
                (editing ? (
                    <MyInfoPageEdit
                        open={props.open}
                        handleClose={props.handleClose}
                        nickname={props.nickname}
                        setNickname={props.setNickname}
                        school={school}
                        major={props.major}
                        setMajor={props.setMajor}
                        gradYear={props.gradYear}
                        setGradYear={props.setGradYear}
                        setCanSend={props.setCanSend}
                        majorList={majorList}
                        buttonString={buttonString}
                        editInfoHandler={editInfoHandler} />)
                    :
                    (
                        <Box sx={subWrapperStyle}>
                            <Box sx={{ alignSelf: 'flex-start', height: '5vh', marginTop: '2vh', marginLeft: '5vw' }}>
                                <IconButton aria-label="close" onClick={props.handleClose}>
                                    <ArrowIcon />
                                </IconButton>
                            </Box>
                            <Box mt={'16px'} sx={{ width: '90%', maxWidth: '600px' }}>
                                <Box sx={inputWrapperStyle}>
                                    <Box sx={{
                                        // display: 'flex', flexDirection: 'column',
                                        // alignItems: 'center',
                                        height: '80vh',
                                    }}>
                                        <Typography variant="h2" color="red.main" align="center">My Information</Typography>
                                        <List
                                            sx={{ width: '100%' }}
                                            component="nav"
                                            aria-labelledby="nested-list-subheader"
                                        >
                                            <ListItem>
                                                <div style={{ width: '100%' }}>
                                                    <Typography sx={titleStyle}>Name</Typography>
                                                    <ListItemText secondary={props.nickname} />

                                                </div>
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <div style={{ width: '100%' }}>
                                                    <Typography sx={titleStyle}>Nickname</Typography>
                                                    <ListItemText secondary={props.nickname} />
                                                </div>
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <div style={{ width: '100%' }}>
                                                    <Typography mt={'12px'} sx={titleStyle}>
                                                        School
                                                    </Typography>
                                                    <ListItemText secondary={school} />
                                                </div>
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <div style={{ width: '100%' }}>
                                                    <Typography mt={'12px'} sx={titleStyle}>
                                                        Major
                                                    </Typography>
                                                    <ListItemText secondary={props.major} />
                                                </div>
                                            </ListItem>
                                            <Divider />
                                            <ListItem>
                                                <div style={{ width: '100%' }}>
                                                    <Typography mt={'12px'} sx={titleStyle}>
                                                        Class Standing
                                                    </Typography>
                                                    <ListItemText secondary={classStanding} />
                                                </div>
                                            </ListItem>
                                            <Divider />
                                        </List>

                                        <Box sx={{ marginTop: 'auto',  display: 'flex', justifyContent: 'center'}}>
                                            <Button variant="contained" onClick={editInfoHandler} sx={{ ...buttonStyle, color: 'white'}}>
                                                {buttonString}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )
                )
            }
        </Box>
    );
}

export default MyInfoPage;

