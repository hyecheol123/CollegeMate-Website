/**
 * Component for the information gathering page of signup page (SignUpCreateAccount).
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
// Component
import Modal from '../../../components/Common/Modal/Modal';
// API Call
import getVerifyNickname from '../../../data/User/getVerifyNickname';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';

interface IProps {
  majorList: string[];
  nickname: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  major: string;
  setMajor: React.Dispatch<React.SetStateAction<string>>;
  gradYear: number;
  setGradYear: React.Dispatch<React.SetStateAction<number>>;
  setCanSend: React.Dispatch<React.SetStateAction<boolean>>;
  remainingTimeSec: number;
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

const inputStyle = {
  minWidth: '100%',
  align: 'center',
  my: '16px',
};

// Function to check if the nickname follows the rules
const isNicknameLength = (value: string): boolean => {
  const pattern = /^.{4,20}$/;
  return pattern.test(value);
};
const isNicknameChar = (value: string): boolean => {
  const pattern = /^[a-zA-Z0-9_-]*$/;
  return pattern.test(value);
};
const isNicknameSpace = (value: string): boolean => {
  const pattern = /\s/;
  return pattern.test(value);
};

/**
 * React Functional Component for SignUp page's first page
 * @param {IProps} props properties sent from this parents
 * @return {React.ReactElement} Renders first page of about page
 */
function SignUpCreateAccount(props: IProps): React.ReactElement {
  const [nicknameAvail, setIsNicknameAvail] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isTimeout, setIsTimeout] = React.useState<boolean>(false);
  const [modalMsg, setModalMsg] = React.useState<string>('');
  const navigate = useNavigate();
  // Variables
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from(
    { length: currentYear - 2015 + 5 },
    (_, index) => 2015 + index,
  );

  // Checking form send eligibility
  React.useEffect(() => {
    if (
      props.nickname !== '' &&
      nicknameAvail &&
      isNicknameLength(props.nickname) &&
      isNicknameChar(props.nickname) &&
      !isNicknameSpace(props.nickname) &&
      props.major !== '' &&
      props.gradYear !== -1 &&
      props.remainingTimeSec > 0
    ) {
      props.setCanSend(true);
    }
  }, [nicknameAvail, props]);

  // Checking time limit
  React.useEffect(() => {
    if (props.remainingTimeSec <= 0) {
      setIsTimeout(true);
      setModalMsg('Timeout! Please restart');
      setIsModalOpen(true);
    }
  }, [props.remainingTimeSec]);

  // TextField change handlers
  const handleMajorChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      props.setMajor(event.target.value);
    },
    [props],
  );
  const handleGradYearChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const year = parseInt(event.target.value);
      props.setGradYear(year);
    },
    [props],
  );
  const handleNicknameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      props.setNickname(event.target.value);
    },
    [props],
  );

  const handleVerify = async (): Promise<void> => {
    if (
      isNicknameLength(props.nickname) &&
      isNicknameChar(props.nickname) &&
      !isNicknameSpace(props.nickname)
    ) {
      const response = await getVerifyNickname(props.nickname);
      if (response.content?.isAvailable) {
        setModalMsg('Great. You can use this nickname.');
        setIsModalOpen(true);
        setIsNicknameAvail(true);
      } else {
        setModalMsg('Nickname Exists. Try different nickname.');
        setIsModalOpen(true);
        setIsNicknameAvail(false);
      }
    } else {
      setIsModalOpen(true);
      setModalMsg('Error: Does not meet criteria');
    }
  };
  // Modal Close
  const handleModalClose = React.useCallback(() => {
    setIsModalOpen(false);
    if (isTimeout) {
      navigate(0);
    }
  }, [isTimeout, navigate]);

  return (
    <Box sx={subWrapperStyle}>
      <Box mt={'16px'} sx={{ width: '90%', maxWidth: '600px' }}>
        <Box sx={inputWrapperStyle}>
          <Box flex={1}>
            <Typography sx={titleStyle}>Name</Typography>
            <TextField
              sx={inputStyle}
              placeholder="Enter your name"
              disabled={isTimeout}
              required
              margin="dense"
              size="small"
            />
          </Box>
          <Box flex={1}>
            <Typography sx={titleStyle}>Nickname</Typography>
            <Box display="flex" flexDirection="row" gap="12px">
              <TextField
                sx={{ flex: '1', align: 'center', my: '16px' }}
                inputProps={{
                  pattern: '[a-zA-Z0-9_-]{4,20}',
                }}
                placeholder="Enter your nickname"
                value={props.nickname}
                onChange={handleNicknameChange}
                disabled={isTimeout}
                required
                margin="dense"
                size="small"
              />
              <Button
                sx={{ my: '16px' }}
                onClick={handleVerify}
                disabled={isTimeout}
                variant="outlined"
                size="small"
              >
                Verify
              </Button>
            </Box>
            <Box>
              <Box mb="12px" display={'flex'} flexDirection={'row'}>
                {props.nickname ? (
                  isNicknameLength(props.nickname) ? (
                    <CheckIcon color="success" />
                  ) : (
                    <ClearIcon color="error" />
                  )
                ) : (
                  <ClearIcon color="error" />
                )}
                <Typography variant="body2">
                  Must be between 4 and 20 characters.
                </Typography>
              </Box>
              <Box mb="12px" display={'flex'} flexDirection={'row'}>
                {props.nickname ? (
                  isNicknameChar(props.nickname) ? (
                    <CheckIcon color="success" />
                  ) : (
                    <ClearIcon color="error" />
                  )
                ) : (
                  <ClearIcon color="error" />
                )}
                <Typography variant="body2">
                  May include only upper case, lower case, number, dash, or
                  underscore.
                </Typography>
              </Box>
              <Box mb="16px" display={'flex'} flexDirection={'row'}>
                {props.nickname ? (
                  !isNicknameSpace(props.nickname) ? (
                    <CheckIcon color="success" />
                  ) : (
                    <ClearIcon color="error" />
                  )
                ) : (
                  <ClearIcon color="error" />
                )}
                <Typography variant="body2">Cannot contain a space.</Typography>
              </Box>
            </Box>
          </Box>
          <Box flex={1}>
            <Typography sx={titleStyle}>Major</Typography>
            <TextField
              select
              placeholder="Select your major"
              value={props.major}
              onChange={handleMajorChange}
              required
              sx={inputStyle}
              disabled={isTimeout}
              margin="dense"
              size="small"
            >
              {props.majorList.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box flex={1}>
            <Typography sx={titleStyle}>Expected Graduation Year</Typography>
            <TextField
              select
              placeholder="Select your (estimated) graduation year"
              value={props.gradYear}
              onChange={handleGradYearChange}
              required
              sx={inputStyle}
              disabled={isTimeout}
              margin="dense"
              size="small"
            >
              {graduationYears.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Modal
          isOpen={isModalOpen}
          handleClose={handleModalClose}
          message={modalMsg}
        />
      </Box>
    </Box>
  );
}

export default SignUpCreateAccount;
