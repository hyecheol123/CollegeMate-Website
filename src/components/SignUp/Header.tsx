/**
 * Component for the page of signup's header.
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Material UI
import { Box, IconButton } from '@mui/material';
// Material UI Icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Assets
import CollegeMateLogoPng from '../../../assets/lg3 1.png';
import CollegeMateLogoWebp from '../../../assets/lg3 1.png?as=webp';
import CollegeMateLogAvif from '../../../assets/lg3 1.png?as=avif';

const titleStyle = {
  bgcolor: 'whiteGrey.main',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: '0.7em',
  px: '0.5em',
};
const logoStyle = {
  left: '50%',
  top: '0.75em',
  transform: 'translateX(-50%)',
};

/**
 * React Functional Component for SignUp page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function Header(): React.ReactElement {
  const navigate = useNavigate();

  // Event Handler to go back
  const handleGoBack = React.useCallback((): void => {
    navigate(-1);
  }, [navigate]);

  return (
    <Box sx={titleStyle}>
      <IconButton
        sx={{ color: 'red.main' }}
        aria-label="back"
        onClick={handleGoBack}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <picture style={{ ...logoStyle, position: 'absolute' }}>
          <source srcSet={CollegeMateLogAvif} type="image/avif" />
          <source srcSet={CollegeMateLogoWebp} type="image/webp" />
          <Box
            component="img"
            sx={{ ...logoStyle, position: 'absolute' }}
            src={CollegeMateLogoPng}
            alt="CollegeMate Logo"
          />
        </picture>
      </Box>
    </Box>
  );
}

export default Header;
