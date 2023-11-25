/**
 * Component for the terms of service for the last page (Footer).
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { fetchTermsAndConditions, ApiResponse } from './mockApi';

/**
 * This component fetches and displays the terms of service.
 * @return {React.ReactElement} A React element containing the terms of service content.
 */
function TermsOfServiceContent(): React.ReactElement {
  const [termsOfService, setTermsOfService] = useState<string>('');

  useEffect(() => {
    fetchTermsAndConditions().then((response: ApiResponse) => {
      setTermsOfService(response.content.termsAndConditions);
    });
  }, []);

  return <Typography variant="body1">{termsOfService}</Typography>;
}

export default TermsOfServiceContent;
