/**
 * Loading screen for downloading image or wallpaper
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import PopupHeader from '../../components/Popup/PopupHeader';
import Loading from '../../components/Common/Loading/Loading';

interface DownloadLoadingProps {
  type: 'image' | 'wallpaper';
  onSuccess: () => void;
  onError: () => void;
}

/**
 * DownloadLoading - Displays loading state for image or wallpaper download.
 * @param {object} props - Component props
 * @param {'image' | 'wallpaper'} props.type - Type of download content
 * @param {() => void} props.onSuccess - Called when download succeeds
 * @param {() => void} props.onError - Called when download fails
 * @returns {React.ReactElement} Loading screen
 */
export default function DownloadLoading({
  type,
  onSuccess,
  onError,
}: DownloadLoadingProps): React.ReactElement {
  useEffect(() => {
    const timer = setTimeout(() => {
      //onError();
      ///*
      const success = Math.random() > 0.2;
      if (success) {
        onSuccess();
      } else {
        onError();
      }
      //*/
    }, 2000);

    return (): void => clearTimeout(timer);
  }, [onSuccess, onError]);

  const message =
    type === 'image' ? 'Image Downloading' : 'Wallpaper Downloading';

  return (
    <>
      <PopupHeader title={message} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={4}
        gap={2}
        position="relative"
      >
        <Box position="static" m={5}>
          <Loading />
        </Box>
      </Box>
    </>
  );
}
