/**
 * Loading screen for downloading image or wallpaper
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useEffect } from 'react';
import { PopupHeader } from '../../Common/Popup';
import { DownloadLoadingInner, DownloadLoadingWrapper } from './';
import Loading from '../../Common/Loading/Loading';

interface DownloadLoadingProps {
  type: 'image' | 'wallpaper';
  onSuccess: () => void;
  onError: () => void;
  onDownload: () => Promise<boolean>;
}

/**
 * DownloadLoading - Displays loading state for image or wallpaper download.
 * @param {object} props - Component props
 * @param {'image' | 'wallpaper'} props.type - Type of download content
 * @param {() => void} props.onSuccess - Called when download succeeds
 * @param {() => void} props.onError - Called when download fails
 * @param {() => void} props.onDownload - Handler to execute actual download process
 * @returns {React.ReactElement} Loading screen
 */
export default function DownloadLoading({
  type,
  onSuccess,
  onError,
  onDownload,
}: DownloadLoadingProps): React.ReactElement {
  useEffect(() => {
    const timer = setTimeout(() => {
      const runDownload = async (): Promise<void> => {
        try {
          const result = await onDownload();
          if (result) onSuccess();
          else onError();
        } catch (e) {
          console.error('Download failed:', e);
          onError();
        }
      };

      runDownload();
    }, 1500);
    return (): void => clearTimeout(timer);
  }, [onDownload, onSuccess, onError]);

  const message =
    type === 'image' ? 'Image Downloading' : 'Wallpaper Downloading';

  return (
    <>
      <PopupHeader title={message} />
      <DownloadLoadingWrapper
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={4}
        gap={2}
        position="relative"
      >
        <DownloadLoadingInner position="relative" m={5}>
          <Loading />
        </DownloadLoadingInner>
      </DownloadLoadingWrapper>
    </>
  );
}
