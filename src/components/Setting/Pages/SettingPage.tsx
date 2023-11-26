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
  // Feature Data
  //   const featureData = [
  //     {
  //       title: 'Customize Schedule',
  //       body: "Customize your schedule effortlessly with CollegeMate - real-time data from UW's database at your fingertips. CollegeMate updates for you.",
  //       pngImage: feature1Png,
  //       webpImage: feature1Webp,
  //       avifImage: feature1Avif,
  //       imageAlt: 'Mockup of Schedule Customization',
  //     },
  //     {
  //       title: 'Share Schedule With Friends',
  //       body: 'Eliminate the "What\'s your schedule?" dilemma. CollegeMate simplifies viewing friends\' timetables. No back-and-forth. Stay connected in a snap',
  //       pngImage: feature2Png,
  //       webpImage: feature2Webp,
  //       avifImage: feature2Avif,
  //       imageAlt: "Mockup of Friend's Schedule",
  //     },
  //     {
  //       title: 'Set Schedule as Wallpaper',
  //       body: "Download your timetable to perfectly fit your phone's screen. Say goodbye to screenshots. Access your schedule whenever and wherever.",
  //       pngImage: feature3Png,
  //       webpImage: feature3Webp,
  //       avifImage: feature3Avif,
  //       imageAlt: 'Mockup of Wallpaper Download',
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
    setlogOutClicked(true)
    setMenuClick(!menuClicked)
  };
  
  return (
    <Box style={{ width: '100vw', height: '100vh', backgroundColor: '#DADFE1'}}>
      <Box sx={HeaderStyle}>
        <Box sx={HeaderIconContStyle}>
          <IconButton onClick={menuFunction}>
            <MenuIcon style={{ color: 'red' }} /></IconButton>
          <IconButton>
            <PermIdentityIcon style={{ color: 'red' }} /></IconButton>
          <IconButton>
            <NotificationsNoneIcon style={{ color: 'red' }} /></IconButton>
        </Box>

        <Box sx={TitleStyle}>
          <Box component="img"
            src={CollegeMateLogo}
            alt="Mockup of CollegeMateLogo">
          </Box>
        </Box>

        <Box sx={HeaderIconContStyle} style={{ visibility: 'hidden' }}>
          <IconButton><MenuIcon /></IconButton>
          <IconButton><PermIdentityIcon /></IconButton>
          <IconButton><NotificationsNoneIcon /></IconButton>
        </Box>
      </Box>

      <MenuVar open={menuClicked} handleClose={menuFunction} handleMyInfo={menuMyInfo} handleDelAcc={menuDelAccClicked} handleLogOut={menulogOutClicked} />

      <MyInfoPage open={myInfoClicked} handleClose={menuMyInfo} />
      <DeleteAccountPage open={delAccClicked} handleClose={menuDelAccClicked} />
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