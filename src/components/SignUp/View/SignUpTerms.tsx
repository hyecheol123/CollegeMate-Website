/**
 * Component for the first page of signup page (SignUpTerms).
 * @author Heewon Kim <khw0285@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
// Components
import Loading from '../../Common/Loading/Loading';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';

const termsStyle = {
  flex: 1,
  overflow: 'auto',
  padding: '6px',
};
const checkBoxStyle = {
  display: 'flex',
  maxHeight: '100%',
  maxWidth: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingX: '5px',
};

/**
 * Properties sent from this parents
 */
interface ISignUpTermsProps {
  isLoaded: boolean;
  content: string;
  checkboxHelperText: string;
  accepted: boolean;
  setAccepted: (curr: boolean) => void;
}

/**
 * React Functional Component for SignUp page's first page
 * @param {ISignUpTermsProps} props properties sent from this parents
 * @return {React.ReactElement} Renders first page of about page
 */
function SignUpTerms(props: ISignUpTermsProps): React.ReactElement {
  const { isLoaded, content, checkboxHelperText, accepted, setAccepted } =
    props;

  const handleCheckboxChange = (): void => {
    setAccepted(!accepted);
  };

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', ...PageWrapperStyle }}>
      <Box sx={termsStyle}>
        {isLoaded ? (
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Typography variant="body1" align="left" mb="5px" minHeight={0}>
              {content}
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

export default SignUpTerms;
