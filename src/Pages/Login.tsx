/**
 * Login Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
// Custom Hook to use Context
import { useGlobalContext } from '../GlobalContext';
// API Calls
import postInitiateOTPRequest from '../data/Authentication/postInitiateOTPRequest';
import postEnterOTPCode from '../data/Authentication/postEnterOTPCode';
// Input Validator
import { emailFormatValidator } from '../inputValidator/emailFormatValidator';
// Global Style
import PageWrapperStyle from '../components/Common/Styles/PageWrapper';
import LinkStyle from '../components/Common/Styles/Link';
import FilledPictureStyle from '../components/Common/Styles/FilledPicture';
// Assets
import VerticalLogoPng from '../../assets/collegemate_logo_vertical.png';
import VerticalLogoWebp from '../../assets/collegemate_logo_vertical.png?as=webp';
import VerticalLogoAvif from '../../assets/collegemate_logo_vertical.png?as=avif';

const innerContentWrapperStyle = {
  ...PageWrapperStyle,
  padding: 0,
  maxWidth: '400px',
  justifyContent: 'center',
};
const imageOuterWrapperStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const imageInnerWrapperStyle = {
  height: '100%',
  width: '100%',
  maxWidth: '122px',
  maxHeight: '160px',
};
const inputWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

/**
 * React Functional Component to generate Login Page
 * @return {React.ReactElement} Renders Login Page
 */
function Login(): React.ReactElement {
  // States
  const [isEditable, setIsEditable] = React.useState<boolean>(true);
  const [email, setEmail] = React.useState<string>('');
  const [otpRequestId, setOtpRequestId] = React.useState<string>('');
  const [secToExp, setSecToExp] = React.useState<number>(0);
  const [elapsedSec, setElapsedSec] = React.useState<number>(0);
  const [code, setCode] = React.useState<string>('');
  const [errorMsg, setErrorMsg] = React.useState<string>('NONE');
  const globalContext = useGlobalContext();
  const navigate = useNavigate();

  // Control variable
  const formatSecond = (second: number): string => {
    return `${Math.floor(second / 60)}:${String(second % 60).padStart(2, '0')}`;
  };

  // If user already logged in, redirect to main page
  React.useEffect(() => {
    if (globalContext.login) {
      navigate('/');
    }
  }, [globalContext.login, navigate]);

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
    }

    return () => clearTimeout(timeout);
  }, [secToExp, elapsedSec]);

  // Event Handlers for buttons
  const logoClickHandler = React.useCallback(() => {
    navigate('/');
  }, [navigate]);
  const signUpClickHandler = React.useCallback(() => {
    navigate('/signup');
  }, [navigate]);
  const sendCodeHandler = async (): Promise<void> => {
    setIsEditable(false);
    setErrorMsg('NONE');

    if (emailFormatValidator(email)) {
      const result = await postInitiateOTPRequest(email, 'signin');
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
        setCode('');
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
      globalContext.dispatch({ type: 'LOGIN' });
      localStorage.setItem('LOGIN', 'yes');
      navigate('/');
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
    [],
  );
  const codeChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value.trim().toUpperCase());
    },
    [],
  );

  return (
    <Box sx={{ ...PageWrapperStyle, alignItems: 'center' }}>
      <Box sx={innerContentWrapperStyle}>
        <Box sx={imageOuterWrapperStyle}>
          <Box sx={imageInnerWrapperStyle}>
            <picture style={{ ...FilledPictureStyle, ...LinkStyle }}>
              <source srcSet={VerticalLogoAvif} type="image/avif" />
              <source srcSet={VerticalLogoWebp} type="image/webp" />
              <Box
                component="img"
                sx={{
                  ...FilledPictureStyle,
                  ...LinkStyle,
                  objectFit: 'contain',
                }}
                src={VerticalLogoPng}
                onClick={logoClickHandler}
                alt="CollegeMate Logo"
              />
            </picture>
          </Box>
        </Box>
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
                      <Typography variant="body2">
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
              sx={{ width: '100%', marginTop: '10px', textTransform: 'none' }}
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
                disabled={secToExp > 0 && secToExp === elapsedSec}
                sx={{ flex: 1, textTransform: 'none' }}
                onClick={submitCodeHandler}
              >
                Submit
              </Button>
              {elapsedSec > 30 && (
                <Button
                  variant="contained"
                  color="whiteGrey"
                  sx={{ flex: 1, textTransform: 'none' }}
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
          <Typography
            variant="body1"
            sx={{ ...LinkStyle, marginTop: '15px' }}
            onClick={signUpClickHandler}
          >
            Sign Up
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(Login);
