/**
 * Download popup
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useState } from 'react';
import { PopupBox } from '../../Common/Popup';
import {
  DownloadDeviceSelect,
  DownloadError,
  DownloadDone,
  DownloadLoading,
  DownloadTypeSelect,
} from './';

export type DownloadView = 'type' | 'device' | 'loading' | 'error' | 'done';
export type DownloadType = 'image' | 'wallpaper';

interface DownloadPopupProps {
  onClose: () => void;
}

/**
 * DownloadPopup - Controls view flow of download popup steps.
 * @param {object} props - Component props
 * @param {() => void} props.onClose - Handler to close the popup
 * @returns {React.ReactElement} Download popup with dynamic content based on step
 */
export default function DownloadPopup({
  onClose,
}: DownloadPopupProps): React.ReactElement {
  const [view, setView] = useState<DownloadView>('type');
  const [downloadType, setDownloadType] = useState<DownloadType>('image');
  const [device, setDevice] = useState<string>('iPhone 12 Pro Max');

  const handleTypeSelect = (type: DownloadType): void => {
    setDownloadType(type);
    if (type === 'image') {
      setView('loading');
    } else {
      setView('device');
    }
  };

  const renderContent = (): React.ReactElement | null => {
    switch (view) {
      case 'type':
        return <DownloadTypeSelect onSelect={handleTypeSelect} />;
      case 'device':
        return (
          <DownloadDeviceSelect
            value={device}
            onChange={setDevice}
            onNext={() => setView('loading')}
          />
        );
      case 'loading':
        return (
          <DownloadLoading
            type={downloadType}
            onSuccess={() => setView('done')}
            onError={() => setView('error')}
          />
        );
      case 'done':
        return <DownloadDone onClose={onClose} />;
      case 'error':
        return <DownloadError onRetry={() => setView('loading')} />;
      default:
        return null;
    }
  };

  return <PopupBox onClose={onClose}>{renderContent()}</PopupBox>;
}
