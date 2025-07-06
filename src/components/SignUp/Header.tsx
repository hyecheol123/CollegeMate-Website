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
import CollegeMateLogoPng from '../../../assets/logo.png';
import CollegeMateLogoWebp from '../../../assets/logo.png?as=webp';
import CollegeMateLogAvif from '../../../assets/logo.png?as=avif';

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
 * React Functional Component for SignUp page's header
 * @param {object} props - Component props
 * @param {number} props.step - Current signup step
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setStep - Function to set step
 * @returns {React.ReactElement} The rendered header component
 */
function Header({
  step,
  setStep,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}): React.ReactElement {
  const navigate = useNavigate();

  // Event Handler to go back
  const handleGoBack = React.useCallback((): void => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate('/login'); // step === 0일 때 로그인 페이지로 이동
    }
  }, [step, setStep, navigate]);

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
