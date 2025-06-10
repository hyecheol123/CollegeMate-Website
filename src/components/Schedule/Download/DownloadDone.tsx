/**
 * Screen displayed after successful download
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useEffect } from 'react';
import { DownloadDoneIcon, DownloadDoneMessage, DownloadDoneWrapper } from './';

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
    <DownloadDoneWrapper onClick={onClose}>
      <DownloadDoneIcon />
      <DownloadDoneMessage variant="h2">Download completed</DownloadDoneMessage>
    </DownloadDoneWrapper>
  );
}
