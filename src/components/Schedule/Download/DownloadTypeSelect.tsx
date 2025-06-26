/**
 * Select download type on download popup
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { PopupHeader, PopupHelperText, PopupButton } from '../../Common/Popup';
import type { DownloadType } from './';

interface DownloadTypeSelectProps {
  onSelect: (type: DownloadType) => void;
}

/**
 * DownloadTypeSelect - Step for choosing between image and wallpaper.
 * @param {object} props - Component props
 * @param {(type: 'image' | 'wallpaper') => void} props.onSelect - Called when a type is selected
 * @returns {React.ReactElement} Type selection view
 */
export default function DownloadTypeSelect({
  onSelect,
}: DownloadTypeSelectProps): React.ReactElement {
  return (
    <>
      <PopupHeader title="Download Schedule" />
      <PopupButton
        buttons={[
          {
            label: 'Image',
            variant: 'outlined',
            onClick: () => onSelect('image'),
          },
          {
            label: 'Wallpaper',
            variant: 'outlined',
            onClick: () => onSelect('wallpaper'),
          },
        ]}
      />
      <PopupHelperText text="Wallpaper dimension differs depend on phone model." />
    </>
  );
}
