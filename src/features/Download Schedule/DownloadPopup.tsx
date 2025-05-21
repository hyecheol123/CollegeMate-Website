/**
 * Download popup
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useState } from 'react';
import DownloadTypeSelect from './DownloadTypeSelect';
import PopupBox from '../../components/Popup/PopupBox';
import DownloadDeviceSelect from './DownloadDeviceSelect';
import DownloadLoading from './DownloadLoading';
import DownloadDone from './DownloadDone';
import DownloadError from './DownloadError';

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
  const [downloadType, setDownloadType] = useState<DownloadType | null>(null);
  const [device, setDevice] = useState<string>('iPhone 12 Pro Max');

  const handleTypeSelect = (type: DownloadType): void => {
    setDownloadType(type);
    if (type === 'image') {
      setView('loading');
    } else {
      setView('device');
    }
  };

  return (
    <PopupBox onClose={onClose}>
      {view === 'type' && <DownloadTypeSelect onSelect={handleTypeSelect} />}
      {view === 'device' && (
        <DownloadDeviceSelect
          value={device}
          onChange={setDevice}
          //onBack={() => setView('type')}
          onNext={() => setView('loading')}
        />
      )}
      {view === 'loading' && (
        <DownloadLoading
          type={downloadType ?? 'image'}
          onSuccess={() => setView('done')}
          onError={() => setView('error')}
        />
      )}
      {view === 'done' && <DownloadDone onClose={onClose} />}
      {view === 'error' && <DownloadError onRetry={() => setView('loading')} />}
    </PopupBox>
  );
}
