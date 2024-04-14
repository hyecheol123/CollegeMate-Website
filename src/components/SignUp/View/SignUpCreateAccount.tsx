/**
 * Component for the information gathering page of signup page (SignUpCreateAccount).
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React, { useState } from 'react';
// Material UI
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';
import getNickname, { NicknameResponse } from '../../../data/Miscellaneous/getNickname';
import Modal from '../../../components/Common/Modal/Modal';

interface IProps {
  majorList: string[];
  nickname: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  major: string;
  setMajor: React.Dispatch<React.SetStateAction<string>>;
  gradYear: number;
  setGradYear: React.Dispatch<React.SetStateAction<number>>;
}

const titleStyle = {
  variant: 'body1',
  fontWeight: 'bold',
  align: 'left',
  color: 'darkGrey'
};

const subWrapper = {
  width: '60%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
  const [nicknameExists, setNicknameExists] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [modalMsg, setModalMsg] = React.useState<string>('');

  const currentYear = new Date().getFullYear();

  const graduationYears = Array.from(
    { length: currentYear - 2015 + 5 },
    (_, index) => 2015 + index,
  );

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
    try {
      const response: NicknameResponse = await getNickname();
      if (isNicknameLength(props.nickname) && isNicknameChar(props.nickname) && !isNicknameSpace(props.nickname)) {
        if (response.content?.nickname === props.nickname) {
          console.log('Nickname Exists');
          setIsModalOpen(true);
          setModalMsg(
            'Bad Input. Nickname Exists. Try Again.',
          );
          setNicknameExists(true);
        } else {
          console.log('Nickname Not Exists');
          setIsModalOpen(true);
          setModalMsg(
            'Great. You can use this nickname.',
          );
          setNicknameExists(false);
        }
      } else {
        setIsModalOpen(true);
        setModalMsg(
          'Error: Need to check all statements.',
        );
      }
    } catch (error) {
      console.error('Error verifying nickname:', error);
    }
  };
  // Modal Close
  const handleModalClose = React.useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <Box mt={'16px'} sx={{ ...PageWrapperStyle, alignItems: 'center' }}>
      <Box sx={subWrapper}>
        <Box flex={1}>
          <Typography sx={titleStyle}>Name</Typography>
          <TextField sx={inputStyle} placeholder="Enter your name"></TextField>
        </Box>
        <Box flex={1}>
          <Typography sx={titleStyle}>Nickname</Typography>
          <Box display={'flex'} flexDirection={'row'}>
            <TextField
              sx={{ flex: '1', align: 'center', my: '16px' }}
              inputProps={{
                pattern: '[a-zA-Z0-9_-]{4,20}',
              }}
              placeholder="Enter your nickname"
              value={props.nickname}
              onChange={handleNicknameChange}
              required
            />
            <Button onClick={handleVerify}>Verify</Button>
            <Modal
              isOpen={isModalOpen}
              handleClose={handleModalClose}
              message={modalMsg}
            />
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
                May include only upper case, lower case, number, dash, or underscore.
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
          >
            {graduationYears.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUpCreateAccount;
