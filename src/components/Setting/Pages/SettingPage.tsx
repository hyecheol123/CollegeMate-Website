/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */


// React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Box, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Childe Pages
import MenuBar from './MenuBar';
import MyInfoPage from './MyInfoPage';
import DeleteAccountPage from './DeleteAccPage';
import LogOutAlert from './LogOutAlert';

// Global Styles
import PageWrapperStyle from '../../Common/Styles/PageWrapper';
import HeaderIconContStyle from '../Styles/HeaderIconCont';
import HeaderStyle from '../Styles/Header';
import TitleStyle from '../Styles/Title';

// API call
import getTnC from '../../../data/Common/getTnC';

// Assets
import CollegeMateLogo from '../../../../assets/lg3 1.png'


/**
 * React Functional Component to generate Setting Page
 * @return {React.ReactElement} Renders Setting Page
 */
function SettingPage(): React.ReactElement {
  const [menuClicked, setMenuClick] = React.useState<boolean>(false);
  const [myInfoClicked, setMyInfo] = React.useState<boolean>(false);
  const [delAccClicked, setDelAccClicked] = React.useState<boolean>(false);
  const [logOutClicked, setlogOutClicked] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const menuFunction = () => {
    setMenuClick(!menuClicked)
  };
  const menuMyInfo = () => {
    setMyInfo(true)
    setDelAccClicked(false)
    setlogOutClicked(false)
    setMenuClick(!menuClicked)
  };
  const menuDelAccClicked = () => {
    setMyInfo(false)
    setDelAccClicked(true)
    setlogOutClicked(false)
    setMenuClick(!menuClicked)
  };
  const menulogOutClicked = () => {
    setMyInfo(false)
    setDelAccClicked(false)
    setlogOutClicked(!logOutClicked)
    setMenuClick(!menuClicked)
  };
  const logoClickHandler = React.useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <Box sx={PageWrapperStyle} style={{ padding: 0, }}>
      <Box sx={HeaderStyle}>
        <Box sx={HeaderIconContStyle} >
          <IconButton onClick={menuFunction}>
            <MenuIcon style={{ color: '#B20000' }} /></IconButton>
          <IconButton>
            <PermIdentityIcon style={{ color: '#B20000' }} /></IconButton>
          <IconButton>
            <NotificationsNoneIcon style={{ color: '#B20000' }} /></IconButton>
        </Box>

        <Box sx={TitleStyle}>
          <Box component="img"
            src={CollegeMateLogo}
            alt="Mockup of CollegeMateLogo">
          </Box>
        </Box>

        {/* Hidden Box to balance the flex container */}
        <Box sx={HeaderIconContStyle} style={{ visibility: 'hidden' }}>
          <IconButton><MenuIcon /></IconButton>
          <IconButton><PermIdentityIcon /></IconButton>
          <IconButton><NotificationsNoneIcon /></IconButton>
        </Box>
      </Box>

      <MenuBar open={menuClicked} handleClose={menuFunction} handleMyInfo={menuMyInfo} handleDelAcc={menuDelAccClicked} handleLogOut={menulogOutClicked} />

      <MyInfoPage open={myInfoClicked} handleClose={menuMyInfo} />
      <DeleteAccountPage open={delAccClicked} handleClose={menuDelAccClicked} />
      <LogOutAlert open={logOutClicked} handleClose={menulogOutClicked} logOut={logoClickHandler} />

    </Box>
  );
}

export default SettingPage;