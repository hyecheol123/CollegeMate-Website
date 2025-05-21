/**
 * Test page
 * @author Joomyoung Park <joommm516@gmail.com>
 */

// React
import React, { useState } from 'react';
// Material UI
import { Button } from '@mui/material';
// Component
import HeaderButton from '../components/Common/HeaderButton/HeaderButton';
import BasePopup from '../components/Popup/BasePopup';
import PopupHeader from '../components/Popup/PopupHeader';
import PopupButton from '../components/Popup/PopupButton';
import PopupDropdown from '../components/Popup/PopupDropdown';
import PopupHelperText from '../components/Popup/PopupInfoText';

const deviceList = ['iPhone 12 Pro Max', 'iPhone 13', 'Galaxy S22'];

/**
 * React Functional Component for About page's third page
 * @return {React.ReactElement} Renders third page of about page
 */
function Test(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState(deviceList[0]);
  return (
    <>
      <HeaderButton />
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ position: 'flex', top: '50%', left: '50%' }}
      >
        Open Popup
      </Button>
      {open && (
        <BasePopup onClose={() => setOpen(false)}>
          <PopupHeader title="Download Schedule" align="center" />
          <PopupButton buttons={[{ label: 'Image' }, { label: 'Wallpaper' }]} />
          <PopupDropdown
            items={deviceList}
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          />
          <PopupHelperText text="Wallpaper dimension differs depend on phone model." />
        </BasePopup>
      )}
    </>
  );
}

export default Test;
