/**
 * Setting Page that are being called by Pages/Setting.tsx.
 * Calls 4 sub pages in the /Setting/View/ directory including:
 *      1. MainHeader
 *      2. MenuBar
 *      3. MyInfoPage
 *      4. DeleteAccountPage
 *      5. LogOutAlert
 * Directly interacts with getUserProfile API.
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';

import MainHeader from '../../Common/HeaderButton/HeaderButton';
import MenuBar from './MenuBar';
import MyInfoPage from './MyInfoPage';
import DeleteAccountPage from './DeleteAccPage';
import LogOutAlert from './LogOutAlert';
import { GlobalContextProvider, useGlobalContext } from '../../../GlobalContext';

import PageWrapperStyle from '../../Common/Styles/PageWrapper';

import getUserProfile, {
  IProfileResponse,
} from '../../../data/User/Profile/getUserProfile';

/**
 *
 */
async function fetchData(email: string): Promise<IProfileResponse | undefined> {
  try {
    const response = await getUserProfile(email);
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return undefined;
  }
}

/**
 * React Functional Component to generate Setting Page
 * @return {React.ReactElement} Renders Setting Page
 */
function SettingPage(): React.ReactElement {
  const [menuClicked, setMenuClick] = useState<boolean>(false);
  const [myInfoClicked, setMyInfo] = useState<boolean>(false);
  const [delAccClicked, setDelAccClicked] = useState<boolean>(false);
  const [logOutClicked, setlogOutClicked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [nicknameChanged, setNicknameChanged] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [gradYear, setGradYear] = useState<number>(-1);
  const [canSend, setCanSend] = useState<boolean>(true);
  const navigate = useNavigate();
  const globalContext = useGlobalContext();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const userInfo = await fetchData(globalContext.email);
      if (userInfo && userInfo.responseCode === 200 && userInfo.content) {
        setEmail(globalContext.email);
        setNickname(userInfo.content.nickname);
        setMajor(userInfo.content.major);
        setGradYear(userInfo.content.graduationYear);
        setNicknameChanged(userInfo.content.nicknameChanged);
      }
    };
    loadData();
  }, [globalContext.email]); // Depend on the email from globalContext

  const menuFunction = () => setMenuClick(prev => !prev);
  const menuMyInfo = () => {
    setMyInfo(true);
    setDelAccClicked(false);
    setlogOutClicked(false);
    setMenuClick(!menuClicked);
  };
  const menuDelAccClicked = () => {
    setMyInfo(false);
    setDelAccClicked(true);
    setlogOutClicked(false);
    setMenuClick(!menuClicked);
  };
  const menulogOutClicked = () => {
    setMyInfo(false);
    setDelAccClicked(false);
    setlogOutClicked(!logOutClicked);
    setMenuClick(!menuClicked);
    globalContext.dispatch({
      type: 'LOGOUT'
    });
  };
  const logoClickHandler = () => navigate('/login');

  return (
    <Box sx={PageWrapperStyle} style={{ padding: 0 }}>
      <MainHeader
        settingOpen = {menuFunction}
      />
      <MenuBar
        open={menuClicked}
        handleClose={menuFunction}
        handleMyInfo={menuMyInfo}
        handleDelAcc={menuDelAccClicked}
        handleLogOut={menulogOutClicked}
      />
      <MyInfoPage
        open={myInfoClicked}
        handleClose={menuMyInfo}
        email={email}
        nickname={nickname}
        nicknameChanged={nicknameChanged}
        setNicknameChanged={setNicknameChanged}
        setNickname={setNickname}
        major={major}
        setMajor={setMajor}
        gradYear={gradYear}
        setGradYear={setGradYear}
        setCanSend={setCanSend}
      />
      <DeleteAccountPage open={delAccClicked} handleClose={menuDelAccClicked} />
      <LogOutAlert
        open={logOutClicked}
        handleClose={menulogOutClicked}
        logOut={logoClickHandler}
      />
    </Box>
  );
}

export default SettingPage;
