/**
 * Loading screen for downloading image or wallpaper
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../Common/Loading/Loading';

interface DownloadLoadingProps {
  type: 'image' | 'wallpaper';
  onSuccess: () => void;
  onError: () => void;
  onDownload: (type: 'image' | 'wallpaper') => Promise<boolean>;
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
    // Prevent body scroll while loading
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      const runDownload = async (): Promise<void> => {
        try {
          const result = await onDownload(type);
          if (result) onSuccess();
          else onError();
        } catch (e) {
          console.error('Download failed:', e);
          onError();
        }
      };

      runDownload();
    }, 1500);

    return (): void => {
      clearTimeout(timer);
      // Restore body scroll
      document.body.style.overflow = '';
    };
  }, [type, onDownload, onSuccess, onError]);

  const message =
    type === 'image' ? 'Image Downloading' : 'Wallpaper Downloading';

  // Use fullscreen overlay to hide DOM changes during download
  // Use React Portal to render outside of any parent container
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ marginBottom: '100px' }}>
        <Loading />
      </div>
      <div
        style={{
          fontSize: '20px',
          color: '#333',
          fontWeight: 500,
        }}
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
