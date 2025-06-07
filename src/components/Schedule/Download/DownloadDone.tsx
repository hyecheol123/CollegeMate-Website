/**
 * Screen displayed after successful download
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

interface DownloadDoneProps {
  onClose: () => void;
}

/**
 * DownloadDone - Final step showing download success confirmation.
 * @param {object} props - Component props
 * @param {() => void} props.onClose - Called when popup should be closed
 * @returns {React.ReactElement} Success view with centered icon and message
 */
export default function DownloadDone({
  onClose,
}: DownloadDoneProps): React.ReactElement {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return (): void => clearTimeout(timer); // Clean up
  }, [onClose]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={150}
      mb={3}
      gap={1}
      onClick={onClose} //
    >
      <VerifiedIcon sx={{ fontSize: 48, color: 'green.main' }} />
      <Typography variant="h2" mt={3} textAlign="center">
        Download completed
      </Typography>
    </Box>
  );
}
