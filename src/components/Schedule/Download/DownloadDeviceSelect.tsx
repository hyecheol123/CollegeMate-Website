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
  'Auto-match for device', // Auto-detect current device resolution
  // iPhone 16 라인업
  'iPhone 16 Pro Max',
  'iPhone 16 Pro',
  'iPhone 16 Plus',
  'iPhone 16',

  // (참고) 여전히 사용량 높은 구형
  'iPhone 13',
  'iPhone mini',

  // Galaxy S25 / S24 시리즈
  'Galaxy S25 Ultra',
  'Galaxy S25+',
  'Galaxy S25',
  'Galaxy S24 Ultra',
  'Galaxy S24+',
  'Galaxy S24',
  'Galaxy Note 20',

  // Galaxy Z Flip 라인
  'Galaxy Z Flip7',
  'Galaxy Z Flip6',
  'Galaxy Z Flip5',

  // iPad 라인업 (최신 세대 위주)
  'iPad Pro 13-inch (M4)',
  'iPad Pro 11-inch (M4)',
  'iPad Air 13-inch (M2/M3)',
  'iPad Air 11-inch (M2/M3)',
  'iPad (10th gen, 10.9-inch)',
  'iPad mini (6th gen)',
];

const DEVICE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  // iPhone 16 series
  'iPhone 16 Pro Max': { width: 1320, height: 2868 }, // Apple
  'iPhone 16 Pro': { width: 1206, height: 2622 }, // Apple
  'iPhone 16 Plus': { width: 1290, height: 2796 }, // Apple
  'iPhone 16': { width: 1179, height: 2556 }, // Apple

  // still common older iPhones
  'iPhone 13': { width: 1170, height: 2532 }, // Apple
  'iPhone mini': { width: 1080, height: 2340 }, // Apple

  // Galaxy S25 / S24
  'Galaxy S25 Ultra': { width: 1440, height: 3120 }, // Samsung
  'Galaxy S25+': { width: 1440, height: 3120 }, // Samsung
  'Galaxy S25': { width: 1080, height: 2340 }, // Samsung
  'Galaxy S24 Ultra': { width: 1440, height: 3120 }, // Samsung
  'Galaxy S24+': { width: 1440, height: 3120 }, // Samsung
  'Galaxy S24': { width: 1080, height: 2340 }, // Samsung
  'Galaxy Note 20': { width: 1080, height: 2340 }, // Samsung

  // Galaxy Z Flip (메인 내부 화면 해상도)
  'Galaxy Z Flip7': { width: 1080, height: 2520 }, // Samsung
  'Galaxy Z Flip6': { width: 1080, height: 2640 }, // Samsung
  'Galaxy Z Flip5': { width: 1080, height: 2640 }, // Samsung

  // iPad (세로 기준)
  'iPad Pro 13-inch (M4)': { width: 2064, height: 2752 }, // Apple
  'iPad Pro 11-inch (M4)': { width: 1668, height: 2420 }, // Apple
  'iPad Air 13-inch (M2/M3)': { width: 2048, height: 2732 }, // Apple
  'iPad Air 11-inch (M2/M3)': { width: 1640, height: 2360 }, // Apple
  'iPad (10th gen, 10.9-inch)': { width: 1640, height: 2360 }, // Apple
  'iPad mini (6th gen)': { width: 1488, height: 2266 }, // Apple
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
