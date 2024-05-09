/**
 * Subpage of the Setting Page; Editing user information
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import ArrowIcon from '@mui/icons-material/ArrowBack';
// Component
import Modal from '../../Common/Modal/Modal';
// API Call
import getVerifyNickname from '../../../data/User/getVerifyNickname';
import postUpdateUser from '../../../data/User/Profile/postUpdateUser';
import { GlobalContextProvider, useGlobalContext } from '../../../GlobalContext';


// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';

interface IProps {
  open: boolean;
  handleClose: () => void;
  majorList: string[];
  email: string;
  nickname: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  nicknameChanged: string;
  setNicknameChanged: React.Dispatch<React.SetStateAction<string>>;
  school: string;
  major: string;
  setMajor: React.Dispatch<React.SetStateAction<string>>;
  gradYear: number;
  setGradYear: React.Dispatch<React.SetStateAction<number>>;
  setCanSend: React.Dispatch<React.SetStateAction<boolean>>;
  buttonString: string;
  editInfoHandler: () => void;
}

const titleStyle = {
  variant: 'body1',
  fontWeight: 'bold',
  align: 'left',
  color: 'darkGrey',
};

const contextStyle = {
  variant: 'body2',
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

const buttonStyle = {
  width: '30vw',
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
function MyInfoPageEdit(props: IProps): React.ReactElement {
  const [nicknameAvail, setIsNicknameAvail] = React.useState<boolean>(false);
  const [nickNameRemainedTime, setNickNameRemainedTime] =
    React.useState<number>(0);
  const [notChangeable, setNotChangeable] = React.useState<boolean>(false);
  const [isSavable, SetIsSavable] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [modalMsg, setModalMsg] = React.useState<string>('');
  const navigate = useNavigate();

  /* Temperal variable that stores changes in edit page */
  const [tempEmail, setEmail] = React.useState<string>(
    props.email,
  );
  const [tempNickName, setTempNickName] = React.useState<string>(
    props.nickname,
  );
  const [tempSchool, setTempSchool] = React.useState<string>(props.school);
  const [tempMajor, setTempMajor] = React.useState<string>(props.major);
  const [tempExpGradYear, setTempExpGradYear] = React.useState<number>(
    props.gradYear,
  );
  const [tempNickChangedDate, setNicknameChangedDate] = React.useState<string>(
    props.nicknameChanged,
  );

  /* Starts: Variables regards Time */
  const currentDate = new Date();
  const today = currentDate.toISOString();
  const currentYear = parseInt(today.substring(0, 4));
  const currentMonth = parseInt(today.substring(5, 7));
  const currentDay = parseInt(today.substring(8, 10));

  const graduationYears = Array.from(
    { length: currentYear - 2015 + 5 },
    (_, index) => 2015 + index,
  );

  const changedYear = parseInt(props.nicknameChanged.substring(0, 4));
  const changedMonth = parseInt(props.nicknameChanged.substring(5, 7));
  const changedDay = parseInt(props.nicknameChanged.substring(8, 10));

  let totalDaysDiff = 0;

  if (currentYear - changedYear > 0) {
    totalDaysDiff = 31;
  } else if (currentMonth - changedMonth > 0) {
    const changedMonthLastDay = new Date(
      changedYear,
      changedMonth,
      0,
    ).getDate();
    totalDaysDiff = currentDay + (changedMonthLastDay - changedDay);
  } else {
    totalDaysDiff = currentDay - changedDay;
  }
  const remainTime = Math.max(30 - totalDaysDiff, 0);
  /* End: Variables regards Time */

  const editInfoHandlerHelper = async () => {
    if (isSavable == true) {
      // API Call
      const postUpdateUserResponse = await postUpdateUser(
        tempEmail,
        tempNickName,
        tempMajor,
        tempExpGradYear,
        tempNickChangedDate,
      );
      if (postUpdateUserResponse.responseCode === 200) {
        // success
        props.setNickname(tempNickName);
        props.setMajor(tempMajor);
        props.setGradYear(tempExpGradYear);
        props.setNicknameChanged(tempNickChangedDate);
        props.editInfoHandler();
      } else {
        setIsModalOpen(true);
        switch (postUpdateUserResponse.responseCode) {
          case 400:
            setModalMsg(
              'Bad Input. Might be due to duplicated nickname or missing field. Try Again.',
            );
            break;
          case 401:
          case 403:
            setModalMsg('Timeout. Please refresh the page and start again.');
            break;
          default:
            setModalMsg(
              'Unknown Errr Occurred. Please refresh the page and start again.',
            );
            break;
        }
      }
    }
  };

  React.useEffect(() => {
    if (
      tempNickName !== '' &&
      nicknameAvail &&
      isNicknameLength(tempNickName) &&
      isNicknameChar(tempNickName) &&
      !isNicknameSpace(tempNickName) &&
      props.major !== '' &&
      props.gradYear !== -1
    ) {
      props.setCanSend(true);
    }
  }, [nicknameAvail, props]);

  const handleMajorChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setTempMajor(event.target.value);
      SetIsSavable(true);
    },
    [props],
  );
  const handleGradYearChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const year = parseInt(event.target.value);
      setTempExpGradYear(year);
      SetIsSavable(true);
    },
    [props],
  );
  const handleNicknameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setTempNickName(event.target.value);
      SetIsSavable(false);
    },
    [props],
  );

  const handleVerify = async (): Promise<void> => {
    setNickNameRemainedTime(remainTime);
    if (remainTime > 0) {
      setNotChangeable(true);
      return;
    } else if (
      isNicknameLength(tempNickName) &&
      isNicknameChar(tempNickName) &&
      !isNicknameSpace(tempNickName)
    ) {
      const response = await getVerifyNickname(tempNickName);
      if (response.content?.isAvailable) {
        setModalMsg('Great. You can use this nickname.');
        setNicknameChangedDate(today);
        setIsNicknameAvail(true);
        SetIsSavable(true);
      } else {
        setModalMsg('Nickname Exists. Try different nickname.');
        setIsNicknameAvail(false);
        SetIsSavable(false);
      }
    } else {
      setIsNicknameAvail(false);
      setModalMsg('Error: Does not meet criteria');
      SetIsSavable(false);
    }
  };

  // Modal Close
  const handleModalClose = React.useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <Box sx={subWrapperStyle}>
      <Box
        sx={{
          alignSelf: 'flex-start',
          height: '5vh',
          marginTop: '2vh',
          marginLeft: '5vw',
        }}
      >
        <IconButton aria-label="close" onClick={props.handleClose}>
          <ArrowIcon />
        </IconButton>
      </Box>
      <Box mt={'16px'} sx={{ width: '90%', maxWidth: '600px' }}>
        <Box sx={inputWrapperStyle}>
          <Box
            sx={{
              height: '80vh',
            }}
          >
            <Typography variant="h2" color="red.main" align="center">
              My Information
            </Typography>
            <Box>
              <Typography sx={titleStyle}>Name</Typography>
              <TextField
                sx={inputStyle}
                value={tempNickName}
                disabled={true} // We won't consider changing this for now
                required
                margin="dense"
                size="small"
              />
            </Box>
            <Box>
              <Typography sx={titleStyle}>Nickname</Typography>
              <Typography variant="body2" color={'darkGrey'}></Typography>
              {notChangeable ? (
                <Typography variant="body2" align="left" color="error.main">
                  You can change the nickname every 30 days. Remaining days:{' '}
                  {nickNameRemainedTime}
                </Typography>
              ) : (
                <Typography variant="body2" align="left" color="initial">
                  You can change your nickname every 30 days. Last Updated:{' '}
                  {changedYear}/{changedMonth}/{changedDay}. Changes Remain:{' '}
                  {remainTime}
                </Typography>
              )}
              <Box display="flex" flexDirection="row" gap="12px">
                <TextField
                  sx={{ flex: '1', align: 'center', my: '16px' }}
                  inputProps={{
                    pattern: '[a-zA-Z0-9_-]{4,20}',
                  }}
                  value={tempNickName}
                  onChange={notChangeable ? undefined : handleNicknameChange}
                  disabled={notChangeable}
                  required
                  margin="dense"
                  size="small"
                />
                <Button
                  sx={{ my: '16px' }}
                  onClick={notChangeable ? undefined : handleVerify}
                  disabled={notChangeable}
                  variant="outlined"
                  size="small"
                >
                  Verify
                </Button>
              </Box>
              <Box>
                <Typography sx={{ ...contextStyle, color: 'red.main' }}>
                  {modalMsg}
                </Typography>
              </Box>
              <Box>
                <Box alignItems="center" display="flex">
                  {tempNickName ? (
                    isNicknameLength(tempNickName) ? (
                      <CheckIcon color="success" />
                    ) : (
                      <ClearIcon color="error" />
                    )
                  ) : (
                    <ClearIcon color="error" />
                  )}
                  <Typography sx={contextStyle}>
                    Must be between 4 and 20 characters.
                  </Typography>
                </Box>
                <Box alignItems="center" display="flex">
                  {tempNickName ? (
                    isNicknameChar(tempNickName) ? (
                      <CheckIcon color="success" />
                    ) : (
                      <ClearIcon color="error" />
                    )
                  ) : (
                    <ClearIcon color="error" />
                  )}
                  <Typography sx={contextStyle}>
                    May include only upper case, lower case, number, dash, or
                    underscore.
                  </Typography>
                </Box>
                <Box alignItems="center" display="flex">
                  {tempNickName ? (
                    !isNicknameSpace(tempNickName) ? (
                      <CheckIcon color="success" />
                    ) : (
                      <ClearIcon color="error" />
                    )
                  ) : (
                    <ClearIcon color="error" />
                  )}
                  <Typography sx={contextStyle}>
                    Cannot contain a space.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography mt={'12px'} sx={titleStyle}>
                School
              </Typography>
              <TextField
                sx={{ flex: '1', align: 'center', my: '16px' }}
                inputProps={{
                  pattern: '[a-zA-Z0-9_-]{4,20}',
                }}
                value={tempSchool}
                disabled={true} // We won't consider changing this for now
                required
                margin="dense"
                size="small"
              />
            </Box>
            <Box>
              <Typography mt={'12px'} sx={titleStyle}>
                Major
              </Typography>
              <TextField
                select
                placeholder="Select your major"
                value={tempMajor}
                onChange={handleMajorChange}
                required
                sx={inputStyle}
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
            <Box>
              <Typography sx={titleStyle}>Expected Graduation Year</Typography>
              <TextField
                select
                placeholder="Select your (estimated) graduation year"
                value={tempExpGradYear}
                onChange={handleGradYearChange}
                required
                sx={inputStyle}
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
            <Box
              sx={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                onClick={editInfoHandlerHelper}
                sx={buttonStyle}
              >
                {props.buttonString}
              </Button>
            </Box>
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

export default MyInfoPageEdit;
