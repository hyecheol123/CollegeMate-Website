/**
 * Select device for download schedule image
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import PopupHeader from '../../components/Popup/PopupHeader';
import PopupDropdown from '../../components/Popup/PopupDropdown';
import PopupHelperText from '../../components/Popup/PopupInfoText';
import PopupButton from '../../components/Popup/PopupButton';

interface DownloadDeviceSelectProps {
  value: string;
  onChange: (value: string) => void;
  //onBack: () => void;
  onNext: () => void;
}

/**
 * DownloadDeviceSelect - Step for selecting the target device (only for wallpaper).
 * @param {object} props - Component props
 * @param {string} props.value - Selected device model
 * @param {(value: string) => void} props.onChange - Handler to change selected device
 //* @param {() => void} props.onBack - Handler to go back to previous view
 * @param {() => void} props.onNext - Handler to proceed to download
 * @returns {React.ReactElement} Device selection step for wallpaper
 */
export default function DownloadDeviceSelect({
  value,
  onChange,
  //onBack,
  onNext,
}: DownloadDeviceSelectProps): React.ReactElement {
  const deviceOptions = [
    'iPhone 12 Pro Max',
    'iPhone 13',
    'Galaxy S21',
    'Galaxy Z Flip 5',
  ];

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
            onClick: onNext,
          },
        ]}
      />
      <PopupHelperText text="Wallpaper dimension differs depend on phone model." />
    </>
  );
}
