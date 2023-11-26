/**
 * Delete Account Page
 * Refered Login.tsx for timer and API call
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import {
    Modal,
    Box,
    IconButton,
    Typography,
    Button,
    InputAdornment,
    TextField,
} from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
// style
import ModalStyle from '../Styles/Modal';

// API Calls
import postInitiateOTPRequest from '../../../data/Login/postInitiateOTPRequest';
import postEnterOTPCode from '../../../data/Login/postEnterOTPCode';


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
const outerWrapperStyle = {
    display: 'flex', flexDirection: 'column',
    zIndex: 1, backgroundColor: 'white',
    alignItems: 'center',
    margin: 0,
};
const innerWrapperStyle = {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '85vh',
    paddingBottom: '10vh',
    margin: 0,
};

/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function DeleteAccountPage(props: SettingMenuProps): React.ReactElement {
    // States
    const [isEditable, setIsEditable] = React.useState<boolean>(false);
    const [isModalOpen, setisModalOpen] = React.useState<boolean>(false);
    const [isDelete, setisDelete] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>('');
    const [otpRequestId, setOtpRequestId] = React.useState<string>('');
    const [secToExp, setSecToExp] = React.useState<number>(0);
    const [elapsedSec, setElapsedSec] = React.useState<number>(0);
    const [code, setCode] = React.useState<string>('');
    const [codeSent, setCodeSent] = React.useState<boolean>(false);
    const [errorMsg, setErrorMsg] = React.useState<string>('NONE');
    // const globalContext = useGlobalContext();
    const navigate = useNavigate();
    const { open, handleClose } = props;

    // Control variable
    const formatSecond = (second: number): string => {
        return `${Math.floor(second / 60)}:${String(second % 60).padStart(2, '0')}`;
    };

    // Timeout for Timer
    React.useEffect(() => {
        let timeout: any;
        if (secToExp > elapsedSec) {
            timeout = setTimeout(() => {
                setElapsedSec(elapsedSec + 1);
            }, 1000);
        }
        if (secToExp > 0 && secToExp <= elapsedSec) {
            setErrorMsg('Code Expired');
            setCodeSent(false);
        }

        return () => clearTimeout(timeout);
    }, [secToExp, elapsedSec]);

    // Event Handlers for buttons
    const sendCodeHandler = async (): Promise<void> => {
        setIsEditable(false);
        setErrorMsg('NONE');
        if (!codeSent) {  // Code not Sent yet
            // set Email here by getting user information
            setEmail('ahn58@wisc.edu'); // Testing Email
            const result = await postInitiateOTPRequest(email, 'sudo'); // Testing Purpose 'sudo'
            if (result.responseCode === 201 && result.content) {
                setOtpRequestId(result.content.requestId);
                setSecToExp(
                    Math.floor(
                        (result.content.codeExpireAt.getTime() - new Date().getTime()) /
                        1000,
                    ),
                );
                setElapsedSec(0);
                setErrorMsg('Code Sent');
                setCodeSent(true);
                setIsEditable(true);
            } else {
                setErrorMsg('Unknown Error');
            }
        } else {    // Code sent already
            if (code == '') { // Code not Entered
                setErrorMsg('Code Already Sent. Please type the code');
            } else if (code == otpRequestId.toUpperCase()) {
                // Code Correct (Test code: sudoRequestId)
                setErrorMsg('NONE');
                setIsEditable(false);
                // popup
                setisModalOpen(true);
            } else { // Code Wrong
                setErrorMsg('Code does not match');
            }
        }
    };
    const modalHandler = (() =>
        setisModalOpen(!isModalOpen)
    );
    const deleteHandler = () => {
        setisDelete(true)
        setisModalOpen(!isModalOpen)
    };

    // Change Event Handler for inputs
    const codeChangeHandler = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setCode(event.target.value.trim().toUpperCase());
        },
        [],
    );
    return (
        <Box style={{ marginLeft: 'auto', marginRight: 'auto', width: '90vw', alignSelf: 'slef-start' }}>
            {/* 1. Delete PopUp */}
            {isModalOpen &&
                <Modal open={open} onClose={modalHandler}>
                    <Box sx={ModalStyle}>
                        <IconButton aria-label="close" onClick={modalHandler} style={{ alignSelf: 'flex-end' }}>
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ aligh: 'center', }}>Are you sure you want to delete the account?</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '60%' }}>
                            <Button variant="contained" onClick={modalHandler} sx={{ width: '42%' }}>
                                cancle
                            </Button>
                            <Button variant="contained" onClick={deleteHandler} sx={{ width: '42%' }}>
                                Delete
                            </Button>

                        </Box>
                    </Box>
                </Modal>
            }
            {/* 2. Account Delete Main Page */}
            <Box>
                {open &&
                    <Box sx={outerWrapperStyle}>
                        <Box sx={{ alignSelf: 'flex-start', height: '5vh', marginTop: '2vh', }}>
                            <IconButton aria-label="close" onClick={handleClose}>
                                <ArrowIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            {!isDelete ?
                                // 2-1. Initial Delete Account Page
                                <Box sx={innerWrapperStyle}>
                                    <Typography variant="h2" color="red.main" align="center">Delete Account</Typography>

                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Typography
                                            variant="body1"
                                            sx={{ marginTop: '15px' }}
                                        >
                                            Send Code
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            margin="dense"
                                            fullWidth
                                            disabled={
                                                !isEditable || (secToExp > 0 && secToExp === elapsedSec)
                                            }
                                            value={code}
                                            onChange={codeChangeHandler}
                                            type="password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Typography variant="body2">
                                                            {formatSecond(secToExp - elapsedSec)}
                                                        </Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            color="red.main"
                                            marginTop="8px"
                                            align='center'
                                            visibility={errorMsg === 'NONE' ? 'hidden' : undefined}
                                        >
                                            {errorMsg}
                                        </Typography>
                                    </Box>

                                    <Button variant="contained" onClick={sendCodeHandler} sx={buttonStyle}>
                                        Next
                                    </Button>

                                </Box> :
                                // 2-2. Post Delete Account Page  
                                <Box sx={innerWrapperStyle} style={{ justifyContent: 'center', }}>
                                    <VerifiedIcon style={{ color: '#1CC82D', fontSize: '4rem', marginBottom: '3vh' }} />
                                    <Typography variant="h3" fontWeight='bold'>Account deleted</Typography>
                                </Box>
                            }
                        </Box></Box>
                }
            </Box>
        </Box>
    );
}

export default DeleteAccountPage;