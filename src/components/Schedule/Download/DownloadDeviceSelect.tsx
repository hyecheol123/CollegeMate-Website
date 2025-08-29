/**
 * Select device for download schedule image
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import {
  PopupDropdown,
  PopupHeader,
  PopupHelperText,
  PopupButton,
} from '../../Common/Popup';
import { DEVICE_OPTIONS, DEVICE_DIMENSIONS } from '../../../data/deviceSpecs';

interface DownloadDeviceSelectProps {
  value: string;
  onChange: (value: string) => void;
  onNext: (params: {
    device: string;
    size: { width: number; height: number };
  }) => void;
}

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
  const handleChange = (e: SelectChangeEvent<string>): void => {
    onChange(e.target.value);
  };

  return (
    <>
      <PopupHeader title="Download Schedule Wallpaper" />
      <PopupDropdown
        items={DEVICE_OPTIONS}
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
              const dpr = window.devicePixelRatio || 1;
              const size =
                value === 'Auto-match for device'
                  ? ({
                      width: Math.round(window.innerWidth * dpr),
                      height: Math.round(window.innerHeight * dpr),
                    } as { width: number; height: number })
                  : DEVICE_DIMENSIONS[value];

              onNext({ device: selected, size });
            },
          },
        ]}
      />
      <PopupHelperText
        text={
          'The wallpaper download may have some margins as it includes the clock part at the top.'
        }
      />
    </>
  );
}
