/**
 * Component for the page of signup's header.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Global Styles
import TitleStyle from '../../Styles/Title';

// Material UI
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Assets
import CollegeMateLogoWebp from '../../../../../assets/lg3 1.png?as=webp';
import CollegeMateLogo from '../../../../../assets/lg3 1.png';
import CollegeMateLogAvif from '../../../../../assets/lg3 1.png?as=avif';


/**
 * React Functional Component for SignUp page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function Header(): React.ReactElement {
  const navigate = useNavigate(); 

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <Box sx={TitleStyle}>
      <IconButton sx={{ position: 'absolute', top: 5, left: 20, color: '#B20000' }} aria-label="back" onClick={handleGoBack}>
        <ArrowBackIcon />
      </IconButton>
      <source srcSet={CollegeMateLogAvif} type="image/avif" />
      <source srcSet={CollegeMateLogoWebp} type="image/webp" />
      <Box component="img" src={CollegeMateLogo} alt="CollegeMate Logo"></Box>
    </Box>
  );
}

export default Header;
