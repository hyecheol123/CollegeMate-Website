/**
 * Error Screen
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import PopupHeader from '../../Common/Popup/PopupHeader';
import PopupButton from '../../Common/Popup/PopupButton';
import { DownloadErrorWrapper } from './DownloadStyles';

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
      <DownloadErrorWrapper>
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
      </DownloadErrorWrapper>
    </>
  );
}
