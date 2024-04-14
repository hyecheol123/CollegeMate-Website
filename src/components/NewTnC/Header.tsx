/**
 * Component for the page of newTnC's header.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box } from '@mui/material';
// Assets
import CollegeMateLogoPng from '../../../assets/logo.png';
import CollegeMateLogoWebp from '../../../assets/logo.png?as=webp';
import CollegeMateLogAvif from '../../../assets/logo.png?as=avif';

const titleStyle = {
  bgcolor: 'whiteGrey.main',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: '1.95em',
};
const logoStyle = {
  left: '50%',
  top: '12px',
  transform: 'translateX(-50%)',
};

/**
 * React Functional Component for NewTnC's header
 * @return {React.ReactElement} Renders first page of newtnc page
 */
function Header(): React.ReactElement {
  return (
    <Box sx={titleStyle}>
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
