/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */


// React
import React from 'react';

// Material UI
import { Box, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Childe Pages
import MenuVar from './MenuVar';
import MyInfoPage from './MyInfoPage';
import DeleteAccountPage from './DeleteAccPage';
import LogOutAlert from './LogOutAlert';

// Global Styles
import HeaderIconContStyle from '../Styles/HeaderIconCont';
import HeaderStyle from '../Styles/Header';
import TitleStyle from '../Styles/Title';

// API call
import getTnC from '../../../data/About/getTnC';

// Assets
import CollegeMateLogo from '../../../../assets/lg3 1.png'


/**
 * React Functional Component to generate Setting Page
 * @return {React.ReactElement} Renders Setting Page
 */
function SettingPage(): React.ReactElement {
  // My Info Data
  //   const myInfoData = [
  //     {
  //       name: ,
  //       nickName: ,
  //       school: ,
  //       major: ,
  //       classStanding: ,
  //     },
  //     {
  //       name: ,
  //       nickName: ,
  //       school: ,
  //       major: ,
  //       classStanding: ,
  //     },
  //     {
  //       name: ,
  //       nickName: ,
  //       school: ,
  //       major: ,
  //       classStanding: ,
  //     },
  //   ];



  const [menuClicked, setMenuClick] = React.useState<boolean>(false);
  const [myInfoClicked, setMyInfo] = React.useState<boolean>(false);
  const [delAccClicked, setDelAccClicked] = React.useState<boolean>(false);
  const [logOutClicked, setlogOutClicked] = React.useState<boolean>(false);

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

  return (
    <Box>
      <Box sx={HeaderStyle}>
        <Box sx={HeaderIconContStyle}>
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

      <MenuVar open={menuClicked} handleClose={menuFunction} handleMyInfo={menuMyInfo} handleDelAcc={menuDelAccClicked} handleLogOut={menulogOutClicked} />

      <MyInfoPage open={myInfoClicked} handleClose={menuMyInfo} />
      <DeleteAccountPage open={delAccClicked} handleClose={menuDelAccClicked} />
      <LogOutAlert open={logOutClicked} handleClose={menulogOutClicked} />

    </Box>
  );
}

export default SettingPage;




/* 희원이 오빠 코드 참고
// React
import React from 'react';
// Material UI
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';

// Global Styles
import PageWrapperSignupStyle from '../Styles/PageWrapper';
import TermsStyle from '../Styles/Terms';
import CheckBoxStyle from '../Styles/Checkbox';
import ButtonStyle from '../Styles/Button';
import TitleStyle from '../Styles/Title';

// API call
import getTnC from '../../../data/About/getTnC';

// Assets
import CollegeMateLogo from '../../../../assets/lg3 1.png'


function SignUpTerms(): React.ReactElement {
  // Set initial state for term of service and privacy policy
  const [termsAgreed, setTermsAgreed] = React.useState<boolean>(false);
  const [privacyAgreed, setPrivacyAgreed] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>('');

  // Function to load terms TnC
  React.useEffect(() => {
      const fetchData = async () => {
          const json = await getTnC();
          setContent(json.content.termsAndConditions);
      };
      fetchData();
  }, []);

  const handleNextClick = () => {
      if (termsAgreed && !privacyAgreed) {
          // User has agreed terms, show privacy content
          const fetchData = async () => {
              const json = await getTnC();
              setContent(json.content.privacyAct);
          };
          setPrivacyAgreed(true);
          fetchData();
      } else if (termsAgreed && privacyAgreed) {
          console.log("User has agreed all!");
          // Need to navigate to the next step
      } else {
          // User has not agreed, show a message or handle accordingly
          console.log("User has not agreed!");
      }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTermsAgreed(event.target.checked);
  };

  return (
      <Box sx={PageWrapperSignupStyle}>
          <Box sx={TitleStyle}>
              <Box component="img"
                  src={CollegeMateLogo}
                  alt="Mockup of CollegeMateLogo"></Box>
          </Box>
          <Box sx={TermsStyle}>
              <Typography variant="h3" align="center" mb="15px">
                  {content}
              </Typography>
          </Box>
          <Box sx={CheckBoxStyle}>
              {!privacyAgreed ? <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} />} label="I agree to the terms and conditions." />
                  : <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} />} label="I agree to the privacy policy." />}
          </Box>
          <Box sx={ButtonStyle}>
              <Button variant="contained" onClick={handleNextClick} sx={{ width: '30%', height: '90%' }}>Next</Button>
          </Box>
      </Box>
  );
}

export default SignUpTerms;

*/