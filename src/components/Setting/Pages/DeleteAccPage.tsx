/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import {
    Box, IconButton, Typography, Button,
    InputAdornment,
    TextField,
} from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';

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


/**
 * React Functional Component to generate Setting Page
 * @param {SettingMenuProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders Setting Page
 */
function DeleteAccountPage(props: SettingMenuProps): React.ReactElement {
    // States
    const [isEditable, setIsEditable] = React.useState<boolean>(false);
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
        if (secToExp > elapsedSec) {
            setTimeout(() => {
                setElapsedSec(elapsedSec + 1);
            }, 1000);
        }
        if (secToExp > 0 && secToExp === elapsedSec) {
            setErrorMsg('Code Expired');
        }
    }, [secToExp, elapsedSec]);

    // Code next button handler
    const sendCodeHandler = async (): Promise<void> => {
        setIsEditable(false);
        setErrorMsg('NONE');
        if (!codeSent) {
            //코드 보내야함
            setErrorMsg('Code Sent');
            // const result = await postInitiateOTPRequest(email, 'signin');
            // if (result.responseCode === 401) {
            //     setErrorMsg('Not Existing Email');
            // } else if (result.responseCode === 201 && result.content) {
            //     setOtpRequestId(result.content.requestId);
            //     setSecToExp(
            //         Math.floor(
            //             (result.content.codeExpireAt.getTime() - new Date().getTime()) /
            //             1000,
            //         ),
            //     );
            //     setElapsedSec(0);
            // } else {
            //     setErrorMsg('Unknown Error');
            // }
            // setSecToExp(
            //     Math.floor(
            //         (result.content.codeExpireAt.getTime() - new Date().getTime()) /
            //         1000,
            //     ),
            // );
            setCodeSent(true);
        } else {

        }


        setIsEditable(true);
    };
    const codeChangeHandler = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setCode(event.target.value.trim().toUpperCase());
        },
        [],
    );
    return (
        <Box sx={{ marginLeft: '5vw', width: '90vw', }}>
            {open ?
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    zIndex: 1, backgroundColor: 'white',
                    alignItems: 'center',
                }}>
                    <Box sx={{ alignSelf: 'flex-start', height: '10vh' }}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <ArrowIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '80vh',
                        paddingBottom: '10vh',
                    }}>
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
                    </Box>
                </Box> : <></>}

        </Box>
    );
}

export default DeleteAccountPage;