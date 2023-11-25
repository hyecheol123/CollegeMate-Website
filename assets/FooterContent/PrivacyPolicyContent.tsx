/**
 * Component for the privacy policy for the last page (Footer).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { fetchTermsAndConditions, ApiResponse } from './mockApi'; // adjust the path as needed

/**
 * This component fetches and displays the privacy policy content.
 * @return {React.ReactElement} A React element containing the privacy policy content.
 */
function PrivacyPolicyContent(): React.ReactElement {
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');

  useEffect(() => {
    fetchTermsAndConditions().then((response: ApiResponse) => {
      setPrivacyPolicy(response.content.privacyAct);
    });
  }, []);

  return (
    <Box>
      <Typography variant="body1" color="text.primary" mb={2}>
        {privacyPolicy}
      </Typography>
    </Box>
  );
}

export default PrivacyPolicyContent;
