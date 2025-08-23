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
  onDownload: () => Promise<boolean>;
  onSelectSize: (size: { width: number; height: number }) => void;
}

/**
 * DownloadPopup - Controls view flow of download popup steps.
 * @param {object} props - Component props
 * @param {() => void} props.onClose - Handler to close the popup
 * @param {() => void} props.onDownload - Handler to execute actual download process
 * @param {() => void} props.onSelectSize - Handler to set image size
 * @returns {React.ReactElement} Download popup with dynamic content based on step
 */
export default function DownloadPopup({
  onClose,
  onDownload,
  onSelectSize,
}: DownloadPopupProps): React.ReactElement {
  const [view, setView] = useState<DownloadView>('type');
  const [downloadType, setDownloadType] = useState<DownloadType>('image');
  const [device, setDevice] = useState<string>('Auto-match for device');

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
            onNext={({ device, size }) => {
              setDevice(device); // 여전히 문자열 저장
              onSelectSize(size); // 사이즈 정보는 MainScheduler로 전달
              setView('loading');
            }}
          />
        );
      case 'loading':
        return (
          <DownloadLoading
            type={downloadType}
            onDownload={onDownload}
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
