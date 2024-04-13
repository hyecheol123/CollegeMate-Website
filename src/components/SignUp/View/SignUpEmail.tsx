/**
 * Sign Up Page where manages the process of
 * sending the verification code to the user's email
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
// React
import React from 'react';
// Material UI
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
// Material UI Icons
// Components
import PageWrapperStyle from '../../Common/Styles/PageWrapper';
// Global Style
// Input Validators
import { emailFormatValidator } from '../../../inputValidator/emailFormatValidator';
// Helper Functions
import formatSecond from '../Function/formatSecond';
// API Calls
import postInitiateOTPRequest from '../../../data/User/postInitiateOTPRequest';
import postEnterOTPCode from '../../../data/User/postEnterOTPCode';

const innerContentWrapperStyle = {
  ...PageWrapperStyle,
  padding: 0,
  maxWidth: '400px',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1, // This will make the container expand to fill available space
};

const inputWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

/**
 * Properties sent from this parents
 */
interface ISignUpEmailProps {
  verifiedEmail: string;
  setVerifiedEmail: React.Dispatch<React.SetStateAction<string>>;
  setTokenExpiresAfterSec: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * React Functional Component to generate the Sign Up page
 * which manages the verification code to user's email
 * @param {ISignUpEmailProps} props properties for this view
 * @return {React.ReactElement} Renders Sing Up Page (Email)
 */
function SignUpEmail(props: ISignUpEmailProps): React.ReactElement {
  const { verifiedEmail, setVerifiedEmail, setTokenExpiresAfterSec } = props;
  const [email, setEmail] = React.useState<string>('');
  const [isEditable, setIsEditable] = React.useState<boolean>(true);
  const [otpRequestId, setOtpRequestId] = React.useState<string>('');
  const [secToExp, setSecToExp] = React.useState<number>(0);
  const [elapsedSec, setElapsedSec] = React.useState<number>(0);
  const [code, setCode] = React.useState<string>('');
  const [errorMsg, setErrorMsg] = React.useState<string>('NONE');

  // Timeout for Timer
  React.useEffect(() => {
    let timeout: any;
    if (secToExp > elapsedSec && verifiedEmail === '') {
      timeout = setTimeout(() => {
        setElapsedSec(elapsedSec + 1);
      }, 1000);
    }
    if (secToExp > 0 && secToExp <= elapsedSec) {
      setErrorMsg('Code Expired');
    }

    return () => clearTimeout(timeout);
  }, [secToExp, elapsedSec, verifiedEmail]);

  const sendCodeHandler = async (): Promise<void> => {
    setIsEditable(false);
    setErrorMsg('NONE');

    if (emailFormatValidator(email)) {
      const result = await postInitiateOTPRequest(email, 'signup');
      if (result.responseCode === 401) {
        setErrorMsg('Not Existing Email');
      } else if (result.responseCode === 201 && result.content) {
        setOtpRequestId(result.content.requestId);
        setSecToExp(
          Math.floor(
            (result.content.codeExpireAt.getTime() - new Date().getTime()) /
              1000,
          ),
        );
        setElapsedSec(0);
      } else {
        setErrorMsg('Unknown Error');
      }
    } else {
      setErrorMsg('Invalid Email');
    }

    setIsEditable(true);
  };

  const submitCodeHandler = async (): Promise<void> => {
    setIsEditable(false);
    setErrorMsg('NONE');

    const result = await postEnterOTPCode(otpRequestId, email, code);
    if (result.responseCode === 499) {
      setErrorMsg('Code Mismatch');
    } else if (result.responseCode === 409) {
      setElapsedSec(secToExp);
      setErrorMsg('Code Expired');
    } else if (result.responseCode === 201) {
      setVerifiedEmail(email);
      setTokenExpiresAfterSec(58 * 60);
    } else {
      setErrorMsg('Unknown Error');
    }

    setIsEditable(true);
  };

  // Change Event Handler for inputs
  const emailChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value.trim());
    },
    [setEmail],
  );
  const codeChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value.trim().toUpperCase());
    },
    [],
  );

  return (
    <Box
      sx={{
        ...PageWrapperStyle,
        alignContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={innerContentWrapperStyle}>
        <Box sx={inputWrapperStyle}>
          {
            // Dummy TextField for styling
            otpRequestId === '' && (
              <TextField
                variant="standard"
                label="DUMMY"
                size="small"
                margin="dense"
                fullWidth
                sx={{ visibility: 'hidden' }}
              />
            )
          }
          <TextField
            variant="standard"
            size="small"
            margin="dense"
            fullWidth
            disabled={!isEditable || otpRequestId !== ''}
            label="Email Address"
            value={email}
            onChange={emailChangeHandler}
            type="email"
          />
          {otpRequestId !== '' && (
            <Box sx={{ width: '100%', display: 'flex' }}>
              <TextField
                variant="standard"
                size="small"
                margin="dense"
                fullWidth
                disabled={
                  !isEditable || (secToExp > 0 && secToExp === elapsedSec)
                }
                label="Code"
                value={code}
                onChange={codeChangeHandler}
                type="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="body2"
                        visibility={verifiedEmail !== '' ? 'hidden' : 'visible'}
                      >
                        {formatSecond(secToExp - elapsedSec)}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
          {otpRequestId === '' && (
            <Button
              variant="contained"
              sx={{ width: '100%', marginTop: '10px' }}
              onClick={sendCodeHandler}
            >
              Send Code
            </Button>
          )}
          {otpRequestId !== '' && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                gap: '10px',
                marginTop: '10px',
              }}
            >
              <Button
                variant="contained"
                disabled={
                  secToExp > 0 &&
                  (secToExp === elapsedSec || verifiedEmail !== '')
                }
                sx={{ flex: 1 }}
                onClick={submitCodeHandler}
              >
                Submit
              </Button>
              {elapsedSec > 30 && (
                <Button
                  variant="contained"
                  color="whiteGrey"
                  sx={{ flex: 1 }}
                  onClick={sendCodeHandler}
                >
                  Resend
                </Button>
              )}
            </Box>
          )}
          <Typography
            variant="body2"
            color="red.main"
            marginTop="8px"
            visibility={errorMsg === 'NONE' ? 'hidden' : undefined}
          >
            {errorMsg}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUpEmail;
