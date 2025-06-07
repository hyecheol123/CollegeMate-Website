/**
 * Error Screen
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box } from '@mui/material';
import PopupHeader from '../../Common/Popup/PopupHeader';
import PopupButton from '../../Common/Popup/PopupButton';

interface DownloadErrorProps {
  onRetry: () => void;
}

/**
 * DownloadError - Displays error message when download fails.
 * @param {object} props - Component props
 * @param {() => void} props.onRetry - Handler to retry download
 * @returns {React.ReactElement} Error state UI
 */
export default function DownloadError({
  onRetry,
}: DownloadErrorProps): React.ReactElement {
  return (
    <>
      <PopupHeader title="Download Failed" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
        mt={5}
      >
        <PopupButton
          buttons={[
            {
              label: 'Try Again',
              variant: 'contained',
              backgroundColor: 'red.main',
              textColor: 'white.main',
              onClick: onRetry,
            },
          ]}
        />
      </Box>
    </>
  );
}
