/**
 * Select device for download schedule image
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import {
  PopupDropdown,
  PopupHeader,
  PopupHelperText,
  PopupButton,
} from '../../Common/Popup';

interface DownloadDeviceSelectProps {
  value: string;
  onChange: (value: string) => void;
  onNext: (params: {
    device: string;
    size: { width: number; height: number };
  }) => void;
}

const deviceOptions = [
  'Auto-match for device',
  'iPhone 12 Pro Max',
  'iPhone 13',
  'Galaxy S21',
  'Galaxy Z Flip 5',
];

const DEVICE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  'iPhone 12 Pro Max': { width: 1284, height: 2778 },
  'iPhone 13': { width: 1170, height: 2532 },
  'Galaxy S21': { width: 1080, height: 2400 },
  'Galaxy Z Flip 5': { width: 1080, height: 2640 },
};

/**
 * DownloadDeviceSelect - Step for selecting the target device (only for wallpaper).
 * @param {object} props - Component props
 * @param {string} props.value - Selected device model
 * @param {(value: string) => void} props.onChange - Handler to change selected device
 * @param {() => void} props.onNext - Handler to proceed to download
 * @returns {React.ReactElement} Device selection step for wallpaper
 */
export default function DownloadDeviceSelect({
  value,
  onChange,
  onNext,
}: DownloadDeviceSelectProps): React.ReactElement {
  const [autoMatched, setAutoMatched] = useState('');
  useEffect(() => {
    const updateMatch = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setAutoMatched(`${width}px × ${height}px`);
    };
    if (value === 'Auto-match for device') {
      updateMatch();
      window.addEventListener('resize', updateMatch);
    }
    return (): void => {
      window.removeEventListener('resize', updateMatch);
    };
  }, [value]);

  const handleChange = (e: SelectChangeEvent<string>): void => {
    onChange(e.target.value);
  };

  return (
    <>
      <PopupHeader title="Download Schedule Wallpaper" />
      <PopupDropdown
        items={deviceOptions}
        value={value}
        onChange={handleChange}
      />
      <PopupButton
        buttons={[
          {
            label: 'Download',
            variant: 'contained',
            backgroundColor: 'red.main',
            textColor: 'white.main',
            onClick: (): void => {
              const selected = value;
              const size =
                value === 'Auto-match for device'
                  ? ({
                      width: window.innerWidth,
                      height: window.innerHeight,
                    } as { width: number; height: number })
                  : DEVICE_DIMENSIONS[value];

              onNext({ device: selected, size });
            },
          },
        ]}
      />
      <PopupHelperText
        text={
          value === 'Auto-match for device'
            ? `Current Device: ${autoMatched} `
            : 'Wallpaper dimension differs depending on selected device model.'
        }
      />
    </>
  );
}
