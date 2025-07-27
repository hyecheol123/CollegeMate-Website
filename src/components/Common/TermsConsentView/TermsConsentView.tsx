/**
 * Component for the first page of signup/newTnC page (TermsConsent).
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
// Components
import Loading from '../Loading/Loading';
// Global Styles
import PageWrapperStyle from '../../SignUp/Styles/PageWrapper';
import { TermsConsentRenderer } from './TermsConsentRender';

const termsStyle = {
  flex: 1,
  overflow: 'auto',
  mt: '16px',
};
const contentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'auto',
};
const checkBoxStyle = {
  display: 'flex',
  maxHeight: '100%',
  maxWidth: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingX: '5px',
  mt: '16px',
  mb: '16px',
};

/**
 * Properties sent from this parents
 */
interface ITermsConsent {
  isLoaded: boolean;
  title: string;
  content: string;
  checkboxHelperText: string;
  accepted: boolean;
  setAccepted: (curr: boolean) => void;
}

/**
 * React Functional Component for SignUp page's first page
 * @param {ITermsConsent} props properties sent from this parents
 * @returns {React.ReactElement} Renders first page of about page
 */
function TermsConsent(props: ITermsConsent): React.ReactElement {
  // Destructuring props to extract required values
  const {
    isLoaded,
    title,
    content,
    checkboxHelperText,
    accepted,
    setAccepted,
  } = props;

  // Function to handle the change event of the checkbox
  const handleCheckboxChange = (): void => {
    setAccepted(!accepted);
  };

  return (
    <Box sx={{ overflow: 'hidden', ...PageWrapperStyle }}>
      <Typography mt={'16px'} variant="h2" color="red.main" align="center">
        {title}
      </Typography>
      <Box sx={{ ...termsStyle }}>
        {isLoaded ? (
          <Box sx={{ ...contentStyle }}>
            <Typography
              variant="body1"
              align="left"
              minHeight={0}
              maxWidth={'80%'}
            >
              {TermsConsentRenderer({ content })}
            </Typography>
          </Box>
        ) : (
          <Loading />
        )}
      </Box>
      <Box sx={checkBoxStyle}>
        <FormControlLabel
          control={
            <Checkbox
              checked={accepted}
              disabled={!isLoaded}
              onChange={handleCheckboxChange}
            />
          }
          label={checkboxHelperText}
        />
      </Box>
    </Box>
  );
}

export default TermsConsent;
