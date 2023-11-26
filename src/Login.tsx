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
import { useGlobalContext } from './GlobalContext';
// Global Style
import PageWrapperStyle from './components/Common/Styles/PageWrapper';
import LinkStyle from './components/Common/Styles/Link';
import FilledPictureStyle from './components/Common/Styles/FilledPicture';
// Assets
import VerticalLogoPng from '../assets/collegemate_logo_vertical.png';
import VerticalLogoWebp from '../assets/collegemate_logo_vertical.png?as=webp';
import VerticalLogoAvif from '../assets/collegemate_logo_vertical.png?as=avif';

/**
 * React Functional Component to generate Login Page
 * @return {React.ReactElement} Renders Login Page
 */
function Login(): React.ReactElement {
  // States
  const [email, setEmail] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const [isCodeSent, setIsCodeSent] = React.useState<boolean>(false);
  const [isResendable, setIsResendable] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string>('TEST');
  const globalContext = useGlobalContext();
  const navigate = useNavigate();

  // Control variable
  const secToExp = 0;

  // If user already logged in, redirect to main page
  React.useEffect(() => {
    if (globalContext.login) {
      navigate('/');
    }
  }, [globalContext.login, navigate]);

  // Event Handlers for buttons
  const signUpClickHandler = React.useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  // Change Event Handler for inputs
  const emailChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value.trim().toLowerCase());
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
      <Box
        sx={{
          ...PageWrapperStyle,
          padding: 0,
          maxWidth: '400px',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              maxWidth: '122px',
              maxHeight: '160px',
            }}
          >
            <picture style={FilledPictureStyle}>
              <source srcSet={VerticalLogoAvif} type="image/avif" />
              <source srcSet={VerticalLogoWebp} type="image/webp" />
              <Box
                component="img"
                sx={{ ...FilledPictureStyle, objectFit: 'contain' }}
                src={VerticalLogoPng}
                alt="CollegeMate Logo"
              />
            </picture>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            variant="standard"
            label="Email Address"
            size="small"
            margin="dense"
            value={email}
            onChange={emailChangeHandler}
            type="email"
            fullWidth
          />
          <Box sx={{ width: '100%', display: 'flex' }}>
            <TextField
              variant="standard"
              label="Code"
              size="small"
              margin="dense"
              value={code}
              onChange={codeChangeHandler}
              type="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2">3:00</Typography>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Box>
          <Button variant="contained" sx={{ width: '100%', marginTop: '10px' }}>
            Send Code
          </Button>
          <Typography
            variant="body2"
            color="red.main"
            sx={{
              marginTop: '8px',
              visibility: errorMsg === 'NONE' ? 'hidden' : undefined,
            }}
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
